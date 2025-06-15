
import { createRoot } from 'react-dom/client';
import App from '@/App.tsx';
import './index.css';
import { ThemeProvider } from '@/providers/ThemeProvider';

// Initialisation de l'application avec Supabase
const rootElement = document.getElementById("root");
if (!rootElement) throw new Error('Root element not found');

createRoot(rootElement).render(
  <ThemeProvider>
    <App />
  </ThemeProvider>
);
