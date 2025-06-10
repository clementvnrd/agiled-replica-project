
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Plus, 
  Save, 
  Edit3, 
  Trash2, 
  FileText,
  Search,
  Hash,
  Clock,
  BookOpen
} from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface Note {
  id: string;
  title: string;
  content: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

interface NotesEditorProps {
  projectId: string;
}

const NotesEditor: React.FC<NotesEditorProps> = ({ projectId }) => {
  const [notes, setNotes] = useState<Note[]>([
    {
      id: '1',
      title: 'Réunion de lancement',
      content: `# Réunion de lancement du projet

## Participants
- Alice Martin (Chef de projet)
- Bob Durand (Développeur)
- Claire Dubois (Designer)

## Objectifs discutés
+ Définir l'architecture technique
+ Créer les maquettes UI/UX
+ Valider le cahier des charges
+ Planifier les sprints

## Actions à suivre
1. **Architecture** - David doit finaliser les schémas d'architecture d'ici vendredi
2. **Design** - Claire commence les wireframes la semaine prochaine
3. **Planning** - Organiser les sprints sur 2 semaines

## Notes importantes
===La deadline du projet est fixée au 31 décembre 2024===

### Ressources
- [Documentation technique](https://example.com)
- [Maquettes Figma](https://figma.com)

#réunion #lancement #planning`,
      tags: ['réunion', 'lancement', 'planning'],
      createdAt: new Date(2024, 5, 1),
      updatedAt: new Date(2024, 5, 1)
    },
    {
      id: '2',
      title: 'Documentation Technique',
      content: `# Spécifications techniques

## Stack technologique
- **Frontend**: React + TypeScript + Tailwind CSS
- **Backend**: Supabase (PostgreSQL + Auth)
- **Déploiement**: Vercel
- **State Management**: TanStack Query

## Base de données
### Tables principales
\`\`\`sql
-- Users table (Supabase Auth)
-- Projects table
-- Tasks table  
-- Notes table
-- Calendar events table
\`\`\`

===IMPORTANT: Cette documentation est critique pour le développement===

## APIs à développer
+ CRUD projets
+ CRUD tâches
+ Système de notes markdown
+ Gestion du calendrier
+ Gestion des équipes

#technique #specs #architecture #Ressource`,
      tags: ['technique', 'specs', 'architecture', 'Ressource'],
      createdAt: new Date(2024, 5, 3),
      updatedAt: new Date(2024, 5, 5)
    }
  ]);

  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState('');
  const [editTitle, setEditTitle] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [newNoteTitle, setNewNoteTitle] = useState('');
  const [activeTab, setActiveTab] = useState('notes');

  // Initialiser la note sélectionnée
  useEffect(() => {
    if (notes.length > 0 && !selectedNote) {
      setSelectedNote(notes[0]);
    }
  }, [notes, selectedNote]);

  // Extraction des hashtags du contenu
  const extractHashtags = (content: string): string[] => {
    const hashtagRegex = /#([a-zA-ZÀ-ÿ0-9_]+)/g;
    const matches = content.match(hashtagRegex);
    return matches ? matches.map(tag => tag.slice(1)) : [];
  };

  // Filtrer les notes
  const filteredNotes = notes.filter(note =>
    note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    note.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
    note.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Obtenir les notes ressources
  const resourceNotes = notes.filter(note => 
    note.tags.includes('Ressource')
  );

  const handleNoteSelect = (note: Note) => {
    if (isEditing) {
      // Si on est en mode édition, sauvegarder d'abord
      handleSave();
    }
    setSelectedNote(note);
    setIsEditing(false);
  };

  const handleEditStart = () => {
    if (selectedNote) {
      setEditTitle(selectedNote.title);
      setEditContent(selectedNote.content);
      setIsEditing(true);
    }
  };

  const handleSave = () => {
    if (selectedNote) {
      // Extraire les hashtags du contenu
      const extractedTags = extractHashtags(editContent);
      
      const updatedNotes = notes.map(note =>
        note.id === selectedNote.id
          ? { 
              ...note, 
              title: editTitle, 
              content: editContent, 
              tags: extractedTags,
              updatedAt: new Date() 
            }
          : note
      );
      setNotes(updatedNotes);
      
      const updatedNote = {
        ...selectedNote, 
        title: editTitle, 
        content: editContent, 
        tags: extractedTags,
        updatedAt: new Date()
      };
      setSelectedNote(updatedNote);
      setIsEditing(false);
    }
  };

  const handleCreateNote = () => {
    if (newNoteTitle.trim()) {
      const newNote: Note = {
        id: Date.now().toString(),
        title: newNoteTitle,
        content: `# ${newNoteTitle}\n\nCommencez à écrire votre note ici...\n\n#nouvelle-note`,
        tags: ['nouvelle-note'],
        createdAt: new Date(),
        updatedAt: new Date()
      };
      setNotes([newNote, ...notes]);
      setSelectedNote(newNote);
      setNewNoteTitle('');
      setIsEditing(true);
      setEditTitle(newNote.title);
      setEditContent(newNote.content);
    }
  };

  const handleDeleteNote = (noteId: string) => {
    const updatedNotes = notes.filter(note => note.id !== noteId);
    setNotes(updatedNotes);
    if (selectedNote?.id === noteId) {
      setSelectedNote(updatedNotes[0] || null);
    }
  };

  const renderMarkdown = (content: string) => {
    return content
      .split('\n')
      .map((line, index) => {
        // Titres
        if (line.startsWith('# ')) {
          return <h1 key={index} className="text-2xl font-bold mt-6 mb-4">{line.slice(2)}</h1>;
        }
        if (line.startsWith('## ')) {
          return <h2 key={index} className="text-xl font-semibold mt-5 mb-3">{line.slice(3)}</h2>;
        }
        if (line.startsWith('### ')) {
          return <h3 key={index} className="text-lg font-medium mt-4 mb-2">{line.slice(4)}</h3>;
        }
        
        // Cases à cocher avec +
        if (line.trim().startsWith('+ ')) {
          return (
            <div key={index} className="flex items-center gap-2 my-1">
              <input type="checkbox" className="rounded" />
              <span>{line.trim().slice(2)}</span>
            </div>
          );
        }
        
        // Cases à cocher markdown standard
        if (line.startsWith('- [x] ')) {
          return (
            <div key={index} className="flex items-center gap-2 my-1">
              <input type="checkbox" checked readOnly className="rounded" />
              <span className="line-through text-muted-foreground">{line.slice(6)}</span>
            </div>
          );
        }
        if (line.startsWith('- [ ] ')) {
          return (
            <div key={index} className="flex items-center gap-2 my-1">
              <input type="checkbox" readOnly className="rounded" />
              <span>{line.slice(6)}</span>
            </div>
          );
        }
        
        // Listes
        if (line.startsWith('- ')) {
          return <li key={index} className="ml-4 my-1">• {line.slice(2)}</li>;
        }
        
        // Citations
        if (line.startsWith('> ')) {
          return (
            <blockquote key={index} className="border-l-4 border-blue-500 pl-4 my-3 italic text-muted-foreground bg-muted/30 py-2 rounded-r">
              {line.slice(2)}
            </blockquote>
          );
        }
        
        // Listes numérotées
        if (line.match(/^\d+\. /)) {
          return <li key={index} className="ml-4 my-1 list-decimal">{line.replace(/^\d+\. /, '')}</li>;
        }
        
        // Lignes vides
        if (line.trim() === '') {
          return <br key={index} />;
        }
        
        // Traitement du surlignage ===text===
        let processedLine = line;
        const highlightRegex = /===([^=]+)===/g;
        const parts = [];
        let lastIndex = 0;
        let match;
        
        while ((match = highlightRegex.exec(line)) !== null) {
          // Ajouter le texte avant le surlignage
          if (match.index > lastIndex) {
            parts.push(line.slice(lastIndex, match.index));
          }
          // Ajouter le texte surligné
          parts.push(
            <mark key={`highlight-${index}-${match.index}`} className="bg-yellow-200 px-1 rounded">
              {match[1]}
            </mark>
          );
          lastIndex = match.index + match[0].length;
        }
        
        // Ajouter le reste du texte
        if (lastIndex < line.length) {
          parts.push(line.slice(lastIndex));
        }
        
        // Si aucun surlignage trouvé, utiliser la ligne originale
        const finalContent = parts.length > 0 ? parts : processedLine;
        
        return <p key={index} className="my-2">{finalContent}</p>;
      });
  };

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="mb-4">
        <TabsTrigger value="notes" className="flex items-center gap-2">
          <FileText className="h-4 w-4" />
          Notes
        </TabsTrigger>
        <TabsTrigger value="resources" className="flex items-center gap-2">
          <BookOpen className="h-4 w-4" />
          Ressources ({resourceNotes.length})
        </TabsTrigger>
      </TabsList>

      <TabsContent value="notes">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[600px]">
          {/* Liste des notes */}
          <Card className="lg:col-span-1">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Notes du projet
              </CardTitle>
              <div className="space-y-3">
                {/* Recherche */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Rechercher dans les notes..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                {/* Nouvelle note */}
                <div className="flex gap-2">
                  <Input
                    placeholder="Titre de la nouvelle note"
                    value={newNoteTitle}
                    onChange={(e) => setNewNoteTitle(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleCreateNote()}
                  />
                  <Button onClick={handleCreateNote} disabled={!newNoteTitle.trim()}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="space-y-1 max-h-96 overflow-y-auto">
                {filteredNotes.map(note => (
                  <div
                    key={note.id}
                    className={`group p-3 cursor-pointer hover:bg-muted/50 border-l-2 transition-colors ${
                      selectedNote?.id === note.id ? 'bg-muted border-l-blue-500' : 'border-l-transparent'
                    }`}
                    onClick={() => handleNoteSelect(note)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-sm truncate">{note.title}</h4>
                        <p className="text-xs text-muted-foreground mt-1">
                          <Clock className="h-3 w-3 inline mr-1" />
                          {format(note.updatedAt, 'dd/MM/yyyy HH:mm', { locale: fr })}
                        </p>
                        {note.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {note.tags.slice(0, 2).map(tag => (
                              <Badge key={tag} variant="outline" className="text-xs">
                                <Hash className="h-2 w-2 mr-1" />
                                {tag}
                              </Badge>
                            ))}
                            {note.tags.length > 2 && (
                              <Badge variant="outline" className="text-xs">+{note.tags.length - 2}</Badge>
                            )}
                          </div>
                        )}
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteNote(note.id);
                        }}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Éditeur de note */}
          <Card className="lg:col-span-2">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  {isEditing ? (
                    <Input
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      className="text-lg font-semibold h-auto border-none p-0 focus-visible:ring-0"
                    />
                  ) : (
                    <CardTitle>{selectedNote?.title || 'Sélectionnez une note'}</CardTitle>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  {isEditing ? (
                    <>
                      <Button size="sm" onClick={handleSave}>
                        <Save className="h-4 w-4 mr-2" />
                        Sauvegarder
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => setIsEditing(false)}>
                        Annuler
                      </Button>
                    </>
                  ) : (
                    <Button size="sm" onClick={handleEditStart} disabled={!selectedNote}>
                      <Edit3 className="h-4 w-4 mr-2" />
                      Modifier
                    </Button>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {selectedNote ? (
                <div className="h-96 overflow-y-auto">
                  {isEditing ? (
                    <Textarea
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                      className="min-h-full border-none p-0 resize-none focus-visible:ring-0"
                      placeholder="Écrivez votre note en markdown...

Syntaxe supportée:
# Titre principal
## Sous-titre
=== Texte surligné ===
+ Case à cocher
#hashtag pour créer des tags"
                    />
                  ) : (
                    <div className="prose prose-sm max-w-none">
                      {renderMarkdown(selectedNote.content)}
                    </div>
                  )}
                </div>
              ) : (
                <div className="h-96 flex items-center justify-center text-muted-foreground">
                  <div className="text-center">
                    <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Sélectionnez une note pour la visualiser</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </TabsContent>

      <TabsContent value="resources">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Ressources du projet
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Notes importantes marquées avec #Ressource
            </p>
          </CardHeader>
          <CardContent>
            {resourceNotes.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Aucune ressource disponible</p>
                <p className="text-sm">Ajoutez #Ressource à vos notes importantes</p>
              </div>
            ) : (
              <div className="space-y-4">
                {resourceNotes.map(note => (
                  <Card key={note.id} className="cursor-pointer hover:bg-muted/50" onClick={() => {
                    setActiveTab('notes');
                    setSelectedNote(note);
                  }}>
                    <CardContent className="p-4">
                      <h4 className="font-medium mb-2">{note.title}</h4>
                      <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                        {note.content.split('\n').find(line => line.trim() && !line.startsWith('#'))?.slice(0, 100)}...
                      </p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        {format(note.updatedAt, 'dd/MM/yyyy', { locale: fr })}
                        <div className="flex gap-1 ml-2">
                          {note.tags.map(tag => (
                            <Badge key={tag} variant="outline" className="text-xs">
                              #{tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
};

export default NotesEditor;
