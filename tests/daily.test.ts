import assert from 'node:assert/strict';
import test from 'node:test';
import { dailyPuzzles } from '../src/client/daily-puzzles.ts';
import { DAILY_START_UTC, selectDailyPuzzle } from '../src/client/daily.ts';
import { destinations, isSolved, simulate } from '../src/client/puzzle.ts';
import type { ChutePair, ObjectId, PuzzleState } from '../src/client/puzzle.ts';

const objectIds: readonly ObjectId[] = ['can', 'paper', 'peel', 'jar', 'bottle', 'gem'];
const lidMasks = Array.from({ length: 32 }, (_, mask) => mask);
const lidsFor = (mask: number) => destinations.map((_, bin) => (mask & (1 << bin)) !== 0);
const key = (state: PuzzleState) => [...state.bins, state.paw].join(',');
const winningMasks = (start: PuzzleState, chute: ChutePair) => lidMasks.filter((mask) =>
  isSolved(simulate(lidsFor(mask), start, chute).result));
const mismatchedMask = (start: PuzzleState) => start.bins.reduce((mask, object, bin) =>
  mask | (object !== destinations[bin]?.object ? 1 << bin : 0), 0);

const permutations = (items: readonly ObjectId[]): ObjectId[][] => {
  if (items.length === 0) return [[]];
  return items.flatMap((item) =>
    permutations(items.filter((other) => other !== item)).map((tail) => [item, ...tail]));
};

test('exhaustive scan covers 720 starts, 32 masks and 10 chute pairs', () => {
  const arrangements = permutations(objectIds);
  const pairs: ChutePair[] = [];
  for (let first = 0; first < 5; first++) {
    for (let second = first + 1; second < 5; second++) pairs.push([first, second]);
  }
  assert.equal(arrangements.length, 720);
  assert.equal(lidMasks.length, 32);
  assert.equal(pairs.length, 10);
  let evaluated = 0;
  let unique = 0;
  let shortcutDefeated = 0;
  let preferred = 0;
  let requiresOpeningCorrect = 0;
  const eligible = new Set<string>();
  for (const arrangement of arrangements) {
    const start: PuzzleState = { bins: arrangement.slice(0, 5), paw: arrangement[5]! };
    for (const chute of pairs) {
      const wins = winningMasks(start, chute);
      evaluated += lidMasks.length;
      if (isSolved(start) || wins.length !== 1) continue;
      unique++;
      if (wins[0] === mismatchedMask(start)) continue;
      shortcutDefeated++;
      if ((wins[0]! & ~mismatchedMask(start)) !== 0) requiresOpeningCorrect++;
      eligible.add(`${key(start)}:${chute.join(',')}`);
      const misplaced = start.bins.filter((item, bin) => item !== destinations[bin]?.object).length;
      if (misplaced < 3 || misplaced > 5) continue;
      preferred++;
    }
  }
  assert.equal(evaluated, 720 * 32 * 10);
  assert.equal(unique, 216);
  assert.equal(shortcutDefeated, 180);
  assert.equal(preferred, 160);
  assert.equal(requiresOpeningCorrect, 20);
  for (const puzzle of dailyPuzzles) {
    assert.ok(eligible.has(`${key(puzzle.start)}:${puzzle.chute.join(',')}`));
  }
});

test('validation rejects impossible, ambiguous and pre-solved starts', () => {
  const impossible: PuzzleState = { bins: ['jar', 'paper', 'gem', 'can', 'bottle'], paw: 'peel' };
  const ambiguous: PuzzleState = { bins: ['paper', 'can', 'peel', 'jar', 'bottle'], paw: 'gem' };
  const solved: PuzzleState = { bins: ['can', 'paper', 'peel', 'jar', 'bottle'], paw: 'gem' };
  assert.equal(winningMasks(impossible, [0, 1]).length, 0);
  assert.ok(winningMasks(ambiguous, [0, 1]).length > 1);
  assert.equal(isSolved(solved), true);
});

test('all published puzzles have one solution, unique starts, and defeat the shortcut', () => {
  const starts = new Set<string>();
  const pairs = new Set<string>();
  const masks = new Set<number>();
  const misplacedCounts = new Map<number, number>();
  let opensCorrect = 0;
  for (const { start, chute } of dailyPuzzles) {
    assert.equal(start.bins.length, 5);
    assert.deepEqual([...start.bins, start.paw].sort(), [...objectIds].sort());
    assert.equal(isSolved(start), false);
    assert.ok(chute[0] >= 0 && chute[0] < chute[1] && chute[1] < 5);
    assert.equal(starts.has(key(start)), false, `duplicate start: ${key(start)}`);
    starts.add(key(start));
    pairs.add(chute.join(','));
    const wins = winningMasks(start, chute);
    assert.equal(wins.length, 1, `ambiguous or impossible: ${key(start)} / ${chute}`);
    const mask = wins[0]!;
    masks.add(mask);
    assert.notEqual(mask, mismatchedMask(start));
    assert.notEqual(mismatchedMask(start) & ~mask, 0, 'at least one wrong bin must stay closed');
    if ((mask & ~mismatchedMask(start)) !== 0) opensCorrect++;
    const count = start.bins.filter((item, bin) => item !== destinations[bin]?.object).length;
    assert.ok(count === 1 || (count >= 3 && count <= 5));
    misplacedCounts.set(count, (misplacedCounts.get(count) ?? 0) + 1);
  }
  assert.equal(dailyPuzzles.length, 30);
  assert.equal(pairs.size, 10);
  assert.equal(masks.size, 26);
  assert.equal(opensCorrect, 1);
  assert.deepEqual([...misplacedCounts].sort(), [[1, 1], [3, 8], [4, 11], [5, 10]]);
});

test('simulation matches an independent lap/chute/lap swap loop for every published puzzle and mask', () => {
  for (const { start, chute } of dailyPuzzles) {
    for (const mask of lidMasks) {
      const bins = [...start.bins];
      let paw = start.paw;
      const expectedVisits: PuzzleState[] = [];
      let afterLapOne: PuzzleState = start;
      let afterChute: PuzzleState = start;
      for (let lap = 1; lap <= 2; lap++) {
        for (let bin = 0; bin < 5; bin++) {
          if (mask & (1 << bin)) [bins[bin], paw] = [paw, bins[bin]!];
          expectedVisits.push({ bins: [...bins], paw });
        }
        if (lap === 1) {
          afterLapOne = { bins: [...bins], paw };
          [bins[chute[0]], bins[chute[1]]] = [bins[chute[1]]!, bins[chute[0]]!];
          afterChute = { bins: [...bins], paw };
        }
      }
      const actual = simulate(lidsFor(mask), start, chute);
      assert.deepEqual(actual.visits.map((visit) => visit.state), expectedVisits);
      assert.deepEqual(actual.afterLapOne, afterLapOne);
      assert.deepEqual(actual.afterChute, afterChute);
      assert.deepEqual(actual.result, { bins, paw });
    }
  }
});

test('UTC date selection and rotation preserve the November 18 epoch', () => {
  assert.equal(DAILY_START_UTC, '2026-11-18');
  const first = selectDailyPuzzle(new Date('2026-11-18T00:00:00.000Z'));
  assert.equal(first.number, 1);
  assert.equal(first.dateKey, '2026-11-18');
  assert.deepEqual(first.start, dailyPuzzles[0]?.start);
  assert.deepEqual(first.chute, dailyPuzzles[0]?.chute);
  assert.equal(selectDailyPuzzle(new Date('2026-11-18T23:59:59.999Z')).number, 1);
  assert.equal(selectDailyPuzzle(new Date('2026-11-19T00:00:00.000Z')).number, 2);
  assert.equal(selectDailyPuzzle(new Date('2026-11-18T01:00:00+01:00')).number, 1);
  assert.throws(() => selectDailyPuzzle(new Date('2026-11-17T23:59:59.999Z')), RangeError);
  for (let day = 0; day < dailyPuzzles.length * 2; day++) {
    const selected = selectDailyPuzzle(new Date(Date.UTC(2026, 10, 18 + day)));
    assert.equal(selected.number, day + 1);
    assert.deepEqual({ start: selected.start, chute: selected.chute }, dailyPuzzles[day % dailyPuzzles.length]);
  }
});
