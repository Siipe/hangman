interface WordDisplayProps {
  originalWord: string;
  guessedCharacters: string[];
}

export function WordDisplay({ originalWord, guessedCharacters }: WordDisplayProps) {
  return (
    <div className="flex justify-center gap-2 my-6 flex-wrap" aria-label="Palavra secreta">
      {originalWord.split('').map((char, index) => {
        if (char === ' ') {
          return (
            <span key={index} className="w-6" aria-hidden="true">
              &nbsp;
            </span>
          );
        }

        const isRevealed = guessedCharacters.includes(char);

        return (
          <span
            key={index}
            className={`w-8 h-10 border-b-2 flex items-center justify-center text-2xl font-bold ${
              isRevealed
                ? 'border-green-500 text-green-600 dark:text-green-400'
                : 'border-gray-400 dark:border-gray-500'
            }`}
          >
            {isRevealed ? char : '_'}
          </span>
        );
      })}
    </div>
  );
}
