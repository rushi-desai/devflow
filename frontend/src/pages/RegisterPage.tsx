import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Input } from '../components/common/Input';
import { Button } from '../components/common/Button';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { User as UserIcon, Mail, Lock, UserPlus } from 'lucide-react';

export const RegisterPage: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { register } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) {
      setError('Please fill in all fields');
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    setIsLoading(true);
    setError('');
    try {
      await register(name.trim(), email.trim(), password);
      showToast('success', 'Account created', 'Welcome to DevFlow!');
      navigate('/dashboard', { replace: true });
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Failed to create account';
      setError(msg);
      showToast('error', 'Registration failed', msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-[#11141b] border border-slate-800 p-6 sm:p-8 rounded-2xl shadow-xl shadow-black/10">
      <div className="mb-7">
        <p className="text-xs font-medium text-indigo-400 mb-2">New here?</p>
        <h2 className="text-2xl font-semibold text-slate-100">Create your account</h2>
        <p className="text-sm text-slate-400 mt-2">A few details and you're ready to start.</p>
      </div>

      {error && (
        <div className="p-3.5 mb-6 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-medium">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Full Name"
          type="text"
          placeholder="e.g. Alex Morgan"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            if (error) setError('');
          }}
          leftIcon={<UserIcon className="w-4 h-4" />}
          autoFocus
          required
        />

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
          required
        />

        <Input
          label="Password"
          type="password"
          placeholder="Minimum 8 characters"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            if (error) setError('');
          }}
          leftIcon={<Lock className="w-4 h-4" />}
          helperText="Must be at least 8 characters long"
          required
        />

        <Button
          type="submit"
          variant="primary"
          size="lg"
          className="w-full mt-3"
          isLoading={isLoading}
          rightIcon={<UserPlus className="w-4 h-4" />}
        >
          Create Account
        </Button>
      </form>

      <div className="mt-6 text-center text-xs text-slate-400">
        Already have an account?{' '}
        <Link to="/login" className="text-indigo-400 hover:text-indigo-300 font-semibold underline underline-offset-4">
          Sign In
        </Link>
      </div>
    </div>
  );
};
