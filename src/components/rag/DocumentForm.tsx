
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Loader2 } from 'lucide-react';
import { toast } from "sonner";
import { useRagDocuments } from '@/hooks/supabase/useRagDocuments';

interface DocumentFormProps {
  onSuccess: () => void;
}

const DocumentForm: React.FC<DocumentFormProps> = ({ onSuccess }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const { addDocument, isAddingDocument } = useRagDocuments();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!content.trim()) {
      toast.error("Le contenu du document est requis");
      return;
    }
    
    try {
      const metadata: Record<string, any> = { title: title || 'Sans titre', type: 'text', source: 'DocumentForm' };
      
      await addDocument({ content, metadata });
      
      setTitle('');
      setContent('');
      onSuccess();
    } catch (err) {
      console.error('Erreur lors de la création du document:', err);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Ajouter un nouveau document</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Titre (optionnel)</label>
            <Input 
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="Titre du document"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Contenu</label>
            <Textarea 
              value={content}
              onChange={e => setContent(e.target.value)}
              placeholder="Contenu du document à ajouter au système RAG..."
              className="min-h-[200px]"
              required
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button 
            type="submit" 
            disabled={isAddingDocument || !content.trim()} 
            className="w-full"
          >
            {isAddingDocument ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Enregistrement...
              </>
            ) : (
              <>Ajouter au système RAG</>
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default DocumentForm;
