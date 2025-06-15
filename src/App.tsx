import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { ThemeProvider } from "@/providers/ThemeProvider"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"

import LandingPage from './pages/LandingPage';
import DashboardPage from './pages/DashboardPage';
import NotFound from './pages/NotFound';
import { LoginPage, SignupPage, VerifyEmail, ResetPassword, RedirectIfAuthenticated } from './components/routes/AuthRoutes';
import { ProtectedRoute } from './components/routes/ProtectedRoute';
import MainLayout from './layouts/MainLayout';
import RagManagementPage from './pages/rag/RagManagementPage';
import VectorSearch from './components/rag/VectorSearch';
import SettingsPage from './pages/settings/SettingsPage';
import OnboardingWrapper from './components/routes/OnboardingWrapper';
import CalendarPage from './pages/calendar/CalendarPage';
import ProjectsPage from '@/pages/projects/ProjectsPage';
import ProjectDetail from '@/pages/projects/ProjectDetail';
import LLMPage from './pages/LLMPage';

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
    <ThemeProvider>
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
              
              {/* Protected routes - nested */}
              <Route element={<ProtectedRoute><MainLayout /></ProtectedRoute>}>
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/calendar" element={<CalendarPage />} />
                <Route path="/projects" element={<ProjectsPage />} />
                <Route path="/projects/:id" element={<ProjectDetail />} />
                <Route path="/settings" element={<SettingsPage />} />
                <Route path="/llm" element={<LLMPage />} />
                <Route path="/rag" element={<RagManagementPage />} />
                <Route path="/search" element={<VectorSearch />} />
              </Route>
              
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
        </Router>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;
