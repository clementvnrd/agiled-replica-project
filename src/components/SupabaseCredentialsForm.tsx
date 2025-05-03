import React, { useState } from 'react';

/**
 * Formulaire pour saisir les credentials Supabase utilisateur.
 *
 * Args:
 *   onSave (function): Callback appelé avec { supabaseUrl, supabaseAnonKey }.
 *
 * Returns:
 *   JSX.Element
 */
const SupabaseCredentialsForm: React.FC<{ onSave: (creds: { supabaseUrl: string; supabaseAnonKey: string }) => void }> = ({ onSave }) => {
  const [supabaseUrl, setSupabaseUrl] = useState('');
  const [supabaseAnonKey, setSupabaseAnonKey] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!supabaseUrl || !supabaseAnonKey) {
      setError('Tous les champs sont obligatoires.');
      return;
    }
    if (!supabaseUrl.startsWith('https://')) {
      setError("L'URL Supabase doit commencer par https://");
      return;
    }
    onSave({ supabaseUrl, supabaseAnonKey });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md mx-auto p-6 bg-white rounded shadow">
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
        <label className="block text-sm font-medium mb-1">Supabase Anon Key</label>
        <input
          type="password"
          value={supabaseAnonKey}
          onChange={e => setSupabaseAnonKey(e.target.value)}
          className="w-full border border-agiled-lightBorder rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-agiled-primary/20"
          placeholder="Votre clé anonyme Supabase"
        />
      </div>
      {error && <div className="text-red-600 text-sm">{error}</div>}
      <button type="submit" className="btn-primary mt-2">Enregistrer</button>
    </form>
  );
};

export default SupabaseCredentialsForm; 