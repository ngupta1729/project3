import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { GameBoard } from '@/components/egg-hunt/GameBoard';
import { GameHeader } from '@/components/egg-hunt/GameHeader';
import { ResultOverlay } from '@/components/egg-hunt/ResultOverlay';
import { useEggHuntStore } from '@/store/eggHuntStore';

export default function EggHunt() {
  const phase = useEggHuntStore((s) => s.phase);
  const startGame = useEggHuntStore((s) => s.startGame);

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-sky-50 flex flex-col overflow-hidden">
      {/* Decorative background blobs */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden" aria-hidden>
        <div className="absolute top-[-15%] left-[-10%] w-80 h-80 rounded-full bg-pink-200/50 blur-3xl" />
        <div className="absolute bottom-[-10%] right-[-8%] w-96 h-96 rounded-full bg-purple-200/50 blur-3xl" />
        <div className="absolute top-[45%] left-[55%] w-56 h-56 rounded-full bg-sky-200/40 blur-3xl" />
        <div className="absolute top-[20%] right-[15%] w-40 h-40 rounded-full bg-yellow-100/60 blur-2xl" />
      </div>

      <div className="relative z-10 flex flex-col items-center min-h-screen">
        {phase === 'idle' ? (
          <StartScreen onStart={startGame} />
        ) : (
          <>
            <GameHeader />
            <GameBoard />
            <ResultOverlay />
          </>
        )}
      </div>
    </div>
  );
}

function StartScreen({ onStart }: { onStart: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.65, ease: 'easeOut' }}
      className="flex flex-col items-center gap-6 pt-20 px-6 text-center max-w-sm"
    >
      {/* Floating egg */}
      <motion.div
        className="text-8xl"
        animate={{ y: [0, -14, 0] }}
        transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut' }}
      >
        🥚
      </motion.div>

      <div className="space-y-2">
        <h1 className="text-5xl font-extrabold tracking-tight text-pink-600 drop-shadow-sm">
          Egg Hunt
        </h1>
        <p className="text-purple-500 text-sm font-medium tracking-wide uppercase">
          Easter Pattern Puzzle
        </p>
      </div>

      <p className="text-muted-foreground text-[15px] leading-relaxed">
        Nine eggs are on screen, but only{' '}
        <span className="font-semibold text-pink-600">one is real</span>. It secretly follows a
        hidden rule while the others try to fool you.
      </p>

      <div className="bg-white/70 rounded-2xl px-5 py-4 text-sm text-purple-700 ring-1 ring-purple-100 shadow-sm space-y-1 text-left w-full">
        <p className="font-semibold text-purple-800 mb-1.5">How to play:</p>
        <p>🎨 Eggs change color, pattern, text &amp; symbols over time</p>
        <p>🔍 Spot the one that always follows the same rule</p>
        <p>🥚 You have <strong>3 attempts</strong> to identify it</p>
        <p>⚡ Faster = more coins</p>
        <p>🎯 First try = max coins — extra attempts reduce your score</p>
        <p>💡 Revealing the clue comes at a cost too</p>
      </div>

      <Button
        onClick={onStart}
        size="lg"
        className="rounded-full px-10 bg-pink-500 hover:bg-pink-600 text-white text-base font-bold shadow-lg shadow-pink-200 active:scale-95 transition-transform"
      >
        Start Hunt 🐣
      </Button>
    </motion.div>
  );
}
