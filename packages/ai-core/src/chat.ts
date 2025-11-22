import { BaseLLM } from './llm';
import { Message, ChatCompletionResponse } from './types';
import { createLogger } from '@supranorma/shared';

const logger = createLogger({ prefix: 'chat' });

export interface ChatSession {
  id: string;
  messages: Message[];
  metadata?: Record<string, any>;
}

export class ChatManager {
  private sessions: Map<string, ChatSession> = new Map();

  constructor(private llm: BaseLLM) {}

  createSession(id?: string, metadata?: Record<string, any>): string {
    const sessionId = id || this.generateSessionId();

    this.sessions.set(sessionId, {
      id: sessionId,
      messages: [],
      metadata,
    });

    logger.info(`Created chat session: ${sessionId}`);
    return sessionId;
  }

  getSession(sessionId: string): ChatSession | undefined {
    return this.sessions.get(sessionId);
  }

  deleteSession(sessionId: string): boolean {
    logger.info(`Deleted chat session: ${sessionId}`);
    return this.sessions.delete(sessionId);
  }

  addMessage(sessionId: string, message: Message): void {
    const session = this.sessions.get(sessionId);
    if (!session) {
      throw new Error(`Session not found: ${sessionId}`);
    }

    session.messages.push(message);
  }

  async sendMessage(
    sessionId: string,
    content: string,
    options?: { temperature?: number; maxTokens?: number }
  ): Promise<ChatCompletionResponse> {
    const session = this.sessions.get(sessionId);
    if (!session) {
      throw new Error(`Session not found: ${sessionId}`);
    }

    // Add user message
    const userMessage: Message = { role: 'user', content };
    session.messages.push(userMessage);

    logger.debug(`Sending message in session ${sessionId}`);

    // Get AI response
    const response = await this.llm.complete({
      messages: session.messages,
      temperature: options?.temperature,
      maxTokens: options?.maxTokens,
    });

    // Add assistant message
    const assistantMessage: Message = {
      role: 'assistant',
      content: response.content,
    };
    session.messages.push(assistantMessage);

    return response;
  }

  async streamMessage(
    sessionId: string,
    content: string,
    onChunk: (chunk: string) => void,
    options?: { temperature?: number; maxTokens?: number }
  ): Promise<ChatCompletionResponse> {
    const session = this.sessions.get(sessionId);
    if (!session) {
      throw new Error(`Session not found: ${sessionId}`);
    }

    // Add user message
    const userMessage: Message = { role: 'user', content };
    session.messages.push(userMessage);

    logger.debug(`Streaming message in session ${sessionId}`);

    // Get AI response
    const response = await this.llm.stream(
      {
        messages: session.messages,
        temperature: options?.temperature,
        maxTokens: options?.maxTokens,
      },
      onChunk
    );

    // Add assistant message
    const assistantMessage: Message = {
      role: 'assistant',
      content: response.content,
    };
    session.messages.push(assistantMessage);

    return response;
  }

  clearMessages(sessionId: string): void {
    const session = this.sessions.get(sessionId);
    if (session) {
      session.messages = [];
      logger.debug(`Cleared messages in session ${sessionId}`);
    }
  }

  getMessageCount(sessionId: string): number {
    const session = this.sessions.get(sessionId);
    return session ? session.messages.length : 0;
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substring(7)}`;
  }

  exportSession(sessionId: string): ChatSession | null {
    const session = this.sessions.get(sessionId);
    return session ? { ...session } : null;
  }

  importSession(session: ChatSession): void {
    this.sessions.set(session.id, session);
    logger.info(`Imported chat session: ${session.id}`);
  }
}
