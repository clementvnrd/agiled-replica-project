import { vi } from 'vitest';
// Mock du hook useUser de Clerk pour simuler un utilisateur connecté
vi.mock('@clerk/clerk-react', () => ({
  useUser: () => ({ user: { id: 'test-user' } }),
  useAuth: () => ({ getToken: vi.fn().mockResolvedValue('fake-token') })
}));

import { renderHook, act, waitFor } from '@testing-library/react';
import { useUserSupabaseCredentials } from '../src/hooks/useUserSupabaseCredentials';
import React from 'react';

describe('useUserSupabaseCredentials', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('retourne undefined si pas de credentials en localStorage', () => {
    const { result } = renderHook(() => useUserSupabaseCredentials());
    expect(result.current.credentials).toBeUndefined();
  });

  it('sauvegarde et récupère les credentials', async () => {
    // Mock localStorage pour simuler la persistance
    const creds = { supabaseUrl: 'https://test.supabase.co', supabaseAnonKey: 'key' };
    localStorage.setItem('userSupabaseCredentials', JSON.stringify(creds));
    const { result } = renderHook(() => useUserSupabaseCredentials());
    await waitFor(() => {
      expect(result.current.credentials).toEqual(creds);
    });
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

  it('gère une erreur lors de la sauvegarde des credentials', async () => {
    // On simule une erreur en mockant getToken pour qu'il échoue
    vi.mock('@clerk/clerk-react', () => ({
      useUser: () => ({ user: { id: 'test-user' } }),
      useAuth: () => ({ getToken: vi.fn().mockRejectedValue(new Error('Token error')) })
    }));
    const { result } = renderHook(() => useUserSupabaseCredentials());
    const creds = { supabaseUrl: 'https://test.supabase.co', supabaseAnonKey: 'key' };
    let saveResult = true;
    await act(async () => {
      saveResult = await result.current.saveCredentials(creds);
    });
    expect(saveResult).toBe(false);
    await waitFor(() => {
      expect(result.current.error).not.toBeNull();
      expect(String(result.current.error)).toMatch(/Token error/);
    });
  });
});
