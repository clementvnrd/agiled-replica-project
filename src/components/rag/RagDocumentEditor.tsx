
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

  // Utilisation du hook centralisé pour gérer les données RAG
  const { documents, isLoading, deleteDocument, refetch } = useRagDocuments();

  const handleDocumentDelete = async (id: string) => {
    // Utilisation de la fonction de suppression du hook
    await deleteDocument(id);
  };
  
  // La fonction de succès pour le formulaire et l'upload est maintenant le "refetch" du hook
  const handleSuccess = () => {
    refetch();
    setActiveTab('list'); // Basculer vers la liste après un ajout réussi
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
            userId={user.id} 
            supabase={supabase} 
            onSuccess={handleSuccess}
          />
        </TabsContent>
        
        <TabsContent value="list">
          <DocumentList 
            documents={documents}
            isLoading={isLoading}
            supabase={supabase}
            onDelete={handleDocumentDelete}
            onRefresh={refetch} // Utiliser refetch du hook
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
