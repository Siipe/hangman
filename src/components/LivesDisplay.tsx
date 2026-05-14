interface LivesDisplayProps {
  remainingLives: number;
  totalLives: number;
}

export function LivesDisplay({ remainingLives, totalLives }: LivesDisplayProps) {
  return (
    <div className="flex justify-center gap-2 my-4" aria-label={`${remainingLives} de ${totalLives} vidas restantes`}>
      {Array.from({ length: totalLives }, (_, i) => (
        <span key={i} className="text-2xl transition-opacity duration-300">
          {i < remainingLives ? '❤️' : '🖤'}
        </span>
      ))}
    </div>
  );
}
