
import type { LucideIcon } from 'lucide-react';

export interface ModelDefinition {
    label: string;
    value: string;
    tier: 'premium' | 'standard' | 'fast';
    description: string;
}

export const MODELS_CONFIG: ModelDefinition[] = [
  { 
    label: 'GPT-4.1', 
    value: 'openai/gpt-4.1',
    tier: 'premium',
    description: 'Le plus avancé pour les tâches complexes.',
  },
  { 
    label: 'Claude 3.7 Sonnet', 
    value: 'anthropic/claude-3.7-sonnet',
    tier: 'premium',
    description: 'Excellent pour l\'analyse et l\'écriture.',
  },
  { 
    label: 'GPT-4o', 
    value: 'openai/gpt-4o',
    tier: 'standard',
    description: 'Polyvalent et efficace.',
  },
  {
    label: 'GPT-4.1 Mini',
    value: 'openai/gpt-4.1-mini',
    tier: 'fast',
    description: 'Rapide et économique pour les tâches quotidiennes.',
  },
  { 
    label: 'O4 Mini', 
    value: 'openai/o4-mini',
    tier: 'fast',
    description: 'Le plus rapide pour les tâches simples.',
  },
];

export const DEFAULT_MODEL_ID = 'openai/gpt-4.1-mini';
