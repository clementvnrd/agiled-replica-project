
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import RagDocumentEditor from '@/components/rag/RagDocumentEditor';
import RagDocumentsViewer from '@/components/rag/RagDocumentsViewer';

const RagManagementPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('manage');
  
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Système RAG</h1>
        <p className="text-agiled-lightText">
          Gérez votre base de connaissances pour le Retrieval Augmented Generation
        </p>
      </div>

      <Tabs defaultValue={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="manage">Gérer les documents</TabsTrigger>
          <TabsTrigger value="view">Visualiser</TabsTrigger>
        </TabsList>
        
        <TabsContent value="manage" className="space-y-6">
          <RagDocumentEditor />
        </TabsContent>
        
        <TabsContent value="view">
          <RagDocumentsViewer />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default RagManagementPage;
