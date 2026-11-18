import assert from 'node:assert/strict';
import test from 'node:test';
import {
  allArrangements,
  emptyPlacement,
  formatClue,
  ingredients,
  isComplete,
  isWinningPlacement,
  matchesClue,
  placeIngredient,
  solvePuzzle,
} from '../src/client/apothecary.ts';
import type { Clue, Placement } from '../src/client/apothecary.ts';
import { dailyPuzzles } from '../src/client/apothecary-puzzles.ts';
import { DAILY_START_UTC, selectDailyPuzzle } from '../src/client/daily.ts';

test('all 120 ingredient permutations are distinct and complete', () => {
  const orders = allArrangements();
  assert.equal(orders.length, 120);
  assert.equal(new Set(orders.map((order) => order.join(','))).size, 120);
  for (const order of orders)
    assert.deepEqual([...order].sort(), [...ingredients].sort());
});

test('each clue relationship has the intended meaning', () => {
  const order = ['newt', 'feather', 'plant', 'frog', 'mandrake'] as const;
  const trueClues: Clue[] = [
    { kind: 'immediatelyLeft', a: 'newt', b: 'feather' },
    { kind: 'rightOf', a: 'frog', b: 'plant' },
    { kind: 'notNextTo', a: 'mandrake', b: 'plant' },
    { kind: 'middle', a: 'plant' },
    { kind: 'end', a: 'mandrake' },
    { kind: 'oneBetween', a: 'newt', b: 'plant' },
  ];
  for (const clue of trueClues) {
    assert.equal(matchesClue(order, clue), true);
    assert.ok(formatClue(clue).endsWith('.'));
  }
  assert.equal(
    matchesClue(order, { kind: 'immediatelyLeft', a: 'feather', b: 'newt' }),
    false
  );
  assert.equal(
    matchesClue(order, { kind: 'notNextTo', a: 'newt', b: 'feather' }),
    false
  );
  assert.equal(
    matchesClue(order, { kind: 'oneBetween', a: 'plant', b: 'frog' }),
    false
  );
});

test('the reference spell has the exact stated solution', () => {
  assert.deepEqual(solvePuzzle(dailyPuzzles[0]!.clues), [
    ['newt', 'feather', 'plant', 'frog', 'mandrake'],
  ]);
});

test('all 30 published spells are unique, necessary, and varied', () => {
  assert.equal(dailyPuzzles.length, 30);
  const ids = new Set<string>();
  const solutions = new Set<string>();
  const signatures = new Set<string>();
  for (const puzzle of dailyPuzzles) {
    assert.equal(ids.has(puzzle.id), false, `duplicate id: ${puzzle.id}`);
    ids.add(puzzle.id);
    assert.ok(puzzle.clues.length >= 4 && puzzle.clues.length <= 5);
    assert.ok(
      puzzle.clues.filter(
        (clue) => clue.kind === 'middle' || clue.kind === 'end'
      ).length <= 1
    );
    const wins = solvePuzzle(puzzle.clues);
    assert.equal(wins.length, 1, `${puzzle.id} must have one solution`);
    const key = wins[0]!.join(',');
    assert.equal(
      solutions.has(key),
      false,
      `duplicate arrangement: ${puzzle.id}`
    );
    solutions.add(key);
    signatures.add(
      puzzle.clues
        .map((clue) => clue.kind)
        .sort()
        .join(',')
    );
    puzzle.clues.forEach((_, index) => {
      assert.ok(
        solvePuzzle(puzzle.clues.filter((__, i) => i !== index)).length > 1,
        `${puzzle.id} has redundant clue ${index + 1}`
      );
    });
  }
  assert.equal(
    signatures.size,
    30,
    'each daily spell uses a distinct mix of clue kinds'
  );
  assert.ok(
    dailyPuzzles
      .slice(0, 5)
      .every((puzzle) =>
        puzzle.clues.some(
          (clue) => clue.kind === 'middle' || clue.kind === 'end'
        )
      )
  );
  const mandrakePositions = [0, 0, 0, 0, 0];
  for (const puzzle of dailyPuzzles)
    mandrakePositions[solvePuzzle(puzzle.clues)[0]!.indexOf('mandrake')]!++;
  assert.deepEqual(mandrakePositions, [6, 6, 6, 6, 6]);
});

test('placement moves ingredients without duplicates and preserves other jars', () => {
  let board: Placement = emptyPlacement();
  board = placeIngredient(board, 'newt', 0);
  board = placeIngredient(board, 'frog', 1);
  board = placeIngredient(board, 'newt', 1);
  assert.deepEqual(board, [null, 'newt', null, null, null]);
  board = placeIngredient(board, 'feather', 0);
  board = placeIngredient(board, 'plant', 2);
  board = placeIngredient(board, 'frog', 3);
  board = placeIngredient(board, 'mandrake', 4);
  assert.equal(isComplete(board), true);
  assert.equal(isWinningPlacement(board, dailyPuzzles[0]!), false);
  board = placeIngredient(board, 'newt', 0);
  board = placeIngredient(board, 'feather', 1);
  assert.equal(isWinningPlacement(board, dailyPuzzles[0]!), true);
  assert.equal(
    isWinningPlacement(
      [null, 'feather', 'plant', 'frog', 'mandrake'],
      dailyPuzzles[0]!
    ),
    false
  );
  assert.equal(
    isWinningPlacement(
      ['feather', 'newt', 'plant', 'frog', 'mandrake'],
      dailyPuzzles[0]!
    ),
    false
  );
  assert.deepEqual(placeIngredient(board, 'newt', 9), board);
});

test('UTC date selection and rotation keep the November 18 epoch', () => {
  assert.equal(DAILY_START_UTC, '2026-11-18');
  const first = selectDailyPuzzle(new Date('2026-11-18T00:00:00.000Z'));
  assert.equal(first.number, 1);
  assert.equal(first.dateKey, '2026-11-18');
  assert.deepEqual(first.puzzle, dailyPuzzles[0]);
  assert.equal(
    selectDailyPuzzle(new Date('2026-11-18T23:59:59.999Z')).number,
    1
  );
  assert.equal(
    selectDailyPuzzle(new Date('2026-11-19T00:00:00.000Z')).number,
    2
  );
  assert.equal(
    selectDailyPuzzle(new Date('2026-11-18T01:00:00+01:00')).number,
    1
  );
  assert.throws(
    () => selectDailyPuzzle(new Date('2026-11-17T23:59:59.999Z')),
    RangeError
  );
  for (let day = 0; day < dailyPuzzles.length * 2; day++) {
    const selected = selectDailyPuzzle(new Date(Date.UTC(2026, 10, 18 + day)));
    assert.equal(selected.number, day + 1);
    assert.deepEqual(selected.puzzle, dailyPuzzles[day % dailyPuzzles.length]);
  }
});
