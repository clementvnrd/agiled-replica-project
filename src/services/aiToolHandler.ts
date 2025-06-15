
import { toast } from 'sonner';

// To avoid complex dependencies, we define the required functions structurally.
// These are compatible with the hooks' return types.
type CreateProjectFunc = (args: any) => Promise<{ name: string }>;
type UpdateProjectFunc = (id: string, updates: any) => Promise<{ name: string }>;
type CreateTaskFunc = (args: any) => Promise<{ title: string }>;
type AddRagDocumentFunc = (args: { content: string; metadata: any }) => Promise<any>;
type RefetchProjectsFunc = () => void;

interface ToolHandlerDependencies {
  createProject: CreateProjectFunc;
  updateProject: UpdateProjectFunc;
  createTask: CreateTaskFunc;
  addRagDocument: AddRagDocumentFunc;
  refetchProjects: RefetchProjectsFunc;
}

interface ToolCall {
  tool_name: string;
  arguments: any;
}

export const handleToolCalls = async (
  toolCalls: ToolCall[],
  dependencies: ToolHandlerDependencies
): Promise<{ confirmationMessage: string; shouldRefetchTasks: boolean; didAddRagDoc: boolean }> => {
  const confirmationMessages: string[] = [];
  let shouldRefetchProjects = false;
  let shouldRefetchTasks = false;
  let didAddRagDoc = false;

  for (const toolCall of toolCalls) {
    switch (toolCall.tool_name) {
      case 'createProject': {
        const newProject = await dependencies.createProject(toolCall.arguments);
        confirmationMessages.push(`J'ai créé le projet "${newProject.name}" avec succès !`);
        shouldRefetchProjects = true;
        break;
      }
      case 'updateProject': {
        const { id, updates } = toolCall.arguments;
        const updatedProject = await dependencies.updateProject(id, updates);
        confirmationMessages.push(`Le projet "${updatedProject.name}" a bien été mis à jour.`);
        shouldRefetchProjects = true;
        break;
      }
      case 'createTask': {
        const newTask = await dependencies.createTask(toolCall.arguments);
        confirmationMessages.push(`J'ai créé la tâche "${newTask.title}".`);
        shouldRefetchTasks = true;
        break;
      }
      case 'addRagDocument': {
        const { content, title } = toolCall.arguments;
        if (!content) {
          throw new Error("Le contenu est requis pour ajouter un document RAG.");
        }
        await dependencies.addRagDocument({
          content,
          metadata: { title: title || 'Information apprise', source: 'ProjectAIAgent' }
        });
        confirmationMessages.push("J'ai bien noté cette information pour le futur.");
        didAddRagDoc = true;
        break;
      }
      default:
        console.warn(`Unknown tool call: ${toolCall.tool_name}`);
    }
  }

  if (shouldRefetchProjects) {
    dependencies.refetchProjects();
  }

  return {
    confirmationMessage: confirmationMessages.join('\n'),
    shouldRefetchTasks,
    didAddRagDoc,
  };
};
