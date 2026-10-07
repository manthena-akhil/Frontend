import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { formatTemp } from '../utils/weather';

const SettingsContext = createContext(null);

export function SettingsProvider({ children }) {
  const [unit, setUnit] = useState(() => localStorage.getItem('unit') || 'C');
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('theme');
    if (saved) return saved;
    return window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  useEffect(() => { localStorage.setItem('unit', unit); }, [unit]);
  useEffect(() => {
    localStorage.setItem('theme', theme);
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  const value = useMemo(() => ({
    unit, theme,
    toggleUnit: () => setUnit((u) => (u === 'C' ? 'F' : 'C')),
    toggleTheme: () => setTheme((t) => (t === 'dark' ? 'light' : 'dark')),
    temp: (celsius) => formatTemp(celsius, unit),
  }), [unit, theme]);

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
}

export const useSettings = () => {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error('useSettings must be used inside SettingsProvider');
  return ctx;
};
