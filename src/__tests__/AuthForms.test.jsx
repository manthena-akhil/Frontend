import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { vi } from 'vitest';
import Login from '../pages/Login';
import Register from '../pages/Register';

const login = vi.fn().mockResolvedValue();
const register = vi.fn().mockResolvedValue();
vi.mock('../context/AuthContext', () => ({
  useAuth: () => ({ login, register, isAuthenticated: false }),
}));
vi.mock('react-hot-toast', () => ({ default: { success: vi.fn(), error: vi.fn() } }));

const wrap = (ui) => render(<MemoryRouter>{ui}</MemoryRouter>);
beforeEach(() => { login.mockClear(); register.mockClear(); });

describe('Login form', () => {
  it('validates required fields', async () => {
    wrap(<Login />);
    await userEvent.click(screen.getByRole('button', { name: 'Log in' }));
    expect(screen.getByText('Email is required.')).toBeInTheDocument();
    expect(screen.getByText('Password is required.')).toBeInTheDocument();
    expect(login).not.toHaveBeenCalled();
  });

  it('submits valid credentials', async () => {
    wrap(<Login />);
    await userEvent.type(screen.getByLabelText('Email'), 'demo@weatherapp.com');
    await userEvent.type(screen.getByLabelText('Password'), 'Demo@1234');
    await userEvent.click(screen.getByRole('button', { name: 'Log in' }));
    expect(login).toHaveBeenCalledWith('demo@weatherapp.com', 'Demo@1234');
  });
});

describe('Register form', () => {
  it('shows validation errors for bad input', async () => {
    wrap(<Register />);
    await userEvent.type(screen.getByLabelText('Full name'), 'Kiran');
    await userEvent.type(screen.getByLabelText('Email'), 'not-an-email');
    await userEvent.type(screen.getByLabelText('Password'), 'short');
    await userEvent.type(screen.getByLabelText('Confirm password'), 'other');
    await userEvent.click(screen.getByRole('button', { name: 'Register' }));
    expect(screen.getByText('Please enter a valid email address.')).toBeInTheDocument();
    expect(screen.getByText(/at least 8 characters/)).toBeInTheDocument();
    expect(screen.getByText('Passwords do not match.')).toBeInTheDocument();
    expect(register).not.toHaveBeenCalled();
  });

  it('submits a valid registration', async () => {
    wrap(<Register />);
    await userEvent.type(screen.getByLabelText('Full name'), 'Kiran');
    await userEvent.type(screen.getByLabelText('Email'), 'kiran@example.com');
    await userEvent.type(screen.getByLabelText('Password'), 'Passw0rd1');
    await userEvent.type(screen.getByLabelText('Confirm password'), 'Passw0rd1');
    await userEvent.click(screen.getByRole('button', { name: 'Register' }));
    expect(register).toHaveBeenCalledWith(expect.objectContaining({ email: 'kiran@example.com', password: 'Passw0rd1' }));
  });
});
