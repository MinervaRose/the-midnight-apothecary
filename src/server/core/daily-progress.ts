import { ingredients, isWinningPlacement } from '../../shared/apothecary.ts';
import { selectDailyPuzzle } from '../../shared/daily.ts';
import {
  completeDate,
  parseProgress,
  progressSnapshot,
} from '../../shared/progress.ts';
import type { Ingredient } from '../../shared/apothecary.ts';
import type { ProgressSnapshot, RewardId } from '../../shared/progress.ts';

type Transaction = {
  multi(): Promise<void>;
  set(key: string, value: string): Promise<unknown>;
  exec(): Promise<unknown[] | null>;
  unwatch(): Promise<unknown>;
  discard(): Promise<void>;
};
export type ProgressStore = {
  get(key: string): Promise<string | null | undefined>;
  watch(key: string): Promise<Transaction>;
};
export type CompletionResponse = {
  progress: ProgressSnapshot;
  newlyCompleted: boolean;
  newlyUnlocked: RewardId[];
};

const keyFor = (userId: string): string => `apothecary:progress:v1:${userId}`;

export const isSubmittedPlacement = (value: unknown): value is Ingredient[] =>
  Array.isArray(value) &&
  value.length === ingredients.length &&
  value.every((item: unknown) =>
    ingredients.some((ingredient) => ingredient === item)
  ) &&
  new Set(value).size === ingredients.length;

export const verifyDailySpell = (
  value: unknown,
  now: Date
): { valid: boolean; stale: boolean; today: string } => {
  const daily = selectDailyPuzzle(now);
  if (
    typeof value !== 'object' ||
    value === null ||
    !('dateKey' in value) ||
    !('placement' in value) ||
    typeof value.dateKey !== 'string' ||
    !isSubmittedPlacement(value.placement)
  ) {
    return { valid: false, stale: false, today: daily.dateKey };
  }
  if (value.dateKey !== daily.dateKey)
    return { valid: false, stale: true, today: daily.dateKey };
  return {
    valid: isWinningPlacement(value.placement, daily.puzzle),
    stale: false,
    today: daily.dateKey,
  };
};

export const getPlayerProgress = async (
  store: ProgressStore,
  userId: string,
  today: string
): Promise<ProgressSnapshot> =>
  progressSnapshot(parseProgress(await store.get(keyFor(userId))), today);

export const completePlayerDaily = async (
  store: ProgressStore,
  userId: string,
  today: string
): Promise<CompletionResponse> => {
  const key = keyFor(userId);
  for (let attempt = 0; attempt < 6; attempt += 1) {
    const txn = await store.watch(key);
    let inMulti = false;
    let closed = false;
    try {
      const current = parseProgress(await store.get(key));
      const completed = completeDate(current, today);
      if (!completed.newlyCompleted) {
        await txn.unwatch();
        closed = true;
        return {
          progress: progressSnapshot(current, today),
          newlyCompleted: false,
          newlyUnlocked: [],
        };
      }
      await txn.multi();
      inMulti = true;
      await txn.set(key, JSON.stringify(completed.progress));
      const committed = await txn.exec();
      closed = true;
      // The installed Devvit client decodes EXEC into an array. An aborted
      // watched transaction can have no command replies, never a saved SET.
      if (committed === null || committed.length === 0) continue;
      if (committed.length !== 1 || committed[0] !== 'OK') {
        throw new Error('Progress transaction did not confirm its SET');
      }
      return {
        progress: progressSnapshot(completed.progress, today),
        newlyCompleted: true,
        newlyUnlocked: completed.newlyUnlocked,
      };
    } finally {
      if (!closed) {
        if (inMulti) await txn.discard();
        else await txn.unwatch();
      }
    }
  }
  throw new Error('Progress update conflicted too many times');
};
