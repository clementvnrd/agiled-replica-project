import { ErrorHandler } from '../src/utils/errorHandler';
import { ERROR_MESSAGES } from '../src/utils/errorMessages';

import { vi } from 'vitest';
vi.mock('sonner', () => ({ toast: { error: vi.fn() } }));

// Mock console.error
beforeEach(() => {
  vi.spyOn(console, 'error').mockImplementation(() => {});
});
afterEach(() => {
  vi.restoreAllMocks();
});

describe('ErrorHandler', () => {
  it('handleError with Error instance', () => {
    const err = new Error('fail');
    const result = ErrorHandler.handleError(err, 'CTX');
    expect(result).toBeInstanceOf(Error);
    expect(result.message).toBe('fail');
    expect(console.error).toHaveBeenCalledWith('Error [CTX]:', err);
  });

  it('handleError with string', () => {
    const result = ErrorHandler.handleError('fail string', 'CTX2');
    expect(result).toBeInstanceOf(Error);
    expect(result.message).toBe('fail string');
    expect(console.error).toHaveBeenCalledWith('Error [CTX2]:', expect.any(Error));
  });

  it('handleError with object with message', () => {
    const result = ErrorHandler.handleError({ message: 'fail obj' }, 'CTX3');
    expect(result).toBeInstanceOf(Error);
    expect(result.message).toBe('fail obj');
    expect(console.error).toHaveBeenCalledWith('Error [CTX3]:', expect.any(Error));
  });

  it('handleError with unknown', () => {
    const result = ErrorHandler.handleError(42, 'CTX4');
    expect(result).toBeInstanceOf(Error);
    expect(result.message).toBe(ERROR_MESSAGES.UNKNOWN);
    expect(console.error).toHaveBeenCalledWith('Error [CTX4]:', expect.any(Error));
  });

  it('handleSupabaseError', () => {
    const err = new Error('supabase fail');
    const result = ErrorHandler.handleSupabaseError(err, 'insert');
    expect(result).toBeInstanceOf(Error);
    expect(result.message).toContain('Erreur Supabase (insert):');
    expect(console.error).toHaveBeenCalledWith(expect.stringContaining('Erreur Supabase (insert):'), err);
  });

  it('handleApiError', () => {
    const err = new Error('api fail');
    const result = ErrorHandler.handleApiError(err, '/api/test');
    expect(result).toBeInstanceOf(Error);
    expect(result.message).toContain('Erreur API (/api/test):');
    expect(console.error).toHaveBeenCalledWith(expect.stringContaining('Erreur API (/api/test):'), err);
  });

  it('handleAuthError', () => {
    const err = new Error('auth fail');
    const result = ErrorHandler.handleAuthError(err);
    expect(result).toBeInstanceOf(Error);
    expect(result.message).toContain('Erreur d\'authentification:');
    expect(console.error).toHaveBeenCalledWith(expect.stringContaining('Erreur d\'authentification:'), err);
  });
}); 