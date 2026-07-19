import { useState } from 'react';

export default function IntroScreener({ onContinue }) {
  const [answer, setAnswer] = useState(null);

  return (
    <section className="card">
      <h1>Subscription Cancellation Design Study</h1>
      <p>
        We&rsquo;re a graduate team at Georgia Tech studying how subscription cancellation screens
        affect the people using them. You&rsquo;ll step through three interface designs for
        canceling a fictional streaming service, then rate each one. About ten minutes. Responses
        are anonymous and used only for this course project.
      </p>

      <fieldset className="screener">
        <legend>
          Have you personally canceled a paid digital subscription in the past year?{' '}
          <span className="required-mark" aria-hidden="true">
            *
          </span>
        </legend>
        <label className="radio-row">
          <input
            type="radio"
            name="screener"
            value="yes"
            checked={answer === 'yes'}
            onChange={() => setAnswer('yes')}
          />
          <span>Yes</span>
        </label>
        <label className="radio-row">
          <input
            type="radio"
            name="screener"
            value="no"
            checked={answer === 'no'}
            onChange={() => setAnswer('no')}
          />
          <span>No</span>
        </label>
      </fieldset>

      <button
        type="button"
        className="btn-primary"
        disabled={answer === null}
        onClick={() => onContinue(answer)}
      >
        Begin
      </button>
    </section>
  );
}
