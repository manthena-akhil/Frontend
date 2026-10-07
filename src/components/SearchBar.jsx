import { useState } from 'react';

export default function SearchBar({ onSearch, onLocation, loading = false, recent = [] }) {
  const [value, setValue] = useState('');
  const [error, setError] = useState('');

  const submit = (e) => {
    e.preventDefault();
    const city = value.trim();
    if (!city) return setError('Please enter a city name.');
    if (city.length > 100 || !/^[\p{L}\p{M}\s.'-]+$/u.test(city)) return setError('Please enter a valid city name.');
    setError('');
    onSearch(city);
    setValue('');
  };

  return (
    <section className="search" aria-label="Search weather">
      <form className="search-row" onSubmit={submit} noValidate>
        <input
          type="search" aria-label="City name" placeholder="Search city..." value={value}
          onChange={(e) => { setValue(e.target.value); if (error) setError(''); }}
          aria-invalid={Boolean(error)} autoComplete="off"
        />
        <button className="btn primary" type="submit" disabled={loading}>Search</button>
        <button className="btn" type="button" onClick={onLocation} disabled={loading}>📍 Use My Location</button>
      </form>
      {error && <p className="field-error" role="alert">{error}</p>}
      {recent.length > 0 && (
        <div className="chips" aria-label="Recent searches">
          <span className="muted">Recent:</span>
          {recent.map((c) => (
            <button key={c} type="button" className="chip" onClick={() => onSearch(c)}>{c}</button>
          ))}
        </div>
      )}
    </section>
  );
}
