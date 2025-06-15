
import { supabase } from '@/integrations/supabase/client';
import React, { useState } from 'react';
import { useSupabaseAuth } from '@/hooks/useSupabaseAuth';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import DocumentForm from './DocumentForm';
import DocumentList from './DocumentList';
import FileUploader from './FileUploader';
import { useRagDocuments } from '@/hooks/supabase/useRagDocuments';

const RagDocumentEditor: React.FC = () => {
  const { user } = useSupabaseAuth();
  const [activeTab, setActiveTab] = useState<string>('editor');

  const { documents, isLoading, deleteDocument, refetch } = useRagDocuments();

  const handleDocumentDelete = async (id: string) => {
    await deleteDocument(id);
  };
  
  const handleSuccess = () => {
    refetch();
    setActiveTab('list');
  };

  if (!user) {
    return <div>Veuillez vous connecter pour gérer les documents.</div>;
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Gestionnaire de Documents RAG</h2>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="editor">Éditeur</TabsTrigger>
          <TabsTrigger value="list">Mes documents</TabsTrigger>
          <TabsTrigger value="import">Importation</TabsTrigger>
        </TabsList>
        
        <TabsContent value="editor">
          <DocumentForm 
            onSuccess={handleSuccess}
          />
        </TabsContent>
        
        <TabsContent value="list">
          <DocumentList 
            documents={documents}
            isLoading={isLoading}
            onDelete={handleDocumentDelete}
            onRefresh={refetch}
            onCreateNew={() => setActiveTab('editor')}
          />
        </TabsContent>
        
        <TabsContent value="import">
          <FileUploader 
            userId={user.id} 
            supabase={supabase} 
            onSuccess={handleSuccess}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default RagDocumentEditor;
