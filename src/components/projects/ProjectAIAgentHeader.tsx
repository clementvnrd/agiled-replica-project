
import React from 'react';
import { Bot, Settings, X } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import ModelSelector from '@/components/llm/ModelSelector';

interface ProjectAIAgentHeaderProps {
  model: string;
  onModelChange: (model: string) => void;
  onClose: () => void;
}

const ProjectAIAgentHeader: React.FC<ProjectAIAgentHeaderProps> = ({ model, onModelChange, onClose }) => {
  return (
    <div className="flex items-center justify-between p-4 border-b border-white/20 flex-shrink-0">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
          <Bot className="h-5 w-5 text-white" />
        </div>
        <h2 className="text-lg font-semibold">Agent Projet IA</h2>
      </div>
      <div className="flex items-center gap-1">
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="icon" className="text-white hover:bg-white/10 hover:text-white">
              <Settings className="h-5 w-5" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[380px] p-0 bg-transparent border-none shadow-none" align="end" sideOffset={10}>
            <ModelSelector selectedModel={model} onModelChange={onModelChange} />
          </PopoverContent>
        </Popover>
        <Button variant="ghost" size="icon" onClick={onClose} className="text-white hover:bg-white/10 hover:text-white">
          <X className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
};

export default ProjectAIAgentHeader;
