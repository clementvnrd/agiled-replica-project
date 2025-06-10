
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Plus, 
  Save, 
  Edit3, 
  Trash2, 
  FileText,
  Search,
  Hash,
  Clock
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
- [ ] Définir l'architecture technique
- [ ] Créer les maquettes UI/UX
- [x] Valider le cahier des charges
- [ ] Planifier les sprints

## Actions à suivre
1. **Architecture** - David doit finaliser les schémas d'architecture d'ici vendredi
2. **Design** - Claire commence les wireframes la semaine prochaine
3. **Planning** - Organiser les sprints sur 2 semaines

## Notes importantes
> La deadline du projet est fixée au 31 décembre 2024

### Ressources
- [Documentation technique](https://example.com)
- [Maquettes Figma](https://figma.com)`,
      tags: ['réunion', 'lancement', 'planning'],
      createdAt: new Date(2024, 5, 1),
      updatedAt: new Date(2024, 5, 1)
    },
    {
      id: '2',
      title: 'Spécifications techniques',
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

## APIs à développer
1. CRUD projets
2. CRUD tâches
3. Système de notes markdown
4. Gestion du calendrier
5. Gestion des équipes

## Performance
- Lazy loading des composants
- Optimisation des requêtes
- Cache avec React Query`,
      tags: ['technique', 'specs', 'architecture'],
      createdAt: new Date(2024, 5, 3),
      updatedAt: new Date(2024, 5, 5)
    }
  ]);

  const [selectedNote, setSelectedNote] = useState<Note | null>(notes[0]);
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState('');
  const [editTitle, setEditTitle] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [newNoteTitle, setNewNoteTitle] = useState('');

  const filteredNotes = notes.filter(note =>
    note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    note.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
    note.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleEditStart = () => {
    if (selectedNote) {
      setEditTitle(selectedNote.title);
      setEditContent(selectedNote.content);
      setIsEditing(true);
    }
  };

  const handleSave = () => {
    if (selectedNote) {
      const updatedNotes = notes.map(note =>
        note.id === selectedNote.id
          ? { ...note, title: editTitle, content: editContent, updatedAt: new Date() }
          : note
      );
      setNotes(updatedNotes);
      setSelectedNote({ ...selectedNote, title: editTitle, content: editContent, updatedAt: new Date() });
      setIsEditing(false);
    }
  };

  const handleCreateNote = () => {
    if (newNoteTitle.trim()) {
      const newNote: Note = {
        id: Date.now().toString(),
        title: newNoteTitle,
        content: `# ${newNoteTitle}\n\nCommencez à écrire votre note ici...`,
        tags: [],
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
    // Simple markdown renderer (basique)
    return content
      .split('\n')
      .map((line, index) => {
        if (line.startsWith('# ')) {
          return <h1 key={index} className="text-2xl font-bold mt-6 mb-4">{line.slice(2)}</h1>;
        }
        if (line.startsWith('## ')) {
          return <h2 key={index} className="text-xl font-semibold mt-5 mb-3">{line.slice(3)}</h2>;
        }
        if (line.startsWith('### ')) {
          return <h3 key={index} className="text-lg font-medium mt-4 mb-2">{line.slice(4)}</h3>;
        }
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
        if (line.startsWith('- ')) {
          return <li key={index} className="ml-4 my-1">• {line.slice(2)}</li>;
        }
        if (line.startsWith('> ')) {
          return (
            <blockquote key={index} className="border-l-4 border-blue-500 pl-4 my-3 italic text-muted-foreground bg-muted/30 py-2 rounded-r">
              {line.slice(2)}
            </blockquote>
          );
        }
        if (line.match(/^\d+\. /)) {
          return <li key={index} className="ml-4 my-1 list-decimal">{line.replace(/^\d+\. /, '')}</li>;
        }
        if (line.trim() === '') {
          return <br key={index} />;
        }
        return <p key={index} className="my-2">{line}</p>;
      });
  };

  return (
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
                className={`p-3 cursor-pointer hover:bg-muted/50 border-l-2 transition-colors ${
                  selectedNote?.id === note.id ? 'bg-muted border-l-blue-500' : 'border-l-transparent'
                }`}
                onClick={() => setSelectedNote(note)}
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
                  placeholder="Écrivez votre note en markdown..."
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
  );
};

export default NotesEditor;
