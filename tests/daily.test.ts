import assert from 'node:assert/strict';
import test from 'node:test';
import { dailyPuzzles } from '../src/client/daily-puzzles.ts';
import { DAILY_START_UTC, selectDailyPuzzle } from '../src/client/daily.ts';
import { destinations, initialState, isSolved, simulate } from '../src/client/puzzle.ts';
import type { ObjectId, PuzzleState } from '../src/client/puzzle.ts';

const binCount = 5;
const patternCount = 1 << binCount;
const objectIds: readonly ObjectId[] = ['can', 'paper', 'peel', 'jar', 'bottle', 'gem'];
const lidsFor = (mask: number) => Array.from({ length: binCount }, (_, bin) => (mask & (1 << bin)) !== 0);
const key = (state: PuzzleState) => [...state.bins, state.paw].join(',');

const winningMasks = (start: PuzzleState) =>
  Array.from({ length: patternCount }, (_, mask) => mask).filter((mask) =>
    isSolved(simulate(lidsFor(mask), start).result));

const validatePuzzle = (start: PuzzleState): number => {
  assert.equal(start.bins.length, binCount);
  assert.deepEqual([...start.bins, start.paw].sort(), [...objectIds].sort());
  assert.equal(isSolved(start), false, 'puzzle must not begin solved');
  const wins = winningMasks(start);
  assert.equal(wins.length, 1, `expected one winning lid pattern for ${key(start)}; found ${wins.length}`);
  return wins[0] ?? -1;
};

const permutations = (items: readonly ObjectId[]): ObjectId[][] => {
  if (items.length === 0) return [[]];
  return items.flatMap((item) =>
    permutations(items.filter((other) => other !== item)).map((tail) => [item, ...tail]));
};

test('every curated puzzle is distinct, unsolved, and has exactly one winning pattern', () => {
  const stateKeys = new Set<string>();
  const winningPatterns = new Set<number>();
  for (const puzzle of dailyPuzzles) {
    const puzzleKey = key(puzzle);
    assert.equal(stateKeys.has(puzzleKey), false, `duplicate starting configuration: ${puzzleKey}`);
    stateKeys.add(puzzleKey);
    const winningPattern = validatePuzzle(puzzle);
    assert.equal(winningPatterns.has(winningPattern), false, `effectively identical winning pattern: ${winningPattern}`);
    winningPatterns.add(winningPattern);
  }
  assert.equal(dailyPuzzles.length, 26);
});

test('all 720 six-object arrangements and 32 lid patterns permit exactly these 26 puzzles', () => {
  assert.equal(destinations.length, binCount);
  assert.equal(patternCount, 32);
  const arrangements = permutations(objectIds);
  assert.equal(arrangements.length, 720);
  const valid = arrangements
    .map((permutation): PuzzleState => ({
      bins: permutation.slice(0, binCount),
      paw: permutation[binCount] ?? 'gem',
    }))
    .filter((start) => !isSolved(start) && winningMasks(start).length === 1)
    .map(key);
  assert.equal(valid.length, 26);
  assert.deepEqual(new Set(dailyPuzzles.map(key)), new Set(valid));
});

test('validator rejects a pre-solved ambiguous state and an impossible state', () => {
  const solved: PuzzleState = { bins: ['can', 'paper', 'peel', 'jar', 'bottle'], paw: 'gem' };
  assert.equal(winningMasks(solved).length, 6);
  assert.throws(() => validatePuzzle(solved));
  const impossible: PuzzleState = { bins: ['paper', 'can', 'peel', 'jar', 'bottle'], paw: 'gem' };
  assert.equal(winningMasks(impossible).length, 0);
  assert.throws(() => validatePuzzle(impossible));
});

test('simulation matches an independent swap loop for every puzzle and lid pattern', () => {
  for (const start of dailyPuzzles) {
    for (let mask = 0; mask < patternCount; mask++) {
      const bins = [...start.bins];
      let paw = start.paw;
      const expectedVisits: PuzzleState[] = [];
      for (let lap = 0; lap < 2; lap++) {
        for (let bin = 0; bin < binCount; bin++) {
          if (mask & (1 << bin)) {
            const previous = bins[bin];
            bins[bin] = paw;
            paw = previous ?? paw;
          }
          expectedVisits.push({ bins: [...bins], paw });
        }
      }
      const actual = simulate(lidsFor(mask), start);
      assert.deepEqual(actual.visits.map((visit) => visit.state), expectedVisits);
      assert.deepEqual(actual.result, { bins, paw });
    }
  }
});

test('UTC day boundaries select the same puzzle across local time zones', () => {
  assert.equal(DAILY_START_UTC, '2026-11-18');
  const first = selectDailyPuzzle(new Date('2026-11-18T00:00:00.000Z'));
  assert.equal(first.number, 1);
  assert.equal(first.dateKey, '2026-11-18');
  assert.deepEqual(first.start, initialState());
  assert.equal(selectDailyPuzzle(new Date('2026-11-18T23:59:59.999Z')).number, 1);
  assert.equal(selectDailyPuzzle(new Date('2026-11-19T00:00:00.000Z')).number, 2);
  assert.equal(selectDailyPuzzle(new Date('2026-11-18T01:00:00+01:00')).number, 1);
  assert.throws(() => selectDailyPuzzle(new Date('2026-11-17T23:59:59.999Z')), RangeError);
});

test('daily rotation advances through the collection and wraps after day 26', () => {
  for (let day = 0; day < dailyPuzzles.length * 2; day++) {
    const selected = selectDailyPuzzle(new Date(Date.UTC(2026, 10, 18 + day)));
    assert.equal(selected.number, day + 1);
    assert.deepEqual(selected.start, dailyPuzzles[day % dailyPuzzles.length]);
  }
  assert.deepEqual(
    selectDailyPuzzle(new Date(Date.UTC(2026, 10, 18 + dailyPuzzles.length))).start,
    dailyPuzzles[0],
  );
});
