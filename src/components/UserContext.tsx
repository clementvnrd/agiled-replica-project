import React, { createContext, useContext, useState, ReactNode } from 'react';

interface UserContextType {
  name: string;
  setName: (name: string) => void;
  avatar: string | null;
  setAvatar: (avatar: string | null) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [name, setName] = useState('Clément');
  const [avatar, setAvatar] = useState<string | null>(null);

  return (
    <UserContext.Provider value={{ name, setName, avatar, setAvatar }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}; 