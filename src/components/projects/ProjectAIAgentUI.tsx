
import React from 'react';
import { Bot } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ModernChatInterface from '@/components/llm/ModernChatInterface';
import ProjectAIAgentHeader from './ProjectAIAgentHeader';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

interface ProjectAIAgentUIProps {
  isOpen: boolean;
  onSetIsOpen: (isOpen: boolean) => void;
  messages: Message[];
  isLoading: boolean;
  onSendMessage: (message: string) => void;
  model: string;
  onSetModel: (model: string) => void;
}

const ProjectAIAgentUI: React.FC<ProjectAIAgentUIProps> = ({
  isOpen,
  onSetIsOpen,
  messages,
  isLoading,
  onSendMessage,
  model,
  onSetModel
}) => {
  if (!isOpen) {
    return (
      <Button
        className="fixed bottom-6 right-6 h-16 w-16 rounded-full shadow-lg z-50 bg-gradient-to-br from-blue-500 to-purple-600 hover:scale-110 transition-transform duration-300"
        onClick={() => onSetIsOpen(true)}
      >
        <Bot className="h-8 w-8" />
      </Button>
    );
  }

  return (
    <div className="fixed inset-0 pointer-events-none z-40" onClick={() => onSetIsOpen(false)}>
      <div 
        className="fixed bottom-6 right-6 h-[calc(100vh-80px)] w-[440px] z-50 flex flex-col rounded-2xl shadow-2xl bg-gray-800/30 backdrop-blur-2xl border border-white/20 text-white overflow-hidden pointer-events-auto" 
        onClick={e => e.stopPropagation()}
      >
        <ProjectAIAgentHeader 
            model={model}
            onModelChange={onSetModel}
            onClose={() => onSetIsOpen(false)}
        />
        <div className="flex-1 p-0 min-h-0">
          <ModernChatInterface
            messages={messages}
            onSendMessage={onSendMessage}
            loading={isLoading}
            model={model}
          />
        </div>
      </div>
    </div>
  );
};

export default ProjectAIAgentUI;
