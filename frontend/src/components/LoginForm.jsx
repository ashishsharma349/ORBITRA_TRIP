import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, Eye, EyeOff, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { FlightIcon } from './common/WanderIcons';
import { motion } from 'motion/react';

const LoginForm = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please fill in all fields.');
      return;
    }

    setLoading(true);
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.error?.message ||
        'Failed to log in. Please check your credentials.'
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
      className="w-full max-w-md bg-[var(--color-surface-1)] border border-[var(--color-hairline)] rounded-3xl p-8 sm:p-10 shadow-xl relative"
    >
      {/* Top Icon Badge */}
      <div className="flex justify-center mb-4">
        <div className="w-12 h-12 rounded-full bg-[var(--color-canvas)] border border-[var(--color-hairline)] flex items-center justify-center text-[var(--color-primary)]">
          <FlightIcon className="w-6 h-6 rotate-45 text-[var(--color-primary)]" />
        </div>
      </div>

      <div className="text-center mb-8">
        <h2 className="text-3xl font-serif font-bold text-[var(--color-ink)] tracking-tight">Welcome Back!</h2>
        <p className="mt-2 text-sm text-[var(--color-ink-subtle)]">
          Login to continue your journey.
        </p>
      </div>

      {error && (
        <div className="mb-6 rounded-xl bg-red-50 border border-red-200 p-4 text-xs font-semibold text-red-700">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
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
              placeholder="Enter your password"
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

        <div className="flex items-center justify-between text-xs text-[var(--color-ink-subtle)]">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="rounded border-[var(--color-hairline)] text-[var(--color-primary)] focus:ring-[var(--color-primary)]"
            />
            <span>Remember me</span>
          </label>
          <span className="font-semibold text-[var(--color-primary)] hover:underline cursor-pointer">Forgot password?</span>
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          disabled={loading}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] px-4 py-3.5 text-sm font-semibold text-white shadow-md transition-colors cursor-pointer disabled:opacity-50"
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Signing in...</span>
            </>
          ) : (
            <>
              <span>Login</span>
              <FlightIcon className="h-4 w-4 rotate-45 text-white" />
            </>
          )}
        </motion.button>
      </form>

      <p className="mt-6 text-center text-xs text-[#94A3B8] leading-relaxed">
        By logging in, you agree to our <span className="underline cursor-pointer">Terms of Service</span> and <span className="underline cursor-pointer">Privacy Policy</span>.
      </p>
    </motion.div>
  );
};

export default LoginForm;
