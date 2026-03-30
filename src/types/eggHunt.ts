export type EggPattern = 'none' | 'stripes' | 'dots' | 'zigzag' | 'stars';
export type EggSymbol = 'none' | 'star' | 'heart' | 'flower' | 'moon' | 'sun';
export type GamePhase = 'idle' | 'playing' | 'won' | 'lost';
export type ScoreTier = 'excellent' | 'good' | 'slow';

export interface EggVisualState {
  color: string;
  pattern: EggPattern;
  text: string | null;
  rotationDeg: number;
  symbol: EggSymbol;
}

export interface GameRule {
  id: string;
  description: string;
  /** Ensures the real egg's next state obeys the rule. prev = current visual. */
  constrainRealEgg: (prev: EggVisualState, next: EggVisualState) => EggVisualState;
  /** Produces a state that clearly violates the rule (used for fake eggs). */
  violateFakeEgg: (next: EggVisualState) => EggVisualState;
  willFakeViolateNow: (tick: number, fakeIndex: number) => boolean;
}

export interface EggState {
  id: number;
  visual: EggVisualState;
  isWrong: boolean;
  updateInterval: number; // ms, 500–1500, fixed at game start
}

// ─── Color Palettes ────────────────────────────────────────────────────────────

export const PASTEL_COLORS = [
  'hsl(340, 80%, 82%)', // rose
  'hsl(320, 75%, 82%)', // pink
  'hsl(290, 65%, 82%)', // lavender
  'hsl(270, 70%, 82%)', // purple
  'hsl(310, 70%, 82%)', // mauve
  'hsl(200, 70%, 80%)', // sky
  'hsl(175, 65%, 78%)', // teal
  'hsl(150, 60%, 78%)', // mint
  'hsl(50,  80%, 80%)', // butter
  'hsl(25,  85%, 80%)', // peach
] as const;

const WARM_COLORS: string[] = [
  'hsl(340, 80%, 82%)',
  'hsl(320, 75%, 82%)',
  'hsl(25,  85%, 80%)',
  'hsl(50,  80%, 80%)',
];

const COOL_COLORS: string[] = [
  'hsl(200, 70%, 80%)',
  'hsl(175, 65%, 78%)',
  'hsl(150, 60%, 78%)',
];

const PURPLE_COLORS: string[] = [
  'hsl(290, 65%, 82%)',
  'hsl(270, 70%, 82%)',
  'hsl(310, 70%, 82%)',
];

const COLOR_FAMILIES: Record<string, string[]> = {
  warm: WARM_COLORS,
  cool: COOL_COLORS,
  purple: PURPLE_COLORS,
};

const COLOR_FAMILY_NAMES: Record<string, string> = {
  warm: 'warm (pink / peach / yellow) tones',
  cool: 'cool (blue / teal / mint) tones',
  purple: 'purple / violet tones',
};

// ─── Other Constants ───────────────────────────────────────────────────────────

const TEXT_OPTIONS = ['Hi', 'BOO', '?', '!!', 'yo', 'hey', 'psst'];

const ALL_PATTERNS: EggPattern[] = ['none', 'stripes', 'dots', 'zigzag', 'stars'];
const NON_NONE_PATTERNS: Exclude<EggPattern, 'none'>[] = ['stripes', 'dots', 'zigzag', 'stars'];

const ALL_SYMBOLS: EggSymbol[] = ['none', 'star', 'heart', 'flower', 'moon', 'sun'];
const NON_NONE_SYMBOLS: Exclude<EggSymbol, 'none'>[] = ['star', 'heart', 'flower', 'moon', 'sun'];

const PATTERN_NAMES: Record<Exclude<EggPattern, 'none'>, string> = {
  stripes: 'stripes',
  dots: 'polka dots',
  zigzag: 'zigzag lines',
  stars: 'star pattern',
};

const SYMBOL_NAMES: Record<Exclude<EggSymbol, 'none'>, string> = {
  star: 'star',
  heart: 'heart',
  flower: 'flower',
  moon: 'moon',
  sun: 'sun',
};

export const SYMBOL_MAP: Record<EggSymbol, string> = {
  none: '',
  star: '⭐',
  heart: '♥',
  flower: '✿',
  moon: '🌙',
  sun: '☀',
};

// ─── Utilities ─────────────────────────────────────────────────────────────────

function pick<T>(arr: readonly T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function randomVisualState(): EggVisualState {
  return {
    color: pick(PASTEL_COLORS),
    pattern: pick(ALL_PATTERNS),
    text: Math.random() < 0.3 ? pick(TEXT_OPTIONS) : null,
    rotationDeg: Math.floor(Math.random() * 61) - 30,
    symbol: pick(ALL_SYMBOLS),
  };
}

// ─── Rule Builders ─────────────────────────────────────────────────────────────

function makeStaticRules(): GameRule[] {
  return [
    {
      id: 'NO_TEXT',
      description: 'The real egg never had any text on it',
      constrainRealEgg: (_prev, next) => ({ ...next, text: null }),
      violateFakeEgg: (next) => ({ ...next, text: pick(TEXT_OPTIONS) }),
      willFakeViolateNow: (tick, idx) => tick > 5 + idx && Math.random() < 0.15,
    },
    {
      id: 'STATIC_COLOR',
      description: 'The real egg never changed its color',
      constrainRealEgg: (prev, next) => ({ ...next, color: prev.color }),
      violateFakeEgg: (next) => ({ ...next, color: pick(PASTEL_COLORS) }),
      willFakeViolateNow: (tick, idx) => tick > 0 && tick % (3 + (idx % 4)) === 0,
    },
    {
      id: 'NO_ROTATION',
      description: 'The real egg never rotated — it always stayed perfectly upright',
      constrainRealEgg: (_prev, next) => ({ ...next, rotationDeg: 0 }),
      violateFakeEgg: (next) => ({
        ...next,
        rotationDeg: (Math.random() < 0.5 ? 1 : -1) * (15 + Math.floor(Math.random() * 15)),
      }),
      willFakeViolateNow: () => Math.random() < 0.3,
    },
    {
      id: 'NO_SYMBOLS',
      description: 'The real egg never displayed any symbols',
      constrainRealEgg: (_prev, next) => ({ ...next, symbol: 'none' }),
      violateFakeEgg: (next) => ({ ...next, symbol: pick(NON_NONE_SYMBOLS) }),
      willFakeViolateNow: (tick) => tick > 3 && Math.random() < 0.2,
    },
    {
      id: 'NO_PATTERN',
      description: 'The real egg was always a solid color — it never had any pattern',
      constrainRealEgg: (_prev, next) => ({ ...next, pattern: 'none' }),
      violateFakeEgg: (next) => ({ ...next, pattern: pick(NON_NONE_PATTERNS) }),
      willFakeViolateNow: (tick) => tick > 4 && Math.random() < 0.25,
    },
    {
      id: 'ALWAYS_TEXT',
      description: 'The real egg always had text displayed on it',
      constrainRealEgg: (prev, next) => ({
        ...next,
        text: next.text ?? prev.text ?? pick(TEXT_OPTIONS),
      }),
      violateFakeEgg: (next) => ({ ...next, text: null }),
      willFakeViolateNow: (tick) => tick > 4 && Math.random() < 0.2,
    },
    {
      id: 'ALWAYS_ROTATING',
      description: 'The real egg was always tilted — it never sat perfectly upright',
      constrainRealEgg: (prev, next) => {
        if (Math.abs(next.rotationDeg) < 8) {
          const dir = prev.rotationDeg >= 0 ? 1 : -1;
          return { ...next, rotationDeg: dir * (10 + Math.floor(Math.random() * 20)) };
        }
        return next;
      },
      violateFakeEgg: (next) => ({ ...next, rotationDeg: 0 }),
      willFakeViolateNow: () => Math.random() < 0.3,
    },
    {
      id: 'ALWAYS_SYMBOL',
      description: 'The real egg always had some symbol on it',
      constrainRealEgg: (_prev, next) => ({
        ...next,
        symbol: next.symbol === 'none' ? pick(NON_NONE_SYMBOLS) : next.symbol,
      }),
      violateFakeEgg: (next) => ({ ...next, symbol: 'none' }),
      willFakeViolateNow: (tick) => tick > 3 && Math.random() < 0.2,
    },
  ];
}

function makeParameterizedRules(): GameRule[] {
  // ALWAYS_PATTERN(p): real egg always shows a specific pattern
  const alwaysPatternType = pick(NON_NONE_PATTERNS);
  const otherPatterns = ALL_PATTERNS.filter((p) => p !== alwaysPatternType);
  const alwaysPattern: GameRule = {
    id: `ALWAYS_PATTERN_${alwaysPatternType.toUpperCase()}`,
    description: `The real egg always had ${PATTERN_NAMES[alwaysPatternType]}`,
    constrainRealEgg: (_prev, next) => ({ ...next, pattern: alwaysPatternType }),
    violateFakeEgg: (next) => ({ ...next, pattern: pick(otherPatterns) }),
    willFakeViolateNow: (tick) => tick > 4 && Math.random() < 0.25,
  };

  // ALWAYS_SPECIFIC_SYMBOL(s): real egg always shows one specific symbol
  const alwaysSymbolType = pick(NON_NONE_SYMBOLS);
  const otherSymbols = ALL_SYMBOLS.filter((s) => s !== alwaysSymbolType);
  const alwaysSymbol: GameRule = {
    id: `ALWAYS_SYMBOL_${alwaysSymbolType.toUpperCase()}`,
    description: `The real egg always showed a ${SYMBOL_NAMES[alwaysSymbolType]}`,
    constrainRealEgg: (_prev, next) => ({ ...next, symbol: alwaysSymbolType }),
    violateFakeEgg: (next) => ({ ...next, symbol: pick(otherSymbols) }),
    willFakeViolateNow: (tick) => tick > 3 && Math.random() < 0.2,
  };

  // ALWAYS_COLOR_FAMILY(f): real egg always stays in a color family
  const familyKey = pick(['warm', 'cool', 'purple']);
  const familyColors = COLOR_FAMILIES[familyKey];
  const nonFamilyColors = [...PASTEL_COLORS].filter((c) => !familyColors.includes(c));
  const alwaysColorFamily: GameRule = {
    id: `ALWAYS_COLOR_FAMILY_${familyKey.toUpperCase()}`,
    description: `The real egg always stayed in ${COLOR_FAMILY_NAMES[familyKey]}`,
    constrainRealEgg: (_prev, next) => ({
      ...next,
      color: familyColors.includes(next.color) ? next.color : pick(familyColors),
    }),
    violateFakeEgg: (next) => ({
      ...next,
      color: nonFamilyColors.length > 0 ? pick(nonFamilyColors) : pick(PASTEL_COLORS),
    }),
    willFakeViolateNow: (tick, idx) => tick > 2 && tick % (3 + (idx % 4)) === 0,
  };

  // NEVER_SPECIFIC_PATTERN(p): real egg never shows a specific pattern
  const neverPatternType = pick(NON_NONE_PATTERNS);
  const neverPattern: GameRule = {
    id: `NEVER_PATTERN_${neverPatternType.toUpperCase()}`,
    description: `The real egg never had ${PATTERN_NAMES[neverPatternType]}`,
    constrainRealEgg: (_prev, next) => ({
      ...next,
      pattern: next.pattern === neverPatternType ? 'none' : next.pattern,
    }),
    violateFakeEgg: (next) => ({ ...next, pattern: neverPatternType }),
    willFakeViolateNow: (tick) => tick > 4 && Math.random() < 0.25,
  };

  return [alwaysPattern, alwaysSymbol, alwaysColorFamily, neverPattern];
}

export function buildRules(): GameRule[] {
  return [...makeStaticRules(), ...makeParameterizedRules()];
}

export function pickRule(): GameRule {
  const all = buildRules();
  return all[Math.floor(Math.random() * all.length)];
}
