
import { ErrorHandler } from '@/utils/errorHandler';
import { supabase } from '@/integrations/supabase/client';

// Service pour interagir avec l'API OpenRouter
export interface Message {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface OpenRouterStreamingResponse {
  id: string;
  choices: {
    message: Message;
    delta: {
      content?: string;
      role?: string;
    };
  }[];
}

// Options pour la requête OpenRouter
export interface OpenRouterOptions {
  model?: string;
  temperature?: number; 
  max_tokens?: number;
  top_p?: number;
  stream?: boolean;
  stop?: string[];
}

// Classe pour interagir avec OpenRouter
export class OpenRouterService {
  private apiKey: string | null = null;
  private lastApiKeyFetch: number = 0;

  constructor() {
    // Écouter l'événement de déconnexion pour effacer la clé en cache
    supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_OUT') {
        this.apiKey = null;
      }
    });
  }

  // Charger la clé API depuis le profil Supabase de l'utilisateur
  private async loadApiKey(): Promise<void> {
    // Un cache simple pour éviter de multiples appels rapides
    if (this.apiKey && Date.now() - this.lastApiKeyFetch < 5000) {
      return;
    }

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data, error } = await supabase
          .from('profiles')
          .select('openrouter_api_key')
          .eq('id', user.id)
          .single();

        if (error && error.code !== 'PGRST116') { // Ignorer 'resource not found'
          throw error;
        }
        this.apiKey = data?.openrouter_api_key || null;
        this.lastApiKeyFetch = Date.now();
      } else {
        this.apiKey = null;
      }
    } catch (e) {
      ErrorHandler.handleError(e, 'Erreur lors du chargement de la clé API OpenRouter');
      this.apiKey = null;
    }
  }

  // Vérifier si le service est configuré (devient asynchrone)
  public async isConfigured(): Promise<boolean> {
    await this.loadApiKey();
    return !!this.apiKey;
  }

  // Récupérer la liste des modèles disponibles
  public async getModels(): Promise<any> {
    await this.loadApiKey();
    if (!this.apiKey) {
      throw new Error("La clé API OpenRouter n'est pas configurée.");
    }

    try {
      const response = await fetch('https://openrouter.ai/api/v1/models', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Error fetching models: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      ErrorHandler.handleError(error, 'Error fetching models');
      throw error;
    }
  }

  // Générer une réponse (non-streaming)
  public async generateCompletion(
    messages: Message[],
    options: OpenRouterOptions = {}
  ): Promise<any> {
    await this.loadApiKey();
    if (!this.apiKey) {
      throw new Error("La clé API OpenRouter n'est pas configurée.");
    }

    try {
      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': window.location.origin,
          'X-Title': 'Agiled Replica',
        },
        body: JSON.stringify({
          messages,
          model: options.model || 'anthropic/claude-3-opus:beta',
          temperature: options.temperature ?? 0.7,
          max_tokens: options.max_tokens ?? 1000,
          top_p: options.top_p ?? 0.9,
          stream: false,
          stop: options.stop,
        }),
      });

      if (!response.ok) {
        const errorBody = await response.text();
        console.error("OpenRouter Error Body:", errorBody);
        throw new Error(`Error generating completion: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      ErrorHandler.handleError(error, 'Error generating completion');
      throw error;
    }
  }

  // Générer une réponse en streaming
  public async* streamCompletion(
    messages: Message[],
    options: OpenRouterOptions = {}
  ): AsyncGenerator<OpenRouterStreamingResponse, void, unknown> {
    await this.loadApiKey();
    if (!this.apiKey) {
      throw new Error("La clé API OpenRouter n'est pas configurée.");
    }

    try {
      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': window.location.origin,
          'X-Title': 'Agiled Replica',
        },
        body: JSON.stringify({
          messages,
          model: options.model || 'anthropic/claude-3-opus:beta',
          temperature: options.temperature ?? 0.7,
          max_tokens: options.max_tokens ?? 1000,
          top_p: options.top_p ?? 0.9,
          stream: true,
          stop: options.stop,
        }),
      });

      if (!response.ok) {
        throw new Error(`Error streaming completion: ${response.statusText}`);
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error('Response body is null');
      }

      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) {
          break;
        }

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (line.trim() === '') continue;
          if (line.trim() === 'data: [DONE]') continue;
          
          try {
            if (line.startsWith('data: ')) {
              const jsonLine = line.slice(6);
              yield JSON.parse(jsonLine);
            }
          } catch (e) {
            ErrorHandler.handleError(e, 'Error parsing SSE line');
          }
        }
      }
    } catch (error) {
      ErrorHandler.handleError(error, 'Error streaming completion');
      throw error;
    }
  }
}

// Créer une instance singleton
export const openRouterService = new OpenRouterService();

// Hook pour accéder au service
export function useOpenRouter() {
  return openRouterService;
}
