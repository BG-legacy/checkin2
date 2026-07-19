import { useState } from 'react';

// Closing questions. `viewOrder` is the array of internal design ids in the
// order this respondent saw them, so "Design N" maps back to an internal id.
export default function ClosingSection({ viewOrder, onSubmit }) {
  const [trustPick, setTrustPick] = useState(null);
  const [trustWhy, setTrustWhy] = useState('');
  const [oneChange, setOneChange] = useState('');

  return (
    <section className="card">
      <h1>A few final questions</h1>

      <fieldset className="screener">
        <legend>
          If this were a real service you paid for, which design would make you trust the company
          most?{' '}
          <span className="required-mark" aria-hidden="true">
            *
          </span>
        </legend>
        {viewOrder.map((internalId, i) => (
          <label key={internalId} className="radio-row">
            <input
              type="radio"
              name="trust-pick"
              value={internalId}
              checked={trustPick === internalId}
              onChange={() => setTrustPick(internalId)}
            />
            <span>Design {i + 1}</span>
          </label>
        ))}
      </fieldset>

      <label className="open-text">
        <span>Why that one? (optional)</span>
        <textarea rows={3} value={trustWhy} onChange={(e) => setTrustWhy(e.target.value)} />
      </label>

      <label className="open-text">
        <span>
          Think of the design you liked least. What single change would most improve it? (optional)
        </span>
        <textarea rows={3} value={oneChange} onChange={(e) => setOneChange(e.target.value)} />
      </label>

      <button
        type="button"
        className="btn-primary"
        disabled={trustPick === null}
        onClick={() =>
          onSubmit({
            trustPick,
            trustWhy: trustWhy.trim(),
            oneChange: oneChange.trim(),
          })
        }
      >
        Submit responses
      </button>
    </section>
  );
}
