import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

interface SecretWordModalProps {
  onConfirm: (word: string, hint: string) => void;
  error?: string;
}

export function SecretWordModal({ onConfirm, error }: SecretWordModalProps) {
  const [word, setWord] = useState('');
  const [hint, setHint] = useState('');
  const [hideWord, setHideWord] = useState(true);
  const [localError, setLocalError] = useState<string | undefined>();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(undefined);

    const trimmedHint = hint.trim();
    if (trimmedHint.length === 0) {
      setLocalError('A dica é obrigatória.');
      return;
    }

    const trimmedWord = word.trim();
    if (trimmedHint.toUpperCase() === trimmedWord.toUpperCase()) {
      setLocalError('A dica não pode ser igual à palavra secreta.');
      return;
    }

    onConfirm(word, hint);
  };

  const displayError = localError || error;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-2xl max-w-md w-full mx-4">
        <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
          Criar jogo
        </h2>
        <form onSubmit={handleSubmit} autoComplete="off">
          <div className="relative mb-3">
            <input
              type="text"
              name="secret-word"
              value={word}
              onChange={(e) => setWord(e.target.value)}
              className="w-full p-3 pr-12 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              style={hideWord ? ({ WebkitTextSecurity: 'disc' } as React.CSSProperties) : undefined}
              placeholder="Palavra ou frase secreta"
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
              spellCheck={false}
              data-lpignore="true"
              data-1p-ignore=""
              autoFocus
            />
            <button
              type="button"
              onClick={() => setHideWord(!hideWord)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 cursor-pointer"
              aria-label={hideWord ? 'Mostrar palavra' : 'Esconder palavra'}
            >
              {hideWord ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          <input
            type="text"
            name="secret-hint"
            value={hint}
            onChange={(e) => setHint(e.target.value)}
            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 mb-3"
            placeholder="Dica"
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck={false}
          />
          {displayError && (
            <p className="text-red-500 dark:text-red-400 text-sm mb-3" role="alert">
              {displayError}
            </p>
          )}
          <button
            type="submit"
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors cursor-pointer"
          >
            Começar jogo
          </button>
        </form>
      </div>
    </div>
  );
}
