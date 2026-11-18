import type { PuzzleState } from './puzzle.ts';

// The fixed object names, destinations, visit order, and two-lap rules admit
// exactly 26 non-solved starting states with one winning lid pattern each.
// This rotation contains all 26. The first 11 keep their prior order,
// with a correctly placed plastic bottle added as bin 5.
export const dailyPuzzles: readonly PuzzleState[] = [
  { bins: ['jar', 'paper', 'gem', 'can', 'bottle'], paw: 'peel' },
  { bins: ['gem', 'can', 'peel', 'jar', 'bottle'], paw: 'paper' },
  { bins: ['gem', 'paper', 'can', 'jar', 'bottle'], paw: 'peel' },
  { bins: ['can', 'gem', 'paper', 'jar', 'bottle'], paw: 'peel' },
  { bins: ['gem', 'paper', 'peel', 'can', 'bottle'], paw: 'jar' },
  { bins: ['can', 'gem', 'peel', 'paper', 'bottle'], paw: 'jar' },
  { bins: ['can', 'paper', 'gem', 'peel', 'bottle'], paw: 'jar' },
  { bins: ['peel', 'gem', 'can', 'jar', 'bottle'], paw: 'paper' },
  { bins: ['jar', 'gem', 'peel', 'can', 'bottle'], paw: 'paper' },
  { bins: ['can', 'jar', 'gem', 'paper', 'bottle'], paw: 'peel' },
  { bins: ['peel', 'jar', 'gem', 'can', 'bottle'], paw: 'paper' },
  { bins: ['gem', 'paper', 'peel', 'jar', 'can'], paw: 'bottle' },
  { bins: ['can', 'gem', 'peel', 'jar', 'paper'], paw: 'bottle' },
  { bins: ['bottle', 'gem', 'peel', 'jar', 'can'], paw: 'paper' },
  { bins: ['can', 'paper', 'gem', 'jar', 'peel'], paw: 'bottle' },
  { bins: ['bottle', 'paper', 'gem', 'jar', 'can'], paw: 'peel' },
  { bins: ['can', 'bottle', 'gem', 'jar', 'paper'], paw: 'peel' },
  { bins: ['peel', 'bottle', 'gem', 'jar', 'can'], paw: 'paper' },
  { bins: ['can', 'paper', 'peel', 'gem', 'jar'], paw: 'bottle' },
  { bins: ['bottle', 'paper', 'peel', 'gem', 'can'], paw: 'jar' },
  { bins: ['can', 'bottle', 'peel', 'gem', 'paper'], paw: 'jar' },
  { bins: ['jar', 'bottle', 'peel', 'gem', 'can'], paw: 'paper' },
  { bins: ['can', 'paper', 'bottle', 'gem', 'peel'], paw: 'jar' },
  { bins: ['jar', 'paper', 'bottle', 'gem', 'can'], paw: 'peel' },
  { bins: ['can', 'jar', 'bottle', 'gem', 'paper'], paw: 'peel' },
  { bins: ['peel', 'jar', 'bottle', 'gem', 'can'], paw: 'paper' },
];
