import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import * as historyService from '../services/historyService';
import { getErrorMessage } from '../services/api';
import { useSettings } from '../context/SettingsContext';
import { formatDateTime } from '../utils/weather';

export default function History() {
  const [items, setItems] = useState(null);
  const { temp } = useSettings();
  const navigate = useNavigate();

  useEffect(() => {
    historyService.list().then(setItems).catch((e) => { toast.error(getErrorMessage(e)); setItems([]); });
  }, []);

  const remove = async (h) => {
    try { await historyService.remove(h.id); setItems((l) => l.filter((x) => x.id !== h.id)); toast.success('Record deleted'); }
    catch (e) { toast.error(getErrorMessage(e)); }
  };

  const clearAll = async () => {
    if (!window.confirm('Delete your entire search history?')) return;
    try { await historyService.clear(); setItems([]); toast.success('History cleared'); }
    catch (e) { toast.error(getErrorMessage(e)); }
  };

  return (
    <main className="page">
      <div className="page-head">
        <h1>🕘 Search history</h1>
        {items?.length > 0 && <button className="btn danger" onClick={clearAll}>Clear history</button>}
      </div>
      {items === null && <div className="skeleton row-sk" aria-busy="true" />}
      {items?.length === 0 && (
        <div className="card empty">
          <p className="empty-icon" aria-hidden="true">🕘</p>
          <h2>No searches yet</h2>
          <p className="muted">Cities you look up will appear here.</p>
          <Link className="btn primary" to="/">Search a city</Link>
        </div>
      )}
      {items?.length > 0 && (
        <div className="card table-wrap">
          <table>
            <thead><tr><th>City</th><th>Country</th><th>Temp</th><th>Condition</th><th>Searched</th><th /></tr></thead>
            <tbody>
              {items.map((h) => (
                <tr key={h.id}>
                  <td data-label="City"><button className="link-btn" onClick={() => navigate(`/?city=${encodeURIComponent(h.cityName)}`)}>{h.cityName}</button></td>
                  <td data-label="Country">{h.country}</td>
                  <td data-label="Temp">{temp(h.temperature)}</td>
                  <td data-label="Condition">{h.weatherCondition}</td>
                  <td data-label="Searched">{formatDateTime(h.searchedAt)}</td>
                  <td><button className="btn small danger" onClick={() => remove(h)} aria-label={`Delete ${h.cityName} record`}>Delete</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}
