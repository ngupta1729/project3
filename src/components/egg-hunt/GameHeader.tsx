import { useGameTimer } from '@/hooks/useGameTimer';
import { useEggHuntStore } from '@/store/eggHuntStore';
import { cn } from '@/lib/utils';

const ATTEMPT_MESSAGES: Record<number, string> = {
  3: 'Watch carefully… find the real egg!',
  2: 'Not quite — keep watching!',
  1: 'Last chance! Think carefully…',
};

export function GameHeader() {
  useGameTimer();

  const phase = useEggHuntStore((s) => s.phase);
  const attemptsRemaining = useEggHuntStore((s) => s.attemptsRemaining);
  const elapsedSeconds = useEggHuntStore((s) => s.elapsedSeconds);

  const timerColor =
    elapsedSeconds < 10
      ? 'text-emerald-500'
      : elapsedSeconds < 25
        ? 'text-amber-500'
        : 'text-rose-500';

  return (
    <div className="flex flex-col items-center gap-2 pt-6 pb-3 px-6 w-full">
      <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-pink-600 drop-shadow-sm">
        🥚 Egg Hunt
      </h1>

      {phase === 'playing' && (
        <div className="flex flex-col items-center gap-1.5 mt-1">
          {/* Timer */}
          <div
            className={cn(
              'text-2xl font-bold tabular-nums transition-colors duration-700',
              timerColor
            )}
          >
            {elapsedSeconds}s
          </div>

          {/* Attempt indicators */}
          <div className="flex gap-2" aria-label={`${attemptsRemaining} of 3 attempts remaining`}>
            {Array.from({ length: 3 }, (_, i) => (
              <span
                key={i}
                className={cn(
                  'text-xl transition-all duration-300',
                  i < attemptsRemaining ? 'opacity-100 scale-100' : 'opacity-20 scale-90 grayscale'
                )}
              >
                🥚
              </span>
            ))}
          </div>

          {/* Hint text */}
          <p className="text-xs sm:text-sm font-medium text-purple-600 text-center max-w-xs">
            {ATTEMPT_MESSAGES[attemptsRemaining] ?? 'Find the real egg!'}
          </p>
        </div>
      )}
    </div>
  );
}
