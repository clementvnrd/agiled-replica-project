
import React, { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { useProjects } from '@/hooks/useProjects';
import { useTeamMembers } from '@/hooks/useTeamMembers';
import ProjectHeader from '@/components/projects/ProjectHeader';
import ProjectTabs from '@/components/projects/ProjectTabs';
import type { Database } from '@/integrations/supabase/types';

const ProjectDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const { projects, updateProject, loading: projectsLoading, error: projectsError } = useProjects();
  const { teamMembers, loading: teamLoading, error: teamError } = useTeamMembers(id);
  
  const [isCreateTaskOpen, setIsCreateTaskOpen] = useState(false);

  // Les Hooks doivent être appelés au plus haut niveau, avant tout retour conditionnel.
  const project = useMemo(() => projects.find(p => p.id === id), [projects, id]);

  const teamForBoard = useMemo(() => teamMembers
    .filter(member => member && member.id)
    .map(member => ({
      id: member.id,
      name: member.name,
      avatar: member.avatar || undefined,
      role: member.role,
  })), [teamMembers]);

  const loading = projectsLoading || teamLoading;
  const error = projectsError || teamError;
  
  if (loading) {
    return (
      <div className="p-6 space-y-6 max-w-7xl mx-auto flex justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  // Après le chargement, on vérifie s'il y a une erreur ou si le projet n'est pas trouvé.
  if (error || !project) {
    return (
      <div className="p-6 space-y-6 max-w-7xl mx-auto text-center">
        <h2 className="text-2xl font-bold text-red-600">Erreur</h2>
        <p>{error?.toString() || 'Le projet n\'a pas pu être trouvé ou chargé.'}</p>
        <Button onClick={() => navigate('/projects')}>Retour aux projets</Button>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={() => navigate('/projects')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Retour aux projets
        </Button>
      </div>

      <ProjectHeader 
        project={project}
        team={teamForBoard}
        updateProject={updateProject}
        isCreateTaskOpen={isCreateTaskOpen}
        setIsCreateTaskOpen={setIsCreateTaskOpen}
      />

      <ProjectTabs
        project={project}
      />
    </div>
  );
};

export default ProjectDetail;
