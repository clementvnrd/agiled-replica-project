
// Composant désactivé : la logique multi-instance Supabase (connexion individuelle) a été supprimée
// L'application utilise maintenant le client global partagé (voir src/lib/supabaseClient.ts)
// Plus besoin de formulaire de credentials Supabase pour chaque utilisateur

import React from 'react';

interface SupabaseCredentialsFormProps {
  onSave?: (credentials: any) => void;
  onSkip?: () => void;
}

const SupabaseCredentialsForm: React.FC<SupabaseCredentialsFormProps> = () => {
  return (
    <div className="p-4 text-center text-gray-500">
      <p>Configuration Supabase non requise</p>
    </div>
  );
};

export default SupabaseCredentialsForm;
