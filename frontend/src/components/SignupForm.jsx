import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, User, Eye, EyeOff, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { FlightIcon } from './common/WanderIcons';
import { motion } from 'motion/react';

const SignupForm = () => {
  const { signup } = useAuth();
  const navigate = useNavigate();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password || !confirmPassword) {
      setError('Please fill in all required fields.');
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      await signup(email, password);
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.error?.message ||
        'Failed to sign up. Email might already be registered.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="w-full max-w-lg bg-[var(--color-surface-1)] border border-[var(--color-hairline)] rounded-3xl p-8 sm:p-10 shadow-xl relative"
    >
      {/* Top Icon Badge */}
      <div className="flex justify-center mb-4">
        <div className="w-12 h-12 rounded-full bg-[var(--color-canvas)] border border-[var(--color-hairline)] flex items-center justify-center text-[var(--color-primary)]">
          <FlightIcon className="w-6 h-6 text-[var(--color-primary)]" />
        </div>
      </div>

      <div className="text-center mb-8">
        <h2 className="text-3xl font-serif font-bold text-[var(--color-ink)] tracking-tight">Let's Get You Started</h2>
        <p className="mt-2 text-sm text-[var(--color-ink-subtle)]">
          Create an account and start your journey.
        </p>
      </div>

      {error && (
        <div className="mb-6 rounded-xl bg-red-50 border border-red-200 p-4 text-xs font-semibold text-red-700">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[var(--color-ink-muted)] mb-1.5">Full Name</label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-[#94A3B8]">
                <User className="h-4 w-4" />
              </div>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="block w-full rounded-xl border border-[var(--color-hairline)] bg-[var(--color-canvas)] pl-10 pr-3.5 py-3 text-sm text-[var(--color-ink)] placeholder-[#94A3B8] focus:border-[var(--color-primary)] focus:bg-[var(--color-surface-1)] focus:outline-none transition-all"
                placeholder="Enter your full name"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[var(--color-ink-muted)] mb-1.5">Email</label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-[#94A3B8]">
                <Mail className="h-4 w-4" />
              </div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="block w-full rounded-xl border border-[var(--color-hairline)] bg-[var(--color-canvas)] pl-10 pr-3.5 py-3 text-sm text-[var(--color-ink)] placeholder-[#94A3B8] focus:border-[var(--color-primary)] focus:bg-[var(--color-surface-1)] focus:outline-none transition-all"
                placeholder="Enter your email"
                required
              />
            </div>
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-[var(--color-ink-muted)] mb-1.5">Password</label>
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-[#94A3B8]">
              <Lock className="h-4 w-4" />
            </div>
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="block w-full rounded-xl border border-[var(--color-hairline)] bg-[var(--color-canvas)] pl-10 pr-10 py-3 text-sm text-[var(--color-ink)] placeholder-[#94A3B8] focus:border-[var(--color-primary)] focus:bg-[var(--color-surface-1)] focus:outline-none transition-all"
              placeholder="Create a password"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-[#94A3B8] hover:text-[var(--color-ink-muted)] transition-colors"
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-[var(--color-ink-muted)] mb-1.5">Confirm Password</label>
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-[#94A3B8]">
              <Lock className="h-4 w-4" />
            </div>
            <input
              type={showPassword ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="block w-full rounded-xl border border-[var(--color-hairline)] bg-[var(--color-canvas)] pl-10 pr-10 py-3 text-sm text-[var(--color-ink)] placeholder-[#94A3B8] focus:border-[var(--color-primary)] focus:bg-[var(--color-surface-1)] focus:outline-none transition-all"
              placeholder="Confirm your password"
              required
            />
          </div>
          <p className="text-2xs text-[#94A3B8] mt-1">Password must be at least 8 characters long.</p>
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          disabled={loading}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] px-4 py-3.5 text-sm font-semibold text-white shadow-md transition-colors cursor-pointer disabled:opacity-50 mt-2"
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Creating account...</span>
            </>
          ) : (
            <>
              <span>Sign Up</span>
              <FlightIcon className="h-4 w-4 text-white" />
            </>
          )}
        </motion.button>
      </form>

      <p className="mt-6 text-center text-xs text-[#94A3B8] leading-relaxed">
        By signing up, you agree to our <span className="underline cursor-pointer">Terms of Service</span> and <span className="underline cursor-pointer">Privacy Policy</span>.
      </p>
    </motion.div>
  );
};

export default SignupForm;
