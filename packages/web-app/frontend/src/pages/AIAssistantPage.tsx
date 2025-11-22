import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { aiApi } from '../lib/api';
import { Sparkles, Send } from 'lucide-react';

export function AIAssistantPage() {
  const [message, setMessage] = useState('');
  const [history, setHistory] = useState<any[]>([]);

  const chatMutation = useMutation({
    mutationFn: aiApi.chat,
    onSuccess: (response) => {
      const assistantMessage = {
        role: 'assistant',
        content: response.data.message,
      };
      setHistory([...history, assistantMessage]);
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    const userMessage = { role: 'user', content: message };
    setHistory([...history, userMessage]);
    setMessage('');

    chatMutation.mutate({
      message,
      history,
    });
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center">
          <Sparkles className="mr-3 text-primary-600" />
          AI Assistant
        </h1>
        <p className="text-gray-600 mt-2">
          Chat with AI to get help with code, generate solutions, and more.
        </p>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="h-96 overflow-y-auto p-6 space-y-4">
          {history.map((msg, index) => (
            <div
              key={index}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                  msg.role === 'user'
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 text-gray-900'
                }`}
              >
                {msg.content}
              </div>
            </div>
          ))}
          {chatMutation.isPending && (
            <div className="flex justify-start">
              <div className="bg-gray-100 text-gray-900 px-4 py-2 rounded-lg">
                Thinking...
              </div>
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit} className="p-4 border-t">
          <div className="flex space-x-4">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Ask me anything..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
            <button
              type="submit"
              disabled={chatMutation.isPending || !message.trim()}
              className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 flex items-center"
            >
              <Send size={16} className="mr-2" />
              Send
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
