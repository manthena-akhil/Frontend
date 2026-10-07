import api from './api';

export const byCity = (city) => api.get(`/weather/city/${encodeURIComponent(city)}`).then((r) => r.data);
export const byCoordinates = (lat, lon) => api.get('/weather/coordinates', { params: { lat, lon } }).then((r) => r.data);
export const forecast = (city) => api.get(`/weather/forecast/${encodeURIComponent(city)}`).then((r) => r.data);
export const hourly = (city) => api.get(`/weather/hourly/${encodeURIComponent(city)}`).then((r) => r.data);
