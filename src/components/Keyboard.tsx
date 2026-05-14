import { normalizeInput } from '../utils/normalizeInput';

const KEYBOARD_ROWS = [
  ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'],
  ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
  ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
  ['Z', 'X', 'C', 'V', 'B', 'N', 'M'],
];

interface KeyboardProps {
  guessedCharacters: string[];
  wrongCharacters: string[];
  disabled: boolean;
  onKeyPress: (char: string) => void;
}

function keyState(
  char: string,
  guessedCharacters: string[],
  wrongCharacters: string[]
): 'default' | 'correct' | 'wrong' {
  const upper = char.toUpperCase();
  if (wrongCharacters.includes(upper)) {
    return 'wrong';
  }
  if (guessedCharacters.some((c) => normalizeInput(c) === upper)) {
    return 'correct';
  }
  return 'default';
}

const stateClasses: Record<string, string> = {
  default: 'bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500',
  correct: 'bg-green-500 text-white hover:bg-green-600',
  wrong: 'bg-red-500 text-white hover:bg-red-600',
};

export function Keyboard({ guessedCharacters, wrongCharacters, disabled, onKeyPress }: KeyboardProps) {
  return (
    <div className="flex flex-col items-center gap-1 sm:gap-2 my-2 sm:my-4 w-full max-w-lg mx-auto">
      {KEYBOARD_ROWS.map((row, rowIndex) => (
        <div key={rowIndex} className="flex justify-center gap-0.5 sm:gap-1.5 w-full px-0.5">
          {row.map((char) => {
            const state = keyState(char, guessedCharacters, wrongCharacters);
            return (
              <button
                key={char}
                onClick={() => onKeyPress(char)}
                disabled={disabled || state !== 'default'}
                className={`w-7 h-9 sm:w-10 sm:h-10 rounded-md font-semibold text-xs sm:text-sm transition-colors cursor-pointer disabled:cursor-not-allowed ${stateClasses[state]} disabled:opacity-70`}
                aria-label={`Letra ${char}`}
              >
                {char}
              </button>
            );
          })}
        </div>
      ))}
    </div>
  );
}
