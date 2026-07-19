import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase.js';
import { LIKERT_ITEMS, DESIGN_IDS } from '../data/designs.js';

const ANALYTICS_PASSWORD = import.meta.env.VITE_ANALYTICS_PASSWORD;

const DESIGN_LABELS = {
  A_direct_exit: 'A — Direct exit',
  B_reason_first: 'B — Reason first',
  C_status_quo: 'C — Status quo',
};

function mean(values) {
  if (values.length === 0) return null;
  return values.reduce((sum, v) => sum + v, 0) / values.length;
}

function summarize(rows) {
  const ratingMeans = {};
  for (const designId of DESIGN_IDS) {
    ratingMeans[designId] = {};
    for (const item of LIKERT_ITEMS) {
      const values = rows
        .map((row) => row.ratings?.[designId]?.[item.key])
        .filter((v) => typeof v === 'number');
      ratingMeans[designId][item.key] = mean(values);
    }
  }

  const trustCounts = {};
  for (const designId of DESIGN_IDS) trustCounts[designId] = 0;
  for (const row of rows) {
    if (row.trust_pick in trustCounts) trustCounts[row.trust_pick] += 1;
  }

  const comments = {};
  for (const designId of DESIGN_IDS) {
    comments[designId] = rows
      .map((row) => row.open_ended?.[designId])
      .filter(Boolean);
  }

  const trustWhy = rows.map((row) => row.trust_why).filter(Boolean);
  const oneChange = rows.map((row) => row.one_change).filter(Boolean);

  return { ratingMeans, trustCounts, comments, trustWhy, oneChange };
}

function PasswordGate({ onUnlock }) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  function handleSubmit(e) {
    e.preventDefault();
    if (password === ANALYTICS_PASSWORD) {
      onUnlock();
    } else {
      setError('Incorrect password.');
    }
  }

  return (
    <section className="card">
      <h1>Results dashboard</h1>
      <p>This area is for the research team. Enter the password to view responses.</p>
      <form onSubmit={handleSubmit} className="login-form">
        <label className="open-text">
          <span>Password</span>
          <input
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setError(null);
            }}
            required
          />
        </label>
        {error && <p className="error-detail">{error}</p>}
        <button type="submit" className="btn-primary">
          View results
        </button>
      </form>
      <p className="hint">
        <a href="#/">Back to the survey</a>
      </p>
    </section>
  );
}

function Dashboard({ rows }) {
  const { ratingMeans, trustCounts, comments, trustWhy, oneChange } = summarize(rows);
  const n = rows.length;

  return (
    <section className="card">
      <h1>Results dashboard</h1>
      <p>
        <strong>{n}</strong> completed {n === 1 ? 'response' : 'responses'}.
      </p>

      {n === 0 ? (
        <p className="hint">No responses yet. Check back once the survey has been shared.</p>
      ) : (
        <>
          <h2>Mean ratings (1 = strongly disagree, 5 = strongly agree)</h2>
          <div className="table-scroll">
            <table className="results-table">
              <thead>
                <tr>
                  <th scope="col">Item</th>
                  {DESIGN_IDS.map((id) => (
                    <th scope="col" key={id}>
                      {DESIGN_LABELS[id]}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {LIKERT_ITEMS.map((item) => (
                  <tr key={item.key}>
                    <th scope="row">{item.text}</th>
                    {DESIGN_IDS.map((id) => {
                      const value = ratingMeans[id][item.key];
                      return <td key={id}>{value === null ? '—' : value.toFixed(2)}</td>;
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <h2>&ldquo;Which design would make you trust the company most?&rdquo;</h2>
          <div className="table-scroll">
            <table className="results-table">
              <thead>
                <tr>
                  <th scope="col">Design</th>
                  <th scope="col">Picks</th>
                  <th scope="col">Share</th>
                </tr>
              </thead>
              <tbody>
                {DESIGN_IDS.map((id) => (
                  <tr key={id}>
                    <th scope="row">{DESIGN_LABELS[id]}</th>
                    <td>{trustCounts[id]}</td>
                    <td>{n > 0 ? `${Math.round((trustCounts[id] / n) * 100)}%` : '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <h2>Open-ended comments</h2>
          {DESIGN_IDS.map((id) => (
            <details key={id} className="comments-group">
              <summary>
                {DESIGN_LABELS[id]} ({comments[id].length})
              </summary>
              {comments[id].length === 0 ? (
                <p className="hint">No comments.</p>
              ) : (
                <ul>
                  {comments[id].map((text, i) => (
                    <li key={i}>{text}</li>
                  ))}
                </ul>
              )}
            </details>
          ))}

          <details className="comments-group">
            <summary>&ldquo;Why that one?&rdquo; ({trustWhy.length})</summary>
            {trustWhy.length === 0 ? (
              <p className="hint">No answers.</p>
            ) : (
              <ul>
                {trustWhy.map((text, i) => (
                  <li key={i}>{text}</li>
                ))}
              </ul>
            )}
          </details>

          <details className="comments-group">
            <summary>&ldquo;What single change would most improve it?&rdquo; ({oneChange.length})</summary>
            {oneChange.length === 0 ? (
              <p className="hint">No answers.</p>
            ) : (
              <ul>
                {oneChange.map((text, i) => (
                  <li key={i}>{text}</li>
                ))}
              </ul>
            )}
          </details>
        </>
      )}

      <p className="hint">
        <a href="#/">Back to the survey</a>
      </p>
    </section>
  );
}

export default function Analytics() {
  const [unlocked, setUnlocked] = useState(false);
  const [rows, setRows] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!unlocked || !supabase) return;
    let cancelled = false;
    supabase
      .from('responses')
      .select('*')
      .then(({ data, error: fetchError }) => {
        if (cancelled) return;
        if (fetchError) {
          setError(fetchError.message || 'Failed to load responses.');
        } else {
          setRows(data ?? []);
        }
      });
    return () => {
      cancelled = true;
    };
  }, [unlocked]);

  if (!supabase || !ANALYTICS_PASSWORD) {
    return (
      <section className="card center-text">
        <h1>Results dashboard</h1>
        <p className="error-detail">
          Not configured. Set VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY, and
          VITE_ANALYTICS_PASSWORD.
        </p>
      </section>
    );
  }

  if (!unlocked) {
    return <PasswordGate onUnlock={() => setUnlocked(true)} />;
  }

  if (error) {
    return (
      <section className="card center-text">
        <h1>Results dashboard</h1>
        <p className="error-detail">{error}</p>
        <p className="hint">
          If this says permission denied, run supabase/migrations/002_dashboard_read.sql.
        </p>
      </section>
    );
  }

  if (rows === null) {
    return (
      <section className="card center-text" aria-live="polite">
        <h1>Results dashboard</h1>
        <p>Loading responses&hellip;</p>
      </section>
    );
  }

  return <Dashboard rows={rows} />;
}
