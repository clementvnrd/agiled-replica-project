import React from 'react';
import { useNavigate } from 'react-router-dom';
import SupabaseCredentialsForm from '@/components/SupabaseCredentialsForm';
import { useUserSupabaseCredentials } from '@/hooks/useUserSupabaseCredentials';
import AuthLayout from '@/components/auth/AuthLayout';
import { useUser } from '@clerk/clerk-react';

const SupabaseCredentialsPage: React.FC = () => {
  const { user } = useUser();
  console.log('Clerk user:', user);
  const navigate = useNavigate();
  const { saveCredentials } = useUserSupabaseCredentials();
  const [error, setError] = React.useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const handleSave = async (creds: { supabaseUrl: string; supabaseAnonKey: string }) => {
    setIsSubmitting(true);
    setError(null);
    console.log('Tentative d’enregistrement des credentials pour userId:', user?.id, creds);
    console.log('UPDATING CREDENTIALS ON SUPABASE URL:', import.meta.env.VITE_SUPABASE_URL);
    const success = await saveCredentials(creds);
    setIsSubmitting(false);
    if (success) {
      navigate('/');
    } else {
      setError("Erreur lors de l'enregistrement des credentials. Veuillez réessayer ou contacter le support.");
    }
  };

  const handleSkip = () => {
    navigate('/');
  };

  return (
    <AuthLayout title="Connexion à Supabase (optionnel)">
      <div className="max-w-md mx-auto mt-10">
        <div className="mb-8 p-4 bg-blue-50 border border-blue-200 rounded text-blue-900 text-sm">
          <h2 className="font-bold mb-2 text-base">Pourquoi connecter Supabase&nbsp;?</h2>
          <ul className="list-disc pl-5 mb-2">
            <li>Pour stocker et gérer toutes vos données de façon privée et sécurisée.</li>
            <li>Pour activer les fonctionnalités avancées (RAG, analytics, etc.).</li>
          </ul>
          <h3 className="font-semibold mt-3 mb-1">Comment faire&nbsp;?</h3>
          <ol className="list-decimal pl-5 mb-2">
            <li>Créez un compte sur <a href="https://supabase.com/" target="_blank" rel="noopener noreferrer" className="underline text-blue-700">supabase.com</a>.</li>
            <li>Créez un nouveau projet (choisissez la région la plus proche).</li>
            <li>Dans le dashboard Supabase, allez dans <b>Settings &gt; API</b>.</li>
            <li>Copiez l'<b>URL</b> et la <b>clé anonyme (anon key)</b> dans le formulaire ci-dessous.</li>
          </ol>
          <div className="mt-2 text-xs text-blue-800">
            <b>Besoin d'aide&nbsp;?</b> Consultez la <a href="https://supabase.com/docs/guides/getting-started" target="_blank" rel="noopener noreferrer" className="underline">documentation officielle</a> ou contactez le support.
          </div>
        </div>
        <SupabaseCredentialsForm onSave={handleSave} onSkip={handleSkip} />
        {error && (
          <div className="mt-4 p-3 rounded-md bg-red-50 border border-red-200 text-red-800">
            {error}
          </div>
        )}
      </div>
    </AuthLayout>
  );
};

export default SupabaseCredentialsPage;
