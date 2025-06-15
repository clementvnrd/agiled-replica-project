
// These types are based on their usage in useProjectAIAgentLogic.ts
// to avoid complex imports from hooks and potential build issues.
// They are structurally compatible.
type Project = Record<string, any> & {
  id: string;
  name: string;
};

type RagDocument = Record<string, any>;

type TeamMember = Record<string, any> & {
  id: string;
  name: string;
  role: string;
};

interface GetPageContextParams {
  pathname: string;
  projects: Project[];
  ragDocuments: RagDocument[];
  teamMembers: TeamMember[];
}

export const getPageContext = ({ pathname, projects, ragDocuments, teamMembers }: GetPageContextParams): { pageContext: string, teamMembersContext: string } => {
  let pageContext = "";
  let teamMembersContext = "";

  if (pathname.startsWith('/projects/')) {
    const projectId = pathname.split('/')[2];
    if (projectId) {
      const currentProject = projects.find(p => p.id === projectId);
      if (currentProject) {
        pageContext = `The user is currently viewing the details of the project "${currentProject.name}". Here is the full data for this project:
<current_project_data>
${JSON.stringify(currentProject, null, 2)}
</current_project_data>\n\n`;
        if (teamMembers && teamMembers.length > 0) {
          teamMembersContext = `The following team members are part of this project. You can assign tasks to them by name:
<team_members_data>
${JSON.stringify(teamMembers.map(m => ({ id: m.id, name: m.name, role: m.role })), null, 2)}
</team_members_data>\n\n`;
        }
      }
    }
  } else if (pathname.startsWith('/projects')) {
    pageContext = "The user is currently viewing the list of all their projects.\n\n";
  } else if (pathname.startsWith('/rag')) {
    pageContext = `The user is currently on the RAG document management page. They can see a list of their documents. Here are the first 5 documents in their knowledge base:
<rag_documents_sample>
${JSON.stringify(ragDocuments.slice(0, 5), null, 2)}
</rag_documents_sample>\n\n`;
  } else if (pathname.startsWith('/dashboard')) {
    pageContext = "The user is currently on the main dashboard page.\n\n";
  } else if (pathname.startsWith('/calendar')) {
    pageContext = "The user is currently viewing their calendar.\n\n";
  }

  return { pageContext, teamMembersContext };
};
