import OpenAI from 'openai';
import { EmbeddingOptions, EmbeddingResult, SemanticSearchResult } from './types';
import { createLogger } from '@supranorma/shared';

const logger = createLogger({ prefix: 'embeddings' });

export class EmbeddingService {
  private client: OpenAI;

  constructor(apiKey: string) {
    this.client = new OpenAI({ apiKey });
  }

  async embed(text: string, options: EmbeddingOptions = {}): Promise<EmbeddingResult> {
    logger.debug('Generating embedding...');

    const model = options.model || 'text-embedding-3-small';

    const response = await this.client.embeddings.create({
      model,
      input: text,
      dimensions: options.dimensions,
    });

    return {
      embedding: response.data[0].embedding,
      model: response.model,
    };
  }

  async embedBatch(
    texts: string[],
    options: EmbeddingOptions = {}
  ): Promise<EmbeddingResult[]> {
    logger.info(`Generating ${texts.length} embeddings...`);

    const model = options.model || 'text-embedding-3-small';

    const response = await this.client.embeddings.create({
      model,
      input: texts,
      dimensions: options.dimensions,
    });

    return response.data.map((item) => ({
      embedding: item.embedding,
      model: response.model,
    }));
  }

  cosineSimilarity(a: number[], b: number[]): number {
    if (a.length !== b.length) {
      throw new Error('Vectors must have the same length');
    }

    let dotProduct = 0;
    let normA = 0;
    let normB = 0;

    for (let i = 0; i < a.length; i++) {
      dotProduct += a[i] * b[i];
      normA += a[i] * a[i];
      normB += b[i] * b[i];
    }

    return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
  }

  async semanticSearch(
    query: string,
    documents: Array<{ content: string; metadata?: Record<string, any> }>,
    options: EmbeddingOptions & { topK?: number } = {}
  ): Promise<SemanticSearchResult[]> {
    logger.info(`Performing semantic search over ${documents.length} documents...`);

    const topK = options.topK || 5;

    // Generate embeddings
    const [queryEmbedding, ...docEmbeddings] = await this.embedBatch(
      [query, ...documents.map((d) => d.content)],
      options
    );

    // Calculate similarities
    const results = documents.map((doc, index) => ({
      content: doc.content,
      metadata: doc.metadata,
      similarity: this.cosineSimilarity(
        queryEmbedding.embedding,
        docEmbeddings[index].embedding
      ),
    }));

    // Sort by similarity and return top K
    return results
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, topK);
  }
}
