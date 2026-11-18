import assert from 'node:assert/strict';
import test from 'node:test';
import { activateChute, correctCount, initialState, isSolved, simulate, visitBin } from '../src/client/puzzle.ts';
import type { PuzzleState } from '../src/client/puzzle.ts';

test('five destinations and the original open-lid swap remain intact', () => {
  const start = initialState();
  assert.deepEqual(start.bins, ['jar', 'paper', 'gem', 'can', 'bottle']);
  assert.equal(correctCount(start), 2);
  assert.deepEqual(visitBin(start, 0, false), start);
  assert.deepEqual(visitBin(start, 0, true), { bins: ['peel', 'paper', 'gem', 'can', 'bottle'], paw: 'jar' });
  assert.deepEqual(start, initialState());
});

test('chute swaps only its connected bins and never touches the carried object', () => {
  const start = initialState();
  assert.deepEqual(activateChute(start, [0, 3]), {
    bins: ['can', 'paper', 'gem', 'jar', 'bottle'], paw: 'peel',
  });
  assert.deepEqual(start, initialState());
  assert.throws(() => activateChute(start, [2, 2]), RangeError);
});

test('the chute fires once between the two complete laps, even with closed lids', () => {
  const start = initialState();
  const actual = simulate([false, false, false, false, false], start, [0, 3]);
  assert.deepEqual(actual.visits.map(({ lap, bin }) => [lap, bin]), [
    [1, 0], [1, 1], [1, 2], [1, 3], [1, 4],
    [2, 0], [2, 1], [2, 2], [2, 3], [2, 4],
  ]);
  assert.deepEqual(actual.afterLapOne, start);
  assert.deepEqual(actual.afterChute, activateChute(start, [0, 3]));
  assert.deepEqual(actual.visits[5]?.state, actual.afterChute);
  assert.deepEqual(actual.result, actual.afterChute);
  assert.equal(isSolved(actual.result), false);
});

test('a winning run returns the final five bins and gem in the raccoon’s paws', () => {
  const start: PuzzleState = { bins: ['gem', 'peel', 'can', 'jar', 'bottle'], paw: 'paper' };
  const result = simulate([true, false, true, false, false], start, [0, 1]).result;
  assert.deepEqual(result, { bins: ['can', 'paper', 'peel', 'jar', 'bottle'], paw: 'gem' });
  assert.equal(isSolved(result), true);
});
