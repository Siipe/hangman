const KEYBOARD_ROWS = [
  ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
  ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
  ['Z', 'X', 'C', 'V', 'B', 'N', 'M'],
  ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'],
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
  const lower = char.toLowerCase();
  if (guessedCharacters.some((c) => c.toLowerCase() === lower || c.toUpperCase() === char)) {
    return 'correct';
  }
  if (wrongCharacters.some((c) => c.toLowerCase() === lower || c.toUpperCase() === char)) {
    return 'wrong';
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
    <div className="flex flex-col items-center gap-2 my-4">
      {KEYBOARD_ROWS.map((row, rowIndex) => (
        <div key={rowIndex} className="flex gap-1">
          {row.map((char) => {
            const state = keyState(char, guessedCharacters, wrongCharacters);
            return (
              <button
                key={char}
                onClick={() => onKeyPress(char)}
                disabled={disabled || state !== 'default'}
                className={`w-10 h-10 rounded-md font-semibold text-sm transition-colors cursor-pointer disabled:cursor-not-allowed ${stateClasses[state]} disabled:opacity-70`}
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
