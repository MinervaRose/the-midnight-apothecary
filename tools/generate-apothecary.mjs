// Reproducible curator for the finite five-ingredient clue space.
// Run: node --experimental-strip-types tools/generate-apothecary.mjs
import {
  allArrangements,
  ingredients,
  matchesClue,
} from '../src/client/apothecary.ts';
import { writeFile } from 'node:fs/promises';

const orders = allArrangements();
const clues = [];
for (const a of ingredients) {
  clues.push({ kind: 'middle', a }, { kind: 'end', a });
  for (const b of ingredients) {
    if (a === b) continue;
    clues.push({ kind: 'immediatelyLeft', a, b }, { kind: 'rightOf', a, b });
    if (ingredients.indexOf(a) < ingredients.indexOf(b)) {
      clues.push({ kind: 'notNextTo', a, b }, { kind: 'oneBetween', a, b });
    }
  }
}
const masks = clues.map((clue) =>
  orders.reduce(
    (mask, order, index) =>
      matchesClue(order, clue) ? mask | (1n << BigInt(index)) : mask,
    0n
  )
);
let seed = 0x514a2026;
const random = () => (seed = (1664525 * seed + 1013904223) >>> 0) / 0x100000000;
const shuffle = (items) => {
  const result = [...items];
  for (let index = result.length - 1; index > 0; index--) {
    const other = Math.floor(random() * (index + 1));
    [result[index], result[other]] = [result[other], result[index]];
  }
  return result;
};
const targetFor = (indices) =>
  indices.reduce((mask, index) => mask & masks[index], (1n << 120n) - 1n);
const candidates = [];
for (let target = 0; target < orders.length; target++) {
  const possible = clues
    .map((_, index) => index)
    .filter((index) => (masks[index] & (1n << BigInt(target))) !== 0n);
  const found = new Set();
  for (let attempt = 0; attempt < 18000 && found.size < 8; attempt++) {
    const count = attempt % 3 === 0 ? 5 : 4;
    const sample = shuffle(possible).slice(0, count);
    const chosen = sample.map((index) => clues[index]);
    const direct = chosen.filter(
      (clue) => clue.kind === 'middle' || clue.kind === 'end'
    ).length;
    if (direct > 1 || new Set(chosen.map((clue) => clue.kind)).size < 3)
      continue;
    if (targetFor(sample) !== 1n << BigInt(target)) continue;
    if (
      sample.some(
        (_, i) =>
          targetFor(sample.filter((__, j) => i !== j)) === 1n << BigInt(target)
      )
    )
      continue;
    const signature = chosen
      .map((clue) => clue.kind)
      .sort()
      .join(',');
    if (found.has(signature)) continue;
    found.add(signature);
    candidates.push({ target, sample, signature, direct, count });
  }
}
const selected = [];
const usedTargets = new Set([
  orders.findIndex(
    (order) => order.join(',') === 'newt,feather,plant,frog,mandrake'
  ),
]);
const usedSignatures = new Set(['immediatelyLeft,middle,notNextTo,rightOf']);
const positionCounts = Object.fromEntries(
  ingredients.map((ingredient) => [ingredient, [0, 0, 0, 0, 0]])
);
orders[[...usedTargets][0]].forEach(
  (ingredient, position) => positionCounts[ingredient][position]++
);
for (let round = 0; round < 29; round++) {
  const available = candidates.filter(
    (candidate) => !usedTargets.has(candidate.target)
  );
  available.sort((a, b) => {
    const directCost = (candidate) =>
      round < 4 ? (candidate.direct === 1 ? -20 : 0) : candidate.direct * 8;
    const score = (candidate) =>
      (usedSignatures.has(candidate.signature) ? 100 : 0) +
      directCost(candidate) +
      (candidate.count === 5 ? 1 : 0) +
      orders[candidate.target].reduce(
        (total, ingredient, position) =>
          total + positionCounts[ingredient][position] * 4,
        0
      );
    return score(a) - score(b) || a.target - b.target;
  });
  const choice = available[0];
  if (!choice) throw new Error(`Only ${round} puzzles found`);
  selected.push(choice);
  usedTargets.add(choice.target);
  usedSignatures.add(choice.signature);
  orders[choice.target].forEach(
    (ingredient, position) => positionCounts[ingredient][position]++
  );
}
console.log(
  `Candidate sets: ${candidates.length}; distinct solutions: ${new Set(candidates.map((entry) => entry.target)).size}; selected: ${selected.length}`
);
const lines = [
  "import type { Puzzle } from './apothecary.ts';",
  '',
  '// Curated by tools/generate-apothecary.mjs. Every clue is necessary for a unique solution.',
  'export const dailyPuzzles: readonly Puzzle[] = [',
  "  { id: 'spell-01', clues: [",
  "    { kind: 'middle', a: 'plant' },",
  "    { kind: 'immediatelyLeft', a: 'newt', b: 'feather' },",
  "    { kind: 'rightOf', a: 'frog', b: 'plant' },",
  "    { kind: 'notNextTo', a: 'mandrake', b: 'plant' },",
  '  ] },',
];
for (const [index, entry] of selected.entries()) {
  console.log(
    `// ${index + 2}: ${orders[entry.target].join(', ')} | ${entry.signature}`
  );
  console.log(
    `{ id: 'spell-${String(index + 2).padStart(2, '0')}', clues: [${entry.sample.map((clueIndex) => JSON.stringify(clues[clueIndex])).join(', ')}] },`
  );
  lines.push(
    `  { id: 'spell-${String(index + 2).padStart(2, '0')}', clues: [${entry.sample.map((clueIndex) => JSON.stringify(clues[clueIndex])).join(', ')}] },`
  );
}
lines.push('];', '');
await writeFile(
  new URL('../src/client/apothecary-puzzles.ts', import.meta.url),
  lines.join('\n')
);
