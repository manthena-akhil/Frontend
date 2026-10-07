import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { getErrorMessage } from '../services/api';
import { emailPattern, passwordPattern } from '../utils/weather';

export default function Register() {
  const { register, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [errors, setErrors] = useState({});
  const [busy, setBusy] = useState(false);

  if (isAuthenticated) return <Navigate to="/" replace />;

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Full name is required.';
    if (!form.email.trim()) e.email = 'Email is required.';
    else if (!emailPattern.test(form.email.trim())) e.email = 'Please enter a valid email address.';
    if (!form.password) e.password = 'Password is required.';
    else if (!passwordPattern.test(form.password)) e.password = 'Use at least 8 characters with a letter and a number.';
    if (!form.confirmPassword) e.confirmPassword = 'Please confirm your password.';
    else if (form.confirmPassword !== form.password) e.confirmPassword = 'Passwords do not match.';
    return e;
  };

  const submit = async (ev) => {
    ev.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length) return;
    setBusy(true);
    try {
      await register({ ...form, name: form.name.trim(), email: form.email.trim() });
      toast.success('Account created!');
      navigate('/');
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally { setBusy(false); }
  };

  const field = (id, label, type, auto) => (
    <>
      <label htmlFor={id}>{label}</label>
      <input id={id} type={type} value={form[id]} onChange={set(id)} autoComplete={auto} />
      {errors[id] && <p className="field-error" role="alert">{errors[id]}</p>}
    </>
  );

  return (
    <main className="auth-page">
      <form className="card auth-card" onSubmit={submit} noValidate aria-label="Registration form">
        <h1>⛅ Create account</h1>
        {field('name', 'Full name', 'text', 'name')}
        {field('email', 'Email', 'email', 'email')}
        {field('password', 'Password', 'password', 'new-password')}
        {field('confirmPassword', 'Confirm password', 'password', 'new-password')}
        <button className="btn primary block-btn" type="submit" disabled={busy}>{busy ? 'Creating…' : 'Register'}</button>
        <p className="muted center">Already registered? <Link to="/login">Log in</Link></p>
      </form>
    </main>
  );
}
