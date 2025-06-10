
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Plus, MessageSquare, Search, Trash2, Edit3, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ChatSession {
  id: string;
  name: string;
  messages: any[];
  lastMessage?: string;
  timestamp: number;
}

interface ChatSidebarProps {
  sessions: ChatSession[];
  currentSessionId: string;
  onNewSession: () => void;
  onSwitchSession: (id: string) => void;
  onRenameSession: (id: string, name: string) => void;
  onDeleteSession: (id: string) => void;
}

const ChatSidebar: React.FC<ChatSidebarProps> = ({
  sessions,
  currentSessionId,
  onNewSession,
  onSwitchSession,
  onRenameSession,
  onDeleteSession
}) => {
  const [editingSessionId, setEditingSessionId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');

  const startEditing = (session: ChatSession) => {
    setEditingSessionId(session.id);
    setEditingName(session.name);
  };

  const handleRename = (id: string) => {
    if (editingName.trim()) {
      onRenameSession(id, editingName.trim());
    }
    setEditingSessionId(null);
    setEditingName('');
  };

  return (
    <div className="w-80 bg-white border-r border-gray-200 flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <Button
          onClick={onNewSession}
          className="w-full justify-start gap-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
        >
          <Plus className="w-4 h-4" />
          Nouvelle conversation
        </Button>
      </div>

      {/* Sessions List */}
      <div className="flex-1 overflow-y-auto p-2">
        <div className="space-y-1">
          {sessions.map((session) => (
            <Card
              key={session.id}
              className={cn(
                "p-3 cursor-pointer transition-all hover:shadow-md group border-0 shadow-sm",
                session.id === currentSessionId 
                  ? 'bg-blue-50 border-l-4 border-l-blue-500' 
                  : 'hover:bg-gray-50'
              )}
              onClick={() => onSwitchSession(session.id)}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  {editingSessionId === session.id ? (
                    <input
                      type="text"
                      value={editingName}
                      onChange={(e) => setEditingName(e.target.value)}
                      onBlur={() => handleRename(session.id)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleRename(session.id);
                        if (e.key === 'Escape') setEditingSessionId(null);
                      }}
                      className="w-full bg-transparent border-b border-gray-300 focus:outline-none focus:border-blue-500"
                      autoFocus
                    />
                  ) : (
                    <>
                      <div className="flex items-center gap-2">
                        <MessageSquare className="w-4 h-4 text-gray-400" />
                        <h3 className="font-medium text-sm truncate">{session.name}</h3>
                      </div>
                      {session.lastMessage && (
                        <p className="text-xs text-gray-500 truncate mt-1">
                          {session.lastMessage}
                        </p>
                      )}
                      <p className="text-xs text-gray-400 mt-1">
                        {new Date(session.timestamp).toLocaleDateString()}
                      </p>
                    </>
                  )}
                </div>
                
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-7 w-7 p-0"
                    onClick={(e) => {
                      e.stopPropagation();
                      startEditing(session);
                    }}
                  >
                    <Edit3 className="w-3 h-3" />
                  </Button>
                  {session.id !== 'default' && (
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-7 w-7 p-0 text-red-500 hover:text-red-700"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteSession(session.id);
                      }}
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200">
        <Button variant="ghost" className="w-full justify-start gap-3">
          <Settings className="w-4 h-4" />
          Paramètres
        </Button>
      </div>
    </div>
  );
};

export default ChatSidebar;
