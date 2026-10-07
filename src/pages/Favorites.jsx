import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import * as favoriteService from '../services/favoriteService';
import { getErrorMessage } from '../services/api';

export default function Favorites() {
  const [items, setItems] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    favoriteService.list().then(setItems).catch((e) => { toast.error(getErrorMessage(e)); setItems([]); });
  }, []);

  const remove = async (f) => {
    try {
      await favoriteService.remove(f.id);
      setItems((list) => list.filter((x) => x.id !== f.id));
      toast.success(`${f.cityName} removed`);
    } catch (e) { toast.error(getErrorMessage(e)); }
  };

  return (
    <main className="page">
      <h1>⭐ Favorite cities</h1>
      {items === null && <div className="skeleton row-sk" aria-busy="true" />}
      {items?.length === 0 && (
        <div className="card empty">
          <p className="empty-icon" aria-hidden="true">☆</p>
          <h2>No favorite cities yet</h2>
          <p className="muted">Search for a city on the dashboard and choose “Save city”.</p>
          <Link className="btn primary" to="/">Go to dashboard</Link>
        </div>
      )}
      <div className="fav-grid">
        {items?.map((f) => (
          <div className="card fav" key={f.id}>
            <button className="fav-main" onClick={() => navigate(`/?city=${encodeURIComponent(f.cityName)}`)}>
              <strong>{f.cityName}</strong><span className="muted">{f.country}</span>
            </button>
            <button className="btn small danger" onClick={() => remove(f)} aria-label={`Remove ${f.cityName}`}>Remove</button>
          </div>
        ))}
      </div>
    </main>
  );
}
