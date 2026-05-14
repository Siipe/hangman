import { useState } from 'react';

interface SecretWordModalProps {
  onConfirm: (word: string) => void;
  error?: string;
}

export function SecretWordModal({ onConfirm, error }: SecretWordModalProps) {
  const [word, setWord] = useState('');
  const [hideWord, setHideWord] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onConfirm(word);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-2xl max-w-md w-full mx-4">
        <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
          Digite a palavra secreta
        </h2>
        <form onSubmit={handleSubmit}>
          <input
            type={hideWord ? 'password' : 'text'}
            value={word}
            onChange={(e) => setWord(e.target.value)}
            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 mb-3"
            placeholder="Palavra ou frase secreta"
            autoFocus
          />
          <label className="flex items-center gap-2 mb-4 cursor-pointer text-gray-700 dark:text-gray-300">
            <input
              type="checkbox"
              checked={hideWord}
              onChange={(e) => setHideWord(e.target.checked)}
              className="w-4 h-4 rounded"
            />
            Esconder palavra ao digitar
          </label>
          {error && (
            <p className="text-red-500 dark:text-red-400 text-sm mb-3" role="alert">
              {error}
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
