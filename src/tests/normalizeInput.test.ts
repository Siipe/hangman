import { describe, it, expect } from 'vitest';
import { normalizeInput } from '../utils/normalizeInput';

describe('normalizeInput', () => {
  it('replaces accented characters with base characters', () => {
    expect(normalizeInput('maçã')).toBe('maca');
    expect(normalizeInput('café')).toBe('cafe');
    expect(normalizeInput('árvore')).toBe('arvore');
    expect(normalizeInput('àquele')).toBe('aquele');
    expect(normalizeInput('não')).toBe('nao');
  });

  it('handles uppercase accented characters', () => {
    expect(normalizeInput('MAÇÃ')).toBe('MACA');
    expect(normalizeInput('ÁRVORE')).toBe('ARVORE');
  });

  it('collapses multiple spaces into a single space', () => {
    expect(normalizeInput('arma    lendaria')).toBe('arma lendaria');
    expect(normalizeInput('  a   b  c   ')).toBe('a b c');
  });

  it('trims leading and trailing spaces', () => {
    expect(normalizeInput('  hello  ')).toBe('hello');
  });

  it('handles strings without accents', () => {
    expect(normalizeInput('hello world')).toBe('hello world');
    expect(normalizeInput('abc123')).toBe('abc123');
  });

  it('handles numbers', () => {
    expect(normalizeInput('xm8')).toBe('xm8');
    expect(normalizeInput('mac10')).toBe('mac10');
  });

  it('handles mixed accented and non-accented text', () => {
    expect(normalizeInput('maçã verde')).toBe('maca verde');
  });
});
