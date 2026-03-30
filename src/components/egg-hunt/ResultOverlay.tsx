import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useEggHuntStore } from '@/store/eggHuntStore';
import { cn } from '@/lib/utils';

const SCORE_CONFIG = {
  excellent: { label: 'Excellent!', icon: '🏆', color: 'text-emerald-500' },
  good: { label: 'Good!', icon: '🌟', color: 'text-amber-500' },
  slow: { label: 'Keep practicing!', icon: '🐢', color: 'text-rose-400' },
} as const;

export function ResultOverlay() {
  const phase = useEggHuntStore((s) => s.phase);
  const rule = useEggHuntStore((s) => s.rule);
  const elapsedSeconds = useEggHuntStore((s) => s.elapsedSeconds);
  const scoreTier = useEggHuntStore((s) => s.scoreTier);
  const startGame = useEggHuntStore((s) => s.startGame);
  const resetGame = useEggHuntStore((s) => s.resetGame);

  const isOpen = phase === 'won' || phase === 'lost';
  const scoreConf = scoreTier ? SCORE_CONFIG[scoreTier] : null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!open) resetGame(); }}>
      <DialogContent
        className="max-w-sm rounded-3xl border-pink-100 bg-gradient-to-br from-pink-50 to-purple-50 shadow-2xl"
        onEscapeKeyDown={(e) => e.preventDefault()}
        onInteractOutside={(e) => e.preventDefault()}
      >
        {phase === 'won' ? (
          <>
            <DialogHeader className="text-center space-y-1">
              <div className="text-5xl mb-1">{scoreConf?.icon ?? '🎉'}</div>
              <DialogTitle className="text-2xl font-extrabold text-pink-600 text-center">
                You found the real egg!
              </DialogTitle>
            </DialogHeader>

            <div className="flex flex-col items-center gap-3 py-1">
              {scoreConf && (
                <p className={cn('text-3xl font-extrabold', scoreConf.color)}>
                  {scoreConf.label}
                </p>
              )}
              <p className="text-muted-foreground text-sm">
                Time:{' '}
                <span className="font-bold text-foreground tabular-nums">{elapsedSeconds}s</span>
              </p>
              {rule && (
                <div className="bg-white/70 rounded-2xl px-4 py-3 text-sm text-purple-700 text-center ring-1 ring-purple-100 leading-snug">
                  The rule was:{' '}
                  <span className="font-semibold italic">"{rule.description}"</span>
                </div>
              )}
            </div>
          </>
        ) : (
          <>
            <DialogHeader className="text-center space-y-1">
              <div className="text-5xl mb-1">🐣</div>
              <DialogTitle className="text-2xl font-extrabold text-pink-600 text-center">
                Out of attempts!
              </DialogTitle>
            </DialogHeader>

            <div className="flex flex-col items-center gap-3 py-1">
              <p className="text-muted-foreground text-sm">The hidden rule was:</p>
              <div className="bg-white/70 rounded-2xl px-4 py-3 text-sm font-semibold text-purple-700 text-center ring-1 ring-purple-100 leading-snug">
                "{rule?.description}"
              </div>
              <p className="text-xs text-muted-foreground italic">
                The real egg is highlighted on the board ↑
              </p>
            </div>
          </>
        )}

        <DialogFooter className="flex flex-row gap-2 pt-1 sm:space-x-0">
          <Button
            onClick={startGame}
            className="flex-1 rounded-2xl bg-pink-500 hover:bg-pink-600 text-white font-bold shadow-md shadow-pink-200 h-11"
          >
            Play Again
          </Button>
          <Button
            onClick={resetGame}
            variant="outline"
            className="flex-1 rounded-2xl border-pink-200 text-pink-600 hover:bg-pink-50 h-11"
          >
            Main Menu
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
