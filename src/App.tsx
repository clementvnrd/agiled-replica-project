import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { ClerkProvider, SignedIn, SignedOut } from '@clerk/clerk-react';
import { ThemeProvider } from "@/components/theme-provider"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"

import LandingPage from './pages/LandingPage';
import DashboardPage from './pages/DashboardPage';
import NotFound from './pages/NotFound';
import { LoginPage, SignupPage, VerifyEmail, ResetPassword, RedirectIfAuthenticated } from './components/routes/AuthRoutes';
import { ProtectedRoute } from './components/routes/ProtectedRoute';
import MainLayout from './components/MainLayout';
import RagDocumentEditor from './components/rag/RagDocumentEditor';
import VectorSearch from './components/rag/VectorSearch';
import SettingsPage from './pages/SettingsPage';
import OnboardingWrapper from './components/routes/OnboardingWrapper';
import Sidebar from './components/Sidebar';
import SidebarNavGroup from './components/navigation/SidebarNavGroup';
import CalendarPage from './pages/calendar/CalendarPage';
import ProjectsPage from './pages/projects/ProjectsPage';

const queryClient = new QueryClient()

// Composant pour afficher un message aux utilisateurs non connectés
const NotSignedIn = () => {
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Bienvenue !</h1>
        <p className="text-gray-600">Veuillez vous connecter pour accéder à votre espace personnel.</p>
      </div>
    </div>
  );
};

// Composant pour rediriger les utilisateurs déjà authentifiés
const AlreadySignedIn = () => {
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Vous êtes déjà connecté !</h1>
        <p className="text-gray-600">Redirection vers votre tableau de bord...</p>
      </div>
    </div>
  );
};

// Inside the Routes section, add the new routes:
function App() {
  return (
    <ClerkProvider 
      publishableKey={import.meta.env.VITE_CLERK_PUBLISHABLE_KEY}
      afterSignOutUrl="/login"
    >
      <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
        <QueryClientProvider client={queryClient}>
          <Router>
            <div className="min-h-screen bg-background">
              <Routes>
                {/* Public routes */}
                <Route path="/" element={<LandingPage />} />
                
                {/* Auth routes */}
                <Route path="/login" element={<RedirectIfAuthenticated><LoginPage /></RedirectIfAuthenticated>} />
                <Route path="/signup" element={<RedirectIfAuthenticated><SignupPage /></RedirectIfAuthenticated>} />
                <Route path="/verify-email" element={<VerifyEmail />} />
                <Route path="/reset-password" element={<ResetPassword />} />
                
                {/* Protected routes */}
                <Route path="/dashboard" element={<ProtectedRoute><MainLayout><DashboardPage /></MainLayout></ProtectedRoute>} />
                <Route path="/calendar" element={<ProtectedRoute><MainLayout><CalendarPage /></MainLayout></ProtectedRoute>} />
                <Route path="/projects" element={<ProtectedRoute><MainLayout><ProjectsPage /></MainLayout></ProtectedRoute>} />
                <Route path="/settings" element={<ProtectedRoute><MainLayout><SettingsPage /></MainLayout></ProtectedRoute>} />
                <Route path="/rag" element={<ProtectedRoute><MainLayout><RagDocumentEditor /></MainLayout></ProtectedRoute>} />
                <Route path="/search" element={<ProtectedRoute><MainLayout><VectorSearch /></MainLayout></ProtectedRoute>} />
                
                <Route path="*" element={<NotFound />} />
              </Routes>
            </div>
          </Router>
        </QueryClientProvider>
      </ThemeProvider>
    </ClerkProvider>
  );
}

export default App;
