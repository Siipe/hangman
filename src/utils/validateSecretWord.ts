const ALLOWED_PATTERN = /^[a-zA-Z0-9\s]*$/;

export function validateSecretWord(input: string): { valid: boolean; error?: string } {
  const trimmed = input.trim();

  if (trimmed.length === 0) {
    return { valid: false, error: 'A palavra não pode estar vazia.' };
  }

  if (!ALLOWED_PATTERN.test(trimmed)) {
    return {
      valid: false,
      error: 'Apenas letras, números e espaços são permitidos.',
    };
  }

  return { valid: true };
}
