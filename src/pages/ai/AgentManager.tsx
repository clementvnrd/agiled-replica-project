
import React, { useState } from 'react';
import { Bot, Send, Info, Settings } from 'lucide-react';

const AgentManager: React.FC = () => {
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState<Array<{role: string, content: string}>>([
    {
      role: 'assistant',
      content: 'Bonjour, je suis votre Agent IA All-in-One. Je peux vous aider à gérer votre business et votre vie personnelle en accédant à vos données via RAG et en interagissant avec vos outils connectés via MCP. Comment puis-je vous aider aujourd\'hui ?'
    }
  ]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() === '') return;
    
    // Add user message to chat
    setChatHistory([...chatHistory, { role: 'user', content: message }]);
    
    // Placeholder for Agent response (would be connected to RAG/OpenRouter in real implementation)
    setTimeout(() => {
      setChatHistory(prev => [...prev, { 
        role: 'assistant', 
        content: "Je ne suis pas encore connecté à OpenRouter. Pour activer mes fonctionnalités complètes, veuillez configurer l'intégration OpenRouter et le système RAG dans les paramètres."
      }]);
    }, 1000);
    
    setMessage('');
  };

  return (
    <div className="p-6 h-full flex flex-col">
      <div className="mb-4 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold mb-1">Agent Manager</h1>
          <p className="text-agiled-lightText">Votre assistant personnel alimenté par l'IA</p>
        </div>
        <div className="flex space-x-2">
          <button className="btn-outline flex items-center">
            <Info size={16} className="mr-1" /> À propos
          </button>
          <button className="btn-outline flex items-center">
            <Settings size={16} className="mr-1" /> Configuration
          </button>
        </div>
      </div>
      
      <div className="flex-1 bg-white border border-agiled-lightBorder rounded-md flex flex-col overflow-hidden">
        <div className="flex-1 p-4 overflow-y-auto">
          {chatHistory.map((msg, index) => (
            <div key={index} className={`mb-4 flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-3/4 rounded-lg p-3 ${
                msg.role === 'user' 
                  ? 'bg-agiled-primary text-white' 
                  : 'bg-gray-100 text-agiled-text border border-agiled-lightBorder'
              }`}>
                {msg.role === 'assistant' && (
                  <div className="flex items-center mb-1">
                    <Bot size={16} className="mr-1" />
                    <span className="font-medium">Agent IA</span>
                  </div>
                )}
                <p className="whitespace-pre-wrap">{msg.content}</p>
              </div>
            </div>
          ))}
        </div>
        
        <div className="border-t border-agiled-lightBorder p-3">
          <form onSubmit={handleSendMessage} className="flex items-center">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Posez une question à votre Agent IA..."
              className="flex-1 px-4 py-2 rounded-md border border-agiled-lightBorder focus:outline-none focus:ring-2 focus:ring-agiled-primary/20"
            />
            <button 
              type="submit" 
              className="ml-2 bg-agiled-primary hover:bg-agiled-primary/90 text-white rounded-md p-2"
            >
              <Send size={18} />
            </button>
          </form>
        </div>
      </div>
      
      <div className="mt-4 text-sm text-agiled-lightText">
        <p>Note: Pour activer toutes les fonctionnalités, configurez le système RAG (base de connaissances) et connectez OpenRouter.</p>
      </div>
    </div>
  );
};

export default AgentManager;
