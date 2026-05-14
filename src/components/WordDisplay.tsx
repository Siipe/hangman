interface WordDisplayProps {
  originalWord: string;
  guessedCharacters: string[];
}

export function WordDisplay({ originalWord, guessedCharacters }: WordDisplayProps) {
  const words = originalWord.split(' ');

  return (
    <div className="flex justify-center gap-x-6 gap-y-2 my-6 flex-wrap" aria-label="Palavra secreta">
      {words.map((word, wordIndex) => (
        <span key={wordIndex} className="inline-flex gap-1">
          {word.split('').map((char, charIndex) => {
            const isRevealed = guessedCharacters.includes(char);

            return (
              <span
                key={charIndex}
                className={`w-8 h-10 border-b-2 flex items-center justify-center text-2xl font-bold ${
                  isRevealed
                    ? 'border-green-500 text-green-600 dark:text-green-400'
                    : 'border-gray-400 dark:border-gray-500'
                }`}
              >
                {isRevealed ? char : ''}
              </span>
            );
          })}
        </span>
      ))}
    </div>
  );
}
