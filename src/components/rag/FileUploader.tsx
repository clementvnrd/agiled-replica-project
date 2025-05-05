
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Loader2, Upload } from 'lucide-react';
import { toast } from "sonner";
import { SupabaseClient } from '@supabase/supabase-js';

interface FileUploaderProps {
  userId: string;
  supabase: SupabaseClient;
  onSuccess: () => void;
}

const FileUploader: React.FC<FileUploaderProps> = ({ userId, supabase, onSuccess }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files.length || !userId) return;
    
    const file = e.target.files[0];
    if (file.size > 5 * 1024 * 1024) { // 5MB
      toast.error("Fichier trop volumineux (max 5MB)");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Pour les fichiers textes simples
      if (file.type === 'text/plain') {
        const text = await file.text();
        
        // Define metadata with correct type
        const metadata: Record<string, any> = { 
          title: file.name, 
          type: 'text',
          size: file.size,
          uploadedAt: new Date().toISOString() 
        };
        
        // Fix for deep type instantiation issue: Do not chain .select()
        const { error } = await supabase
          .from('rag_documents')
          .insert([{ user_id: userId, content: text, metadata }]);
          
        if (error) throw error;
        
        toast.success("Document importé avec succès");
        onSuccess(); // Refresh documents
      } else {
        toast.error("Format de fichier non supporté. Seuls les fichiers texte (.txt) sont acceptés pour le moment");
      }
    } catch (err) {
      console.error('Erreur lors de l\'importation:', err);
      toast.error("Erreur lors de l'importation du document");
    } finally {
      setIsSubmitting(false);
      // Reset input
      e.target.value = '';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Importer un document</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
          <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="font-medium mb-2">Déposez votre fichier ici ou cliquez pour parcourir</h3>
          <p className="text-sm text-gray-500 mb-4">Formats supportés: fichiers texte (.txt)</p>
          <Input 
            type="file" 
            accept=".txt" 
            onChange={handleFileUpload}
            className="hidden"
            id="file-upload"
            disabled={isSubmitting}
          />
          <Button 
            variant="outline" 
            onClick={() => document.getElementById('file-upload')?.click()}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Importation...
              </>
            ) : (
              <>Sélectionner un fichier</>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default FileUploader;
