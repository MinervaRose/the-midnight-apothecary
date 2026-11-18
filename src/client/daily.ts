import { dailyPuzzles } from './daily-puzzles.ts';

// Daily puzzle 1 starts at 00:00 UTC on November 18, 2026.
export const DAILY_START_UTC = '2026-11-18';
const dayMilliseconds = 24 * 60 * 60 * 1000;
const startMilliseconds = Date.parse(`${DAILY_START_UTC}T00:00:00.000Z`);

export const selectDailyPuzzle = (now: Date) => {
  const utcDay = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate());
  if (Number.isNaN(utcDay) || utcDay < startMilliseconds) {
    throw new RangeError('Daily puzzle date must be on or after the fixed start date');
  }
  const dayIndex = Math.floor((utcDay - startMilliseconds) / dayMilliseconds);
  const puzzle = dailyPuzzles[dayIndex % dailyPuzzles.length];
  if (!puzzle) throw new Error('Daily puzzle collection is empty');
  return {
    number: dayIndex + 1,
    date: new Date(utcDay).toLocaleDateString('en-US', {
      timeZone: 'UTC',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }),
    dateKey: new Date(utcDay).toISOString().slice(0, 10),
    start: puzzle,
  };
};
