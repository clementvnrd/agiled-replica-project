import { renderHook, act } from '@testing-library/react';
import { useMcpConnections } from '../src/hooks/supabase/useMcpConnections';

// Mocks
import { vi } from 'vitest';
vi.mock('@clerk/clerk-react', () => ({
  useUser: () => ({ user: { id: 'user1' } })
}));

const mockFrom = vi.fn();
const mockDynamicSupabase = {
  from: mockFrom
};

import { vi } from 'vitest';
vi.mock('../src/providers/DynamicSupabaseProvider', () => ({
  useDynamicSupabase: () => ({
    dynamicSupabase: mockDynamicSupabase,
    loading: false,
    error: null
  })
}));

const mockToast = { success: vi.fn(), error: vi.fn() };
vi.mock('sonner', () => mockToast);

describe('useMcpConnections', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('retourne isLoading au début', () => {
    const { result } = renderHook(() => useMcpConnections());
    expect(result.current.isLoading).toBe(true);
  });

  it('fetch les connexions avec succès', async () => {
    mockFrom.mockReturnValueOnce({
      select: () => ({ eq: async () => ({ data: [{ id: '1', name: 'Test', url: 'u', status: 'connected', created_at: '', user_id: 'user1' }], error: null }) })
    });
    const { result } = renderHook(() => useMcpConnections());
    await act(async () => {
      await new Promise(res => setTimeout(res, 0));
    });
    expect(result.current.connections.length).toBe(1);
    expect(result.current.error).toBeNull();
  });

  it('gère une erreur lors du fetch', async () => {
    mockFrom.mockReturnValueOnce({
      select: () => ({ eq: async () => ({ data: null, error: { message: 'fail' } }) })
    });
    const { result } = renderHook(() => useMcpConnections());
    await act(async () => {
      await new Promise(res => setTimeout(res, 0));
    });
    expect(result.current.error).toBeInstanceOf(Error);
  });

  it('addConnection ajoute une connexion', async () => {
    mockFrom.mockReturnValue({
      insert: () => ({ select: () => ({ single: async () => ({ data: { id: '2', name: 'Ajout', url: 'u', status: 'connected', created_at: '', user_id: 'user1' }, error: null }) }) })
    });
    const { result } = renderHook(() => useMcpConnections());
    await act(async () => {
      await result.current.addConnection('Ajout', 'u');
    });
    expect(result.current.connections.find(c => c.name === 'Ajout')).toBeTruthy();
    expect(mockToast.success).toHaveBeenCalled();
  });

  it('deleteConnection supprime une connexion', async () => {
    mockFrom.mockReturnValue({
      delete: () => ({ eq: async () => ({ error: null }) })
    });
    const { result } = renderHook(() => useMcpConnections());
    // Simule une connexion existante
    act(() => {
      result.current.refreshConnections = jest.fn();
      result.current.connections = [{ id: '3', name: 'Del', url: 'u', status: 'connected', created_at: '', user_id: 'user1' }];
    });
    await act(async () => {
      await result.current.deleteConnection('3');
    });
    expect(result.current.connections.find(c => c.id === '3')).toBeUndefined();
    expect(mockToast.success).toHaveBeenCalled();
  });

  it('edge case : pas de user ou pas de client', async () => {
    jest.doMock('@clerk/clerk-react', () => ({ useUser: () => ({ user: null }) }));
    jest.doMock('../src/providers/DynamicSupabaseProvider', () => ({ useDynamicSupabase: () => ({ dynamicSupabase: null, loading: false, error: null }) }));
    const { result } = renderHook(() => useMcpConnections());
    expect(result.current.connections).toEqual([]);
    expect(result.current.isLoading).toBe(false);
  });
}); 