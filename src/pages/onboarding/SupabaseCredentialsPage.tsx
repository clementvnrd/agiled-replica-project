
import React from 'react';
import { useNavigate } from 'react-router-dom';
import SupabaseCredentialsForm from '@/components/SupabaseCredentialsForm';
import { useUserSupabaseCredentials } from '@/hooks/useUserSupabaseCredentials';
import AuthLayout from '@/components/auth/AuthLayout';
import { useUser } from '@clerk/clerk-react';
import { toast } from 'sonner';
import { Card } from '@/components/ui/card';
import { ArrowRight } from 'lucide-react';

const SupabaseCredentialsPage: React.FC = () => {
  const { user } = useUser();
  const navigate = useNavigate();
  const { saveCredentials } = useUserSupabaseCredentials();
  const [error, setError] = React.useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const handleSave = async (creds: { supabaseUrl: string; supabaseAnonKey: string }) => {
    setIsSubmitting(true);
    setError(null);
    console.log('Tentative d'enregistrement des credentials pour userId:', user?.id, creds);
    const success = await saveCredentials(creds);
    setIsSubmitting(false);
    if (success) {
      toast.success('Connexion à Supabase établie avec succès', {
        description: 'Vous pouvez maintenant profiter de toutes les fonctionnalités.'
      });
      navigate('/dashboard');
    } else {
      setError("Erreur lors de l'enregistrement des credentials. Veuillez réessayer ou contacter le support.");
    }
  };

  const handleSkip = () => {
    toast.info('Configuration ignorée', {
      description: 'Certaines fonctionnalités seront limitées.'
    });
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-blue-50 to-white p-4">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-8">
          <div className="mb-4 mx-auto h-16 w-16 rounded-xl bg-blue-600 flex items-center justify-center">
            <span className="text-white text-3xl font-bold">A</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Bienvenue sur Agiled Replica</h1>
          <p className="mt-2 text-gray-600">Pour profiter de toutes les fonctionnalités, connectez votre instance Supabase</p>
        </div>

        <Card className="p-8 shadow-lg">
          <div className="flex justify-center mb-8">
            <div className="flex items-center">
              <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold">1</div>
              <div className="h-1 w-16 bg-blue-200"></div>
              <div className="h-8 w-8 rounded-full bg-blue-200 flex items-center justify-center text-gray-500 font-semibold">2</div>
              <div className="h-1 w-16 bg-blue-200"></div>
              <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-gray-400 font-semibold">3</div>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-xl font-bold mb-4">Configuration de Supabase</h2>
            <div className="p-4 bg-blue-50 border border-blue-200 rounded text-blue-900 text-sm mb-6">
              <h3 className="font-bold mb-2 text-base">Comment créer votre instance Supabase ?</h3>
              <ol className="list-decimal pl-5 mb-2 space-y-2">
                <li>Créez un compte sur <a href="https://supabase.com/" target="_blank" rel="noopener noreferrer" className="underline text-blue-700">supabase.com</a></li>
                <li>Créez un nouveau projet (choisissez la région la plus proche)</li>
                <li>Dans le dashboard Supabase, allez dans <b>Settings &gt; API</b></li>
                <li>Copiez l'<b>URL</b> et la <b>clé anonyme (anon key)</b> dans le formulaire ci-dessous</li>
              </ol>
              <div className="mt-2 text-xs text-blue-800">
                <b>Besoin d'aide ?</b> Consultez la <a href="https://supabase.com/docs/guides/getting-started" target="_blank" rel="noopener noreferrer" className="underline">documentation officielle</a>
              </div>
            </div>
            
            <SupabaseCredentialsForm onSave={handleSave} onSkip={handleSkip} />
            
            {error && (
              <div className="mt-4 p-3 rounded-md bg-red-50 border border-red-200 text-red-800">
                {error}
              </div>
            )}
          </div>
          
          <div className="flex justify-between items-center mt-8 pt-4 border-t">
            <button
              onClick={handleSkip}
              className="text-gray-600 hover:text-blue-800"
            >
              Configurer plus tard
            </button>
            <button
              onClick={() => navigate('/dashboard')}
              className="flex items-center text-blue-600 hover:text-blue-800"
            >
              Aller au tableau de bord
              <ArrowRight className="ml-1 h-4 w-4" />
            </button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default SupabaseCredentialsPage;
