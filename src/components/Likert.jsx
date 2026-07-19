// A single 1-5 Likert item rendered as a radio group.
export default function Likert({ name, question, value, onChange, disabled }) {
  return (
    <fieldset className="likert" disabled={disabled}>
      <legend className="likert-question">{question}</legend>
      <div className="likert-scale">
        <span className="likert-endpoint" aria-hidden="true">
          Strongly disagree
        </span>
        <div className="likert-options">
          {[1, 2, 3, 4, 5].map((n) => (
            <label key={n} className="likert-option">
              <input
                type="radio"
                name={name}
                value={n}
                checked={value === n}
                onChange={() => onChange(n)}
                aria-label={`${n} of 5${n === 1 ? ', strongly disagree' : ''}${
                  n === 5 ? ', strongly agree' : ''
                }`}
              />
              <span className="likert-option-label">{n}</span>
            </label>
          ))}
        </div>
        <span className="likert-endpoint" aria-hidden="true">
          Strongly agree
        </span>
      </div>
    </fieldset>
  );
}
