import './index.css';
import { requestExpandedMode } from '@devvit/web/client';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

export const Splash = () => <main className="splash">
  <div className="splash-card">
    <span className="eyebrow">THE ALLEY · DAILY LOGIC PUZZLE</span>
    <div className="splash-raccoon" aria-hidden="true">🦝</div>
    <h1>Release the<br />Raccoon!</h1>
    <p>Five bins. Two laps. One very nosy raccoon.</p>
    <button className="btn primary" type="button" onClick={(event) => requestExpandedMode(event.nativeEvent, 'game')}>▶ PLAY THE PUZZLE</button>
  </div>
</main>;

createRoot(document.getElementById('root')!).render(<StrictMode><Splash /></StrictMode>);
