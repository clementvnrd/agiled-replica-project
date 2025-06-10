
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Loader2, Send, Bot, User, Copy, ThumbsUp, ThumbsDown, MoreVertical, Share, Download, RefreshCcw } from 'lucide-react';
import { useOpenRouter } from '@/services/openrouter';
import { cn } from '@/lib/utils';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
  feedback?: 'like' | 'dislike' | null;
}

interface ModernChatInterfaceProps {
  messages: Message[];
  onSendMessage: (message: string) => void;
  loading: boolean;
  model: string;
}

const ModernChatInterface: React.FC<ModernChatInterfaceProps> = ({
  messages,
  onSendMessage,
  loading,
  model
}) => {
  const [input, setInput] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !loading) {
      onSendMessage(input);
      setInput('');
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="flex flex-col h-full bg-gradient-to-br from-slate-50 to-blue-50/30">
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6">
        {messages.length === 0 && !loading && (
          <div className="flex flex-col items-center justify-center h-full text-center space-y-6">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
              <Bot className="w-8 h-8 text-white" />
            </div>
            <div className="space-y-3">
              <h2 className="text-2xl font-semibold text-gray-800">Comment puis-je vous aider aujourd'hui ?</h2>
              <p className="text-gray-600 max-w-md">Posez-moi n'importe quelle question ou commencez une conversation. Je suis là pour vous assister.</p>
            </div>
          </div>
        )}

        {messages.map((msg, idx) => (
          <div key={idx} className={cn(
            "flex gap-4 max-w-4xl mx-auto",
            msg.role === 'user' ? 'justify-end' : 'justify-start'
          )}>
            {msg.role === 'assistant' && (
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                <Bot className="w-4 h-4 text-white" />
              </div>
            )}
            
            <div className={cn(
              "group relative max-w-[80%]",
              msg.role === 'user' ? 'order-1' : 'order-2'
            )}>
              <div className={cn(
                "rounded-2xl px-4 py-3 shadow-sm",
                msg.role === 'user' 
                  ? 'bg-blue-600 text-white ml-12' 
                  : 'bg-white border border-gray-200'
              )}>
                <div className="whitespace-pre-wrap break-words">{msg.content}</div>
              </div>
              
              {/* Message Actions */}
              {msg.role === 'assistant' && (
                <div className="flex items-center gap-1 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    className="h-7 px-2"
                    onClick={() => copyToClipboard(msg.content)}
                  >
                    <Copy className="w-3 h-3" />
                  </Button>
                  <Button size="sm" variant="ghost" className="h-7 px-2">
                    <ThumbsUp className="w-3 h-3" />
                  </Button>
                  <Button size="sm" variant="ghost" className="h-7 px-2">
                    <ThumbsDown className="w-3 h-3" />
                  </Button>
                  <Button size="sm" variant="ghost" className="h-7 px-2">
                    <MoreVertical className="w-3 h-3" />
                  </Button>
                </div>
              )}
            </div>

            {msg.role === 'user' && (
              <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center flex-shrink-0">
                <User className="w-4 h-4 text-white" />
              </div>
            )}
          </div>
        ))}

        {loading && (
          <div className="flex gap-4 max-w-4xl mx-auto">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <Bot className="w-4 h-4 text-white" />
            </div>
            <div className="bg-white border border-gray-200 rounded-2xl px-4 py-3 shadow-sm">
              <div className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin text-blue-500" />
                <span className="text-gray-600">Génération en cours...</span>
              </div>
            </div>
          </div>
        )}

        <div ref={chatEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white border-t border-gray-200">
        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
          <div className="relative flex items-center bg-gray-50 rounded-2xl border border-gray-200 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/20 transition-all">
            <Input
              placeholder="Écrivez votre message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={loading}
              className="flex-1 border-0 bg-transparent px-4 py-3 focus-visible:ring-0 focus-visible:ring-offset-0"
            />
            <Button 
              type="submit" 
              disabled={loading || !input.trim()}
              className="mr-2 rounded-xl"
              size="sm"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
          <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
            <span>Modèle: {model}</span>
            <span>Appuyez sur Entrée pour envoyer</span>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModernChatInterface;
