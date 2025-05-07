
import React from 'react';
import { AlertTriangle, Check } from 'lucide-react';
import { ConnectionTestStatus } from '@/services/supabaseConnectionService';

interface SupabaseConnectionTestProps {
  status: ConnectionTestStatus;
  errorMessage: string | null;
}

const SupabaseConnectionTest: React.FC<SupabaseConnectionTestProps> = ({ status, errorMessage }) => {
  if (status === 'idle' || status === 'testing') {
    return null;
  }
  
  if (status === 'error') {
    return (
      <div className="p-3 rounded-md bg-red-50 border border-red-200 text-red-800 flex items-start gap-2">
        <AlertTriangle className="h-5 w-5 flex-shrink-0 text-red-500 mt-0.5" />
        <div className="text-sm">
          <p className="font-semibold">Erreur de connexion</p>
          <p>{errorMessage || "Impossible de se connecter à Supabase avec ces credentials"}</p>
        </div>
      </div>
    );
  }
  
  if (status === 'success') {
    return (
      <div className="p-3 rounded-md bg-green-50 border border-green-200 text-green-800 flex items-start gap-2">
        <Check className="h-5 w-5 flex-shrink-0 text-green-500 mt-0.5" />
        <div className="text-sm">
          <p className="font-semibold">Connexion réussie</p>
          <p>Les credentials sont valides et la connexion à Supabase est établie.</p>
        </div>
      </div>
    );
  }
  
  return null;
};

export default SupabaseConnectionTest;
