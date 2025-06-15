import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { toast } from 'sonner';

import { openRouterService, Message as OpenRouterMessage } from '@/services/openrouter';
import { useSupabaseAuth } from '@/hooks/useSupabaseAuth';
import { useRagDocuments } from '@/hooks/supabase/useRagDocuments';
import { useTasks } from '@/hooks/useTasks';
import { useTeamMembers } from '@/hooks/useTeamMembers';
import type { useProjects } from '@/hooks/useProjects';
import { getPageContext } from '@/utils/ai/getContext';
import { handleToolCalls } from '@/services/aiToolHandler';
import { getSystemPrompt } from '@/utils/ai/getSystemPrompt';
import { searchRag } from '@/services/ragService';

type Project = ReturnType<typeof useProjects>['projects'][0];
type CreateProject = ReturnType<typeof useProjects>['createProject'];
type UpdateProject = ReturnType<typeof useProjects>['updateProject'];

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

interface UseProjectAIAgentLogicProps {
  projects: Project[];
  createProject: CreateProject;
  updateProject: UpdateProject;
  refetchProjects: () => void;
  model: string;
}

export const useProjectAIAgentLogic = ({
  projects,
  createProject,
  updateProject,
  refetchProjects,
  model,
}: UseProjectAIAgentLogicProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useSupabaseAuth();
  const { addDocument: addRagDocument, documents: ragDocuments } = useRagDocuments();
  const location = useLocation();
  const { createTask } = useTasks();

  const pathname = location.pathname;
  const isProjectDetailPage = pathname.startsWith('/projects/') && pathname.split('/')[2];
  const currentProjectId = isProjectDetailPage ? pathname.split('/')[2] : undefined;
  
  const { teamMembers } = useTeamMembers(currentProjectId);

  const handleSendMessage = async (messageText: string) => {
    setIsLoading(true);
    const userMessage: Message = { role: 'user', content: messageText, timestamp: Date.now() };
    setMessages(prev => [...prev, userMessage]);

    try {
      if (!user) {
        throw new Error("Utilisateur non authentifié.");
      }

      // 1. RAG Retrieval
      const ragContext = await searchRag(messageText, user.id);

      // 2. Page-specific context
      const { pageContext, teamMembersContext } = getPageContext({
        pathname,
        projects,
        ragDocuments,
        teamMembers,
      });

      // 3. System Prompt Construction
      const systemPrompt = getSystemPrompt({
        pageContext,
        teamMembersContext,
        projects,
        ragContext,
      });

      const conversationHistory: OpenRouterMessage[] = messages.map(m => ({ role: m.role, content: m.content }));
      
      const response = await openRouterService.generateCompletion(
        [
          { role: 'system', content: systemPrompt },
          ...conversationHistory,
          { role: 'user', content: messageText }
        ], { model }
      );

      let aiResponseContent = response.choices[0].message.content;
      console.log('AI response raw:', aiResponseContent);

      let isToolCall = false;
      try {
        const jsonMatch = aiResponseContent.match(/(\[[\s\S]*\]|\{[\s\S]*\})/);
        if (jsonMatch) {
            const parsedJson = JSON.parse(jsonMatch[0]);
            const toolCalls = Array.isArray(parsedJson) ? parsedJson : [parsedJson];

            if (toolCalls.length > 0 && toolCalls[0] && toolCalls[0].tool_name) {
                isToolCall = true;
                const {
                    confirmationMessage,
                    shouldRefetchTasks,
                    didAddRagDoc
                } = await handleToolCalls(toolCalls, {
                    createProject,
                    updateProject,
                    createTask,
                    addRagDocument,
                    refetchProjects,
                });

                if (confirmationMessage) {
                    aiResponseContent = confirmationMessage;
                    if (shouldRefetchTasks) {
                        const taskCount = toolCalls.filter(t => t.tool_name === 'createTask').length;
                        if (taskCount > 0) {
                            toast.success(`${taskCount} tâche(s) créée(s) !`);
                            window.dispatchEvent(new Event('tasks-updated'));
                        }
                    }
                    if (didAddRagDoc) {
                        toast.success("Nouvelle information ajoutée au RAG.");
                    }
                } else {
                   isToolCall = false; // Fallback to showing raw response if tool call handler is empty
                }
            }
        }
      } catch (toolError) {
        if (isToolCall) {
            console.error("Error executing tool:", toolError);
            const errorMessage = toolError instanceof Error ? toolError.message : String(toolError);
            aiResponseContent = `Désolé, une erreur est survenue lors de l'exécution de l'action demandée.\n\nErreur: ${errorMessage}`;
            toast.error("Erreur de l'agent IA : " + errorMessage);
        }
        // If not a tool call error, we let the raw AI response (potentially malformed json) be displayed by default.
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

  return { messages, isLoading, handleSendMessage };
};
