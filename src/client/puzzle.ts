export type ObjectId = 'can' | 'paper' | 'peel' | 'jar' | 'bottle' | 'gem';
export type PuzzleState = { bins: readonly ObjectId[]; paw: ObjectId };
export type Visit = { lap: number; bin: number; swapped: boolean; state: PuzzleState };

export const objects: Record<ObjectId, { icon: string; name: string }> = {
  can: { icon: '🥫', name: 'Tin can' },
  paper: { icon: '📰', name: 'Newspaper' },
  peel: { icon: '🍌', name: 'Banana peel' },
  jar: { icon: '🫙', name: 'Glass jar' },
  bottle: { icon: '🧴', name: 'Plastic bottle' },
  gem: { icon: '💎', name: 'Shiny gem' },
};

export const destinations = [
  { icon: '🥫', name: 'Metal', object: 'can' },
  { icon: '📰', name: 'Paper', object: 'paper' },
  { icon: '🍌', name: 'Compost', object: 'peel' },
  { icon: '🫙', name: 'Glass', object: 'jar' },
  { icon: '🧴', name: 'Plastic', object: 'bottle' },
] as const;

export const initialState = (): PuzzleState => ({
  bins: ['jar', 'paper', 'gem', 'can', 'bottle'],
  paw: 'peel',
});

export const correctCount = (state: PuzzleState): number =>
  state.bins.filter((object, index) => object === destinations[index]?.object).length;

export const isSolved = (state: PuzzleState): boolean =>
  correctCount(state) === destinations.length && state.paw === 'gem';

export const visitBin = (state: PuzzleState, bin: number, open: boolean): PuzzleState => {
  if (!open || bin < 0 || bin >= destinations.length) {
    return { bins: [...state.bins], paw: state.paw };
  }
  const bins = [...state.bins];
  const paw = bins[bin];
  bins[bin] = state.paw;
  return { bins, paw: paw ?? state.paw };
};

export const simulate = (lids: readonly boolean[], start: PuzzleState = initialState()): { visits: Visit[]; result: PuzzleState } => {
  let state: PuzzleState = { bins: [...start.bins], paw: start.paw };
  const visits: Visit[] = [];
  for (let lap = 1; lap <= 2; lap++) {
    for (let bin = 0; bin < destinations.length; bin++) {
      const swapped = lids[bin] === true;
      state = visitBin(state, bin, swapped);
      visits.push({ lap, bin, swapped, state });
    }
  }
  return { visits, result: state };
};
