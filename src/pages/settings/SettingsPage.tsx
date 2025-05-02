import React, { useState } from 'react';

const TABS = [
  { key: 'mcps', label: 'MCPs' },
  { key: 'supabase', label: 'Supabase' },
  { key: 'llm', label: 'LLM' },
];

const SettingsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('mcps');
  const [supabaseUrl, setSupabaseUrl] = useState('');
  const [supabaseKey, setSupabaseKey] = useState('');
  const [openRouterKey, setOpenRouterKey] = useState('');

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
            <form className="space-y-4 max-w-md">
              <div>
                <label className="block text-sm font-medium mb-1">Supabase URL</label>
                <input
                  type="text"
                  value={supabaseUrl}
                  onChange={e => setSupabaseUrl(e.target.value)}
                  className="w-full border border-agiled-lightBorder rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-agiled-primary/20"
                  placeholder="https://xxxx.supabase.co"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Supabase Key</label>
                <input
                  type="password"
                  value={supabaseKey}
                  onChange={e => setSupabaseKey(e.target.value)}
                  className="w-full border border-agiled-lightBorder rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-agiled-primary/20"
                  placeholder="Votre clé Supabase"
                />
              </div>
              <button type="submit" className="btn-primary mt-2">Sauvegarder</button>
            </form>
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