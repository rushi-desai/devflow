import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Input } from '../components/common/Input';
import { Button } from '../components/common/Button';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Mail, Lock, LogIn, Sparkles } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    setIsLoading(true);
    setError('');
    try {
      await login(email.trim(), password);
      showToast('success', 'Welcome back!', 'Successfully signed in');
      navigate(from, { replace: true });
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Invalid email or password';
      setError(msg);
      showToast('error', 'Login failed', msg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoFill = () => {
    setEmail('developer@devflow.io');
    setPassword('Password123!');
    setError('');
  };

  return (
    <div className="bg-[#11141b] border border-slate-800 p-6 sm:p-8 rounded-2xl shadow-xl shadow-black/10">
      <div className="mb-7">
        <p className="text-xs font-medium text-indigo-400 mb-2">Welcome back</p>
        <h2 className="text-2xl font-semibold text-slate-100">Sign in to DevFlow</h2>
        <p className="text-sm text-slate-400 mt-2">Pick up where you left off.</p>
      </div>

      {error && (
        <div className="p-3.5 mb-6 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-medium">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Email Address"
          type="email"
          placeholder="name@company.com"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (error) setError('');
          }}
          leftIcon={<Mail className="w-4 h-4" />}
          autoFocus
          required
        />

        <Input
          label="Password"
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            if (error) setError('');
          }}
          leftIcon={<Lock className="w-4 h-4" />}
          required
        />

        <Button
          type="submit"
          variant="primary"
          size="lg"
          className="w-full mt-3"
          isLoading={isLoading}
          rightIcon={<LogIn className="w-4 h-4" />}
        >
          Sign In
        </Button>
      </form>

      <div className="mt-6 pt-5 border-t border-slate-800">
        <button
          type="button"
          onClick={handleDemoFill}
          className="w-full flex items-center justify-center gap-2 p-2.5 rounded-lg bg-indigo-500/10 hover:bg-indigo-500/15 border border-indigo-500/25 text-indigo-300 text-xs font-medium transition-colors"
        >
          <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
          <span>Auto-fill Demo Credentials</span>
        </button>
      </div>

      <div className="mt-6 text-center text-xs text-slate-400">
        Don't have an account?{' '}
        <Link to="/register" className="text-indigo-400 hover:text-indigo-300 font-semibold underline underline-offset-4">
          Create Account
        </Link>
      </div>
    </div>
  );
};
