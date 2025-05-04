import { createRoot } from 'react-dom/client';
import App from '@/App.tsx';
import './index.css';
import { ThemeProvider } from '@/providers/ThemeProvider';
import { ClerkProvider } from '@clerk/clerk-react';

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key");
}

// Initialisation de l'application avec lazy loading
const rootElement = document.getElementById("root");
if (!rootElement) throw new Error('Root element not found');

createRoot(rootElement).render(
  <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </ClerkProvider>
);
