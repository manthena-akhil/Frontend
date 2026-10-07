import { useCallback, useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import SearchBar from '../components/SearchBar';
import CurrentWeather from '../components/CurrentWeather';
import HourlyForecast from '../components/HourlyForecast';
import Forecast from '../components/Forecast';
import WeatherCharts from '../components/WeatherCharts';
import useWeather from '../hooks/useWeather';
import * as favoriteService from '../services/favoriteService';
import { getErrorMessage } from '../services/api';

const readRecent = () => { try { return JSON.parse(localStorage.getItem('recentSearches')) || []; } catch { return []; } };

function Skeleton() {
  return (
    <div aria-busy="true" aria-label="Loading weather">
      <div className="skeleton hero-sk" />
      <div className="stats-grid">{Array.from({ length: 7 }, (_, i) => <div key={i} className="skeleton stat-sk" />)}</div>
      <div className="skeleton row-sk" />
    </div>
  );
}

export default function Dashboard() {
  const [params, setParams] = useSearchParams();
  const city = params.get('city');
  const { weather, forecast, hourly, loading, error, loadCity, loadCoords } = useWeather();
  const [favorites, setFavorites] = useState([]);
  const [recent, setRecent] = useState(readRecent);
  const lastLoaded = useRef('');

  const remember = useCallback((name) => {
    localStorage.setItem('lastCity', name);
    setRecent((prev) => {
      const next = [name, ...prev.filter((c) => c.toLowerCase() !== name.toLowerCase())].slice(0, 5);
      localStorage.setItem('recentSearches', JSON.stringify(next));
      return next;
    });
  }, []);

  useEffect(() => { favoriteService.list().then(setFavorites).catch(() => {}); }, []);

  useEffect(() => {
    if (!city) { setParams({ city: localStorage.getItem('lastCity') || 'Hyderabad' }, { replace: true }); return; }
    const key = city.toLowerCase();
    if (key === lastLoaded.current) return; // avoid unnecessary API requests
    lastLoaded.current = key;
    loadCity(city).then((w) => { if (w) remember(w.city); else lastLoaded.current = ''; });
  }, [city]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSearch = (c) => setParams({ city: c });

  const handleLocation = () => {
    if (!navigator.geolocation) return toast.error('Geolocation is not supported by your browser. Please search for a city manually.');
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const w = await loadCoords(pos.coords.latitude, pos.coords.longitude);
        if (w) { lastLoaded.current = w.city.toLowerCase(); remember(w.city); setParams({ city: w.city }); }
      },
      (err) => toast.error(err.code === 1
        ? 'Location permission was denied. Please search for a city manually.'
        : 'Unable to determine your location. Please search for a city manually.'),
      { timeout: 10000 }
    );
  };

  const favorite = weather && favorites.find((f) => f.cityName.toLowerCase() === weather.city.toLowerCase());

  const toggleFavorite = async () => {
    try {
      if (favorite) {
        await favoriteService.remove(favorite.id);
        setFavorites((f) => f.filter((x) => x.id !== favorite.id));
        toast.success(`${weather.city} removed from favorites`);
      } else {
        const saved = await favoriteService.add({ cityName: weather.city, country: weather.country, latitude: weather.latitude, longitude: weather.longitude });
        setFavorites((f) => [saved, ...f]);
        toast.success(`${weather.city} saved to favorites`);
      }
    } catch (e) { toast.error(getErrorMessage(e)); }
  };

  return (
    <main className="page">
      <SearchBar onSearch={handleSearch} onLocation={handleLocation} loading={loading} recent={recent} />
      {favorites.length > 0 && (
        <div className="chips" aria-label="Favorite cities">
          <span className="muted">⭐ Favorites:</span>
          {favorites.map((f) => <button key={f.id} className="chip" onClick={() => handleSearch(f.cityName)}>{f.cityName}</button>)}
        </div>
      )}
      {loading && <Skeleton />}
      {!loading && error && (
        <div className="card empty" role="alert">
          <p className="empty-icon" aria-hidden="true">🌫️</p>
          <h2>{error}</h2>
          <p className="muted">Check the spelling or try another city.</p>
          {city && <button className="btn" onClick={() => { lastLoaded.current = city.toLowerCase(); loadCity(city); }}>Try again</button>}
        </div>
      )}
      {!loading && weather && (
        <>
          <CurrentWeather weather={weather} isFavorite={Boolean(favorite)} onToggleFavorite={toggleFavorite} />
          <HourlyForecast hours={hourly} />
          <Forecast days={forecast} />
          <WeatherCharts hours={hourly} days={forecast} />
        </>
      )}
    </main>
  );
}
