import React from 'react';
import { useUser } from '@clerk/clerk-react';

const Profil: React.FC = () => {
  const { user } = useUser();

  if (!user) {
    return <div className="max-w-lg mx-auto mt-10 p-6 bg-white rounded shadow text-center">Non connecté.</div>;
  }

  return (
    <div className="max-w-lg mx-auto mt-10 p-6 bg-white rounded shadow">
      <h1 className="text-2xl font-bold mb-6">Profil utilisateur</h1>
      <div className="flex flex-col items-center mb-6">
        <div className="w-24 h-24 rounded-full bg-agiled-primary text-white flex items-center justify-center text-4xl mb-2 overflow-hidden">
          {user.imageUrl ? (
            <img src={user.imageUrl} alt="Avatar" className="w-full h-full object-cover rounded-full" />
          ) : (
            user.fullName?.charAt(0)?.toUpperCase() || user.emailAddresses?.[0]?.emailAddress?.charAt(0)?.toUpperCase()
          )}
        </div>
        <div className="mt-2 text-center">
          <div className="font-semibold text-lg">{user.fullName || user.emailAddresses?.[0]?.emailAddress}</div>
          <div className="text-sm text-agiled-lightText">{user.emailAddresses?.[0]?.emailAddress}</div>
        </div>
      </div>
      <div className="mb-4 text-center">
        <a
          href="https://dashboard.clerk.com/" // ou Clerk user portal si activé
          target="_blank"
          rel="noopener noreferrer"
          className="btn-outline"
        >
          Modifier mon profil sur Clerk
        </a>
      </div>
    </div>
  );
};

export default Profil; 