import { describe, it, expect } from 'vitest';
import { ERROR_MESSAGES } from '../src/utils/errorMessages';

describe('ERROR_MESSAGES', () => {
  it('should contain a generic unknown error', () => {
    expect(ERROR_MESSAGES.UNKNOWN).toBeDefined();
  });
  it('should contain an auth required error', () => {
    expect(ERROR_MESSAGES.AUTH_REQUIRED).toBeDefined();
  });
  it('should contain a not found error', () => {
    expect(ERROR_MESSAGES.NOT_FOUND).toBeDefined();
  });
});
