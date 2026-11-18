import { Hono } from 'hono';
import { context, redis } from '@devvit/web/server';
import { selectDailyPuzzle } from '../../shared/daily';
import {
  completePlayerDaily,
  getPlayerProgress,
  verifyDailySpell,
} from '../core/daily-progress';

export const api = new Hono();

api.get('/progress', async (c) => {
  const userId = context.userId;
  if (!userId) return c.json({ error: 'Sign in to save daily rewards.' }, 401);
  try {
    const today = selectDailyPuzzle(new Date()).dateKey;
    return c.json({ progress: await getPlayerProgress(redis, userId, today) });
  } catch (error) {
    console.error('Progress read failed:', error);
    return c.json(
      { error: 'Treasure Cabinet is temporarily unavailable.' },
      503
    );
  }
});

api.post('/progress/complete', async (c) => {
  const userId = context.userId;
  if (!userId) return c.json({ error: 'Sign in to save daily rewards.' }, 401);
  let body: unknown;
  try {
    body = await c.req.json<unknown>();
  } catch {
    return c.json({ error: 'Invalid spell submission.' }, 400);
  }
  const verified = verifyDailySpell(body, new Date());
  if (verified.stale)
    return c.json(
      { error: 'A new UTC spell has begun. Reload the puzzle.' },
      409
    );
  if (!verified.valid)
    return c.json({ error: 'The spell does not match today’s clues.' }, 422);
  try {
    return c.json(await completePlayerDaily(redis, userId, verified.today));
  } catch (error) {
    console.error('Progress save failed:', error);
    return c.json(
      {
        error:
          'Your spell worked, but the reward could not be saved. Please try again.',
      },
      503
    );
  }
});
