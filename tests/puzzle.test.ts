import assert from 'node:assert/strict';
import test from 'node:test';
import { correctCount, initialState, isSolved, simulate, visitBin } from '../src/client/puzzle.ts';

test('expanded sample keeps its original four bins and adds sorted plastic', () => {
  const start = initialState();
  assert.deepEqual(start.bins, ['jar', 'paper', 'gem', 'can', 'bottle']);
  assert.equal(start.paw, 'peel');
  assert.equal(correctCount(start), 2);
});

test('open swaps the carried object, closed keeps both objects', () => {
  const start = initialState();
  assert.deepEqual(visitBin(start, 0, false), start);
  assert.deepEqual(visitBin(start, 0, true), {
    bins: ['peel', 'paper', 'gem', 'can', 'bottle'],
    paw: 'jar',
  });
  assert.deepEqual(start, initialState());
});

test('the same lid pattern is used for ten visits across two laps', () => {
  const { visits, result } = simulate([false, false, false, false, false]);
  assert.deepEqual(visits.map(({ lap, bin }) => [lap, bin]), [
    [1, 0], [1, 1], [1, 2], [1, 3], [1, 4],
    [2, 0], [2, 1], [2, 2], [2, 3], [2, 4],
  ]);
  assert.deepEqual(result, initialState());
  assert.equal(isSolved(result), false);
});

test('sample puzzle has a winning lid pattern', () => {
  const result = simulate([true, false, true, true, false]).result;
  assert.deepEqual(result, { bins: ['can', 'paper', 'peel', 'jar', 'bottle'], paw: 'gem' });
  assert.equal(isSolved(result), true);
});

