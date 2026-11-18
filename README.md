# Release the Raccoon!

A daily five-bin, two-lap logic puzzle for Reddit, built with the Devvit React template.

## How to play

Five labeled bins start with one object each, and the raccoon carries the sixth. Tap a lid to leave it **open** or **closed**. Press **RELEASE THE RACCOON!** to watch the raccoon visit bins 1–5. At each open bin it trades its carried object with the contents; it skips closed bins.

After the first lap, the visible **trash chute** automatically exchanges the contents of its two connected bins, whether their lids are open or closed. The raccoon then visits bins 1–5 again with the **same** lid settings. Win by sorting all five bins and leaving the raccoon holding the gem. The chute activates once per attempt. Use **Reset lids** to restore the starting board, or change lids and retry after a result. Hints explain the rules without revealing the solution.

## Daily rotation and puzzle validation

Puzzle 1 begins on **2026-11-18 at 00:00 UTC**. The daily number increases at each UTC midnight, and the starting arrangement and fixed chute connection cycle through 30 curated puzzles. All players receive the same puzzle on the same UTC date. An open game switches at UTC midnight or when a sleeping tab becomes visible again. There is no randomness or server-side account state.

The exhaustive validation test evaluates **720** six-object arrangements, **32** lid configurations and **10** chute pairs: 230,400 simulations. There are 216 unsolved arrangement/pair combinations with exactly one winning lid pattern. Of those, 180 defeat the old shortcut of opening every initially incorrect bin. The curated 30 all defeat that shortcut. Twenty-nine begin with 3–5 misplaced bins; one introductory exception has one misplaced bin and requires opening an initially correct bin. The set covers all ten chute connections, 26 distinct winning lid patterns and 30 distinct starting arrangements. We classify starting layouts only by the reproducible misplaced-bin count; we do not claim that count measures human difficulty. Under the current rules, the 20 qualifying puzzles requiring an initially correct bin to be opened all have one initially misplaced bin. Every curated puzzle also requires leaving at least one initially incorrect bin closed.

## Development checks

- `npm run test:unit`: exhaustive puzzle validation, independent simulation checks, and UTC rotation tests
- `npm run test:types`: TypeScript project check
- `npm run lint`: ESLint
- `npm run build`: Devvit client and server production build
- `npm run dev`: Reddit playtest

The game uses the existing `splash.html` inline entrypoint and `game.html` expanded entrypoint. The pure simulation is in `src/client/puzzle.ts`, separate from the React interface. No new dependencies are required.
