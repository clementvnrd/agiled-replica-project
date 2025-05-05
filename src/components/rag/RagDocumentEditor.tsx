import React, { useState, useEffect, useCallback } from 'react';
import { useDynamicSupabase } from '@/providers/DynamicSupabaseProvider';
import { useUser } from '@clerk/clerk-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Check, Loader2, AlertTriangle, FileText, Upload } from 'lucide-react';
import { toast } from "sonner";
import { RagDocument } from '@/types';

const RagDocumentEditor: React.FC = () => {
  const { user } = useUser();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState<string>('editor');
  const [documents, setDocuments] = useState<RagDocument[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { supabase, loading: supabaseLoading, error: supabaseError } = useDynamicSupabase();

  // Define fetchDocuments without useCallback first to avoid circular reference
  const fetchDocuments = async () => {
    if (!user || supabaseLoading || supabaseError) return;
    
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('rag_documents')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      
      // Ensure each document has an ID
      const processedData = (data || []).map((doc: any) => ({
        ...doc,
        id: doc.id || `doc-${crypto.randomUUID()}`
      })) as RagDocument[];
      
      setDocuments(processedData);
    } catch (err) {
      console.error('Erreur lors de la récupération des documents:', err);
      toast.error("Erreur lors de la récupération des documents");
    } finally {
      setIsLoading(false);
    }
  };

  // Wrap fetchDocuments in useCallback with minimal dependencies
  // This avoids the infinite type instantiation
  const memoizedFetchDocuments = useCallback(() => {
    fetchDocuments();
  }, [user?.id, supabase]); // Only include primitive values or stable references

  useEffect(() => {
    if (user && !supabaseLoading && !supabaseError) {
      memoizedFetchDocuments();
    }
  }, [user, memoizedFetchDocuments, supabaseLoading, supabaseError]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    if (!content.trim()) {
      toast.error("Le contenu du document est requis");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const metadata = { title: title || 'Sans titre', type: 'text' };
      
      const { data, error } = await supabase
        .from('rag_documents')
        .insert([
          { user_id: user.id, content, metadata }
        ])
        .select();
        
      if (error) throw error;
      
      toast.success("Document RAG ajouté avec succès");
      setTitle('');
      setContent('');
      fetchDocuments();
      setActiveTab('list');
    } catch (err) {
      console.error('Erreur lors de la création du document:', err);
      toast.error("Erreur lors de la création du document");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('rag_documents')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      
      setDocuments(documents.filter(doc => doc.id !== id));
      toast.success("Document supprimé avec succès");
    } catch (err) {
      console.error('Erreur lors de la suppression:', err);
      toast.error("Erreur lors de la suppression du document");
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files.length || !user) return;
    
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
        
        const { data, error } = await supabase
          .from('rag_documents')
          .insert([
            { 
              user_id: user.id, 
              content: text, 
              metadata: { 
                title: file.name, 
                type: 'text',
                size: file.size,
                uploadedAt: new Date().toISOString() 
              } 
            }
          ])
          .select();
          
        if (error) throw error;
        
        toast.success("Document importé avec succès");
        fetchDocuments();
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
        </TabsContent>
        
        <TabsContent value="list">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-medium">Documents ({documents.length})</h3>
              <Button 
                size="sm" 
                variant="outline" 
                onClick={memoizedFetchDocuments}
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
                  onClick={() => setActiveTab('editor')}
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
        </TabsContent>
        
        <TabsContent value="import">
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
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default RagDocumentEditor;
