import { useEffect, useRef } from 'react';
import { useEggHuntStore } from '@/store/eggHuntStore';
import { randomVisualState } from '@/types/eggHunt';

export function useEggAnimation(eggId: number) {
  const phase = useEggHuntStore((s) => s.phase);
  const rule = useEggHuntStore((s) => s.rule);
  const realEggIndex = useEggHuntStore((s) => s.realEggIndex);
  const updateInterval = useEggHuntStore((s) => s.eggs[eggId]?.updateInterval ?? 1000);
  const updateEggVisual = useEggHuntStore((s) => s.updateEggVisual);

  // Track tick count locally — no need to store it in Zustand
  const tickCountRef = useRef(0);

  useEffect(() => {
    if (phase !== 'playing' || !rule) return;

    const isReal = eggId === realEggIndex;
    // fakeIndex: position among fakes 0–7, used to stagger violation timing
    const fakeIndex = isReal ? -1 : eggId < realEggIndex ? eggId : eggId - 1;

    // Reset tick on each new game phase (i.e., when game restarts)
    tickCountRef.current = 0;

    const id = setInterval(() => {
      // Read current visual directly from store to avoid stale closure
      const currentVisual = useEggHuntStore.getState().eggs[eggId]?.visual;
      const currentPhase = useEggHuntStore.getState().phase;

      if (!currentVisual || currentPhase !== 'playing') return;

      const next = randomVisualState();
      const tick = tickCountRef.current;
      tickCountRef.current += 1;

      let newVisual;
      if (isReal) {
        newVisual = rule.constrainRealEgg(currentVisual, next);
      } else {
        const shouldViolate = rule.willFakeViolateNow(tick, fakeIndex);
        if (shouldViolate) {
          // Explicitly violate the rule so the player has a chance to spot it
          newVisual = rule.violateFakeEgg(next);
        } else if (Math.random() < 0.7) {
          // Mimic the real egg's rule (makes detection harder)
          newVisual = rule.constrainRealEgg(currentVisual, next);
        } else {
          // Fully random — may or may not happen to follow the rule
          newVisual = next;
        }
      }

      updateEggVisual(eggId, newVisual);
    }, updateInterval);

    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, eggId, realEggIndex, rule, updateInterval, updateEggVisual]);
}
