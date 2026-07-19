import { useEffect, useRef, useState } from 'react';
import ProgressBar from './components/ProgressBar.jsx';
import IntroScreener from './components/IntroScreener.jsx';
import ScreenedOut from './components/ScreenedOut.jsx';
import DesignSection from './components/DesignSection.jsx';
import ClosingSection from './components/ClosingSection.jsx';
import ThankYou from './components/ThankYou.jsx';
import Analytics from './components/Analytics.jsx';
import { DESIGNS, DESIGN_IDS } from './data/designs.js';
import { fisherYatesShuffle } from './lib/shuffle.js';
import { insertResponse } from './lib/supabase.js';

// Steps: intro, three designs, closing. Thank-you counts as full progress.
const TOTAL_STEPS = 5;

export default function App() {
  // Shuffled once on mount and never re-shuffled.
  const [viewOrder] = useState(() => fisherYatesShuffle(DESIGN_IDS));
  const [startedAt] = useState(() => new Date().toISOString());

  // stage: 'intro' | 'screened_out' | 'design' | 'closing' | 'submitting'
  //        | 'submit_error' | 'thank_you'
  const [stage, setStage] = useState('intro');
  const [designIndex, setDesignIndex] = useState(0);
  const [ratings, setRatings] = useState({});
  const [openEnded, setOpenEnded] = useState({});
  const [submitError, setSubmitError] = useState(null);
  const pendingRow = useRef(null);

  // Minimal hash route for the password-protected results dashboard.
  const [hash, setHash] = useState(window.location.hash);
  useEffect(() => {
    const onHashChange = () => setHash(window.location.hash);
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  function handleScreener(answer) {
    if (answer === 'yes') {
      setStage('design');
    } else {
      setStage('screened_out');
    }
  }

  function handleDesignComplete(designId, designRatings, openText) {
    setRatings((prev) => ({ ...prev, [designId]: designRatings }));
    if (openText) {
      setOpenEnded((prev) => ({ ...prev, [designId]: openText }));
    }
    if (designIndex < viewOrder.length - 1) {
      setDesignIndex(designIndex + 1);
      window.scrollTo(0, 0);
    } else {
      setStage('closing');
      window.scrollTo(0, 0);
    }
  }

  async function trySubmit(row) {
    pendingRow.current = row;
    setStage('submitting');
    try {
      await insertResponse(row);
      setStage('thank_you');
    } catch (err) {
      setSubmitError(err.message || 'Something went wrong.');
      setStage('submit_error');
    }
  }

  function handleClosing({ trustPick, trustWhy, oneChange }) {
    const row = {
      started_at: startedAt,
      completed_at: new Date().toISOString(),
      view_order: viewOrder,
      screener: 'yes',
      ratings,
      open_ended: Object.keys(openEnded).length > 0 ? openEnded : null,
      trust_pick: trustPick,
      trust_why: trustWhy || null,
      one_change: oneChange || null,
    };
    trySubmit(row);
  }

  function downloadFallback() {
    const blob = new Blob([JSON.stringify(pendingRow.current, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'survey-responses.json';
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
    setStage('thank_you');
  }

  function progressValue() {
    switch (stage) {
      case 'intro':
      case 'screened_out':
        return 0;
      case 'design':
        return 1 + designIndex;
      case 'closing':
        return 4;
      default:
        return TOTAL_STEPS;
    }
  }

  const currentDesignId = viewOrder[designIndex];

  if (hash.startsWith('#/results')) {
    return (
      <div className="app">
        <main className="content">
          <Analytics />
        </main>
      </div>
    );
  }

  return (
    <div className="app">
      <ProgressBar value={progressValue()} max={TOTAL_STEPS} />
      <main className="content">
        {stage === 'intro' && <IntroScreener onContinue={handleScreener} />}
        {stage === 'screened_out' && <ScreenedOut />}
        {stage === 'design' && (
          <DesignSection
            key={currentDesignId}
            design={DESIGNS[currentDesignId]}
            label={`Design ${designIndex + 1} of 3`}
            onComplete={handleDesignComplete}
          />
        )}
        {stage === 'closing' && (
          <ClosingSection viewOrder={viewOrder} onSubmit={handleClosing} />
        )}
        {stage === 'submitting' && (
          <section className="card center-text" aria-live="polite">
            <h1>Submitting&hellip;</h1>
            <p>Saving your responses.</p>
          </section>
        )}
        {stage === 'submit_error' && (
          <section className="card center-text" aria-live="assertive">
            <h1>We couldn&rsquo;t save your responses</h1>
            <p className="error-detail">{submitError}</p>
            <div className="error-actions">
              <button
                type="button"
                className="btn-primary"
                onClick={() => trySubmit(pendingRow.current)}
              >
                Try again
              </button>
              <button type="button" className="btn-secondary" onClick={downloadFallback}>
                Download my responses as a file
              </button>
            </div>
            <p className="hint">
              If saving keeps failing, download the file and email it to the research team.
            </p>
          </section>
        )}
        {stage === 'thank_you' && <ThankYou />}
      </main>
    </div>
  );
}
