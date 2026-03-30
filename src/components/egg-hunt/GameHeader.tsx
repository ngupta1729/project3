import { motion, AnimatePresence } from 'framer-motion';
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
  const clueUsed = useEggHuntStore((s) => s.clueUsed);
  const rule = useEggHuntStore((s) => s.rule);
  const useClue = useEggHuntStore((s) => s.useClue);

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
        <div className="flex flex-col items-center gap-2 mt-1 w-full max-w-sm">
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
          <p className="text-xs sm:text-sm font-medium text-purple-600 text-center">
            {ATTEMPT_MESSAGES[attemptsRemaining] ?? 'Find the real egg!'}
          </p>

          {/* Clue section */}
          <AnimatePresence mode="wait">
            {!clueUsed ? (
              <motion.button
                key="clue-btn"
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.2 }}
                onClick={useClue}
                className="mt-1 text-xs px-4 py-1.5 rounded-full border border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-100 active:scale-95 transition-all"
              >
                🔍 Reveal Clue{' '}
                <span className="opacity-60 font-normal">−200 pts</span>
              </motion.button>
            ) : (
              <motion.div
                key="clue-reveal"
                initial={{ opacity: 0, scale: 0.95, y: 4 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
                className="mt-1 w-full bg-amber-50 ring-1 ring-amber-200 rounded-2xl px-4 py-2.5 text-center"
              >
                <p className="text-xs text-amber-600 font-medium mb-0.5">🔍 Clue revealed</p>
                <p className="text-sm font-semibold text-amber-900 leading-snug">
                  {rule?.description}
                </p>
                <p className="text-xs text-amber-500 mt-1 opacity-70">−200 pts penalty applied</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
