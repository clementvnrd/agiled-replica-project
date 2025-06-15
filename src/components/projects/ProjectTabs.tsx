import React, { lazy, Suspense } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  CheckSquare,
  FileText,
  Calendar as CalendarIcon, 
  BarChart3,
  Loader2
} from 'lucide-react';
import type { Database } from '@/integrations/supabase/types';

const ProjectTasksBoard = lazy(() => import('@/components/projects/ProjectTasksBoard'));
const NotesEditor = lazy(() => import('@/components/projects/NotesEditor'));
const ProjectCalendar = lazy(() => import('@/components/projects/ProjectCalendar'));

type DbProject = Database['public']['Tables']['projects']['Row'];

const TabContentLoader = () => (
  <Card>
    <CardContent className="flex items-center justify-center p-12">
      <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
    </CardContent>
  </Card>
);

interface ProjectTabsProps {
  project: DbProject;
}

const ProjectTabs: React.FC<ProjectTabsProps> = ({ project }) => {
  return (
    <Tabs defaultValue="tasks" className="space-y-6">
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="tasks" className="flex items-center gap-2">
          <CheckSquare className="h-4 w-4" />
          Tâches
        </TabsTrigger>
        <TabsTrigger value="notes" className="flex items-center gap-2">
          <FileText className="h-4 w-4" />
          Notes
        </TabsTrigger>
        <TabsTrigger value="calendar" className="flex items-center gap-2">
          <CalendarIcon className="h-4 w-4" />
          Calendrier
        </TabsTrigger>
        <TabsTrigger value="analytics" className="flex items-center gap-2">
          <BarChart3 className="h-4 w-4" />
          Analytiques
        </TabsTrigger>
      </TabsList>

      <TabsContent value="tasks">
        <Suspense fallback={<TabContentLoader />}>
          <ProjectTasksBoard projectId={project.id} />
        </Suspense>
      </TabsContent>

      <TabsContent value="notes">
        <Suspense fallback={<TabContentLoader />}>
          <NotesEditor projectId={project.id} />
        </Suspense>
      </TabsContent>

      <TabsContent value="calendar">
        <Suspense fallback={<TabContentLoader />}>
          <ProjectCalendar projectId={project.id} />
        </Suspense>
      </TabsContent>

      <TabsContent value="analytics">
        <Card>
          <CardHeader>
            <CardTitle>Analytiques du projet</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-12 text-muted-foreground">
              <BarChart3 className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Les analytiques détaillées du projet seront bientôt disponibles</p>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
};

export default ProjectTabs;
