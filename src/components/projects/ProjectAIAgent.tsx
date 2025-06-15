
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
  const [model, setModel] = useState('openai/gpt-4.1-mini');

  const handleSendMessage = async (messageText: string) => {
    setIsLoading(true);
    const userMessage: Message = { role: 'user', content: messageText, timestamp: Date.now() };
    setMessages(prev => [...prev, userMessage]);

    const systemPrompt = `
      You are a project management AI assistant. Your goal is to help the user manage their projects.
      You are omniscient about the user's projects. Here is the current list of projects:
      <projects_data>
      ${JSON.stringify(projects, null, 2)}
      </projects_data>

      You have access to the following tools. To use a tool, you MUST respond with a single JSON object in the format: {"tool_name": "...", "arguments": {...}}. Do not add any other text.
      
      Available tools:
      - "createProject": { "description": "Creates a new project.", "arguments": { "name": "string", "description": "string" (optional), "priority": "'low'|'medium'|'high'" (optional) } }
      - "updateProject": { "description": "Updates an existing project.", "arguments": { "id": "string", "updates": { "name": "string" (optional), "description": "string" (optional), "status": "'planning'|'active'|'on-hold'|'completed'" (optional) } } }
      
      If the user asks a general question, answer it naturally. If they ask to perform an action, use the appropriate tool.
      After a tool is successfully used, confirm the action to the user in a natural and friendly way.
    `;

    const conversationHistory: OpenRouterMessage[] = messages.map(m => ({ role: m.role, content: m.content }));
    
    try {
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
      const errorMessage = "Je suis désolé, une erreur s'est produite. Veuillez vérifier votre configuration OpenRouter et réessayer.";
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
