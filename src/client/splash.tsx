import './index.css';
import { requestExpandedMode } from '@devvit/web/client';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Raccoon } from './Raccoon';
import { ObjectArt } from './ObjectArt';

export const Splash = () => <main className="splash">
  <div className="splash-card">
    <span className="eyebrow">THE ALLEY · DAILY LOGIC PUZZLE</span>
    <div className="splash-stage" aria-hidden="true"><span className="splash-piece left"><ObjectArt object="can" /></span><span className="splash-raccoon"><Raccoon mood="waiting" /></span><span className="splash-piece right"><ObjectArt object="gem" /></span></div>
    <h1>Release the<br />Raccoon!</h1>
    <p>Five bins. Two laps. One mischievous trash chute.</p>
    <button className="btn primary" type="button" onClick={(event) => requestExpandedMode(event.nativeEvent, 'game')}>▶ PLAY THE PUZZLE</button>
  </div>
</main>;

createRoot(document.getElementById('root')!).render(<StrictMode><Splash /></StrictMode>);
