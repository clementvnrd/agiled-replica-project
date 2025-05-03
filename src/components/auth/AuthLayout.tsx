
import React from 'react';
import { Card } from '@/components/ui/card';

type AuthLayoutProps = {
  children: React.ReactNode;
  title?: string;
};

const AuthLayout: React.FC<AuthLayoutProps> = ({ children, title }) => {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center p-4 bg-gray-50">
      <div className="w-full max-w-md">
        {title && (
          <h1 className="text-2xl font-bold text-center mb-6">{title}</h1>
        )}
        {children}
      </div>
      <p className="mt-8 text-center text-sm text-gray-500">
        Propulsé par{' '}
        <a
          href="https://supabase.com"
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium text-blue-600 hover:underline"
        >
          Supabase
        </a>
        {' '}et{' '}
        <a
          href="https://clerk.com"
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium text-blue-600 hover:underline"
        >
          Clerk
        </a>
      </p>
    </div>
  );
};

export default AuthLayout;
