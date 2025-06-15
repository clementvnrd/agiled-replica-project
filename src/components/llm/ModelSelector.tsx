import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Settings, Zap, Brain, Star } from 'lucide-react';
import { MODELS_CONFIG } from '@/lib/constants/models';

const MODEL_ICONS: Record<string, React.ReactElement> = {
  'openai/gpt-4.1': <Star className="w-4 h-4" />,
  'anthropic/claude-3.7-sonnet': <Brain className="w-4 h-4" />,
  'openai/gpt-4o': <Zap className="w-4 h-4" />,
  'openai/gpt-4.1-mini': <Zap className="w-4 h-4" />,
  'openai/o4-mini': <Zap className="w-4 h-4" />,
};

interface ModelSelectorProps {
  selectedModel: string;
  onModelChange: (model: string) => void;
}

const ModelSelector: React.FC<ModelSelectorProps> = ({ selectedModel, onModelChange }) => {
  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'premium': return 'bg-purple-500/20 text-purple-300 border-purple-500/30';
      case 'standard': return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
      case 'fast': return 'bg-green-500/20 text-green-300 border-green-500/30';
      default: return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
    }
  };

  return (
    <div className="p-4 bg-gray-900/80 backdrop-blur-lg border border-white/10 rounded-xl text-white">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold flex items-center gap-2">
          <Settings className="w-4 h-4" />
          Sélection du modèle
        </h3>
      </div>

      <div className="space-y-3">
        {MODELS_CONFIG.map((model) => (
          <div
            key={model.value}
            className={`p-3 rounded-lg border cursor-pointer transition-all hover:shadow-md ${
              selectedModel === model.value
                ? 'border-blue-500 bg-blue-500/20 shadow-sm'
                : 'border-white/20 hover:border-white/40 bg-white/5 hover:bg-white/10'
            }`}
            onClick={() => onModelChange(model.value)}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  {MODEL_ICONS[model.value]}
                  <span className="font-medium text-sm text-gray-100">{model.label}</span>
                  <Badge variant="outline" className={`text-xs ${getTierColor(model.tier)}`}>
                    {model.tier}
                  </Badge>
                </div>
                <p className="text-xs text-gray-400">{model.description}</p>
              </div>
              <div className={`w-4 h-4 rounded-full border-2 flex-shrink-0 ${
                selectedModel === model.value
                  ? 'border-blue-400 bg-blue-500'
                  : 'border-gray-500'
              }`}>
                {selectedModel === model.value && (
                  <div className="w-full h-full rounded-full bg-white scale-50 transition-transform"></div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ModelSelector;
