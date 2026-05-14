interface HangmanDrawingProps {
  remainingLives: number;
  totalLives: number;
}

export function HangmanDrawing({ remainingLives, totalLives }: HangmanDrawingProps) {
  const mistakes = totalLives - remainingLives;

  return (
    <div className="flex justify-center my-4">
      <svg viewBox="0 0 200 220" className="w-48 h-56" fill="none" strokeWidth="3" strokeLinecap="round">
        {/* Gallows */}
        <g className="stroke-amber-800 dark:stroke-amber-600">
          <line x1="10" y1="210" x2="80" y2="210" />
          <line x1="40" y1="210" x2="40" y2="20" />
          <line x1="40" y1="20" x2="120" y2="20" />
          <line x1="40" y1="60" x2="70" y2="20" />
          <line x1="120" y1="20" x2="120" y2="50" />
        </g>

        {/* Body */}
        <g className="stroke-gray-700 dark:stroke-gray-300">
          {mistakes >= 1 && <circle cx="120" cy="70" r="20" />}
          {mistakes >= 2 && <line x1="120" y1="90" x2="120" y2="140" />}
          {mistakes >= 3 && <line x1="120" y1="105" x2="95" y2="125" />}
          {mistakes >= 4 && <line x1="120" y1="105" x2="145" y2="125" />}
          {mistakes >= 5 && <line x1="120" y1="140" x2="100" y2="175" />}
          {mistakes >= 6 && <line x1="120" y1="140" x2="140" y2="175" />}
        </g>
      </svg>
    </div>
  );
}
