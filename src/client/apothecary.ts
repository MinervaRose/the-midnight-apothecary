export const ingredients = [
  'mandrake',
  'newt',
  'feather',
  'frog',
  'plant',
] as const;
export type Ingredient = (typeof ingredients)[number];
export type Arrangement = readonly Ingredient[];
export type Placement = readonly (Ingredient | null)[];

export const ingredientInfo: Record<
  Ingredient,
  { name: string; image: string }
> = {
  mandrake: { name: 'Mandrake', image: '/apothecary/mandrake.png' },
  newt: { name: 'Eye of Newt', image: '/apothecary/newt-eye.png' },
  feather: {
    name: 'Phoenix Feather',
    image: '/apothecary/phoenix-feather.png',
  },
  frog: { name: 'Bullfrog', image: '/apothecary/bullfrog.png' },
  plant: {
    name: 'Carnivorous Plant',
    image: '/apothecary/carnivorous-plant.png',
  },
};

export type Clue =
  | { kind: 'immediatelyLeft'; a: Ingredient; b: Ingredient }
  | { kind: 'rightOf'; a: Ingredient; b: Ingredient }
  | { kind: 'notNextTo'; a: Ingredient; b: Ingredient }
  | { kind: 'middle'; a: Ingredient }
  | { kind: 'end'; a: Ingredient }
  | { kind: 'oneBetween'; a: Ingredient; b: Ingredient };

export type Puzzle = { id: string; clues: readonly Clue[] };

export const formatClue = (clue: Clue): string => {
  const a = ingredientInfo[clue.a].name;
  switch (clue.kind) {
    case 'immediatelyLeft':
      return `${a} is immediately to the left of ${ingredientInfo[clue.b].name}.`;
    case 'rightOf':
      return `${a} is somewhere to the right of ${ingredientInfo[clue.b].name}.`;
    case 'notNextTo':
      return `${a} is not next to ${ingredientInfo[clue.b].name}.`;
    case 'middle':
      return `${a} belongs in the middle jar.`;
    case 'end':
      return `${a} belongs in a jar at one end.`;
    case 'oneBetween':
      return `Exactly one jar separates ${a} and ${ingredientInfo[clue.b].name}.`;
  }
};

export const matchesClue = (order: Arrangement, clue: Clue): boolean => {
  const a = order.indexOf(clue.a);
  if (a < 0) return false;
  if (clue.kind === 'middle') return a === 2;
  if (clue.kind === 'end') return a === 0 || a === 4;
  const b = order.indexOf(clue.b);
  if (b < 0 || a === b) return false;
  switch (clue.kind) {
    case 'immediatelyLeft':
      return a + 1 === b;
    case 'rightOf':
      return a > b;
    case 'notNextTo':
      return Math.abs(a - b) !== 1;
    case 'oneBetween':
      return Math.abs(a - b) === 2;
  }
};

export const allArrangements = (): Arrangement[] => {
  const result: Arrangement[] = [];
  const visit = (prefix: Ingredient[], remaining: Ingredient[]) => {
    if (remaining.length === 0) {
      result.push(prefix);
      return;
    }
    remaining.forEach((ingredient, index) =>
      visit(
        [...prefix, ingredient],
        remaining.filter((_, i) => i !== index)
      )
    );
  };
  visit([], [...ingredients]);
  return result;
};

export const solvePuzzle = (clues: readonly Clue[]): Arrangement[] =>
  allArrangements().filter((order) =>
    clues.every((clue) => matchesClue(order, clue))
  );

export const emptyPlacement = (): Placement => [null, null, null, null, null];

// Moving an ingredient to an occupied jar returns the displaced ingredient to the tray.
export const placeIngredient = (
  placement: Placement,
  ingredient: Ingredient,
  jar: number
): Placement => {
  if (!Number.isInteger(jar) || jar < 0 || jar >= ingredients.length)
    return placement;
  return placement.map((value, index) =>
    index === jar ? ingredient : value === ingredient ? null : value
  );
};

export const isComplete = (placement: Placement): boolean =>
  placement.length === ingredients.length &&
  ingredients.every((ingredient) => placement.includes(ingredient));

export const isWinningPlacement = (
  placement: Placement,
  puzzle: Puzzle
): boolean =>
  isComplete(placement) &&
  puzzle.clues.every((clue) =>
    matchesClue(
      placement.filter((value): value is Ingredient => value !== null),
      clue
    )
  );
