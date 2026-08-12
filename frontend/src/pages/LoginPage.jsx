import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import LoginForm from '../components/LoginForm';
import { WanderLogo, StampBadge } from '../components/common/WanderIcons';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
  const { isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated && !loading) {
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, loading, navigate]);
  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#1E293B] flex flex-col justify-between selection:bg-[#D97706]/20 relative overflow-hidden font-sans">
      {/* Real Watercolor Artwork Background */}
      <div
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat opacity-90 pointer-events-none"
        style={{ backgroundImage: "url('/assets/login_bg.png')" }}
      />

      {/* TOP NAV BAR */}
      <header className="px-8 py-6 flex items-center justify-between z-10">
        <Link to="/">
          <WanderLogo />
        </Link>
        <div className="flex items-center gap-3 text-sm">
          <span className="text-[#64748B]">New here?</span>
          <Link
            to="/signup"
            className="border border-[#EBE7DF] bg-[#FFFDF9] hover:bg-[#FAF8F5] text-[#1D3B3A] font-semibold px-4 py-2 rounded-xl transition-all shadow-2xs flex items-center gap-1.5"
          >
            <span>Sign up</span>
            <span>→</span>
          </Link>
        </div>
      </header>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 flex items-center justify-center px-4 py-8 z-10">
        <LoginForm />
      </main>

      {/* FOOTER */}
      <footer className="px-8 py-6 border-t border-[#EBE7DF]/60 flex flex-col sm:flex-row items-center justify-between text-xs text-[#94A3B8] gap-4 z-10">
        <WanderLogo className="h-6 w-6" textClass="text-base font-bold font-serif text-[#1D3B3A]" />
        <div>© 2026 Wander. All rights reserved.</div>
      </footer>
    </div>
  );
};

export default LoginPage;
