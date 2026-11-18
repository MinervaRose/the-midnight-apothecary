import './index.css';
import { requestExpandedMode } from '@devvit/web/client';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

export const Splash = () => (
  <main className="splash apothecary">
    <div className="night-sky" aria-hidden="true" />
    <div className="splash-scene">
      <div className="splash-copy">
        <span className="brand-kicker">RELEASE THE RACCOON! PRESENTS</span>
        <h1>
          The Midnight
          <br />
          Apothecary
        </h1>
        <p>
          Five enchanted jars. A page of clues. One raccoon who should probably
          not have a wand.
        </p>
        <button
          className="cast-button"
          type="button"
          onClick={(event) => requestExpandedMode(event.nativeEvent, 'game')}
        >
          ✦ PLAY TODAY&apos;S SPELL
        </button>
      </div>
      <img
        src="/apothecary/wizard-raccoon.png"
        alt="Mischievous wizard raccoon with a striped tail and crooked hat"
      />
      <span className="splash-moon" aria-hidden="true">
        ✦
      </span>
    </div>
  </main>
);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Splash />
  </StrictMode>
);
