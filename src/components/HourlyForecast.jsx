import { useSettings } from '../context/SettingsContext';
import { weatherEmoji } from '../utils/weather';

export default function HourlyForecast({ hours = [] }) {
  const { temp } = useSettings();
  if (!hours.length) return null;
  return (
    <section className="block" aria-label="Hourly forecast">
      <h2>Hourly forecast <small className="muted">(3-hour steps)</small></h2>
      <div className="hourly-scroll">
        {hours.map((h, i) => (
          <div className="card hour" key={`${h.time}-${i}`}>
            <span className="hour-time">{h.time}</span>
            <span className="hour-icon" aria-hidden="true">{weatherEmoji(h.icon)}</span>
            <strong>{temp(h.temperature)}</strong>
            <span className="hour-cond">{h.condition}</span>
            <span className="muted">🌧 {h.precipitationProbability}%</span>
            <span className="muted">💨 {h.windSpeed} km/h</span>
          </div>
        ))}
      </div>
    </section>
  );
}
