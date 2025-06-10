
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Settings, Zap, Brain, Star } from 'lucide-react';

const MODELS = [
  { 
    label: 'GPT-4.1', 
    value: 'openai/gpt-4.1',
    tier: 'premium',
    description: 'Le plus avancé pour les tâches complexes',
    icon: <Star className="w-4 h-4" />
  },
  { 
    label: 'Claude 3.7 Sonnet', 
    value: 'anthropic/claude-3.7-sonnet',
    tier: 'premium',
    description: 'Excellent pour l\'analyse et l\'écriture',
    icon: <Brain className="w-4 h-4" />
  },
  { 
    label: 'GPT-4o (2024-11-20)', 
    value: 'openai/gpt-4o-2024-11-20',
    tier: 'standard',
    description: 'Polyvalent et efficace',
    icon: <Zap className="w-4 h-4" />
  },
  { 
    label: 'O3 Mini', 
    value: 'openai/o3-mini',
    tier: 'fast',
    description: 'Rapide pour les tâches simples',
    icon: <Zap className="w-4 h-4" />
  },
];

interface ModelSelectorProps {
  selectedModel: string;
  onModelChange: (model: string) => void;
}

const ModelSelector: React.FC<ModelSelectorProps> = ({ selectedModel, onModelChange }) => {
  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'premium': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'standard': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'fast': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <Card className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold flex items-center gap-2">
          <Settings className="w-4 h-4" />
          Sélection du modèle
        </h3>
      </div>

      <div className="space-y-3">
        {MODELS.map((model) => (
          <div
            key={model.value}
            className={`p-3 rounded-lg border cursor-pointer transition-all hover:shadow-md ${
              selectedModel === model.value
                ? 'border-blue-500 bg-blue-50 shadow-sm'
                : 'border-gray-200 hover:border-gray-300'
            }`}
            onClick={() => onModelChange(model.value)}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  {model.icon}
                  <span className="font-medium text-sm">{model.label}</span>
                  <Badge className={`text-xs ${getTierColor(model.tier)}`}>
                    {model.tier}
                  </Badge>
                </div>
                <p className="text-xs text-gray-600">{model.description}</p>
              </div>
              <div className={`w-4 h-4 rounded-full border-2 ${
                selectedModel === model.value
                  ? 'border-blue-500 bg-blue-500'
                  : 'border-gray-300'
              }`}>
                {selectedModel === model.value && (
                  <div className="w-full h-full rounded-full bg-white scale-50"></div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default ModelSelector;
