import { useCallback, useRef, useState } from 'react';
import * as weatherService from '../services/weatherService';
import { getErrorMessage } from '../services/api';

const EMPTY = { weather: null, forecast: [], hourly: [], loading: false, error: '' };

/** Loads current weather + forecasts together and ignores stale responses. */
export default function useWeather() {
  const [state, setState] = useState(EMPTY);
  const requestId = useRef(0);

  const run = useCallback(async (getCurrent) => {
    const id = ++requestId.current;
    setState((s) => ({ ...s, loading: true, error: '' }));
    try {
      const weather = await getCurrent();
      const [forecast, hourly] = await Promise.all([
        weatherService.forecast(weather.city),
        weatherService.hourly(weather.city),
      ]);
      if (id !== requestId.current) return null;
      setState({ weather, forecast, hourly, loading: false, error: '' });
      return weather;
    } catch (e) {
      if (id === requestId.current) setState({ ...EMPTY, error: getErrorMessage(e) });
      return null;
    }
  }, []);

  const loadCity = useCallback((city) => run(() => weatherService.byCity(city)), [run]);
  const loadCoords = useCallback((lat, lon) => run(() => weatherService.byCoordinates(lat, lon)), [run]);

  return { ...state, loadCity, loadCoords };
}
