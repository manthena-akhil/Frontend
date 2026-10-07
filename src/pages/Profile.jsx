import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import * as authService from '../services/authService';
import { getErrorMessage } from '../services/api';
import { formatDateTime, passwordPattern } from '../utils/weather';

export default function Profile() {
  const { user, updateUser } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [busy, setBusy] = useState(false);
  const [profile, setProfile] = useState(user);

  useEffect(() => {
    authService.getProfile().then((p) => { setProfile(p); setName(p.name); }).catch(() => {});
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    const errs = {};
    if (!name.trim()) errs.name = 'Full name is required.';
    if (password && !passwordPattern.test(password)) errs.password = 'Use at least 8 characters with a letter and a number.';
    setErrors(errs);
    if (Object.keys(errs).length) return;
    setBusy(true);
    try {
      const updated = await authService.updateProfile({ name: name.trim(), password: password || null });
      updateUser(updated); setProfile(updated); setPassword('');
      toast.success('Profile updated');
    } catch (err) { toast.error(getErrorMessage(err)); }
    finally { setBusy(false); }
  };

  return (
    <main className="page narrow">
      <h1>👤 Profile</h1>
      <form className="card form" onSubmit={submit} noValidate>
        <p className="muted">{profile?.email}{profile?.createdAt ? ` · member since ${formatDateTime(profile.createdAt)}` : ''}</p>
        <label htmlFor="name">Full name</label>
        <input id="name" value={name} onChange={(e) => setName(e.target.value)} />
        {errors.name && <p className="field-error" role="alert">{errors.name}</p>}
        <label htmlFor="newpass">New password <span className="muted">(leave blank to keep current)</span></label>
        <input id="newpass" type="password" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="new-password" />
        {errors.password && <p className="field-error" role="alert">{errors.password}</p>}
        <button className="btn primary" type="submit" disabled={busy}>{busy ? 'Saving…' : 'Save changes'}</button>
      </form>
    </main>
  );
}
