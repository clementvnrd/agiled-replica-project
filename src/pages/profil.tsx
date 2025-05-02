import React, { useRef, useState } from 'react';
import { useUser } from '../components/UserContext';

const Profil: React.FC = () => {
  const { name, setName, avatar, setAvatar } = useUser();
  const [localName, setLocalName] = useState(name);
  const [localAvatar, setLocalAvatar] = useState<string | null>(avatar);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalName(e.target.value);
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setLocalAvatar(ev.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    setName(localName);
    setAvatar(localAvatar);
  };

  const isDirty = localName !== name || localAvatar !== avatar;

  return (
    <div className="max-w-lg mx-auto mt-10 p-6 bg-white rounded shadow">
      <h1 className="text-2xl font-bold mb-6">Profil utilisateur</h1>
      <div className="flex flex-col items-center mb-6">
        <div className="w-24 h-24 rounded-full bg-agiled-primary text-white flex items-center justify-center text-4xl mb-2 overflow-hidden">
          {localAvatar ? (
            <img src={localAvatar} alt="Avatar" className="w-full h-full object-cover rounded-full" />
          ) : (
            localName.charAt(0).toUpperCase()
          )}
        </div>
        <button
          className="btn-outline mt-2"
          onClick={() => fileInputRef.current?.click()}
        >
          Changer la photo de profil
        </button>
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          className="hidden"
          onChange={handleAvatarChange}
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Nom d'utilisateur</label>
        <input
          type="text"
          value={localName}
          onChange={handleNameChange}
          className="w-full border border-agiled-lightBorder rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-agiled-primary/20"
        />
      </div>
      <button
        className={`btn-primary w-full mt-4${!isDirty ? ' opacity-50 cursor-not-allowed' : ''}`}
        onClick={handleSave}
        disabled={!isDirty}
      >
        Sauvegarder les changements
      </button>
    </div>
  );
};

export default Profil; 