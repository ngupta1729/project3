import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useEggHuntStore } from '@/store/eggHuntStore';
import { getScoreTier } from '@/types/eggHunt';
import { cn } from '@/lib/utils';

const TIER_CONFIG = {
  excellent: { label: 'Excellent!', icon: '🏆', color: 'text-emerald-500' },
  good:      { label: 'Good!',      icon: '🌟', color: 'text-amber-500'   },
  slow:      { label: 'Keep trying!', icon: '🐢', color: 'text-rose-400'  },
} as const;

export function ResultOverlay() {
  const phase     = useEggHuntStore((s) => s.phase);
  const rule      = useEggHuntStore((s) => s.rule);
  const score     = useEggHuntStore((s) => s.score);
  const clueUsed  = useEggHuntStore((s) => s.clueUsed);
  const startGame = useEggHuntStore((s) => s.startGame);
  const resetGame = useEggHuntStore((s) => s.resetGame);

  const isOpen = phase === 'won' || phase === 'lost';
  const tier = score ? TIER_CONFIG[getScoreTier(score.total)] : null;

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
              <div className="text-5xl mb-1">{tier?.icon ?? '🎉'}</div>
              <DialogTitle className="text-2xl font-extrabold text-pink-600 text-center">
                You found the real egg!
              </DialogTitle>
            </DialogHeader>

            <div className="flex flex-col items-center gap-3 py-1">
              {/* Tier label */}
              {tier && (
                <p className={cn('text-2xl font-extrabold', tier.color)}>{tier.label}</p>
              )}

              {/* Coin total */}
              {score && (
                <>
                  <div className="flex items-center justify-center gap-2">
                    <span className="text-5xl font-extrabold text-foreground tabular-nums">
                      {score.total}
                    </span>
                    <span className="text-3xl">🪙</span>
                  </div>

                  {/* Breakdown */}
                  <div className="w-full bg-white/70 rounded-2xl px-4 py-3 text-sm ring-1 ring-purple-100 space-y-1.5">
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">⚡ Speed</span>
                      <span className="font-semibold text-emerald-600">+{score.speedCoins} 🪙</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">🎯 Attempts</span>
                      <span className="font-semibold text-blue-600">+{score.attemptCoins} 🪙</span>
                    </div>
                    {score.clueApplied && (
                      <>
                        <div className="flex justify-between items-center border-t border-purple-100 pt-1.5">
                          <span className="text-muted-foreground">Subtotal</span>
                          <span className="tabular-nums">{score.subtotal} 🪙</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-muted-foreground">🔍 Clue used</span>
                          <span className="font-semibold text-amber-600">× 0.8</span>
                        </div>
                      </>
                    )}
                    <div className="flex justify-between items-center border-t border-purple-100 pt-1.5 font-bold">
                      <span>Total</span>
                      <span>{score.total} 🪙</span>
                    </div>
                  </div>
                </>
              )}

              {/* Rule reveal */}
              {rule && (
                <div className="bg-white/70 rounded-2xl px-4 py-3 text-sm text-purple-700 text-center ring-1 ring-purple-100 leading-snug w-full">
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
              <div className="bg-white/70 rounded-2xl px-4 py-3 text-sm font-semibold text-purple-700 text-center ring-1 ring-purple-100 leading-snug w-full">
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
