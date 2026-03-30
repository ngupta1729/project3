import type { EggPattern } from '@/types/eggHunt';

interface PatternDefProps {
  id: string;
  pattern: Exclude<EggPattern, 'none'>;
}

export function PatternDef({ id, pattern }: PatternDefProps) {
  switch (pattern) {
    case 'stripes':
      return (
        <pattern
          id={id}
          patternUnits="userSpaceOnUse"
          width="12"
          height="12"
          patternTransform="rotate(45)"
        >
          <rect width="6" height="12" fill="rgba(255,255,255,0.45)" />
        </pattern>
      );

    case 'dots':
      return (
        <pattern id={id} patternUnits="userSpaceOnUse" width="14" height="14">
          <circle cx="7" cy="7" r="3.5" fill="rgba(255,255,255,0.5)" />
        </pattern>
      );

    case 'zigzag':
      return (
        <pattern id={id} patternUnits="userSpaceOnUse" width="20" height="12">
          <polyline
            points="0,10 10,2 20,10"
            fill="none"
            stroke="rgba(255,255,255,0.55)"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </pattern>
      );

    case 'stars':
      return (
        <pattern id={id} patternUnits="userSpaceOnUse" width="22" height="22">
          <text
            x="11"
            y="16"
            textAnchor="middle"
            fontSize="14"
            fill="rgba(255,255,255,0.6)"
          >
            ✦
          </text>
        </pattern>
      );
  }
}
