import { vi } from 'vitest';
// Mock du hook useUser de Clerk pour simuler un utilisateur connecté
vi.mock('@clerk/clerk-react', () => ({
  useUser: () => ({ user: { id: 'test-user' } }),
}));

import { renderHook, act } from '@testing-library/react';
import { useUserSupabaseCredentials } from '../src/hooks/useUserSupabaseCredentials';
import React from 'react';

describe('useUserSupabaseCredentials', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('retourne null si pas de credentials en localStorage', () => {
    const { result } = renderHook(() => useUserSupabaseCredentials());
    expect(result.current.credentials).toBeNull();
  });

  it('sauvegarde et récupère les credentials', async () => {
    const { result } = renderHook(() => useUserSupabaseCredentials());
    const creds = { supabaseUrl: 'https://test.supabase.co', supabaseAnonKey: 'key' };
    await act(async () => {
      await result.current.saveCredentials(creds);
    });
    expect(result.current.credentials).toEqual(creds);
  });

  it('efface les credentials', async () => {
    const { result } = renderHook(() => useUserSupabaseCredentials());
    const creds = { supabaseUrl: 'https://test.supabase.co', supabaseAnonKey: 'key' };
    await act(async () => {
      await result.current.saveCredentials(creds);
      result.current.clearCredentials();
    });
    expect(result.current.credentials).toBeNull();
  });
});
