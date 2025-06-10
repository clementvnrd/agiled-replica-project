
import React, { useState } from 'react';
import { useOpenRouter } from '@/services/openrouter';
import ModernChatInterface from '@/components/llm/ModernChatInterface';
import ChatSidebar from '@/components/llm/ChatSidebar';
import ModelSelector from '@/components/llm/ModelSelector';
import FeatureSuggestions from '@/components/llm/FeatureSuggestions';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
  feedback?: 'like' | 'dislike' | null;
}

interface ChatSession {
  id: string;
  name: string;
  messages: Message[];
  lastMessage?: string;
  timestamp: number;
}

const initialSession: ChatSession = {
  id: 'default',
  name: 'Session principale',
  messages: [],
  timestamp: Date.now(),
};

const LLMPage: React.FC = () => {
  const [sessions, setSessions] = useState<ChatSession[]>([initialSession]);
  const [currentSessionId, setCurrentSessionId] = useState('default');
  const [loading, setLoading] = useState(false);
  const [model, setModel] = useState('openai/gpt-4.1');
  const openRouter = useOpenRouter();

  const currentSession = sessions.find(s => s.id === currentSessionId)!;

  const updateSessionMessages = (messages: Message[]) => {
    setSessions(sessions => sessions.map(s =>
      s.id === currentSessionId 
        ? { 
            ...s, 
            messages,
            lastMessage: messages[messages.length - 1]?.content.substring(0, 50) + '...',
            timestamp: Date.now()
          } 
        : s
    ));
  };

  const handleSendMessage = async (content: string) => {
    const userMsg: Message = { role: 'user', content, timestamp: Date.now() };
    const newMessages = [...currentSession.messages, userMsg];
    updateSessionMessages(newMessages);
    
    setLoading(true);
    try {
      const messages = newMessages.map(m => ({ role: m.role, content: m.content }));
      const response = await openRouter.generateCompletion(messages, { model });
      const assistantContent = response.choices?.[0]?.message?.content || 'Aucune réponse.';
      const assistantMsg: Message = {
        role: 'assistant',
        content: assistantContent,
        timestamp: Date.now(),
        feedback: null,
      };
      updateSessionMessages([...newMessages, assistantMsg]);
    } catch (error) {
      const assistantMsg: Message = {
        role: 'assistant',
        content: 'Erreur lors de la génération de la réponse LLM.',
        timestamp: Date.now(),
        feedback: null,
      };
      updateSessionMessages([...newMessages, assistantMsg]);
    } finally {
      setLoading(false);
    }
  };

  const handleNewSession = () => {
    const id = `session-${Date.now()}`;
    const newSession: ChatSession = {
      id,
      name: `Session ${sessions.length + 1}`,
      messages: [],
      timestamp: Date.now(),
    };
    setSessions([...sessions, newSession]);
    setCurrentSessionId(id);
  };

  const handleSwitchSession = (id: string) => {
    setCurrentSessionId(id);
  };

  const handleRenameSession = (id: string, name: string) => {
    setSessions(sessions => sessions.map(s => s.id === id ? { ...s, name } : s));
  };

  const handleDeleteSession = (id: string) => {
    if (id === 'default') return;
    setSessions(sessions => {
      const filtered = sessions.filter(s => s.id !== id);
      if (currentSessionId === id) setCurrentSessionId('default');
      return filtered;
    });
  };

  return (
    <div className="flex h-[calc(100vh-4rem)] bg-gray-50">
      {/* Sidebar */}
      <ChatSidebar
        sessions={sessions}
        currentSessionId={currentSessionId}
        onNewSession={handleNewSession}
        onSwitchSession={handleSwitchSession}
        onRenameSession={handleRenameSession}
        onDeleteSession={handleDeleteSession}
      />

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        <ModernChatInterface
          messages={currentSession.messages}
          onSendMessage={handleSendMessage}
          loading={loading}
          model={model}
        />
      </div>

      {/* Right Panel */}
      <div className="w-80 bg-white border-l border-gray-200 overflow-y-auto">
        <Tabs defaultValue="settings" className="w-full">
          <TabsList className="grid w-full grid-cols-2 m-4">
            <TabsTrigger value="settings">Paramètres</TabsTrigger>
            <TabsTrigger value="features">Suggestions</TabsTrigger>
          </TabsList>
          
          <TabsContent value="settings" className="p-4 pt-0">
            <ModelSelector
              selectedModel={model}
              onModelChange={setModel}
            />
          </TabsContent>
          
          <TabsContent value="features" className="p-4 pt-0">
            <FeatureSuggestions />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default LLMPage;
