import { describe, it, expect } from 'vitest';
import { normalizeInput } from '../utils/normalizeInput';

describe('normalizeInput', () => {
  it('replaces accented characters with base characters and uppercases', () => {
    expect(normalizeInput('maçã')).toBe('MACA');
    expect(normalizeInput('café')).toBe('CAFE');
    expect(normalizeInput('árvore')).toBe('ARVORE');
    expect(normalizeInput('àquele')).toBe('AQUELE');
    expect(normalizeInput('não')).toBe('NAO');
  });

  it('handles uppercase accented characters', () => {
    expect(normalizeInput('MAÇÃ')).toBe('MACA');
    expect(normalizeInput('ÁRVORE')).toBe('ARVORE');
  });

  it('collapses multiple spaces into a single space', () => {
    expect(normalizeInput('arma    lendaria')).toBe('ARMA LENDARIA');
    expect(normalizeInput('  a   b  c   ')).toBe('A B C');
  });

  it('trims leading and trailing spaces', () => {
    expect(normalizeInput('  hello  ')).toBe('HELLO');
  });

  it('handles strings without accents', () => {
    expect(normalizeInput('hello world')).toBe('HELLO WORLD');
    expect(normalizeInput('abc123')).toBe('ABC123');
  });

  it('handles numbers', () => {
    expect(normalizeInput('xm8')).toBe('XM8');
    expect(normalizeInput('mac10')).toBe('MAC10');
  });

  it('handles mixed accented and non-accented text', () => {
    expect(normalizeInput('maçã verde')).toBe('MACA VERDE');
  });
});
