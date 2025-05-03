import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { supabase } from '@/lib/supabaseClient';
import React from 'react';

const SupabaseAuthBox: React.FC = () => {
  return (
    <div style={{ maxWidth: 400, margin: '2rem auto' }}>
      <Auth
        supabaseClient={supabase}
        appearance={{ theme: ThemeSupa }}
        providers={['google']}
        localization={{
          variables: {
            sign_in: {
              email_label: 'Adresse email',
              password_label: 'Mot de passe',
              button_label: 'Connexion',
              link_text: 'Déjà inscrit ? Connectez-vous',
            },
            sign_up: {
              email_label: 'Adresse email',
              password_label: 'Mot de passe',
              button_label: 'Créer un compte',
              link_text: 'Pas encore de compte ? Inscrivez-vous',
            },
          },
        }}
      />
    </div>
  );
};

export default SupabaseAuthBox;
