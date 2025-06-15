
import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from '@/components/Header';
import Sidebar from '@/components/navigation/Sidebar';
import { Toaster } from "@/components/ui/sonner";
import ProjectAIAgent from '@/components/projects/ProjectAIAgent';
import { useProjects } from '@/hooks/useProjects';

const MainLayout: React.FC = () => {
  const { projects, createProject, updateProject, refetch } = useProjects();

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto bg-gray-50">
          <Outlet />
        </main>
        <Toaster />
      </div>
      {projects && createProject && updateProject && refetch && (
        <ProjectAIAgent
          projects={projects}
          createProject={createProject}
          updateProject={updateProject}
          refetchProjects={refetch}
        />
      )}
    </div>
  );
};

export default MainLayout;
