import React, { useState, useEffect } from 'react';
import SupabaseRagList from '@/components/SupabaseRagList';
import SupabaseAuthBox from '@/components/SupabaseAuthBox';
import { supabase } from '@/lib/supabaseClient';

const TABS = [
  { key: 'mcps', label: 'MCPs' },
  { key: 'supabase', label: 'Supabase' },
  { key: 'llm', label: 'LLM' },
];

const SettingsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('mcps');
  const [showAuth, setShowAuth] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [supabaseOnline, setSupabaseOnline] = useState<boolean | null>(null);
  const [openRouterKey, setOpenRouterKey] = useState('');

  // Vérifie l'état de connexion utilisateur
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data?.user ?? null);
    });
  }, []);

  // Ping la DB pour LED verte/rouge
  useEffect(() => {
    const checkDb = async () => {
      try {
        // On tente de récupérer 1 doc (peu importe le user)
        const { error } = await supabase.from('rag_documents').select('id').limit(1);
        setSupabaseOnline(!error);
      } catch {
        setSupabaseOnline(false);
      }
    };
    checkDb();
  }, [user]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setShowAuth(false);
  };

  return (
    <div className="flex min-h-[70vh] bg-white rounded shadow mt-10 max-w-4xl mx-auto">
      {/* Sidebar */}
      <aside className="w-56 border-r p-6 bg-gray-50">
        <nav className="flex flex-col gap-2">
          {TABS.map(tab => (
            <button
              key={tab.key}
              className={`text-left px-4 py-2 rounded transition-colors font-medium ${activeTab === tab.key ? 'bg-agiled-primary text-white' : 'hover:bg-gray-100 text-agiled-text'}`}
              onClick={() => setActiveTab(tab.key)}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </aside>
      {/* Content */}
      <section className="flex-1 p-8">
        {activeTab === 'mcps' && (
          <div>
            <h2 className="text-xl font-bold mb-4">MCPs</h2>
            <p className="text-agiled-lightText">Connectez vos outils MCP ici (à venir...)</p>
          </div>
        )}
        {activeTab === 'supabase' && (
          <div>
            <h2 className="text-xl font-bold mb-4">Supabase</h2>
            {/* État connecté */}
            {user ? (
              <div className="flex items-center justify-between bg-gray-900 text-white rounded-lg p-6 mb-6">
                <div>
                  <div className="font-bold text-lg mb-1">n8n RAG</div>
                  <div className="text-gray-300 text-sm">Supabase connecté à votre workspace.</div>
                  <div className="mt-2 text-sm">Connecté en tant que <span className="font-semibold">{user.email}</span></div>
                </div>
                <div className="flex items-center gap-4">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${supabaseOnline === null ? 'bg-gray-500' : supabaseOnline ? 'bg-green-600' : 'bg-red-600'}`}
                  >
                    <span className="w-2 h-2 rounded-full mr-2 inline-block" style={{ background: supabaseOnline === null ? '#888' : supabaseOnline ? '#22c55e' : '#ef4444' }}></span>
                    {supabaseOnline === null ? '...' : supabaseOnline ? 'Connected' : 'Offline'}
                  </span>
                  <button
                    onClick={handleLogout}
                    className="text-xs px-1 py-1 rounded border border-gray-500 text-gray-200 transition-colors duration-150 hover:bg-red-600 hover:text-white hover:border-red-600"
                  >
                    Se déconnecter
                  </button>
                </div>
              </div>
            ) : (
              <div className="mb-6">
                {!showAuth ? (
                  <button onClick={() => setShowAuth(true)} className="btn-primary text-base px-6 py-3 rounded-lg font-semibold">Se connecter à Supabase</button>
                ) : (
                  <SupabaseAuthBox />
                )}
              </div>
            )}
            {/* Database RAG */}
            <SupabaseRagList />
          </div>
        )}
        {activeTab === 'llm' && (
          <div>
            <h2 className="text-xl font-bold mb-4">LLM (OpenRouter)</h2>
            <form className="space-y-4 max-w-md">
              <div>
                <label className="block text-sm font-medium mb-1">OpenRouter API Key</label>
                <input
                  type="password"
                  value={openRouterKey}
                  onChange={e => setOpenRouterKey(e.target.value)}
                  className="w-full border border-agiled-lightBorder rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-agiled-primary/20"
                  placeholder="Votre clé OpenRouter"
                />
              </div>
              <button type="submit" className="btn-primary mt-2">Sauvegarder</button>
            </form>
          </div>
        )}
      </section>
    </div>
  );
};

export default SettingsPage; 