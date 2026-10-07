const EMOJI = {
  '01d': '☀️', '01n': '🌙', '02d': '⛅', '02n': '☁️', '03d': '☁️', '03n': '☁️', '04d': '☁️', '04n': '☁️',
  '09d': '🌧️', '09n': '🌧️', '10d': '🌦️', '10n': '🌧️', '11d': '⛈️', '11n': '⛈️', '13d': '❄️', '13n': '❄️',
  '50d': '🌫️', '50n': '🌫️',
};

export const weatherEmoji = (icon) => EMOJI[icon] || '🌡️';

/** CSS class that drives the hero background for the current conditions. */
export function weatherTheme(icon = '01d') {
  const night = icon.endsWith('n');
  switch (icon.slice(0, 2)) {
    case '01': return night ? 'wx-night' : 'wx-sunny';
    case '02': case '03': case '04': return night ? 'wx-night' : 'wx-cloudy';
    case '09': case '10': return 'wx-rain';
    case '11': return 'wx-storm';
    case '13': return 'wx-snow';
    default: return night ? 'wx-night' : 'wx-cloudy';
  }
}

export const toUnit = (celsius, unit) => (unit === 'F' ? celsius * 9 / 5 + 32 : celsius);

export const formatTemp = (celsius, unit) =>
  celsius === null || celsius === undefined ? '--°' : `${Math.round(toUnit(celsius, unit))}°`;

export const formatDateTime = (iso) => {
  if (!iso) return '';
  const d = new Date(iso);
  return Number.isNaN(d.getTime())
    ? ''
    : d.toLocaleString(undefined, { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
};

export const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const passwordPattern = /^(?=.*[A-Za-z])(?=.*\d).{8,100}$/;
