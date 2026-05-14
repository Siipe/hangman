import { describe, it, expect } from 'vitest';
import { validateSecretWord } from '../utils/validateSecretWord';

describe('validateSecretWord', () => {
  it('accepts valid words with letters', () => {
    expect(validateSecretWord('banana')).toEqual({ valid: true });
  });

  it('accepts letters and numbers', () => {
    expect(validateSecretWord('xm8')).toEqual({ valid: true });
    expect(validateSecretWord('mac10')).toEqual({ valid: true });
  });

  it('accepts letters, numbers, and spaces', () => {
    expect(validateSecretWord('arma lendaria')).toEqual({ valid: true });
    expect(validateSecretWord('a b c 123')).toEqual({ valid: true });
  });

  it('rejects empty strings', () => {
    const result = validateSecretWord('');
    expect(result.valid).toBe(false);
    expect(result.error).toBeDefined();
  });

  it('rejects space-only values', () => {
    const result = validateSecretWord('   ');
    expect(result.valid).toBe(false);
    expect(result.error).toBeDefined();
  });

  it('rejects symbols and punctuation', () => {
    const symbols = ['#', '@', '$', '%', '/', '-', '_', '!', '?', '.', ',', ';', ':', '"', "'", '(', ')', '[', ']'];
    for (const symbol of symbols) {
      const result = validateSecretWord(symbol);
      expect(result.valid).toBe(false);
    }
  });

  it('rejects words with symbols mixed in', () => {
    expect(validateSecretWord('hello!')).toEqual({ valid: false, error: expect.any(String) });
    expect(validateSecretWord('test@123')).toEqual({ valid: false, error: expect.any(String) });
  });
});
