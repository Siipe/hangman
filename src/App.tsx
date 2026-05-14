import { useEffect, useCallback } from 'react';
import { useDarkMode } from './hooks/useDarkMode';
import { useHangmanGame } from './hooks/useHangmanGame';
import { ThemeToggle } from './components/ThemeToggle';
import { LivesDisplay } from './components/LivesDisplay';
import { WordDisplay } from './components/WordDisplay';
import { Keyboard } from './components/Keyboard';
import { SecretWordModal } from './components/SecretWordModal';
import { GameStatus } from './components/GameStatus';
import { useState } from 'react';

const TOTAL_LIVES = 6;

export default function App() {
  const { isDark, toggle: toggleDark } = useDarkMode();
  const { state, startGame, guessCharacter, resetGame } = useHangmanGame();
  const [modalError, setModalError] = useState<string | undefined>();

  const handleStartGame = useCallback(
    (word: string) => {
      const result = startGame(word);
      if (!result.valid) {
        setModalError(result.error);
      } else {
        setModalError(undefined);
      }
    },
    [startGame]
  );

  const handleNewGame = useCallback(() => {
    resetGame();
    setModalError(undefined);
  }, [resetGame]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (state.status !== 'playing') return;

      const key = e.key;
      if (key.length === 1 && /^[a-zA-Z0-9]$/.test(key)) {
        guessCharacter(key);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [state.status, guessCharacter]);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white transition-colors">
      <ThemeToggle isDark={isDark} onToggle={toggleDark} />

      <main className="container mx-auto px-4 py-8 max-w-2xl">
        <h1 className="text-3xl font-bold text-center mb-8">Forca do TioSiipe</h1>

        {state.status === 'idle' && (
          <SecretWordModal onConfirm={handleStartGame} error={modalError} />
        )}

        {(state.status === 'playing' || state.status === 'won' || state.status === 'lost') && (
          <>
            <LivesDisplay remainingLives={state.remainingLives} totalLives={TOTAL_LIVES} />
            <WordDisplay originalWord={state.originalWord} guessedCharacters={state.guessedCharacters} />
            <Keyboard
              guessedCharacters={state.guessedCharacters}
              wrongCharacters={state.wrongCharacters}
              disabled={state.status !== 'playing'}
              onKeyPress={guessCharacter}
            />
            <GameStatus status={state.status} originalWord={state.originalWord} />

            {(state.status === 'won' || state.status === 'lost') && (
              <div className="text-center mt-4">
                <button
                  onClick={handleNewGame}
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors cursor-pointer"
                >
                  Novo jogo
                </button>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
