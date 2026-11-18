import { Hono } from 'hono';
import { context, redis, reddit } from '@devvit/web/server';
import type {
  DecrementResponse,
  IncrementResponse,
  InitResponse,
} from '../../shared/api';
import { selectDailyPuzzle } from '../../shared/daily';
import {
  completePlayerDaily,
  getPlayerProgress,
  verifyDailySpell,
} from '../core/daily-progress';

type ErrorResponse = {
  status: 'error';
  message: string;
};

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

api.get('/init', async (c) => {
  const { postId } = context;

  if (!postId) {
    console.error('API Init Error: postId not found in devvit context');
    return c.json<ErrorResponse>(
      {
        status: 'error',
        message: 'postId is required but missing from context',
      },
      400
    );
  }

  try {
    const [count, username] = await Promise.all([
      redis.get('count'),
      reddit.getCurrentUsername(),
    ]);

    return c.json<InitResponse>({
      type: 'init',
      postId: postId,
      count: count ? parseInt(count) : 0,
      username: username ?? 'anonymous',
    });
  } catch (error) {
    console.error(`API Init Error for post ${postId}:`, error);
    let errorMessage = 'Unknown error during initialization';
    if (error instanceof Error) {
      errorMessage = `Initialization failed: ${error.message}`;
    }
    return c.json<ErrorResponse>(
      { status: 'error', message: errorMessage },
      400
    );
  }
});

api.post('/increment', async (c) => {
  const { postId } = context;
  if (!postId) {
    return c.json<ErrorResponse>(
      {
        status: 'error',
        message: 'postId is required',
      },
      400
    );
  }

  const count = await redis.incrBy('count', 1);
  return c.json<IncrementResponse>({
    count,
    postId,
    type: 'increment',
  });
});

api.post('/decrement', async (c) => {
  const { postId } = context;
  if (!postId) {
    return c.json<ErrorResponse>(
      {
        status: 'error',
        message: 'postId is required',
      },
      400
    );
  }

  const count = await redis.incrBy('count', -1);
  return c.json<DecrementResponse>({
    count,
    postId,
    type: 'decrement',
  });
});
