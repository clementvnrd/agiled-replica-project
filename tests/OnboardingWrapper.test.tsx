import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import OnboardingWrapper from '../src/components/routes/OnboardingWrapper';

// Mocks
import { vi } from 'vitest';
vi.mock('@clerk/clerk-react', () => ({
  useUser: () => ({ user: { id: 'user1' } })
}));
vi.mock('react-router-dom', () => ({
  useNavigate: () => vi.fn(),
  useLocation: () => ({ pathname: '/dashboard' })
}));
// ---
// Mock dynamique piloté par une variable globale pour chaque scénario
let mockCredentials: any = { url: 'url', key: 'key' };
let mockLoading = false;
let mockError: any = null;
vi.mock('../src/hooks/useUserSupabaseCredentials', () => ({
  useUserSupabaseCredentials: () => ({
    credentials: mockCredentials,
    getCredentials: vi.fn(),
    loading: mockLoading,
    error: mockError
  })
}));

const DummyChild = () => <div>App Content</div>;

describe('OnboardingWrapper', () => {
  it('affiche le loading quand loading=true', () => {
    mockCredentials = null;
    mockLoading = true;
    mockError = null;
    const { queryByText, unmount } = render(<OnboardingWrapper><DummyChild /></OnboardingWrapper>);
    expect(queryByText(/App Content/)).not.toBeInTheDocument();
    unmount();
  });

  it('affiche le message d\'erreur et le bouton de reconfiguration', () => {
    mockCredentials = null;
    mockLoading = false;
    mockError = 'Erreur test';
    const { getByText, getByRole, unmount } = render(<OnboardingWrapper><DummyChild /></OnboardingWrapper>);
    expect(getByText(/Erreur test/)).toBeInTheDocument();
    expect(getByRole('button', { name: /Reconfigurer Supabase/i })).toBeInTheDocument();
    unmount();
  });

  it('affiche les enfants si credentials présents', () => {
    mockCredentials = { url: 'url', key: 'key' };
    mockLoading = false;
    mockError = null;
    const { getByText } = render(<OnboardingWrapper><DummyChild /></OnboardingWrapper>);
    expect(getByText(/App Content/)).toBeInTheDocument();
  });

  // Edge case: pas de credentials, pas sur onboarding, doit afficher loading
  it('affiche loading si pas de credentials et pas sur onboarding', () => {
    mockCredentials = null;
    mockLoading = false;
    mockError = null;
    const { queryByText, unmount } = render(<OnboardingWrapper><DummyChild /></OnboardingWrapper>);
    expect(queryByText(/App Content/)).not.toBeInTheDocument();
    unmount();
  });

  // Accessibilité bouton
  it('le bouton de reconfiguration a un aria-label', () => {
    mockCredentials = null;
    mockLoading = false;
    mockError = 'Erreur test';
    const { getByRole, unmount } = render(<OnboardingWrapper><DummyChild /></OnboardingWrapper>);
    const btn = getByRole('button', { name: /Reconfigurer Supabase/i });
    expect(btn).toBeInTheDocument();
    unmount();
  });
}); 