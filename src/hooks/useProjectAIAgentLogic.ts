import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { toast } from 'sonner';

import { openRouterService, Message as OpenRouterMessage } from '@/services/openrouter';
import { supabase } from '@/integrations/supabase/client';
import { useSupabaseAuth } from '@/hooks/useSupabaseAuth';
import { useRagDocuments } from '@/hooks/supabase/useRagDocuments';
import { useTasks } from '@/hooks/useTasks';
import { useTeamMembers } from '@/hooks/useTeamMembers';
import type { useProjects } from '@/hooks/useProjects';
import { getPageContext } from '@/utils/ai/getContext';
import { handleToolCalls } from '@/services/aiToolHandler';

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

      // 2. Page-specific context
      const { pageContext, teamMembersContext } = getPageContext({
        pathname,
        projects,
        ragDocuments,
        teamMembers,
      });

      const systemPrompt = `
      You are a project management AI assistant. Your goal is to help the user manage their projects.
      You are omniscient about the user's projects and what they are currently doing in the app.

      ${pageContext}
      ${teamMembersContext}

      Here is the current list of all projects:
      <projects_data>
      ${JSON.stringify(projects, null, 2)}
      </projects_data>

      ${ragContext}

      You have access to the following tools. To use a tool, you MUST respond with a JSON object. To use multiple tools in one turn, respond with a JSON array of tool call objects.
      Format for single call: {"tool_name": "...", "arguments": {...}}
      Format for multiple calls: [{"tool_name": "...", "arguments": {...}}, {"tool_name": "...", "arguments": {...}}]
      Do not add any other text outside the JSON.
      
      Available tools:
      - "createProject": { "description": "Creates a new project.", "arguments": { "name": "string", "description": "string" (optional), "priority": "'low'|'medium'|'high'" (optional) } }
      - "updateProject": { "description": "Updates an existing project.", "arguments": { "id": "string", "updates": { "name": "string" (optional), "description": "string" (optional), "status": "'planning'|'active'|'on-hold'|'completed'" (optional) } } }
      - "createTask": { "description": "Creates a new task in a specific project. You must provide the project_id from the projects list.", "arguments": { "project_id": "string", "title": "string", "description": "string (optional)", "assignee": "string (the name of a team member, if available in the context)" (optional), "status": "'idea'|'todo'|'in-progress'|'done'" (optional, defaults to 'todo'), "priority": "'low'|'medium'|'high'" (optional, defaults to 'medium'), "due_date": "string (YYYY-MM-DD)" (optional), "tags": "string[]" (optional) } }
      - "addRagDocument": { "description": "Adds a new piece of information to the long-term knowledge base (RAG). Use this when you learn new, important, and permanent information from the user that should be remembered for future conversations. For example, user preferences, project goals, specific instructions, etc.", "arguments": { "content": "string (the piece of information to remember)", "title": "string (a short, descriptive title for the information)" } }
      
      If the user asks a general question, answer it naturally. If they ask to perform an action, use the appropriate tool(s).

      **Crucially, your primary function is to learn and build a knowledge base.** If the user provides any new information that could be useful later (their preferences, goals, facts, specific instructions, etc.), you **MUST** use the 'addRagDocument' tool to store it. This is more important than just answering the immediate question. Always be on the lookout for information to remember, regardless of the current page or context.

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
