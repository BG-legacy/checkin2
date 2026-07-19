export default function ProgressBar({ value, max }) {
  const percent = Math.round((value / max) * 100);
  return (
    <div
      className="progress-bar"
      role="progressbar"
      aria-valuenow={value}
      aria-valuemin={0}
      aria-valuemax={max}
      aria-label="Survey progress"
    >
      <div className="progress-bar-fill" style={{ width: `${percent}%` }} />
    </div>
  );
}
