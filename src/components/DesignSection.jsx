import { useState } from 'react';
import PhoneFrame from './PhoneFrame.jsx';
import Likert from './Likert.jsx';
import { LIKERT_ITEMS } from '../data/designs.js';

// One design walkthrough plus its rating questions. `label` is the neutral
// name shown to the respondent ("Design 1"); `design.id` is the internal id
// used as the storage key.
export default function DesignSection({ design, label, onComplete }) {
  const [screenIndex, setScreenIndex] = useState(0);
  const [reachedEnd, setReachedEnd] = useState(design.screens.length === 1);
  const [ratings, setRatings] = useState({});
  const [openText, setOpenText] = useState('');

  const total = design.screens.length;
  const isLast = screenIndex === total - 1;
  const allRated = LIKERT_ITEMS.every((item) => ratings[item.key] !== undefined);

  function goNext() {
    const next = Math.min(screenIndex + 1, total - 1);
    setScreenIndex(next);
    if (next === total - 1) setReachedEnd(true);
  }

  function goBack() {
    setScreenIndex(Math.max(screenIndex - 1, 0));
  }

  return (
    <section className="card">
      <h1>{label}</h1>
      <p>
        Step through this cancellation flow for Streamly, a fictional streaming service, using the
        buttons below the phone. The rating questions unlock when you reach the last screen.
      </p>

      <div className="walkthrough">
        <PhoneFrame screen={design.screens[screenIndex]} />
        <p className="screen-counter" aria-live="polite">
          Screen {screenIndex + 1} of {total}
        </p>
        <div className="walkthrough-nav">
          <button type="button" className="btn-secondary" onClick={goBack} disabled={screenIndex === 0}>
            Back
          </button>
          <button type="button" className="btn-primary" onClick={goNext} disabled={isLast}>
            Next
          </button>
        </div>
      </div>

      <div className="ratings">
        <h2>Rate this design</h2>
        {!reachedEnd && (
          <p className="hint">View all screens above to unlock these questions.</p>
        )}
        {LIKERT_ITEMS.map((item) => (
          <Likert
            key={item.key}
            name={`${design.id}-${item.key}`}
            question={item.text}
            value={ratings[item.key]}
            onChange={(n) => setRatings((prev) => ({ ...prev, [item.key]: n }))}
            disabled={!reachedEnd}
          />
        ))}

        <label className="open-text">
          <span>What stood out about this design, good or bad? (optional)</span>
          <textarea
            rows={3}
            value={openText}
            onChange={(e) => setOpenText(e.target.value)}
            disabled={!reachedEnd}
          />
        </label>

        <button
          type="button"
          className="btn-primary"
          disabled={!allRated}
          onClick={() => onComplete(design.id, ratings, openText.trim())}
        >
          Continue
        </button>
      </div>
    </section>
  );
}
