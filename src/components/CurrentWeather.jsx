import WeatherCard from './WeatherCard';
import { useSettings } from '../context/SettingsContext';
import { weatherEmoji, weatherTheme } from '../utils/weather';

export default function CurrentWeather({ weather, isFavorite, onToggleFavorite }) {
  const { temp } = useSettings();
  const w = weather;
  return (
    <section aria-label="Current weather">
      <div className={`hero ${weatherTheme(w.icon)}`}>
        <div className="hero-top">
          <div>
            <h1 className="hero-city">{w.city}{w.country ? `, ${w.country}` : ''}</h1>
            <p className="hero-time">{w.localTime}</p>
          </div>
          <button className={`btn small fav-btn ${isFavorite ? 'active' : ''}`} onClick={onToggleFavorite} aria-pressed={isFavorite}>
            {isFavorite ? '⭐ Saved' : '☆ Save city'}
          </button>
        </div>
        <div className="hero-main">
          <span className="hero-icon" aria-hidden="true">{weatherEmoji(w.icon)}</span>
          <div>
            <div className="hero-temp" data-testid="current-temp">{temp(w.temperature)}</div>
            <p className="hero-condition">{w.condition}</p>
            <p className="hero-sub">Feels like {temp(w.feelsLike)} · High {temp(w.maxTemperature)} · Low {temp(w.minTemperature)}</p>
          </div>
        </div>
      </div>
      <div className="stats-grid">
        <WeatherCard icon="💧" label="Humidity" value={`${w.humidity}%`} />
        <WeatherCard icon="💨" label="Wind speed" value={`${w.windSpeed} km/h`} />
        <WeatherCard icon="🧭" label="Pressure" value={`${w.pressure} hPa`} />
        <WeatherCard icon="👁️" label="Visibility" value={`${w.visibility} km`} />
        <WeatherCard icon="🕶️" label="UV index" value={w.uvIndex ?? 'N/A'} />
        <WeatherCard icon="🌅" label="Sunrise" value={w.sunrise} />
        <WeatherCard icon="🌇" label="Sunset" value={w.sunset} />
      </div>
    </section>
  );
}
