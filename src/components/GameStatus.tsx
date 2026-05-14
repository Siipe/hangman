import type { GameStatus as GameStatusType } from '../hooks/useHangmanGame';

interface GameStatusProps {
  status: GameStatusType;
  originalWord: string;
}

export function GameStatus({ status, originalWord }: GameStatusProps) {
  if (status === 'won') {
    return (
      <div className="text-center my-4 sm:my-6 p-3 sm:p-4 bg-green-100 dark:bg-green-900/30 rounded-xl w-full" role="status">
        <h3 className="text-xl sm:text-2xl font-bold text-green-700 dark:text-green-300 mb-1 sm:mb-2">
          Parabéns! Você venceu!
        </h3>
        <p className="text-gray-700 dark:text-gray-300 text-sm sm:text-base">
          A palavra era: <strong className="text-base sm:text-lg">{originalWord}</strong>
        </p>
      </div>
    );
  }

  if (status === 'lost') {
    return (
      <div className="text-center my-4 sm:my-6 p-3 sm:p-4 bg-red-100 dark:bg-red-900/30 rounded-xl w-full" role="status">
        <h3 className="text-xl sm:text-2xl font-bold text-red-700 dark:text-red-300 mb-1 sm:mb-2">
          Fim de jogo!
        </h3>
        <p className="text-gray-700 dark:text-gray-300 text-sm sm:text-base">
          A palavra era: <strong className="text-base sm:text-lg">{originalWord}</strong>
        </p>
      </div>
    );
  }

  return null;
}
