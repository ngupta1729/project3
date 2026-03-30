import { motion } from 'framer-motion';
import { useEggAnimation } from '@/hooks/useEggAnimation';
import { useEggHuntStore } from '@/store/eggHuntStore';
import { SYMBOL_MAP } from '@/types/eggHunt';
import type { EggPattern } from '@/types/eggHunt';
import { PatternDef } from './EggPatterns';
import { cn } from '@/lib/utils';

// Realistic egg shape: narrower at top, wider at bottom
const EGG_PATH =
  'M 50 5 C 80 5, 95 40, 95 70 C 95 100, 80 125, 50 125 C 20 125, 5 100, 5 70 C 5 40, 20 5, 50 5 Z';

interface EggProps {
  eggId: number;
  onClick: () => void;
  isDisabled: boolean;
  isDimmed: boolean;
  isHighlighted: boolean;
  showAsReal: boolean;
}

export function Egg({ eggId, onClick, isDisabled, isDimmed, isHighlighted, showAsReal }: EggProps) {
  useEggAnimation(eggId);

  const egg = useEggHuntStore((s) => s.eggs[eggId]);
  if (!egg) return null;

  const { color, pattern, text, rotationDeg, symbol } = egg.visual;
  const hasPattern = pattern !== 'none';
  const hasSymbol = symbol !== 'none';
  const patternId = `egg-pattern-${eggId}`;
  const clipId = `egg-clip-${eggId}`;

  return (
    <motion.div
      className={cn(
        'relative select-none',
        !isDisabled && 'cursor-pointer',
        isDimmed && 'opacity-35'
      )}
      animate={{
        rotate: rotationDeg,
        scale: egg.isWrong ? [1, 1.18, 0.86, 1.06, 1] : 1,
      }}
      transition={{
        rotate: { duration: 0.5, ease: 'easeInOut' },
        scale: { duration: 0.42, ease: 'easeInOut' },
      }}
      whileHover={!isDisabled ? { scale: 1.08, y: -6 } : {}}
      whileTap={!isDisabled ? { scale: 0.91 } : {}}
      onClick={!isDisabled ? onClick : undefined}
      role={!isDisabled ? 'button' : undefined}
      aria-label={`Egg ${eggId + 1}`}
    >
      <svg
        viewBox="0 0 100 130"
        className="w-full h-full drop-shadow-lg"
        style={{ overflow: 'visible' }}
      >
        <defs>
          <clipPath id={clipId}>
            <path d={EGG_PATH} />
          </clipPath>
          {hasPattern && (
            <PatternDef id={patternId} pattern={pattern as Exclude<EggPattern, 'none'>} />
          )}
        </defs>

        {/* Base egg fill with smooth color transition */}
        <motion.path
          d={EGG_PATH}
          animate={{ fill: color }}
          transition={{ duration: 0.35, ease: 'easeInOut' }}
        />

        {/* Pattern overlay clipped to egg shape */}
        {hasPattern && (
          <path
            d={EGG_PATH}
            fill={`url(#${patternId})`}
            clipPath={`url(#${clipId})`}
            opacity={0.6}
          />
        )}

        {/* Symbol (emoji, centered) */}
        {hasSymbol && (
          <text
            x="50"
            y={text ? '62' : '70'}
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize="24"
            clipPath={`url(#${clipId})`}
          >
            {SYMBOL_MAP[symbol]}
          </text>
        )}

        {/* Text label */}
        {text && (
          <text
            x="50"
            y={hasSymbol ? '94' : '72'}
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize="13"
            fontWeight="bold"
            fill="rgba(255,255,255,0.95)"
            stroke="rgba(0,0,0,0.18)"
            strokeWidth="0.4"
            clipPath={`url(#${clipId})`}
          >
            {text}
          </text>
        )}

        {/* Wrong-guess red flash */}
        {egg.isWrong && <path d={EGG_PATH} fill="rgba(239, 68, 68, 0.45)" />}

        {/* Win: pulsing golden ring */}
        {isHighlighted && (
          <>
            <path d={EGG_PATH} fill="rgba(253, 224, 71, 0.25)" />
            <motion.path
              d={EGG_PATH}
              fill="none"
              stroke="hsl(48, 96%, 53%)"
              strokeWidth="4"
              animate={{ opacity: [1, 0.35, 1] }}
              transition={{ duration: 1, repeat: Infinity, ease: 'easeInOut' }}
            />
          </>
        )}

        {/* Loss: real egg reveal with green dashed ring */}
        {showAsReal && (
          <>
            <path d={EGG_PATH} fill="rgba(74, 222, 128, 0.18)" />
            <path
              d={EGG_PATH}
              fill="none"
              stroke="hsl(142, 71%, 45%)"
              strokeWidth="3"
              strokeDasharray="6 3"
            />
          </>
        )}
      </svg>
    </motion.div>
  );
}
