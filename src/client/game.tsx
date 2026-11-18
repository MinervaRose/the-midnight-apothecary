import './index.css';
import { StrictMode, useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { selectDailyPuzzle } from './daily';
import { correctCount, destinations, isSolved, objects, simulate } from './puzzle';
import type { PuzzleState } from './puzzle';
import { Raccoon } from './Raccoon';
import type { RaccoonMood } from './Raccoon';
import { ObjectArt } from './ObjectArt';
import type { ObjectId } from './puzzle';

const hints = [
  'Hint 1: An open lid trades the object in the bin with the one in the raccoon’s paws. Closed lids skip that trade.',
  'Hint 2: After lap one, the chute trades its two bins even if both lids are closed. Then the same lid pattern runs again.',
  'Hint 3: Trace the carried object through both laps. A bin that starts wrong can still be right after the chute, so it may need to stay closed.',
];
const pause = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));
const closedLids = () => Array<boolean>(destinations.length).fill(false);

export const App = () => {
  const [daily, setDaily] = useState(() => selectDailyPuzzle(new Date()));
  const [lids, setLids] = useState(closedLids);
  const [board, setBoard] = useState<PuzzleState>(() => daily.start);
  const [attempts, setAttempts] = useState(0);
  const [running, setRunning] = useState(false);
  const runningRef = useRef(false);
  const runId = useRef(0);
  const [completed, setCompleted] = useState(false);
  const [lap, setLap] = useState('Ready');
  const [lapText, setLapText] = useState('Waiting behind the gate...');
  const [active, setActive] = useState(-1);
  const [feedback, setFeedback] = useState({ heading: 'Plan your heist.', detail: 'Choose which bin lids stay open for both laps.' });
  const [hintLevel, setHintLevel] = useState(0);
  const [bounce, setBounce] = useState(0);
  const [chuteMoving, setChuteMoving] = useState(false);
  const [chuteCargo, setChuteCargo] = useState<readonly [ObjectId, ObjectId]>(['gem', 'gem']);
  const [visitAction, setVisitAction] = useState<'approach' | 'swap' | 'skip'>('approach');
  const [swapCargo, setSwapCargo] = useState<readonly [ObjectId, ObjectId]>(['gem', 'gem']);
  const [visitKey, setVisitKey] = useState(0);

  useEffect(() => {
    const rollOver = () => {
      const next = selectDailyPuzzle(new Date());
      if (next.dateKey === daily.dateKey) return;
      runId.current++;
      runningRef.current = false;
      setDaily(next);
      setLids(closedLids());
      setBoard(next.start);
      setAttempts(0);
      setRunning(false);
      setCompleted(false);
      setLap('Ready');
      setLapText('Waiting behind the gate...');
      setActive(-1);
      setFeedback({ heading: 'Plan your heist.', detail: 'Choose which bin lids stay open for both laps.' });
      setHintLevel(0);
      setBounce(0);
      setChuteMoving(false);
      setVisitAction('approach');
    };
    const now = new Date();
    const nextMidnight = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + 1);
    const timer = window.setTimeout(rollOver, nextMidnight - now.getTime() + 10);
    document.addEventListener('visibilitychange', rollOver);
    return () => {
      window.clearTimeout(timer);
      document.removeEventListener('visibilitychange', rollOver);
    };
  }, [daily.dateKey]);

  const restore = (keepLids: boolean) => {
    setBoard(daily.start);
    setCompleted(false);
    setActive(-1);
    setLap('Ready');
    setLapText('Waiting behind the gate...');
    setFeedback({ heading: 'Plan your heist.', detail: 'Choose which bin lids stay open for both laps.' });
    setChuteMoving(false);
    setVisitAction('approach');
    if (!keepLids) setLids(closedLids());
  };

  const toggleLid = (index: number) => {
    if (runningRef.current) return;
    if (completed) restore(true);
    setLids((current) => current.map((open, bin) => bin === index ? !open : open));
  };

  const release = async () => {
    if (runningRef.current) return;
    runningRef.current = true;
    const currentRun = ++runId.current;
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 25 : 500;
    const { visits, afterLapOne, afterChute, result } = simulate(lids, daily.start, daily.chute);
    let previousState = daily.start;
    setBoard(daily.start);
    setCompleted(false);
    setRunning(true);
    setAttempts((value) => value + 1);
    setLap('1 of 2');
    setLapText('The gate springs open!');
    setFeedback({ heading: 'The raccoon is loose!', detail: 'Watch what happens at each open lid.' });
    setVisitAction('approach');
    await pause(motion);
    if (currentRun !== runId.current) return;
    for (const visit of visits) {
      setLap(`${visit.lap} of 2`);
      setLapText(`Lap ${visit.lap} · Investigating bin ${visit.bin + 1}`);
      setActive(visit.bin);
      setVisitKey((value) => value + 1);
      setVisitAction('approach');
      await pause(motion * .55);
      if (currentRun !== runId.current) return;
      if (visit.swapped) {
        setSwapCargo([previousState.paw, previousState.bins[visit.bin]!]);
      }
      setBoard(visit.state);
      setVisitAction(visit.swapped ? 'swap' : 'skip');
      if (visit.swapped) {
        setBounce((value) => value + 1);
        setFeedback({ heading: `CLATTER! A swap at bin ${visit.bin + 1}.`, detail: `The raccoon now holds ${objects[visit.state.paw].name.toLowerCase()}.` });
      } else {
        setFeedback({ heading: `Squeak! Bin ${visit.bin + 1} stays shut.`, detail: `The raccoon trots onward, still holding ${objects[visit.state.paw].name.toLowerCase()}.` });
      }
      previousState = visit.state;
      await pause(motion * .45);
      if (currentRun !== runId.current) return;
      if (visit.bin === destinations.length - 1 && visit.lap === 1) {
        const [first, second] = daily.chute;
        setActive(-1);
        setLap('CHUTE!');
        setLapText('The machine has other ideas...');
        setFeedback({ heading: 'K-CHUNK! The trash chute fires.', detail: `Bins ${first + 1} and ${second + 1} trade their contents, lids aside.` });
        setChuteCargo([afterLapOne.bins[first]!, afterLapOne.bins[second]!]);
        setChuteMoving(true);
        setVisitAction('approach');
        await pause(motion * 1.8);
        if (currentRun !== runId.current) return;
        setBoard(afterChute);
        previousState = afterChute;
        setChuteMoving(false);
        setBounce((value) => value + 1);
        setLapText('Lap 2! Same lids, newly scrambled bins.');
        await pause(motion * .55);
        if (currentRun !== runId.current) return;
      }
    }
    setActive(-1);
    setVisitAction('approach');
    setBoard(result);
    setLap('Finished');
    setLapText('Back at the gate.');
    setCompleted(true);
    setRunning(false);
    runningRef.current = false;
    setFeedback(isSolved(result)
      ? { heading: '🎉 PERFECT HEIST!', detail: 'All five bins are sorted. Your raccoon escaped with the gem!' }
      : { heading: '💥 WHAT A BEAUTIFUL MESS.', detail: `Only ${correctCount(result)} of ${destinations.length} bins are right. Try a different lid pattern.` });
  };

  const mood: RaccoonMood = completed ? (isSolved(board) ? 'victory' : 'failure') : chuteMoving ? 'surprised' : running ? 'rummaging' : 'waiting';

  return <main className="wrap">
    <header className="brand"><div><span className="eyebrow">THE DAILY ALLEY PUZZLE</span><h1>Release the Raccoon!</h1></div><p className="lead">Set the lids. Sort the bins. Swipe the gem. <span>Two laps and one sneaky chute.</span></p></header>
    <section className="game" data-stage={lap === '2 of 2' ? 'two' : lap === 'CHUTE!' ? 'chute' : 'one'} aria-label="Raccoon puzzle">
      <div className="header"><span className="small">THE ALLEY · DAILY {String(daily.number).padStart(3, '0')}</span><div className="facts"><span>{daily.date} UTC</span><span className="lap-signal">{lap === 'Ready' ? 'READY' : lap === 'Finished' ? 'FINISHED' : lap === 'CHUTE!' ? '⚙ CHUTE!' : `LAP ${lap}`}</span><span>Attempts <b>{attempts}</b></span><span>Correct <b>{correctCount(board)}/{destinations.length}</b></span></div></div>
      <div className="machine">
        <div className={`paw mood-panel-${mood}`}><div key={bounce} className={`character ${completed && isSolved(board) ? 'celebrate' : bounce ? 'bounce' : ''}`}><Raccoon mood={mood} />{completed && isSolved(board) && <span className="character-gem" aria-hidden="true"><ObjectArt object="gem" /></span>}{completed && <span className="character-thought">{isSolved(board) ? 'MINE!' : 'TA-DA!'}</span>}</div><span className="paw-text"><small>IN THE RACCOON&apos;S PAWS</small><strong><ObjectArt object={board.paw} className="held-piece" /> {objects[board.paw].name}</strong><span className="hint">{lapText}</span></span>{completed && isSolved(board) && <span className="confetti" aria-hidden="true">✦ ✧ ✦</span>}</div>
        <div className="board-area"><div className="board-guide"><span>START HERE →</span><strong>MATCH EACH BIN TO ITS LABEL</strong><span>1 → 2 → 3 → 4 → 5</span></div><div className="track">{destinations.map((destination, index) => {
          const object = objects[board.bins[index] ?? 'peel'];
          return <div className={`bin ${active === index ? `active action-${visitAction}` : ''} ${completed && board.bins[index] === destination.object ? 'good' : ''} ${daily.chute.includes(index) ? 'chute-bin' : ''} ${chuteMoving && daily.chute.includes(index) ? 'chute-rattle' : ''}`} key={destination.name}>
            <div className="visitor-lane">{active === index && <span key={visitKey} className="visitor"><Raccoon mood="rummaging" /></span>}</div>
            <div className="number">BIN {index + 1}</div><div className="destination"><ObjectArt object={destination.object} className="destination-piece" /> {destination.name}</div>
            {daily.chute.includes(index) && <div className="chute-port" aria-label="Connected to trash chute">⚙ CHUTE PORT</div>}
            <button className={`lid ${lids[index] ? 'on' : ''}`} type="button" aria-label={`Bin ${index + 1} lid, ${lids[index] ? 'open' : 'closed'}`} aria-pressed={lids[index]} disabled={running} onClick={() => toggleLid(index)}>{lids[index] ? 'OPEN' : 'CLOSED'}<span className="lid-knob" aria-hidden="true" /></button>
            <div className="object-window"><div className="item-icon"><ObjectArt object={board.bins[index] ?? 'peel'} />{active === index && visitAction === 'swap' && <span key={visitKey} className="trade-burst"><span><ObjectArt object={swapCargo[0]} /></span><span><ObjectArt object={swapCargo[1]} /></span></span>}</div><div className="object-name">{object.name}</div></div>
            {active === index && visitAction === 'skip' && <div className="skip-badge">NO PEEK!</div>}
          </div>;
        })}</div></div>
        <div className={`chute-machine ${chuteMoving ? 'firing' : ''}`} aria-label={`Trash chute connects bin ${daily.chute[0] + 1} ${destinations[daily.chute[0]]!.name} and bin ${daily.chute[1] + 1} ${destinations[daily.chute[1]]!.name}`}>
          <div className="chute-end"><span className="chute-bolt">⚙</span><strong>BIN {daily.chute[0] + 1}</strong><small>{destinations[daily.chute[0]]!.name}</small></div>
          <div className="chute-pipe"><span className="chute-lever" aria-hidden="true">▰</span><span className="chute-label">THE MISCHIEVOUS TRASH CHUTE</span><span className="chute-flow" aria-hidden="true">⇄</span>{chuteMoving && <><span className="chute-clunk" aria-hidden="true">K-CHUNK!</span><span className="chute-object from-left" aria-hidden="true"><ObjectArt object={chuteCargo[0]} /></span><span className="chute-object from-right" aria-hidden="true"><ObjectArt object={chuteCargo[1]} /></span></>}</div>
          <div className="chute-end"><span className="chute-bolt">⚙</span><strong>BIN {daily.chute[1] + 1}</strong><small>{destinations[daily.chute[1]]!.name}</small></div>
        </div>
        <div className="runway"><span>↪ The raccoon circles the alley twice, 1 → 2 → 3 → 4 → 5 ↺</span></div>
      </div>
      <div className="bottom"><div className="feedback" role="status" aria-live="polite"><strong>{feedback.heading}</strong><small>{feedback.detail}</small></div>
        <div className="controls"><button className="btn" type="button" disabled={running} onClick={() => restore(false)}>Reset lids</button><button className="btn primary" type="button" disabled={running} onClick={() => void release()}>{running ? '⚙ RUMMAGING...' : completed ? '↺ TRY AGAIN' : '▶ RELEASE THE RACCOON!'}</button></div>
      </div>
    </section>
    <div className="instructions" aria-label="Game rules">
      <div className="rule"><b>① PICK THE LIDS</b> Tap a bin lid to leave it open or closed.</div>
      <div className="rule"><b>② FOLLOW THE PAWS</b> An open lid swaps the bin&apos;s object with the one in the raccoon&apos;s paws. The raccoon makes two laps with the same lids.</div>
      <div className="rule"><b>③ MIND THE CHUTE</b> Between laps, the marked bins trade contents, even with closed lids. Sort all five and leave with the gem.</div>
    </div>
    <div className="after"><button className="btn" type="button" disabled={running} onClick={() => setHintLevel((value) => Math.min(3, value + 1))}>💡 {hintLevel === 0 ? 'Hint' : hintLevel < 3 ? 'Another hint' : 'All hints shown'}</button><p className="note">No timer and no random outcomes. You can retry as often as you like. The same lid settings always produce the same result.</p></div>
    {hintLevel > 0 && <p className="hint-text" role="status">{hints[hintLevel - 1]}</p>}
    <p className="footer">Puzzle categories are illustrative and do not represent local recycling rules. Keyboard accessible controls; animations respect reduced-motion preferences.</p>
  </main>;
};

createRoot(document.getElementById('root')!).render(<StrictMode><App /></StrictMode>);
