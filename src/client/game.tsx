import './index.css';
import { StrictMode, useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { selectDailyPuzzle } from './daily';
import {
  emptyPlacement,
  formatClue,
  ingredientInfo,
  ingredients,
  isComplete,
  isWinningPlacement,
  placeIngredient,
} from './apothecary';
import type { Ingredient, Placement, Puzzle } from './apothecary';

type SpellResult = 'idle' | 'success' | 'mishap';

const hintFor = (puzzle: Puzzle, level: number): string => {
  if (level === 1) {
    const anchor = puzzle.clues.find(
      (clue) => clue.kind === 'middle' || clue.kind === 'end'
    );
    return anchor
      ? `Begin with the clue about ${ingredientInfo[anchor.a].name}. What positions does it allow?`
      : 'Look for a pair that must stay together, or a pair with one jar between them. Treat that pair as a single piece.';
  }
  if (level === 2)
    return 'Combine two clues about the same ingredient. Each possible position rules out places for the others.';
  return 'Try one possible position for a constrained ingredient. If it makes another clue impossible, cross that position out.';
};

export const App = () => {
  const [daily, setDaily] = useState(() => selectDailyPuzzle(new Date()));
  const [placement, setPlacement] = useState<Placement>(emptyPlacement);
  const [selectedIngredient, setSelectedIngredient] =
    useState<Ingredient | null>(null);
  const [selectedJar, setSelectedJar] = useState<number | null>(null);
  const [attempts, setAttempts] = useState(0);
  const [result, setResult] = useState<SpellResult>('idle');
  const [hintLevel, setHintLevel] = useState(0);
  const [message, setMessage] = useState(
    'Choose an ingredient, then tap its jar.'
  );

  useEffect(() => {
    const rollOver = () => {
      const next = selectDailyPuzzle(new Date());
      if (next.dateKey === daily.dateKey) return;
      setDaily(next);
      setPlacement(emptyPlacement());
      setSelectedIngredient(null);
      setSelectedJar(null);
      setAttempts(0);
      setResult('idle');
      setHintLevel(0);
      setMessage('A new page of the spellbook has appeared.');
    };
    const now = new Date();
    const nextMidnight = Date.UTC(
      now.getUTCFullYear(),
      now.getUTCMonth(),
      now.getUTCDate() + 1
    );
    const timer = window.setTimeout(
      rollOver,
      nextMidnight - now.getTime() + 10
    );
    document.addEventListener('visibilitychange', rollOver);
    return () => {
      window.clearTimeout(timer);
      document.removeEventListener('visibilitychange', rollOver);
    };
  }, [daily.dateKey]);

  const put = (ingredient: Ingredient, jar: number) => {
    setPlacement((current) => placeIngredient(current, ingredient, jar));
    setSelectedIngredient(null);
    setSelectedJar(null);
    setResult('idle');
    setMessage(
      `${ingredientInfo[ingredient].name} floats into jar ${jar + 1}.`
    );
  };
  const chooseIngredient = (ingredient: Ingredient) => {
    if (selectedJar !== null) {
      put(ingredient, selectedJar);
      return;
    }
    setSelectedIngredient(ingredient);
    setResult('idle');
    setMessage(`Now tap the jar for ${ingredientInfo[ingredient].name}.`);
  };
  const chooseJar = (jar: number) => {
    if (selectedIngredient) {
      put(selectedIngredient, jar);
      return;
    }
    setSelectedJar(jar);
    setMessage(`Choose an ingredient for jar ${jar + 1}.`);
  };
  const reset = () => {
    setPlacement(emptyPlacement());
    setSelectedIngredient(null);
    setSelectedJar(null);
    setResult('idle');
    setMessage('Fresh jars, fresh spell. Take your time.');
  };
  const cast = () => {
    if (!isComplete(placement)) {
      setMessage('The spell needs all five ingredients first.');
      return;
    }
    setAttempts((count) => count + 1);
    if (isWinningPlacement(placement, daily.puzzle)) {
      setResult('success');
      setMessage(
        'Perfectly brewed! The moon crystal is yours, you clever little wizard.'
      );
    } else {
      setResult('mishap');
      setMessage(
        'POOF! A very stylish mistake. Your jars are still here—read the clues and try again.'
      );
    }
  };

  return (
    <main className={`apothecary ${result}`}>
      <div className="night-sky" aria-hidden="true" />
      <div className="app-shell">
        <header className="masthead">
          <div className="brand-lockup">
            <span className="brand-kicker">RELEASE THE RACCOON! PRESENTS</span>
            <h1>The Midnight Apothecary</h1>
            <p>Five jars. Five ingredients. One spellbook full of secrets.</p>
          </div>
          <div className="daily-badge">
            <span>
              THE DAILY SPELL · {String(daily.number).padStart(3, '0')}
            </span>
            <strong>{daily.date} UTC</strong>
          </div>
        </header>
        <section className="workshop" aria-label="Daily apothecary puzzle">
          <div className="workshop-top">
            <div className="wizard-stage">
              <div className="moon-window" aria-hidden="true">
                <span className="moon" />
              </div>
              <img
                className="wizard-art"
                src="/apothecary/wizard-raccoon.png"
                alt="A cheeky wizard raccoon raises a sparkling wand"
              />
              <span className="wizard-speech">
                {result === 'success'
                  ? 'Moon crystal acquired!'
                  : result === 'mishap'
                    ? 'I meant to do that.'
                    : 'Psst... trust the clues!'}
              </span>
              {result === 'success' && (
                <span className="moon-crystal" aria-hidden="true">
                  ◆
                </span>
              )}
            </div>
            <div className="jar-stage">
              <div className="stage-heading">
                <div>
                  <span className="overline">THE ENCHANTED SHELF</span>
                  <h2>Fill the five jars</h2>
                </div>
                <p>Each ingredient belongs in exactly one jar.</p>
              </div>
              <div
                className="shelf"
                role="group"
                aria-label="Five numbered apothecary jars"
              >
                {placement.map((ingredient, index) => (
                  <button
                    key={index}
                    className={`jar-button ${selectedJar === index ? 'jar-selected' : ''} ${ingredient ? 'filled' : ''}`}
                    type="button"
                    onClick={() => chooseJar(index)}
                    aria-label={`Jar ${index + 1}, ${ingredient ? ingredientInfo[ingredient].name : 'empty'}. ${selectedIngredient ? `Place ${ingredientInfo[selectedIngredient].name}` : 'Select jar'}`}
                    aria-pressed={selectedJar === index}
                  >
                    <span className="jar-number">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <span className="jar-cork" />
                    <span className="jar-neck" />
                    <span className="jar-glass">
                      <span className="jar-shine" />
                      {ingredient ? (
                        <img src={ingredientInfo[ingredient].image} alt="" />
                      ) : (
                        <span className="jar-empty">✦</span>
                      )}
                    </span>
                    <span className="jar-name">
                      {ingredient
                        ? ingredientInfo[ingredient].name
                        : 'Empty jar'}
                    </span>
                  </button>
                ))}
              </div>
              <div className="shelf-ledge" aria-hidden="true" />
            </div>
          </div>
          <div className="worktable">
            <section className="spellbook" aria-labelledby="spellbook-heading">
              <div className="book-header">
                <span className="book-mark">✧</span>
                <div>
                  <span className="overline">TODAY'S CHALLENGE</span>
                  <h2 id="spellbook-heading">From the spellbook</h2>
                </div>
              </div>
              <ol>
                {daily.puzzle.clues.map((clue, index) => (
                  <li key={index}>{formatClue(clue)}</li>
                ))}
              </ol>
            </section>
            <section
              className="ingredient-tray"
              aria-labelledby="ingredients-heading"
            >
              <div className="tray-heading">
                <div>
                  <span className="overline">THE INGREDIENTS</span>
                  <h2 id="ingredients-heading">Choose one, then a jar</h2>
                </div>
                <span className="tray-count">
                  {placement.filter(Boolean).length} / 5 placed
                </span>
              </div>
              <div className="ingredient-grid">
                {ingredients.map((ingredient) => {
                  const location = placement.indexOf(ingredient);
                  return (
                    <button
                      key={ingredient}
                      className={`ingredient-token ${selectedIngredient === ingredient ? 'chosen' : ''} ${location >= 0 ? 'placed' : ''}`}
                      type="button"
                      onClick={() => chooseIngredient(ingredient)}
                      aria-pressed={selectedIngredient === ingredient}
                      aria-label={`${ingredientInfo[ingredient].name}${location >= 0 ? `, in jar ${location + 1}` : ', available'}`}
                    >
                      <img src={ingredientInfo[ingredient].image} alt="" />
                      <span>{ingredientInfo[ingredient].name}</span>
                      {location >= 0 && <small>Jar {location + 1}</small>}
                    </button>
                  );
                })}
              </div>
            </section>
          </div>
          <div className="action-bar">
            <div className="status" role="status" aria-live="polite">
              <strong>
                {result === 'success'
                  ? 'SPELL SUCCESS!'
                  : result === 'mishap'
                    ? 'A MAGICAL MISHAP!'
                    : 'Ready when you are, wizard.'}
              </strong>
              <span>{message}</span>
              <small>
                {attempts > 0
                  ? `${attempts} spell${attempts === 1 ? '' : 's'} cast today`
                  : ''}
              </small>
            </div>
            <div className="actions">
              <button className="quiet-button" type="button" onClick={reset}>
                Reset
              </button>
              <button className="cast-button" type="button" onClick={cast}>
                ✦ CAST THE SPELL!
              </button>
            </div>
          </div>
        </section>
        <div className="help-row">
          <p>
            Use the clues to find the order. Tap an ingredient and a jar in
            either order. Moving an ingredient never makes a duplicate.
          </p>
          <button
            type="button"
            onClick={() => setHintLevel((level) => Math.min(level + 1, 3))}
          >
            {hintLevel < 3 ? 'Need a hint?' : 'Hints shown'}
          </button>
        </div>
        {hintLevel > 0 && (
          <div className="hint-panel" role="status">
            <strong>Wizard&apos;s nudge {hintLevel}</strong>
            <p>{hintFor(daily.puzzle, hintLevel)}</p>
          </div>
        )}
        <footer>
          One new spell each UTC day · No timer · No random outcomes
        </footer>
      </div>
    </main>
  );
};

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
