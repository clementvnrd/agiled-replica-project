
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Loader2 } from 'lucide-react';
import { toast } from "sonner";
import { SupabaseClient } from '@supabase/supabase-js';

interface DocumentFormProps {
  userId: string;
  supabase: SupabaseClient;
  onSuccess: () => void;
}

const DocumentForm: React.FC<DocumentFormProps> = ({ userId, supabase, onSuccess }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) return;
    
    if (!content.trim()) {
      toast.error("Le contenu du document est requis");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Define metadata with correct type
      const metadata: Record<string, any> = { title: title || 'Sans titre', type: 'text' };
      
      // Fix for deep type instantiation issue: Do not chain .select()
      const { error } = await supabase
        .from('rag_documents')
        .insert([
          { user_id: userId, content, metadata }
        ]);
        
      if (error) throw error;
      
      toast.success("Document RAG ajouté avec succès");
      setTitle('');
      setContent('');
      onSuccess(); // Call callback to refresh documents
    } catch (err) {
      console.error('Erreur lors de la création du document:', err);
      toast.error("Erreur lors de la création du document");
    } finally {
      setIsSubmitting(false);
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
            disabled={isSubmitting || !content.trim()} 
            className="w-full"
          >
            {isSubmitting ? (
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
