import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Loader2, Send, RefreshCcw, Sparkles, Sun, Moon, FileUp, User, Users, Globe, ThumbsUp, ThumbsDown, BookOpen, Code2, Volume2, Link2, Plus } from 'lucide-react';
import { useOpenRouter } from '@/services/openrouter';

const MODELS = [
  { label: 'GPT-4.1', value: 'openai/gpt-4.1' },
  { label: 'Claude 3.7 Sonet', value: 'anthropic/claude-3.7-sonnet' },
  { label: 'GPT-4o (2024-11-20)', value: 'openai/gpt-4o-2024-11-20' },
  { label: 'O3 Mini', value: 'openai/o3-mini' },
];
const PERSONAS = [
  { label: 'Assistant', value: 'assistant' },
  { label: 'Coach', value: 'coach' },
  { label: 'Développeur', value: 'dev' },
  { label: 'Expert', value: 'expert' },
  { label: 'Fun', value: 'fun' },
];
const QUICK_ACTIONS = [
  { label: 'Résumer', icon: <BookOpen size={16} />, action: 'summarize' },
  { label: 'Traduire', icon: <Globe size={16} />, action: 'translate' },
  { label: 'Générer du code', icon: <Code2 size={16} />, action: 'code' },
];

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
  sources?: string[];
  collaborative?: boolean;
  plugin?: string;
  feedback?: 'like' | 'dislike' | null;
}

interface ChatSession {
  id: string;
  name: string;
  messages: Message[];
}

const initialSession: ChatSession = {
  id: 'default',
  name: 'Session principale',
  messages: [],
};

const LLMPage: React.FC = () => {
  const [sessions, setSessions] = useState<ChatSession[]>([initialSession]);
  const [currentSessionId, setCurrentSessionId] = useState('default');
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [model, setModel] = useState(MODELS[0].value);
  const [persona, setPersona] = useState(PERSONAS[0].value);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const openRouter = useOpenRouter();
  const [editingSessionId, setEditingSessionId] = useState<string | null>(null);
  const [editingSessionName, setEditingSessionName] = useState('');

  const currentSession = sessions.find(s => s.id === currentSessionId)!;

  const sendMessage = async (msg?: string) => {
    const content = (msg ?? input).trim();
    if (!content) return;
    const userMsg: Message = { role: 'user', content, timestamp: Date.now() };
    updateSessionMessages([...currentSession.messages, userMsg]);
    setInput('');
    setLoading(true);
    try {
      const messages = [...currentSession.messages, userMsg].map(m => ({ role: m.role, content: m.content }));
      const response = await openRouter.generateCompletion(messages, { model });
      const assistantContent = response.choices?.[0]?.message?.content || 'Aucune réponse.';
      const assistantMsg: Message = {
        role: 'assistant',
        content: assistantContent,
        timestamp: Date.now(),
        sources: response.choices?.[0]?.sources || [],
        feedback: null,
      };
      updateSessionMessages([...currentSession.messages, userMsg, assistantMsg]);
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    } catch (error) {
      const assistantMsg: Message = {
        role: 'assistant',
        content: 'Erreur lors de la génération de la réponse LLM.',
        timestamp: Date.now(),
        feedback: null,
      };
      updateSessionMessages([...currentSession.messages, userMsg, assistantMsg]);
    } finally {
      setLoading(false);
    }
  };

  function updateSessionMessages(messages: Message[]) {
    setSessions(sessions => sessions.map(s =>
      s.id === currentSessionId ? { ...s, messages } : s
    ));
  }

  function resetChat() {
    updateSessionMessages([]);
  }

  function handleNewSession() {
    const id = `session-${Date.now()}`;
    setSessions([...sessions, { id, name: `Session ${sessions.length + 1}`, messages: [] }]);
    setCurrentSessionId(id);
  }

  function handleSwitchSession(id: string) {
    setCurrentSessionId(id);
  }

  function handleRenameSession(id: string, name: string) {
    setSessions(sessions => sessions.map(s => s.id === id ? { ...s, name } : s));
    setEditingSessionId(null);
  }

  function handleDeleteSession(id: string) {
    if (id === 'default') return;
    setSessions(sessions => {
      const filtered = sessions.filter(s => s.id !== id);
      if (currentSessionId === id) setCurrentSessionId('default');
      return filtered;
    });
  }

  return (
    <div className="flex h-[calc(100vh-2rem)] gap-0 rounded-lg border bg-background shadow-lg overflow-hidden"> 
      {/* Sidebar historique */}
      <aside className="w-64 bg-muted/60 border-r flex flex-col">
        <div className="flex items-center justify-between p-4 border-b">
          <span className="font-bold text-lg flex items-center gap-2"><Sparkles className="text-purple-500" /> Sessions</span>
          <Button size="icon" variant="outline" onClick={handleNewSession} title="Nouvelle session"><Plus /></Button>
        </div>
        <div className="flex-1 overflow-y-auto">
          {sessions.map(s => (
            <div key={s.id} className={`flex items-center group ${s.id === currentSessionId ? 'bg-muted' : ''}`}>
              <Button
                variant={s.id === currentSessionId ? 'default' : 'ghost'}
                className="flex-1 justify-start rounded-none px-4 py-3 text-left"
                onClick={() => handleSwitchSession(s.id)}
              >
                {editingSessionId === s.id ? (
                  <input
                    className="border rounded px-1 py-0.5 text-sm w-32"
                    value={editingSessionName}
                    autoFocus
                    onChange={e => setEditingSessionName(e.target.value)}
                    onBlur={() => handleRenameSession(s.id, editingSessionName)}
                    onKeyDown={e => {
                      if (e.key === 'Enter') handleRenameSession(s.id, editingSessionName);
                      if (e.key === 'Escape') setEditingSessionId(null);
                    }}
                  />
                ) : (
                  s.name
                )}
              </Button>
              <button
                className="p-1 opacity-60 hover:opacity-100"
                title="Renommer"
                onClick={(e) => { e.stopPropagation(); setEditingSessionId(s.id); setEditingSessionName(s.name); }}
              >
                <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M15.232 5.232l3.536 3.536M9 13l6.586-6.586a2 2 0 1 1 2.828 2.828L11.828 15.828a2 2 0 0 1-1.414.586H7v-3a2 2 0 0 1 .586-1.414z"/></svg>
              </button>
              <button
                className="p-1 opacity-60 hover:opacity-100 disabled:opacity-20"
                title="Supprimer"
                disabled={s.id === 'default'}
                onClick={(e) => { e.stopPropagation(); handleDeleteSession(s.id); }}
              >
                <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M3 6h18M9 6v12a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2V6m-6 0V4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2"/></svg>
              </button>
            </div>
          ))}
        </div>
      </aside>
      {/* Zone centrale chat */}
      <main className="flex-1 flex flex-col h-full">
        {/* Header */}
        <div className="flex items-center gap-4 border-b px-6 py-3 bg-background/80">
          <span className="font-bold text-xl flex items-center gap-2"><Sparkles className="text-purple-500" /> LLM Chat</span>
          <select
            className="border rounded px-2 py-1 text-sm"
            value={model}
            onChange={e => setModel(e.target.value)}
          >
            {MODELS.map(m => (
              <option key={m.value} value={m.value}>{m.label}</option>
            ))}
          </select>
          <select
            className="border rounded px-2 py-1 text-sm"
            value={persona}
            onChange={e => setPersona(e.target.value)}
          >
            {PERSONAS.map(p => (
              <option key={p.value} value={p.value}>{p.label}</option>
            ))}
          </select>
          <Button variant="outline" size="icon" onClick={resetChat} title="Réinitialiser la conversation">
            <RefreshCcw />
          </Button>
        </div>
        {/* Chat */}
        <div className="flex-1 flex flex-col overflow-y-auto p-6 bg-muted/50">
          {currentSession.messages.length === 0 && !loading && (
            <div className="text-center text-gray-400 mt-16">
              Commencez la conversation avec votre LLM préféré !
            </div>
          )}
          {currentSession.messages.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} mb-2`}>
              <div className={`rounded-lg px-4 py-2 max-w-[70%] shadow relative ${msg.role === 'user' ? 'bg-blue-500 text-white' : 'bg-white border text-gray-800'}`}>
                <div className="flex items-center gap-2 text-xs opacity-60 mb-1">
                  {msg.role === 'user' ? <User /> : <Sparkles className="text-purple-500" />} {msg.role === 'user' ? 'Vous' : 'LLM'}
                  {msg.collaborative && <span className="ml-2 px-2 py-0.5 bg-green-100 text-green-700 rounded text-[10px] flex items-center gap-1"><Users size={12}/>Collaboratif</span>}
                  {msg.plugin && <span className="ml-2 px-2 py-0.5 bg-blue-100 text-blue-700 rounded text-[10px] flex items-center gap-1"><Globe size={12}/>Plugin</span>}
                </div>
                <div>{msg.content}</div>
                {msg.sources && (
                  <div className="flex gap-2 mt-2">
                    {msg.sources.map((src, i) => (
                      <a key={i} href={src} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs text-blue-600 underline"><Link2 size={12} />Source {i+1}</a>
                    ))}
                  </div>
                )}
                <div className="text-[10px] text-right opacity-40 mt-1">{new Date(msg.timestamp).toLocaleTimeString()}</div>
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start mb-2">
              <div className="rounded-lg px-4 py-2 max-w-[70%] bg-white border text-gray-800 flex items-center gap-2">
                <Loader2 className="animate-spin" /> Génération en cours...
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>
        {/* Input */}
        <form
          className="flex items-center gap-2 p-4 border-t bg-background"
          onSubmit={e => { e.preventDefault(); sendMessage(); }}
        >
          <Input
            placeholder="Écrivez votre prompt..."
            value={input}
            onChange={e => setInput(e.target.value)}
            disabled={loading}
            className="flex-1"
          />
          <Button type="submit" disabled={loading || !input.trim()}>
            <Send className="mr-1" /> Envoyer
          </Button>
        </form>
      </main>
    </div>
  );
};

export default LLMPage; 