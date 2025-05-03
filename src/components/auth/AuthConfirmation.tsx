
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check, Mail } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

type AuthConfirmationProps = {
  type: 'email' | 'password-reset' | 'signup';
  email?: string;
  onResend?: () => void;
  onBack?: () => void;
};

const AuthConfirmation: React.FC<AuthConfirmationProps> = ({
  type,
  email = 'votre email',
  onResend,
  onBack
}) => {
  const navigate = useNavigate();

  const getTitle = () => {
    switch (type) {
      case 'email':
        return 'Vérifiez votre boîte mail';
      case 'password-reset':
        return 'Instructions envoyées';
      case 'signup':
        return 'Inscription réussie';
    }
  };

  const getMessage = () => {
    switch (type) {
      case 'email':
        return `Un email de confirmation a été envoyé à ${email}. Cliquez sur le lien pour finaliser votre connexion.`;
      case 'password-reset':
        return `Les instructions pour réinitialiser votre mot de passe ont été envoyées à ${email}.`;
      case 'signup':
        return `Votre compte a été créé avec succès. Un email de vérification a été envoyé à ${email}.`;
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <div className="mx-auto bg-green-100 p-3 rounded-full w-16 h-16 flex items-center justify-center mb-4">
          {type === 'email' || type === 'password-reset' ? (
            <Mail className="h-8 w-8 text-green-600" />
          ) : (
            <Check className="h-8 w-8 text-green-600" />
          )}
        </div>
        <CardTitle className="text-center">{getTitle()}</CardTitle>
        <CardDescription className="text-center">{getMessage()}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-center text-sm text-muted-foreground">
          Si vous ne trouvez pas l'email, vérifiez votre dossier spam ou essayez de renvoyer l'email.
        </div>
      </CardContent>
      <CardFooter className="flex flex-col gap-2">
        {onResend && (
          <Button variant="outline" onClick={onResend} className="w-full">
            Renvoyer l'email
          </Button>
        )}
        {onBack && (
          <Button variant="ghost" onClick={onBack} className="w-full">
            Retour à la connexion
          </Button>
        )}
        <Button 
          variant="link" 
          onClick={() => navigate('/')} 
          className="w-full"
        >
          Retour à l'accueil
        </Button>
      </CardFooter>
    </Card>
  );
};

export default AuthConfirmation;
