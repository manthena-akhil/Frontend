import { useState } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useSettings } from '../context/SettingsContext';

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { user, logout } = useAuth();
  const { unit, toggleUnit, theme, toggleTheme } = useSettings();
  const navigate = useNavigate();
  const close = () => setOpen(false);

  const handleLogout = () => { close(); logout(); navigate('/login'); };

  return (
    <header className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="brand" onClick={close}><span aria-hidden="true">⛅</span> Weather App</Link>
        <button className="icon-btn menu-btn" aria-label="Toggle menu" aria-expanded={open} onClick={() => setOpen((o) => !o)}>
          {open ? '✕' : '☰'}
        </button>
        <nav className={`nav-links ${open ? 'open' : ''}`}>
          <NavLink to="/" end onClick={close}>Dashboard</NavLink>
          <NavLink to="/favorites" onClick={close}>Favorites</NavLink>
          <NavLink to="/history" onClick={close}>History</NavLink>
          <NavLink to="/profile" onClick={close}>{user?.name?.split(' ')[0] || 'Profile'}</NavLink>
          <div className="nav-actions">
            <button className="seg" onClick={toggleUnit} aria-label={`Switch to ${unit === 'C' ? 'Fahrenheit' : 'Celsius'}`}>
              <span className={unit === 'C' ? 'on' : ''}>°C</span><span className={unit === 'F' ? 'on' : ''}>°F</span>
            </button>
            <button className="icon-btn" onClick={toggleTheme} aria-label="Toggle dark mode">{theme === 'dark' ? '☀️' : '🌙'}</button>
            <button className="btn small" onClick={handleLogout}>Log out</button>
          </div>
        </nav>
      </div>
    </header>
  );
}
