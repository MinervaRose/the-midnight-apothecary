# The Midnight Apothecary

**A Daily Spell Puzzle**

A daily deduction puzzle for Reddit, built with the Devvit React web template. A mischievous wizard raccoon needs help placing five magical ingredients in five numbered jars.

## How to play

Each ingredient belongs in exactly one jar. Read the spellbook's four or five clues, tap an ingredient and a jar in either order, and press **CAST THE SPELL!**. Selecting an ingredient already in a jar moves it; placing one in an occupied jar returns the displaced ingredient to the tray. **Reset** clears the jars. An incorrect spell keeps your arrangement in place so you can revise it. Progressive hints give reasoning guidance without revealing the answer.

The ingredients are Mandrake, Eye of Newt, Phoenix Feather, Bullfrog, and Carnivorous Plant. The Moon Crystal is a collectible reward, not a puzzle ingredient.

## Daily puzzles

Spell 1 begins at **00:00 UTC on November 18, 2026** and uses the introductory clues in the work order. The displayed spell number increases each UTC day. The 30 curated spells repeat in a fixed cycle, so everyone receives the same challenge on the same UTC date. An open game updates at UTC midnight or when its tab becomes visible again. There is no randomness in puzzle selection.

The pure clue engine in `src/shared/apothecary.ts` evaluates each clue against all **120** possible ingredient orders. Tests require exactly one solution for every published spell, distinct solutions, and no redundant clues. All 30 spells have different mixes of clue kinds. The first five have a middle or end clue as a gentle starting point. `tools/generate-apothecary.mjs` records the deterministic curation process. The server checks submitted arrangements against today's clues; solution orders are not rendered in the interface.

## Streaks and treasure

A signed-in Reddit player earns one Moon Crystal for each UTC day's first successful spell. Consecutive days increase the current streak. A missed day resets the current streak, while the longest streak, completed dates, and unlocked treasures remain. The **Apprentice Star** unlocks at a 3-day streak and the **Enchanted Familiar Charm** at 7 days. Open **Treasure Cabinet** beside the daily puzzle date to see progress and the next milestone. Hints and retries do not affect rewards.

The server uses the authenticated `context.userId` and installation-scoped Redis. It verifies the submitted arrangement and date, then updates a per-player progress record with Redis `WATCH`/`MULTI`/`EXEC` so duplicate requests cannot award twice. If storage fails, the game identifies the local spell success but does not claim the reward was saved. Completed UTC dates persist independently of the 30-day puzzle rotation.

## Development

- `npm run dev`: run the Reddit playtest using the Devvit template
- `npm run test:unit`: test clue semantics, all daily solutions, placement controls, UTC rotation, streaks, duplicate requests, and storage errors
- `npm run test:types`: TypeScript project check
- `npm run lint`: ESLint
- `npm run build`: production client and server build

The existing `splash.html` inline entrypoint opens `game.html` in expanded mode. The React interface is in `src/client/game.tsx` and `src/client/splash.tsx`; gameplay logic is separate. Original storybook artwork is kept under `public/apothecary`. No new runtime dependencies were added.

The previous five-bin trash chute game remains recoverable from the `feature/trash-chute` Git branch.
