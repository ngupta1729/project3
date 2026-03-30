import { useEffect } from 'react';
import { useEggHuntStore } from '@/store/eggHuntStore';

export function useGameTimer() {
  const phase = useEggHuntStore((s) => s.phase);
  const incrementTimer = useEggHuntStore((s) => s.incrementTimer);

  useEffect(() => {
    if (phase !== 'playing') return;
    const id = setInterval(incrementTimer, 500);
    return () => clearInterval(id);
  }, [phase, incrementTimer]);
}
