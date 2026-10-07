export default function WeatherCard({ icon, label, value }) {
  return (
    <div className="card stat">
      <span className="stat-icon" aria-hidden="true">{icon}</span>
      <span className="stat-label">{label}</span>
      <strong className="stat-value">{value}</strong>
    </div>
  );
}
