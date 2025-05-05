
import React, { useState, useEffect } from 'react';
import { useDynamicSupabase } from '@/providers/DynamicSupabaseProvider';
import { useUser } from '@clerk/clerk-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RagDocument } from '@/types';
import DocumentForm from './DocumentForm';
import DocumentList from './DocumentList';
import FileUploader from './FileUploader';

const RagDocumentEditor: React.FC = () => {
  const { user } = useUser();
  const [activeTab, setActiveTab] = useState<string>('editor');
  const [documents, setDocuments] = useState<RagDocument[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { supabase, loading: supabaseLoading, error: supabaseError } = useDynamicSupabase();

  // Function to load documents with proper type handling
  function loadDocuments() {
    if (!user || supabaseLoading || supabaseError) return;
    setIsLoading(true);
    
    const fetchData = async () => {
      try {
        const { data, error } = await supabase
          .from('rag_documents')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });
          
        if (error) throw error;
        
        // Process the data with explicit type casting
        const processedData: RagDocument[] = [];
        
        if (data) {
          for (const item of data) {
            // Important fix: Ensure each document has an ID, even if it's not in the database response
            const documentId = (item as any).id || `doc-${crypto.randomUUID()}`;
            
            // Create a properly typed document object
            const doc: RagDocument = {
              id: documentId,
              user_id: item.user_id || user.id,
              content: item.content,
              metadata: typeof item.metadata === 'object' ? item.metadata : {}, 
              created_at: item.created_at
            };
            processedData.push(doc);
          }
        }
        
        setDocuments(processedData);
      } catch (err) {
        console.error('Erreur lors de la récupération des documents:', err);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }

  useEffect(() => {
    if (user && !supabaseLoading && !supabaseError) {
      loadDocuments();
    }
  }, [user, supabaseLoading, supabaseError]);

  const handleDocumentDelete = (id: string) => {
    setDocuments(documents.filter(doc => doc.id !== id));
  };

  if (supabaseLoading) return <div>Chargement Supabase...</div>;
  if (supabaseError) return <div>Erreur Supabase : {supabaseError}</div>;

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
          {user && (
            <DocumentForm 
              userId={user.id} 
              supabase={supabase} 
              onSuccess={loadDocuments}
            />
          )}
        </TabsContent>
        
        <TabsContent value="list">
          <DocumentList 
            documents={documents}
            isLoading={isLoading}
            supabase={supabase}
            onDelete={handleDocumentDelete}
            onRefresh={loadDocuments}
            onCreateNew={() => setActiveTab('editor')}
          />
        </TabsContent>
        
        <TabsContent value="import">
          {user && (
            <FileUploader 
              userId={user.id} 
              supabase={supabase} 
              onSuccess={loadDocuments}
            />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default RagDocumentEditor;
