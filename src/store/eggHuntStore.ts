import { create } from 'zustand';
import { pickRule, randomVisualState, calculateScore } from '@/types/eggHunt';
import type { EggState, EggVisualState, GamePhase, GameRule, ScoreBreakdown } from '@/types/eggHunt';

interface EggHuntStoreState {
  phase: GamePhase;
  rule: GameRule | null;
  realEggIndex: number;
  eggs: EggState[];
  attemptsRemaining: number;
  wrongGuesses: number[];
  startTime: number | null;
  elapsedSeconds: number;
  clueUsed: boolean;
  score: ScoreBreakdown | null;
  // Actions
  startGame: () => void;
  selectEgg: (index: number) => void;
  updateEggVisual: (index: number, visual: EggVisualState) => void;
  setEggWrong: (index: number, value: boolean) => void;
  incrementTimer: () => void;
  useClue: () => void;
  resetGame: () => void;
}

function createInitialEggs(rule: GameRule, realIndex: number): EggState[] {
  return Array.from({ length: 9 }, (_, i) => {
    const visual = randomVisualState();
    return {
      id: i,
      visual: i === realIndex ? rule.constrainRealEgg(visual, visual) : visual,
      isWrong: false,
      updateInterval: 500 + Math.random() * 1000,
    };
  });
}

export const useEggHuntStore = create<EggHuntStoreState>((set, get) => ({
  phase: 'idle',
  rule: null,
  realEggIndex: 0,
  eggs: [],
  attemptsRemaining: 3,
  wrongGuesses: [],
  startTime: null,
  elapsedSeconds: 0,
  clueUsed: false,
  score: null,

  startGame: () => {
    const rule = pickRule();
    const realEggIndex = Math.floor(Math.random() * 9);
    const eggs = createInitialEggs(rule, realEggIndex);
    set({
      phase: 'playing',
      rule,
      realEggIndex,
      eggs,
      attemptsRemaining: 3,
      wrongGuesses: [],
      startTime: Date.now(),
      elapsedSeconds: 0,
      clueUsed: false,
      score: null,
    });
  },

  selectEgg: (index) => {
    const { phase, realEggIndex, attemptsRemaining, elapsedSeconds, wrongGuesses, clueUsed } = get();
    if (phase !== 'playing') return;
    if (wrongGuesses.includes(index)) return;

    if (index === realEggIndex) {
      const score = calculateScore(elapsedSeconds, wrongGuesses.length, clueUsed);
      set({ phase: 'won', score });
    } else {
      const newAttempts = attemptsRemaining - 1;
      set((state) => ({
        attemptsRemaining: newAttempts,
        wrongGuesses: [...state.wrongGuesses, index],
        eggs: state.eggs.map((egg, i) =>
          i === index ? { ...egg, isWrong: true } : egg
        ),
        phase: newAttempts === 0 ? 'lost' : 'playing',
      }));
      setTimeout(() => {
        set((state) => ({
          eggs: state.eggs.map((egg, i) =>
            i === index ? { ...egg, isWrong: false } : egg
          ),
        }));
      }, 700);
    }
  },

  updateEggVisual: (index, visual) => {
    set((state) => ({
      eggs: state.eggs.map((egg, i) => (i === index ? { ...egg, visual } : egg)),
    }));
  },

  setEggWrong: (index, value) => {
    set((state) => ({
      eggs: state.eggs.map((egg, i) => (i === index ? { ...egg, isWrong: value } : egg)),
    }));
  },

  incrementTimer: () => {
    const { startTime, phase } = get();
    if (!startTime || phase !== 'playing') return;
    set({ elapsedSeconds: Math.floor((Date.now() - startTime) / 1000) });
  },

  useClue: () => {
    if (get().phase !== 'playing') return;
    set({ clueUsed: true });
  },

  resetGame: () => set({ phase: 'idle' }),
}));
