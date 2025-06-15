import React, { useState } from 'react';
import { Bot, X, Loader2, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import ModernChatInterface from '@/components/llm/ModernChatInterface';
import { openRouterService, Message as OpenRouterMessage } from '@/services/openrouter';
import { toast } from 'sonner';
import { useProjects } from '@/hooks/useProjects';
import ModelSelector from '@/components/llm/ModelSelector';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useSupabaseAuth } from '@/hooks/useSupabaseAuth';
import { supabase } from '@/integrations/supabase/client';

// Utiliser les types de useProjects
type Project = ReturnType<typeof useProjects>['projects'][0];
type CreateProject = ReturnType<typeof useProjects>['createProject'];
type UpdateProject = ReturnType<typeof useProjects>['updateProject'];

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

interface ProjectAIAgentProps {
  projects: Project[];
  createProject: CreateProject;
  updateProject: UpdateProject;
  refetchProjects: () => void;
}

const ProjectAIAgent: React.FC<ProjectAIAgentProps> = ({ projects, createProject, updateProject, refetchProjects }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [model, setModel] = useState('openai/gpt-4o-mini');
  const { user } = useSupabaseAuth();

  const handleSendMessage = async (messageText: string) => {
    setIsLoading(true);
    const userMessage: Message = { role: 'user', content: messageText, timestamp: Date.now() };
    setMessages(prev => [...prev, userMessage]);

    try {
      if (!user) {
        throw new Error("Utilisateur non authentifié.");
      }

      // 1. RAG Retrieval
      let ragContext = "";
      try {
        const { data: searchResults, error: searchError } = await supabase.functions.invoke('vector_search', {
          body: { query: messageText, userId: user.id, limit: 3 }
        });

        if (searchError) {
          console.warn("La recherche RAG a échoué:", searchError.message);
        } else if (searchResults && searchResults.length > 0) {
          ragContext = "Contexte potentiellement pertinent de votre base de connaissances :\n" +
            searchResults.map((doc: any) => `- ${doc.content}`).join('\n') + "\n\n";
        }
      } catch (e) {
        console.warn("La recherche RAG a échoué, je continue sans contexte.", e);
      }

      const systemPrompt = `
      You are a project management AI assistant. Your goal is to help the user manage their projects.
      You are omniscient about the user's projects. Here is the current list of projects:
      <projects_data>
      ${JSON.stringify(projects, null, 2)}
      </projects_data>

      ${ragContext}

      You have access to the following tools. To use a tool, you MUST respond with a single JSON object in the format: {"tool_name": "...", "arguments": {...}}. Do not add any other text.
      
      Available tools:
      - "createProject": { "description": "Creates a new project.", "arguments": { "name": "string", "description": "string" (optional), "priority": "'low'|'medium'|'high'" (optional) } }
      - "updateProject": { "description": "Updates an existing project.", "arguments": { "id": "string", "updates": { "name": "string" (optional), "description": "string" (optional), "status": "'planning'|'active'|'on-hold'|'completed'" (optional) } } }
      - "addRagDocument": { "description": "Adds a new piece of information to the long-term knowledge base (RAG). Use this when you learn new, important, and permanent information from the user that should be remembered for future conversations. For example, user preferences, project goals, specific instructions, etc.", "arguments": { "content": "string (the piece of information to remember)", "title": "string (a short, descriptive title for the information)" } }
      
      If the user asks a general question, answer it naturally. If they ask to perform an action, use the appropriate tool.
      When you learn something new and important, use the 'addRagDocument' tool to remember it.
      After a tool is successfully used, confirm the action to the user in a natural and friendly way.
    `;

      const conversationHistory: OpenRouterMessage[] = messages.map(m => ({ role: m.role, content: m.content }));
      
      const response = await openRouterService.generateCompletion(
        [
          { role: 'system', content: systemPrompt },
          ...conversationHistory,
          { role: 'user', content: messageText }
        ], { model }
      );

      let aiResponseContent = response.choices[0].message.content;

      // Check if the AI wants to use a tool
      if (aiResponseContent.trim().startsWith('{')) {
        try {
          const toolCall = JSON.parse(aiResponseContent);
          if (toolCall.tool_name === 'createProject') {
            const newProject = await createProject(toolCall.arguments);
            aiResponseContent = `J'ai créé le projet "${newProject.name}" avec succès !`;
            refetchProjects();
          } else if (toolCall.tool_name === 'updateProject') {
            const { id, updates } = toolCall.arguments;
            const updatedProject = await updateProject(id, updates);
            aiResponseContent = `Le projet "${updatedProject.name}" a bien été mis à jour.`;
            refetchProjects();
          } else if (toolCall.tool_name === 'addRagDocument') {
            const { content, title } = toolCall.arguments;
            if (!content) {
                throw new Error("Le contenu est requis pour ajouter un document RAG.");
            }
            const { error: insertError } = await supabase.from('rag_documents').insert({
                user_id: user.id,
                content,
                metadata: { title: title || 'Information apprise', source: 'ProjectAIAgent' }
            });
            if (insertError) throw insertError;
            aiResponseContent = "J'ai bien noté cette information et l'ai ajoutée à ma base de connaissances pour le futur.";
            toast.success("Nouvelle information ajoutée au RAG.");
          }
        } catch (toolError) {
          console.error("Error executing tool:", toolError);
          aiResponseContent = "Désolé, une erreur est survenue lors de l'exécution de l'action demandée.";
          toast.error("Erreur de l'agent IA : " + (toolError instanceof Error ? toolError.message : String(toolError)));
        }
      }

      setMessages(prev => [...prev, { role: 'assistant', content: aiResponseContent, timestamp: Date.now() }]);

    } catch (error) {
      console.error("Error communicating with AI:", error);
      const errorMessage = "Je suis désolé, une erreur s'est produite. Veuillez vérifier votre configuration et réessayer.";
      setMessages(prev => [...prev, { role: 'assistant', content: errorMessage, timestamp: Date.now() }]);
      toast.error("Erreur de l'agent IA : " + (error instanceof Error ? error.message : String(error)));
    } finally {
      setIsLoading(false);
    }
  };


  if (!isOpen) {
    return (
      <Button
        className="fixed bottom-6 right-6 h-16 w-16 rounded-full shadow-lg z-50"
        onClick={() => setIsOpen(true)}
      >
        <Bot className="h-8 w-8" />
      </Button>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/30 z-40" onClick={() => setIsOpen(false)}>
        <Card className="fixed bottom-6 right-6 h-[calc(100vh-80px)] w-[440px] z-50 flex flex-col shadow-2xl" onClick={e => e.stopPropagation()}>
            <CardHeader className="flex flex-row items-center justify-between p-4 border-b">
                <div className="flex items-center gap-3">
                    <Bot className="h-6 w-6 text-primary" />
                    <CardTitle className="text-lg">Agent Projet IA</CardTitle>
                </div>
                <div className="flex items-center gap-1">
                  <Popover>
                      <PopoverTrigger asChild>
                          <Button variant="ghost" size="icon">
                              <Settings className="h-5 w-5" />
                          </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-[380px] p-2" align="end">
                          <ModelSelector selectedModel={model} onModelChange={setModel} />
                      </PopoverContent>
                  </Popover>
                  <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
                      <X className="h-5 w-5" />
                  </Button>
                </div>
            </CardHeader>
            <CardContent className="flex-1 p-0">
                <ModernChatInterface
                    messages={messages}
                    onSendMessage={handleSendMessage}
                    loading={isLoading}
                    model={model}
                />
            </CardContent>
        </Card>
    </div>
  );
};

export default ProjectAIAgent;
