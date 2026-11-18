import type { DailyPuzzle } from './puzzle.ts';

// Curated from an exhaustive scan of 720 starts × 32 lid masks × 10 chute pairs.
// Each entry has one winning mask and defeats the mismatched-bin shortcut.
// Twenty-nine have 3–5 initially misplaced bins. One has a single misplaced bin and
// demonstrates that an initially correct bin may need to be opened.
// Solutions are intentionally absent from this file. The 30 entries cover
// all ten chute connections and 26 distinct winning masks.
export const dailyPuzzles: readonly DailyPuzzle[] = [
  { start: { bins: ['can', 'paper', 'peel', 'gem', 'bottle'], paw: 'jar' }, chute: [0, 3] },
  { start: { bins: ['gem', 'peel', 'can', 'jar', 'bottle'], paw: 'paper' }, chute: [0, 1] },
  { start: { bins: ['peel', 'gem', 'can', 'paper', 'bottle'], paw: 'jar' }, chute: [0, 2] },
  { start: { bins: ['jar', 'gem', 'paper', 'can', 'bottle'], paw: 'peel' }, chute: [0, 3] },
  { start: { bins: ['peel', 'gem', 'can', 'jar', 'paper'], paw: 'bottle' }, chute: [0, 4] },
  { start: { bins: ['peel', 'can', 'gem', 'jar', 'bottle'], paw: 'paper' }, chute: [1, 2] },
  { start: { bins: ['paper', 'gem', 'peel', 'can', 'bottle'], paw: 'jar' }, chute: [1, 3] },
  { start: { bins: ['jar', 'bottle', 'gem', 'can', 'paper'], paw: 'peel' }, chute: [1, 4] },
  { start: { bins: ['jar', 'peel', 'gem', 'can', 'bottle'], paw: 'paper' }, chute: [2, 3] },
  { start: { bins: ['peel', 'bottle', 'gem', 'can', 'jar'], paw: 'paper' }, chute: [2, 4] },
  { start: { bins: ['can', 'paper', 'bottle', 'peel', 'gem'], paw: 'jar' }, chute: [3, 4] },
  { start: { bins: ['peel', 'jar', 'gem', 'paper', 'bottle'], paw: 'can' }, chute: [0, 1] },
  { start: { bins: ['gem', 'paper', 'bottle', 'jar', 'can'], paw: 'peel' }, chute: [0, 2] },
  { start: { bins: ['peel', 'bottle', 'gem', 'paper', 'can'], paw: 'jar' }, chute: [0, 3] },
  { start: { bins: ['gem', 'bottle', 'can', 'jar', 'paper'], paw: 'peel' }, chute: [0, 4] },
  { start: { bins: ['can', 'gem', 'bottle', 'jar', 'paper'], paw: 'peel' }, chute: [1, 2] },
  { start: { bins: ['bottle', 'jar', 'gem', 'paper', 'can'], paw: 'peel' }, chute: [1, 3] },
  { start: { bins: ['bottle', 'gem', 'peel', 'paper', 'can'], paw: 'jar' }, chute: [1, 4] },
  { start: { bins: ['bottle', 'gem', 'jar', 'peel', 'can'], paw: 'paper' }, chute: [2, 3] },
  { start: { bins: ['jar', 'bottle', 'gem', 'peel', 'can'], paw: 'paper' }, chute: [2, 4] },
  { start: { bins: ['can', 'paper', 'jar', 'gem', 'peel'], paw: 'bottle' }, chute: [3, 4] },
  { start: { bins: ['paper', 'can', 'peel', 'gem', 'jar'], paw: 'bottle' }, chute: [0, 1] },
  { start: { bins: ['peel', 'bottle', 'can', 'gem', 'paper'], paw: 'jar' }, chute: [0, 2] },
  { start: { bins: ['bottle', 'jar', 'can', 'gem', 'paper'], paw: 'peel' }, chute: [0, 3] },
  { start: { bins: ['gem', 'paper', 'bottle', 'can', 'peel'], paw: 'jar' }, chute: [0, 4] },
  { start: { bins: ['paper', 'jar', 'bottle', 'gem', 'can'], paw: 'peel' }, chute: [1, 2] },
  { start: { bins: ['can', 'bottle', 'peel', 'gem', 'jar'], paw: 'paper' }, chute: [1, 3] },
  { start: { bins: ['can', 'gem', 'bottle', 'paper', 'peel'], paw: 'jar' }, chute: [1, 4] },
  { start: { bins: ['jar', 'peel', 'bottle', 'gem', 'can'], paw: 'paper' }, chute: [2, 3] },
  { start: { bins: ['can', 'bottle', 'gem', 'peel', 'paper'], paw: 'jar' }, chute: [2, 4] },
];
