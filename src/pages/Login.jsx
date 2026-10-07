import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { getErrorMessage } from '../services/api';
import { emailPattern } from '../utils/weather';

export default function Login() {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [busy, setBusy] = useState(false);

  if (isAuthenticated) return <Navigate to="/" replace />;

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    const errs = {};
    if (!form.email.trim()) errs.email = 'Email is required.';
    else if (!emailPattern.test(form.email.trim())) errs.email = 'Please enter a valid email address.';
    if (!form.password) errs.password = 'Password is required.';
    setErrors(errs);
    if (Object.keys(errs).length) return;
    setBusy(true);
    try {
      await login(form.email.trim(), form.password);
      toast.success('Welcome back!');
      navigate('/');
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally { setBusy(false); }
  };

  return (
    <main className="auth-page">
      <form className="card auth-card" onSubmit={submit} noValidate aria-label="Login form">
        <h1>⛅ Log in</h1>
        <p className="muted">Check the weather anywhere, and keep your favorite cities.</p>
        <label htmlFor="email">Email</label>
        <input id="email" type="email" value={form.email} onChange={set('email')} autoComplete="email" />
        {errors.email && <p className="field-error" role="alert">{errors.email}</p>}
        <label htmlFor="password">Password</label>
        <input id="password" type="password" value={form.password} onChange={set('password')} autoComplete="current-password" />
        {errors.password && <p className="field-error" role="alert">{errors.password}</p>}
        <button className="btn primary block-btn" type="submit" disabled={busy}>{busy ? 'Logging in…' : 'Log in'}</button>
        <p className="muted center">New here? <Link to="/register">Create an account</Link></p>
      </form>
    </main>
  );
}
