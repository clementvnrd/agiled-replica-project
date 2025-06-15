
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DashboardOverview from '@/components/dashboard/DashboardOverview';
import DashboardBusiness from '@/components/dashboard/DashboardBusiness';
import DashboardPersonal from '@/components/dashboard/DashboardPersonal';
import DashboardSystemCards from '@/components/dashboard/DashboardSystemCards';
import DashboardFooter from '@/components/dashboard/DashboardFooter';

const DashboardPage: React.FC = () => {
  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-1">Bienvenue sur votre plateforme All-in-One</h1>
        <p className="text-agiled-lightText">Gérez votre business et votre vie personnelle en un seul endroit</p>
      </div>
      
      <Tabs defaultValue="overview" className="mb-8">
        <TabsList className="mb-4">
          <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
          <TabsTrigger value="business">Business</TabsTrigger>
          <TabsTrigger value="personal">Personnel</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview">
          <DashboardOverview />
        </TabsContent>
        
        <TabsContent value="business">
          <DashboardBusiness />
        </TabsContent>
        
        <TabsContent value="personal">
          <DashboardPersonal />
        </TabsContent>
      </Tabs>
      
      <DashboardSystemCards />
      <DashboardFooter />
    </div>
  );
};

export default DashboardPage;
