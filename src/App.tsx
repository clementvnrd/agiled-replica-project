
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import LandingPage from './pages/LandingPage';
import DashboardPage from './pages/DashboardPage';
import NotFound from './pages/NotFound';
import { LoginPage, SignupPage, VerifyEmail, ResetPassword, RedirectIfAuthenticated } from './components/routes/AuthRoutes';
import { ProtectedRoute } from './components/routes/ProtectedRoute';
import MainLayout from './layouts/MainLayout';
import RagManagementPage from './pages/rag/RagManagementPage';
import VectorSearch from './components/rag/VectorSearch';
import SettingsPage from './pages/settings/SettingsPage';
import CalendarPage from './pages/calendar/CalendarPage';
import ProjectsPage from '@/pages/projects/ProjectsPage';
import ProjectDetail from '@/pages/projects/ProjectDetail';
import LLMPage from './pages/LLMPage';

// CRM Pages
import CRMDashboard from '@/pages/business/crm/CRMDashboard';
import CrmAccountsPage from '@/pages/business/crm/CrmAccountsPage';
import CrmContactsPage from '@/pages/business/crm/CrmContactsPage';
import CrmDealsPage from '@/pages/business/crm/CrmDealsPage';
import CrmTicketsPage from '@/pages/business/crm/CrmTicketsPage';

function App() {
  return (
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
            
            {/* CRM Routes */}
            <Route path="/crm/dashboard" element={<CRMDashboard />} />
            <Route path="/crm/accounts" element={<CrmAccountsPage />} />
            <Route path="/crm/contacts" element={<CrmContactsPage />} />
            <Route path="/crm/deals" element={<CrmDealsPage />} />
            <Route path="/crm/tickets" element={<CrmTicketsPage />} />

            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/llm" element={<LLMPage />} />
            <Route path="/rag" element={<RagManagementPage />} />
            <Route path="/search" element={<VectorSearch />} />
          </Route>
          
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
