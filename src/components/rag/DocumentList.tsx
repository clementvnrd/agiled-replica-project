
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Loader2, FileText } from 'lucide-react';
import { toast } from "sonner";
import { RagDocument } from '@/types';
import { SupabaseClient } from '@supabase/supabase-js';

interface DocumentListProps {
  documents: RagDocument[];
  isLoading: boolean;
  supabase: SupabaseClient;
  onDelete: (id: string) => void;
  onRefresh: () => void;
  onCreateNew: () => void;
}

const DocumentList: React.FC<DocumentListProps> = ({ 
  documents, 
  isLoading, 
  supabase, 
  onDelete, 
  onRefresh,
  onCreateNew 
}) => {
  
  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('rag_documents')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      
      onDelete(id);
      toast.success("Document supprimé avec succès");
    } catch (err) {
      console.error('Erreur lors de la suppression:', err);
      toast.error("Erreur lors de la suppression du document");
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-medium">Documents ({documents.length})</h3>
        <Button 
          size="sm" 
          variant="outline" 
          onClick={onRefresh}
          disabled={isLoading}
        >
          {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Rafraîchir"}
        </Button>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
        </div>
      ) : documents.length === 0 ? (
        <div className="text-center py-8 bg-gray-50 rounded-md">
          <FileText className="h-12 w-12 text-gray-400 mx-auto mb-2" />
          <h3 className="font-medium text-gray-600">Aucun document</h3>
          <p className="text-sm text-gray-500">Ajoutez des documents pour alimenter votre système RAG</p>
          <Button 
            variant="outline" 
            className="mt-4"
            onClick={onCreateNew}
          >
            Créer un document
          </Button>
        </div>
      ) : (
        <div className="space-y-2">
          {documents.map(doc => (
            <Card key={doc.id} className="overflow-hidden">
              <div className="flex items-start p-4">
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium truncate">
                    {doc.metadata?.title || 'Sans titre'}
                  </h4>
                  <p className="text-sm text-gray-500 truncate">
                    {doc.created_at ? new Date(doc.created_at).toLocaleDateString() : ''}
                  </p>
                  <p className="mt-2 text-sm text-gray-600 line-clamp-2">
                    {doc.content}
                  </p>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-red-600 hover:text-red-800 hover:bg-red-50"
                  onClick={() => handleDelete(doc.id)}
                >
                  Supprimer
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default DocumentList;
