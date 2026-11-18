import assert from 'node:assert/strict';
import test from 'node:test';
import {
  completeDate,
  emptyProgress,
  progressSnapshot,
} from '../src/shared/progress.ts';
import {
  completePlayerDaily,
  getPlayerProgress,
  verifyDailySpell,
} from '../src/server/core/daily-progress.ts';
import type { ProgressStore } from '../src/server/core/daily-progress.ts';
import { selectDailyPuzzle } from '../src/shared/daily.ts';
import { solvePuzzle } from '../src/shared/apothecary.ts';

const date = (day: number): string =>
  new Date(Date.UTC(2026, 10, 18 + day)).toISOString().slice(0, 10);

class MemoryStore implements ProgressStore {
  values = new Map<string, string>();
  versions = new Map<string, number>();
  fail = false;
  execMode: 'normal' | 'empty' | 'malformed' | 'throw' = 'normal';
  conflicts = 0;
  async get(key: string) {
    if (this.fail) throw new Error('Redis unavailable');
    return this.values.get(key);
  }
  async watch(key: string) {
    if (this.fail) throw new Error('Redis unavailable');
    const version = this.versions.get(key) ?? 0;
    let pending: string | undefined;
    return {
      async multi() {},
      async set(_key: string, value: string) {
        pending = value;
      },
      exec: async () => {
        if (this.execMode === 'throw') throw new Error('Redis EXEC failed');
        if (this.execMode === 'empty') return [];
        if (this.execMode === 'malformed') return [null];
        if (
          this.versions.get(key) !== undefined &&
          this.versions.get(key) !== version
        ) {
          this.conflicts += 1;
          return [];
        }
        if (pending === undefined) throw new Error('No write');
        this.values.set(key, pending);
        this.versions.set(key, version + 1);
        return ['OK'];
      },
      async unwatch() {},
      async discard() {},
    };
  }
}

test('first completion, same-day retry, and UTC consecutive streaks', () => {
  const first = completeDate(emptyProgress(), date(0));
  assert.deepEqual(first.newlyUnlocked, ['moon-crystal']);
  assert.equal(first.progress.completedDates.length, 1);
  assert.equal(completeDate(first.progress, date(0)).newlyCompleted, false);
  let progress = first.progress;
  for (let day = 1; day < 7; day += 1) {
    const result = completeDate(progress, date(day));
    progress = result.progress;
    if (day === 2) assert.deepEqual(result.newlyUnlocked, ['apprentice-star']);
    if (day === 6) assert.deepEqual(result.newlyUnlocked, ['familiar-charm']);
  }
  const snapshot = progressSnapshot(progress, date(6));
  assert.equal(snapshot.currentStreak, 7);
  assert.equal(snapshot.longestStreak, 7);
  assert.equal(snapshot.moonCrystals, 7);
  assert.equal(snapshot.totalCompleted, 7);
  assert.equal(snapshot.nextReward, null);
  assert.equal(progressSnapshot(progress, date(7)).currentStreak, 7);
  assert.equal(progressSnapshot(progress, date(8)).currentStreak, 0);
  const afterGap = completeDate(progress, date(8)).progress;
  assert.equal(progressSnapshot(afterGap, date(8)).currentStreak, 1);
  assert.equal(afterGap.longestStreak, 7);
  assert.deepEqual(afterGap.unlockedRewards, progress.unlockedRewards);
});

test("server verifies today's unique arrangement and rejects stale or invalid submissions", () => {
  const now = new Date('2026-12-18T00:00:00.000Z');
  const daily = selectDailyPuzzle(now);
  const solution = solvePuzzle(daily.puzzle.clues)[0];
  assert.ok(solution);
  assert.equal(daily.number, 31);
  assert.equal(
    verifyDailySpell({ dateKey: daily.dateKey, placement: solution }, now)
      .valid,
    true
  );
  assert.equal(
    verifyDailySpell({ dateKey: date(0), placement: solution }, now).stale,
    true
  );
  assert.equal(
    verifyDailySpell(
      { dateKey: daily.dateKey, placement: Array(5).fill('frog') },
      now
    ).valid,
    false
  );
  assert.equal(
    verifyDailySpell(
      { dateKey: daily.dateKey, placement: [...solution].reverse() },
      now
    ).valid,
    false
  );
});

test('atomic duplicate and concurrent requests award once, with users isolated', async () => {
  const store = new MemoryStore();
  const results = await Promise.all(
    Array.from({ length: 8 }, () =>
      completePlayerDaily(store, 'user-a', date(0))
    )
  );
  assert.equal(results.filter((result) => result.newlyCompleted).length, 1);
  assert.ok(store.conflicts > 0, 'the test must exercise a WATCH conflict');
  assert.equal(
    (await getPlayerProgress(store, 'user-a', date(0))).moonCrystals,
    1
  );
  assert.equal(
    (await getPlayerProgress(store, 'user-b', date(0))).moonCrystals,
    0
  );
  const other = await completePlayerDaily(store, 'user-b', date(0));
  assert.equal(other.progress.moonCrystals, 1);
  assert.equal(
    (await getPlayerProgress(store, 'user-a', date(0))).moonCrystals,
    1
  );
});

test('completed dates and crystals continue past the 30-day puzzle rotation', () => {
  let progress = emptyProgress();
  for (let day = 0; day <= 30; day += 1) {
    progress = completeDate(progress, date(day)).progress;
  }
  assert.equal(
    selectDailyPuzzle(new Date(`${date(30)}T12:00:00Z`)).puzzle.id,
    selectDailyPuzzle(new Date(`${date(0)}T12:00:00Z`)).puzzle.id
  );
  assert.equal(progressSnapshot(progress, date(30)).moonCrystals, 31);
  assert.equal(progress.completedDates.length, 31);
});

test('storage failures never report saved completion', async () => {
  const store = new MemoryStore();
  store.fail = true;
  await assert.rejects(completePlayerDaily(store, 'user-a', date(0)));
  await assert.rejects(getPlayerProgress(store, 'user-a', date(0)));
  assert.equal(store.values.size, 0);
});

test('empty, malformed, and failed EXEC responses never report a saved reward', async () => {
  for (const mode of ['empty', 'malformed', 'throw'] as const) {
    const store = new MemoryStore();
    store.execMode = mode;
    await assert.rejects(completePlayerDaily(store, 'user-a', date(0)));
    assert.equal(
      (await getPlayerProgress(store, 'user-a', date(0))).moonCrystals,
      0
    );
  }
});
