
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Send, Bot, User, Copy, ThumbsUp, ThumbsDown, MoreVertical } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';
import 'highlight.js/styles/github-dark.css';

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
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (input.trim() && !loading) {
      onSendMessage(input);
      setInput('');
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto'; // Reset height
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    const textarea = e.target;
    textarea.style.height = 'auto';
    textarea.style.height = `${textarea.scrollHeight}px`;
  };


  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="flex flex-col h-full bg-transparent">
      {/* Messages Area */}
      <ScrollArea className="flex-1">
        <div className="px-4 py-6 space-y-6">
          {messages.length === 0 && !loading && (
            <div className="flex flex-col items-center justify-center text-center space-y-6 h-full pt-16">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                <Bot className="w-8 h-8 text-white" />
              </div>
              <div className="space-y-3">
                <h2 className="text-2xl font-semibold text-white">Comment puis-je vous aider ?</h2>
                <p className="text-gray-300 max-w-md">Je peux créer des tâches, mettre à jour des projets, ou simplement discuter. Que souhaitez-vous faire ?</p>
              </div>
            </div>
          )}

          {messages.map((msg, idx) => (
            <div key={idx} className={cn(
              "flex gap-3 max-w-full mx-auto",
              msg.role === 'user' ? 'justify-end' : 'justify-start'
            )}>
              {msg.role === 'assistant' && (
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <Bot className="w-4 h-4 text-white" />
                </div>
              )}
              
              <div className={cn(
                "group relative max-w-[85%]",
                msg.role === 'user' ? 'order-1' : 'order-2'
              )}>
                <div className={cn(
                  "rounded-xl px-4 py-2.5 shadow-md",
                  msg.role === 'user' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-black/20 border border-white/20 text-gray-200'
                )}>
                  <div className="whitespace-pre-wrap break-words text-white">{msg.content}</div>
                </div>
                
                {msg.role === 'assistant' && (
                  <div className="flex items-center gap-1 mt-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button size="sm" variant="ghost" className="h-7 px-2 text-gray-400 hover:text-white hover:bg-white/10" onClick={() => copyToClipboard(msg.content)}>
                      <Copy className="w-3 h-3" />
                    </Button>
                    <Button size="sm" variant="ghost" className="h-7 px-2 text-gray-400 hover:text-white hover:bg-white/10">
                      <ThumbsUp className="w-3 h-3" />
                    </Button>
                    <Button size="sm" variant="ghost" className="h-7 px-2 text-gray-400 hover:text-white hover:bg-white/10">
                      <ThumbsDown className="w-3 h-3" />
                    </Button>
                  </div>
                )}
              </div>

              {msg.role === 'user' && (
                <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <User className="w-4 h-4 text-white" />
                </div>
              )}
            </div>
          ))}

          {loading && (
            <div className="flex gap-3 max-w-full mx-auto">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <div className="bg-black/20 border border-white/20 rounded-xl px-4 py-2.5 shadow-md">
                <div className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin text-blue-400" />
                  <span className="text-gray-300">Génération en cours...</span>
                </div>
              </div>
            </div>
          )}

          <div ref={chatEndRef} />
        </div>
      </ScrollArea>

      {/* Input Area */}
      <div className="p-4 bg-transparent border-t border-white/20">
        <form onSubmit={handleSubmit} className="max-w-full mx-auto">
          <div className="relative flex items-end bg-black/20 rounded-xl border border-white/20 focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-400/30 transition-all">
            <Textarea
              ref={textareaRef}
              placeholder="Écrivez votre message..."
              value={input}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              disabled={loading}
              className="flex-1 border-0 bg-transparent px-4 py-2.5 text-white placeholder-gray-400 focus-visible:ring-0 focus-visible:ring-offset-0 resize-none min-h-0 max-h-36 overflow-y-auto"
              rows={1}
            />
            <Button 
              type="submit" 
              disabled={loading || !input.trim()}
              className="mr-2 mb-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white"
              size="sm"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
          <div className="flex items-center justify-between mt-2 text-xs text-gray-400">
            <span>Modèle: {model}</span>
            <span>Maj+Entrée pour une nouvelle ligne</span>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModernChatInterface;
