import { useSettings } from '../context/SettingsContext';
import { weatherEmoji } from '../utils/weather';

export default function Forecast({ days = [] }) {
  const { temp } = useSettings();
  if (!days.length) return null;
  return (
    <section className="block" aria-label="Daily forecast">
      <h2>{days.length}-day forecast</h2>
      <div className="forecast-grid">
        {days.map((d) => (
          <article className="card day" key={`${d.day}-${d.date}`}>
            <h3>{d.day}</h3>
            <span className="muted">{d.date}</span>
            <span className="day-icon" aria-hidden="true">{weatherEmoji(d.icon)}</span>
            <span className="day-cond">{d.condition}</span>
            <div className="day-temps"><strong>{temp(d.maxTemperature)}</strong><span className="muted">{temp(d.minTemperature)}</span></div>
            <span className="muted">💧 {d.humidity}%</span>
            <span className="muted">💨 {d.windSpeed} km/h</span>
          </article>
        ))}
      </div>
    </section>
  );
}
