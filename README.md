# Release the Raccoon!

A daily five-bin, two-lap logic puzzle for Reddit, built with the Devvit React template.

## Daily rotation

Puzzle 1 begins on **2026-11-18 at 00:00 UTC**. The daily number increases by one at each UTC midnight; the starting arrangement cycles through the curated collection. Everyone viewing the same UTC date receives the same arrangement. The open game switches to the new puzzle at UTC midnight or when a sleeping tab becomes visible again.

The five destinations (metal, paper, compost, glass, and plastic), the gem, visit order, and two-lap swap rule allow **26** non-solved starting arrangements with exactly one winning lid pattern. The rotation contains all 26. The first 11 retain their earlier order, with the plastic bottle correctly placed in bin 5; the original sample remains puzzle 1. The exhaustive test checks all 720 six-object arrangements against all 32 lid patterns and rejects invalid or duplicate collection entries.

## Development checks

- `npm run test:unit`: puzzle validation, simulation, and UTC rotation tests
- `npm run test:types`: TypeScript project check
- `npm run lint`: ESLint
- `npm run build`: Devvit client and server build
- `npm run dev`: Reddit playtest

The game uses the existing `splash.html` inline entrypoint and `game.html` expanded entrypoint. No server-side state or account is needed for daily selection.
