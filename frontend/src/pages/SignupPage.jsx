import React from 'react';
import { Link } from 'react-router-dom';
import SignupForm from '../components/SignupForm';
import { WanderLogo } from '../components/common/WanderIcons';

const SignupPage = () => {
  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#1E293B] flex flex-col justify-between selection:bg-[#D97706]/20 relative overflow-hidden font-sans">
      {/* Real Watercolor Artwork Background */}
      <div
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat opacity-90 pointer-events-none"
        style={{ backgroundImage: "url('/assets/signup_bg.png')" }}
      />
      {/* TOP NAV BAR */}
      <header className="px-8 py-6 flex items-center justify-between z-10">
        <Link to="/">
          <WanderLogo />
        </Link>
        <div className="flex items-center gap-3 text-sm">
          <span className="text-[#64748B]">Already have an account?</span>
          <Link
            to="/login"
            className="border border-[#EBE7DF] bg-[#FFFDF9] hover:bg-[#FAF8F5] text-[#1D3B3A] font-semibold px-4 py-2 rounded-xl transition-all shadow-2xs flex items-center gap-1.5"
          >
            <span>Login</span>
            <span>→</span>
          </Link>
        </div>
      </header>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 flex items-center justify-center px-4 py-8 z-10">
        <SignupForm />
      </main>

      {/* FOOTER */}
      <footer className="px-8 py-6 border-t border-[#EBE7DF]/60 flex flex-col sm:flex-row items-center justify-between text-xs text-[#94A3B8] gap-4 z-10">
        <WanderLogo className="h-6 w-6" textClass="text-base font-bold font-serif text-[#1D3B3A]" />
        <div>© 2026 Wander. All rights reserved.</div>
      </footer>
    </div>
  );
};

export default SignupPage;
