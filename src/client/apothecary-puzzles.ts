import type { Puzzle } from './apothecary.ts';

// Curated by tools/generate-apothecary.mjs. Every clue is necessary for a unique solution.
export const dailyPuzzles: readonly Puzzle[] = [
  {
    id: 'spell-01',
    clues: [
      { kind: 'middle', a: 'plant' },
      { kind: 'immediatelyLeft', a: 'newt', b: 'feather' },
      { kind: 'rightOf', a: 'frog', b: 'plant' },
      { kind: 'notNextTo', a: 'mandrake', b: 'plant' },
    ],
  },
  {
    id: 'spell-02',
    clues: [
      { 'kind': 'rightOf', 'a': 'plant', 'b': 'mandrake' },
      { 'kind': 'immediatelyLeft', 'a': 'mandrake', 'b': 'newt' },
      { 'kind': 'immediatelyLeft', 'a': 'plant', 'b': 'frog' },
      { 'kind': 'middle', 'a': 'feather' },
    ],
  },
  {
    id: 'spell-03',
    clues: [
      { 'kind': 'notNextTo', 'a': 'newt', 'b': 'feather' },
      { 'kind': 'oneBetween', 'a': 'feather', 'b': 'frog' },
      { 'kind': 'immediatelyLeft', 'a': 'newt', 'b': 'plant' },
      { 'kind': 'end', 'a': 'plant' },
    ],
  },
  {
    id: 'spell-04',
    clues: [
      { 'kind': 'oneBetween', 'a': 'feather', 'b': 'plant' },
      { 'kind': 'rightOf', 'a': 'newt', 'b': 'mandrake' },
      { 'kind': 'middle', 'a': 'mandrake' },
      { 'kind': 'rightOf', 'a': 'feather', 'b': 'mandrake' },
    ],
  },
  {
    id: 'spell-05',
    clues: [
      { 'kind': 'middle', 'a': 'newt' },
      { 'kind': 'rightOf', 'a': 'mandrake', 'b': 'frog' },
      { 'kind': 'immediatelyLeft', 'a': 'newt', 'b': 'mandrake' },
      { 'kind': 'rightOf', 'a': 'frog', 'b': 'plant' },
    ],
  },
  {
    id: 'spell-06',
    clues: [
      { 'kind': 'immediatelyLeft', 'a': 'newt', 'b': 'feather' },
      { 'kind': 'rightOf', 'a': 'plant', 'b': 'feather' },
      { 'kind': 'rightOf', 'a': 'newt', 'b': 'mandrake' },
      { 'kind': 'notNextTo', 'a': 'feather', 'b': 'plant' },
    ],
  },
  {
    id: 'spell-07',
    clues: [
      { 'kind': 'rightOf', 'a': 'plant', 'b': 'newt' },
      { 'kind': 'immediatelyLeft', 'a': 'plant', 'b': 'feather' },
      { 'kind': 'notNextTo', 'a': 'newt', 'b': 'plant' },
      { 'kind': 'immediatelyLeft', 'a': 'mandrake', 'b': 'frog' },
    ],
  },
  {
    id: 'spell-08',
    clues: [
      { 'kind': 'rightOf', 'a': 'plant', 'b': 'feather' },
      { 'kind': 'oneBetween', 'a': 'feather', 'b': 'plant' },
      { 'kind': 'notNextTo', 'a': 'newt', 'b': 'feather' },
      { 'kind': 'immediatelyLeft', 'a': 'mandrake', 'b': 'newt' },
    ],
  },
  {
    id: 'spell-09',
    clues: [
      { 'kind': 'immediatelyLeft', 'a': 'frog', 'b': 'plant' },
      { 'kind': 'oneBetween', 'a': 'newt', 'b': 'frog' },
      { 'kind': 'immediatelyLeft', 'a': 'feather', 'b': 'mandrake' },
      { 'kind': 'notNextTo', 'a': 'mandrake', 'b': 'frog' },
    ],
  },
  {
    id: 'spell-10',
    clues: [
      { 'kind': 'rightOf', 'a': 'frog', 'b': 'feather' },
      { 'kind': 'oneBetween', 'a': 'mandrake', 'b': 'plant' },
      { 'kind': 'immediatelyLeft', 'a': 'newt', 'b': 'frog' },
      { 'kind': 'rightOf', 'a': 'feather', 'b': 'plant' },
    ],
  },
  {
    id: 'spell-11',
    clues: [
      { 'kind': 'oneBetween', 'a': 'feather', 'b': 'frog' },
      { 'kind': 'immediatelyLeft', 'a': 'frog', 'b': 'plant' },
      { 'kind': 'notNextTo', 'a': 'mandrake', 'b': 'plant' },
      { 'kind': 'oneBetween', 'a': 'mandrake', 'b': 'frog' },
    ],
  },
  {
    id: 'spell-12',
    clues: [
      { 'kind': 'notNextTo', 'a': 'frog', 'b': 'plant' },
      { 'kind': 'oneBetween', 'a': 'mandrake', 'b': 'plant' },
      { 'kind': 'oneBetween', 'a': 'mandrake', 'b': 'newt' },
      { 'kind': 'rightOf', 'a': 'plant', 'b': 'frog' },
    ],
  },
  {
    id: 'spell-13',
    clues: [
      { 'kind': 'oneBetween', 'a': 'frog', 'b': 'plant' },
      { 'kind': 'rightOf', 'a': 'frog', 'b': 'plant' },
      { 'kind': 'oneBetween', 'a': 'feather', 'b': 'plant' },
      { 'kind': 'immediatelyLeft', 'a': 'plant', 'b': 'newt' },
    ],
  },
  {
    id: 'spell-14',
    clues: [
      { 'kind': 'rightOf', 'a': 'mandrake', 'b': 'plant' },
      { 'kind': 'oneBetween', 'a': 'feather', 'b': 'frog' },
      { 'kind': 'rightOf', 'a': 'plant', 'b': 'frog' },
      { 'kind': 'notNextTo', 'a': 'newt', 'b': 'feather' },
      { 'kind': 'rightOf', 'a': 'newt', 'b': 'frog' },
    ],
  },
  {
    id: 'spell-15',
    clues: [
      { 'kind': 'rightOf', 'a': 'mandrake', 'b': 'newt' },
      { 'kind': 'rightOf', 'a': 'feather', 'b': 'plant' },
      { 'kind': 'rightOf', 'a': 'frog', 'b': 'plant' },
      { 'kind': 'notNextTo', 'a': 'mandrake', 'b': 'feather' },
      { 'kind': 'immediatelyLeft', 'a': 'newt', 'b': 'frog' },
    ],
  },
  {
    id: 'spell-16',
    clues: [
      { 'kind': 'rightOf', 'a': 'feather', 'b': 'newt' },
      { 'kind': 'immediatelyLeft', 'a': 'mandrake', 'b': 'newt' },
      { 'kind': 'immediatelyLeft', 'a': 'plant', 'b': 'frog' },
      { 'kind': 'oneBetween', 'a': 'feather', 'b': 'plant' },
    ],
  },
  {
    id: 'spell-17',
    clues: [
      { 'kind': 'oneBetween', 'a': 'feather', 'b': 'frog' },
      { 'kind': 'rightOf', 'a': 'mandrake', 'b': 'newt' },
      { 'kind': 'notNextTo', 'a': 'mandrake', 'b': 'frog' },
      { 'kind': 'rightOf', 'a': 'feather', 'b': 'mandrake' },
    ],
  },
  {
    id: 'spell-18',
    clues: [
      { 'kind': 'notNextTo', 'a': 'mandrake', 'b': 'feather' },
      { 'kind': 'oneBetween', 'a': 'feather', 'b': 'frog' },
      { 'kind': 'immediatelyLeft', 'a': 'frog', 'b': 'mandrake' },
      { 'kind': 'notNextTo', 'a': 'newt', 'b': 'feather' },
    ],
  },
  {
    id: 'spell-19',
    clues: [
      { 'kind': 'oneBetween', 'a': 'feather', 'b': 'frog' },
      { 'kind': 'notNextTo', 'a': 'mandrake', 'b': 'frog' },
      { 'kind': 'rightOf', 'a': 'mandrake', 'b': 'feather' },
      { 'kind': 'rightOf', 'a': 'feather', 'b': 'newt' },
      { 'kind': 'immediatelyLeft', 'a': 'plant', 'b': 'frog' },
    ],
  },
  {
    id: 'spell-20',
    clues: [
      { 'kind': 'middle', 'a': 'mandrake' },
      { 'kind': 'immediatelyLeft', 'a': 'frog', 'b': 'feather' },
      { 'kind': 'oneBetween', 'a': 'mandrake', 'b': 'plant' },
      { 'kind': 'rightOf', 'a': 'plant', 'b': 'feather' },
    ],
  },
  {
    id: 'spell-21',
    clues: [
      { 'kind': 'rightOf', 'a': 'feather', 'b': 'frog' },
      { 'kind': 'oneBetween', 'a': 'frog', 'b': 'plant' },
      { 'kind': 'notNextTo', 'a': 'mandrake', 'b': 'plant' },
      { 'kind': 'rightOf', 'a': 'plant', 'b': 'mandrake' },
      { 'kind': 'notNextTo', 'a': 'mandrake', 'b': 'frog' },
    ],
  },
  {
    id: 'spell-22',
    clues: [
      { 'kind': 'rightOf', 'a': 'feather', 'b': 'newt' },
      { 'kind': 'oneBetween', 'a': 'newt', 'b': 'plant' },
      { 'kind': 'notNextTo', 'a': 'feather', 'b': 'plant' },
      { 'kind': 'notNextTo', 'a': 'newt', 'b': 'frog' },
      { 'kind': 'notNextTo', 'a': 'newt', 'b': 'feather' },
    ],
  },
  {
    id: 'spell-23',
    clues: [
      { 'kind': 'immediatelyLeft', 'a': 'plant', 'b': 'mandrake' },
      { 'kind': 'rightOf', 'a': 'plant', 'b': 'feather' },
      { 'kind': 'immediatelyLeft', 'a': 'newt', 'b': 'plant' },
      { 'kind': 'rightOf', 'a': 'frog', 'b': 'feather' },
      { 'kind': 'notNextTo', 'a': 'mandrake', 'b': 'frog' },
    ],
  },
  {
    id: 'spell-24',
    clues: [
      { 'kind': 'immediatelyLeft', 'a': 'feather', 'b': 'mandrake' },
      { 'kind': 'oneBetween', 'a': 'mandrake', 'b': 'plant' },
      { 'kind': 'notNextTo', 'a': 'newt', 'b': 'frog' },
      { 'kind': 'immediatelyLeft', 'a': 'newt', 'b': 'plant' },
      { 'kind': 'rightOf', 'a': 'feather', 'b': 'plant' },
    ],
  },
  {
    id: 'spell-25',
    clues: [
      { 'kind': 'rightOf', 'a': 'mandrake', 'b': 'frog' },
      { 'kind': 'notNextTo', 'a': 'frog', 'b': 'plant' },
      { 'kind': 'rightOf', 'a': 'newt', 'b': 'feather' },
      { 'kind': 'oneBetween', 'a': 'feather', 'b': 'plant' },
      { 'kind': 'oneBetween', 'a': 'mandrake', 'b': 'frog' },
    ],
  },
  {
    id: 'spell-26',
    clues: [
      { 'kind': 'rightOf', 'a': 'newt', 'b': 'feather' },
      { 'kind': 'oneBetween', 'a': 'feather', 'b': 'frog' },
      { 'kind': 'immediatelyLeft', 'a': 'mandrake', 'b': 'feather' },
      { 'kind': 'rightOf', 'a': 'newt', 'b': 'plant' },
      { 'kind': 'immediatelyLeft', 'a': 'newt', 'b': 'frog' },
    ],
  },
  {
    id: 'spell-27',
    clues: [
      { 'kind': 'oneBetween', 'a': 'newt', 'b': 'plant' },
      { 'kind': 'immediatelyLeft', 'a': 'feather', 'b': 'newt' },
      { 'kind': 'rightOf', 'a': 'plant', 'b': 'mandrake' },
      { 'kind': 'notNextTo', 'a': 'feather', 'b': 'plant' },
      { 'kind': 'oneBetween', 'a': 'feather', 'b': 'frog' },
    ],
  },
  {
    id: 'spell-28',
    clues: [
      { 'kind': 'rightOf', 'a': 'frog', 'b': 'plant' },
      { 'kind': 'notNextTo', 'a': 'feather', 'b': 'frog' },
      { 'kind': 'immediatelyLeft', 'a': 'newt', 'b': 'mandrake' },
      { 'kind': 'immediatelyLeft', 'a': 'frog', 'b': 'newt' },
      { 'kind': 'notNextTo', 'a': 'mandrake', 'b': 'feather' },
    ],
  },
  {
    id: 'spell-29',
    clues: [
      { 'kind': 'notNextTo', 'a': 'newt', 'b': 'frog' },
      { 'kind': 'oneBetween', 'a': 'feather', 'b': 'frog' },
      { 'kind': 'notNextTo', 'a': 'feather', 'b': 'plant' },
      { 'kind': 'rightOf', 'a': 'newt', 'b': 'mandrake' },
      { 'kind': 'immediatelyLeft', 'a': 'plant', 'b': 'frog' },
    ],
  },
  {
    id: 'spell-30',
    clues: [
      { 'kind': 'rightOf', 'a': 'newt', 'b': 'frog' },
      { 'kind': 'end', 'a': 'feather' },
      { 'kind': 'immediatelyLeft', 'a': 'mandrake', 'b': 'feather' },
      { 'kind': 'immediatelyLeft', 'a': 'plant', 'b': 'mandrake' },
    ],
  },
];
