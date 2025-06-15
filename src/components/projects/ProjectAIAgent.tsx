
import React, { useState } from 'react';
import type { useProjects } from '@/hooks/useProjects';
import { useProjectAIAgentLogic } from '@/hooks/useProjectAIAgentLogic';
import ProjectAIAgentUI from './ProjectAIAgentUI';
import { DEFAULT_MODEL_ID } from '@/lib/constants/models';

type Project = ReturnType<typeof useProjects>['projects'][0];
type CreateProject = ReturnType<typeof useProjects>['createProject'];
type UpdateProject = ReturnType<typeof useProjects>['updateProject'];

interface ProjectAIAgentProps {
  projects: Project[];
  createProject: CreateProject;
  updateProject: UpdateProject;
  refetchProjects: () => void;
}

const ProjectAIAgent: React.FC<ProjectAIAgentProps> = ({ projects, createProject, updateProject, refetchProjects }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [model, setModel] = useState(DEFAULT_MODEL_ID);

  const { messages, isLoading, handleSendMessage } = useProjectAIAgentLogic({
    projects,
    createProject,
    updateProject,
    refetchProjects,
    model,
  });

  return (
    <ProjectAIAgentUI
      isOpen={isOpen}
      onSetIsOpen={setIsOpen}
      messages={messages}
      isLoading={isLoading}
      onSendMessage={handleSendMessage}
      model={model}
      onSetModel={setModel}
    />
  );
};

export default ProjectAIAgent;
