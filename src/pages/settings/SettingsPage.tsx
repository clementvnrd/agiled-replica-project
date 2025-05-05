
import React, { useState, useEffect } from 'react';
import SupabaseRagList from '@/components/SupabaseRagList';
import SupabaseAuthBox from '@/components/SupabaseAuthBox';
import { supabase } from '@/lib/supabaseClient';
import { useUserSupabaseCredentials } from '@/hooks/useUserSupabaseCredentials';
import SupabaseCredentialsForm from '@/components/SupabaseCredentialsForm';
import OpenRouterSettings from '@/components/settings/OpenRouterSettings';
import { toast } from "sonner";
import { useNavigate } from 'react-router-dom';

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
  const [showCredentialsForm, setShowCredentialsForm] = useState(false);
  
  const navigate = useNavigate();
  
  const { 
    credentials, 
    getCredentials, 
    saveCredentials, 
    clearCredentials, 
    loading: credentialsLoading 
  } = useUserSupabaseCredentials();

  // Vérifie l'état de connexion utilisateur
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data?.user ?? null);
    });
  }, []);

  // Ping la DB pour LED verte/rouge
  useEffect(() => {
    const checkDb = async () => {
      if (!credentials) {
        setSupabaseOnline(false);
        return;
      }
      
      try {
        // On tente de récupérer 1 doc (peu importe le user)
        const { error } = await supabase.from('rag_documents').select('id').limit(1);
        setSupabaseOnline(!error);
      } catch {
        setSupabaseOnline(false);
      }
    };
    checkDb();
  }, [user, credentials]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setShowAuth(false);
  };

  const handleSaveCredentials = async (creds: { supabaseUrl: string; supabaseAnonKey: string }) => {
    const ok = await saveCredentials(creds);
    if (ok) {
      setShowCredentialsForm(false);
      toast.success("Connexion à Supabase établie avec succès");
      getCredentials();
    } else {
      toast.error("Erreur lors de la sauvegarde des credentials Supabase");
    }
  };

  const handleDisconnectSupabase = async () => {
    await clearCredentials();
    setSupabaseOnline(false);
    toast.info("Connexion à Supabase déconnectée");
    getCredentials();
  };

  return (
    <div className="flex min-h-[70vh] bg-white rounded shadow mt-10 max-w-4xl mx-auto">
      {/* Sidebar */}
      <aside className="w-56 border-r p-6 bg-gray-50">
        <nav className="flex flex-col gap-2">
          {TABS.map(tab => (
            <button
              key={tab.key}
              className={`text-left px-4 py-2 rounded transition-colors font-medium ${activeTab === tab.key ? 'bg-blue-600 text-white' : 'hover:bg-gray-100 text-gray-700'}`}
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
            <p className="text-gray-600">Connectez vos outils MCP ici (à venir...)</p>
          </div>
        )}
        {activeTab === 'supabase' && (
          <div>
            <h2 className="text-xl font-bold mb-4">Supabase</h2>
            
            {/* Affiche le formulaire de credentials si demandé */}
            {showCredentialsForm ? (
              <div className="mb-6">
                <SupabaseCredentialsForm 
                  onSave={handleSaveCredentials}
                  initialCredentials={credentials}
                  onSkip={() => setShowCredentialsForm(false)}
                />
                {credentialsLoading && (
                  <div className="text-center text-blue-600 mt-2">Chargement...</div>
                )}
              </div>
            ) : (
              <>
                {/* État connecté */}
                {credentials ? (
                  <div className="flex items-center justify-between bg-gray-900 text-white rounded-lg p-6 mb-6">
                    <div>
                      <div className="font-bold text-lg mb-1">Configuration Supabase</div>
                      <div className="text-gray-300 text-sm">URL: {credentials.supabaseUrl}</div>
                      <div className="mt-2 text-sm">Clé: {credentials.supabaseAnonKey.substring(0, 10)}...</div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${supabaseOnline === null ? 'bg-gray-500' : supabaseOnline ? 'bg-green-600' : 'bg-red-600'}`}
                      >
                        <span className="w-2 h-2 rounded-full mr-2 inline-block" style={{ background: supabaseOnline === null ? '#888' : supabaseOnline ? '#22c55e' : '#ef4444' }}></span>
                        {supabaseOnline === null ? '...' : supabaseOnline ? 'Connected' : 'Offline'}
                      </span>
                      <div className="flex flex-col gap-2">
                        <button
                          onClick={() => setShowCredentialsForm(true)}
                          className="text-xs px-2 py-1 rounded border border-blue-500 text-blue-200 transition-colors duration-150 hover:bg-blue-700 hover:text-white"
                        >
                          Modifier
                        </button>
                        <button
                          onClick={handleDisconnectSupabase}
                          className="text-xs px-2 py-1 rounded border border-gray-500 text-gray-200 transition-colors duration-150 hover:bg-red-600 hover:text-white hover:border-red-600"
                        >
                          Déconnecter
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="mb-6">
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-4 text-yellow-800">
                      <p className="font-medium mb-2">Supabase n'est pas configuré</p>
                      <p className="text-sm mb-4">
                        Connectez votre instance Supabase pour activer les fonctionnalités RAG, la persistance des données, et plus encore.
                      </p>
                      <button 
                        onClick={() => setShowCredentialsForm(true)}
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
                      >
                        Configurer Supabase
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}

            {/* Auth Supabase (visible uniquement si Supabase est configuré) */}
            {credentials && !showCredentialsForm && (
              <>
                {!showAuth ? (
                  <button onClick={() => setShowAuth(true)} className="btn-primary text-base px-6 py-3 rounded-lg font-semibold">Se connecter à Supabase Auth</button>
                ) : (
                  <SupabaseAuthBox />
                )}
                
                {/* Database RAG */}
                <div className="mt-8">
                  <h3 className="text-lg font-semibold mb-3">Base de connaissances RAG</h3>
                  <SupabaseRagList />
                </div>
              </>
            )}
          </div>
        )}
        {activeTab === 'llm' && (
          <div>
            <h2 className="text-xl font-bold mb-4">LLM (OpenRouter)</h2>
            <OpenRouterSettings />
          </div>
        )}
      </section>
    </div>
  );
};

export default SettingsPage;
