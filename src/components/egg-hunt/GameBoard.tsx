import { useEggHuntStore } from '@/store/eggHuntStore';
import { Egg } from './Egg';

export function GameBoard() {
  const eggs = useEggHuntStore((s) => s.eggs);
  const phase = useEggHuntStore((s) => s.phase);
  const realEggIndex = useEggHuntStore((s) => s.realEggIndex);
  const wrongGuesses = useEggHuntStore((s) => s.wrongGuesses);
  const selectEgg = useEggHuntStore((s) => s.selectEgg);

  if (eggs.length === 0) return null;

  return (
    <div className="grid grid-cols-3 gap-3 sm:gap-5 w-full max-w-[340px] sm:max-w-[460px] mx-auto px-4 pb-8">
      {eggs.map((egg, i) => (
        <Egg
          key={egg.id}
          eggId={i}
          onClick={() => selectEgg(i)}
          isDisabled={phase !== 'playing' || wrongGuesses.includes(i)}
          isDimmed={wrongGuesses.includes(i)}
          isHighlighted={phase === 'won' && i === realEggIndex}
          showAsReal={phase === 'lost' && i === realEggIndex}
        />
      ))}
    </div>
  );
}
