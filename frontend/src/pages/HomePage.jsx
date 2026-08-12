import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowRight, ChevronDown, Mail, Sparkles, ShieldCheck, Share2 } from 'lucide-react';
import {
  WanderLogo,
  FlightIcon,
  HotelIcon,
  TrainIcon,
  StampBadge,
  DocumentStackIllustration,
  AIExtractionIllustration,
  MapShareIllustration,
  PagodaLandscapeIllustration,
  JapanMapGraphic,
  GithubIcon,
  LinkedinIcon
} from '../components/common/WanderIcons';
import { useAuth } from '../context/AuthContext';

const fadeInUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15
    }
  }
};

const HomePage = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();

  const handleTryDashboard = () => {
    navigate('/dashboard');
  };

  const handleGetStarted = () => {
    navigate('/signup');
  };

  const handleLogin = () => {
    navigate('/login');
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#1E293B] font-sans selection:bg-[#D97706]/20 selection:text-[#1D3B3A]">
      {/* 1. HEADER */}
      <header className="sticky top-0 z-50 bg-[#FAF8F5]/90 backdrop-blur-md border-b border-[#EBE7DF]">
        <div className="mx-auto max-w-7xl px-6 h-20 flex items-center justify-between">
          <Link to="/" className="cursor-pointer">
            <WanderLogo />
          </Link>

          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-[#475569]">
            <a href="#features" className="hover:text-[#1D3B3A] transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-[#1D3B3A] transition-colors">How It Works</a>
            <a href="#demo" className="hover:text-[#1D3B3A] transition-colors">Demo</a>
          </nav>

          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <>
                <button
                  onClick={handleLogout}
                  className="text-sm font-semibold text-[#64748B] hover:text-[#0F172A] px-3 py-2 transition-colors cursor-pointer"
                >
                  Logout
                </button>
                <button
                  onClick={handleTryDashboard}
                  className="bg-[#1D3B3A] hover:bg-[#162E2D] text-white text-sm font-medium px-5 py-2.5 rounded-xl shadow-sm transition-all duration-200 cursor-pointer hover:scale-102"
                >
                  Dashboard
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={handleLogin}
                  className="text-sm font-semibold text-[#1D3B3A] hover:text-[#0F172A] px-3 py-2 transition-colors cursor-pointer"
                >
                  Login
                </button>
                <button
                  onClick={handleGetStarted}
                  className="bg-[#1D3B3A] hover:bg-[#162E2D] text-white text-sm font-medium px-5 py-2.5 rounded-xl shadow-sm transition-all duration-200 cursor-pointer hover:scale-102"
                >
                  Get Started
                </button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* 2. HERO SECTION */}
      <section className="relative pt-12 pb-24 overflow-hidden min-h-[650px] bg-[#FAF8F5]">
        {/* Real Watercolor Artwork Background */}
        <div 
          className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat opacity-85 pointer-events-none mix-blend-multiply"
          style={{ backgroundImage: "url('/assets/home_hero_bg.png')" }}
        />
        {/* Animated Flight Line SVG */}
        <div className="absolute top-12 right-1/4 pointer-events-none opacity-80 hidden lg:block">
          <svg className="w-96 h-32" viewBox="0 0 400 120" fill="none">
            <motion.path
              d="M10 100 Q 200 10 380 40"
              stroke="#C8BFA9"
              strokeWidth="2"
              strokeDasharray="6 6"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 2, ease: 'easeInOut' }}
            />
          </svg>
          <motion.div
            className="absolute top-2 right-12"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 1.5, duration: 0.5 }}
          >
            <FlightIcon className="w-8 h-8 text-[#B45309] rotate-12" />
          </motion.div>
        </div>

        <div className="mx-auto max-w-7xl px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Hero Left Content */}
          <motion.div
            className="lg:col-span-6 space-y-8 z-10"
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
          >
            <motion.h1 variants={fadeInUp} className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[var(--color-ink)] leading-[1.15] tracking-tight">
              Turn Chaotic Bookings into <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--color-primary)] to-[#a855f7]">Beautiful Journeys.</span>
            </motion.h1>
            <motion.p variants={fadeInUp} className="text-lg text-[var(--color-ink-muted)] leading-relaxed max-w-xl">
              Wander uses AI to read your travel documents and create a clean, chronological itinerary—automatically.
            </motion.p>

            <motion.div variants={fadeInUp} className="flex flex-wrap items-center gap-4">
              <button
                onClick={handleTryDashboard}
                className="bg-[var(--color-ink)] hover:bg-black text-white font-medium px-7 py-3.5 rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all flex items-center gap-2 cursor-pointer"
              >
                <span>Try Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <a
                href="#how-it-works"
                className="text-sm font-semibold text-[var(--color-ink-muted)] hover:text-[var(--color-ink)] px-4 py-3.5 flex items-center gap-1.5 transition-colors"
              >
                <span>See How It Works</span>
                <ChevronDown className="w-4 h-4" />
              </a>
            </motion.div>


          </motion.div>

          {/* Hero Right Visuals */}
          <motion.div
            className="lg:col-span-6 relative"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            {/* Wooden Sign Post Badges */}
            <div className="absolute -left-6 bottom-4 hidden sm:flex flex-col gap-2 z-20">
              <StampBadge text="JOURNEYS" className="transform -rotate-6" />
              <StampBadge text="MEMORIES" className="transform rotate-3 ml-2" />
              <StampBadge text="ADVENTURES" className="transform -rotate-2" />
            </div>

            {/* Floating Itinerary Card */}
            <div className="bg-[#FFFDF9] border border-[#EBE7DF] rounded-2xl p-6 shadow-xl relative z-10 space-y-4 hover:shadow-2xl transition-all">
              <div className="flex items-center justify-between border-b border-[#F1ECE1] pb-3">
                <span className="font-serif font-bold text-[#1D3B3A] text-lg flex items-center gap-1.5">
                  <span>Your Itinerary</span>
                </span>
              </div>

              {/* Flight Item */}
              <div className="flex items-start gap-4 p-3 rounded-xl bg-[#FAF8F5] border border-[#F1ECE1] hover:border-[#1D3B3A]/30 transition-all">
                <div className="w-10 h-10 rounded-full bg-[#E8F3F1] flex items-center justify-center shrink-0">
                  <FlightIcon className="w-5 h-5 text-[#1D3B3A]" />
                </div>
                <div className="flex-1">
                  <div className="text-xs font-bold text-[#94A3B8] uppercase">Flight</div>
                  <div className="font-bold text-[#0F172A]">Delhi → Tokyo</div>
                  <div className="text-xs text-[#64748B] mt-0.5">10 May, 2026 • 08:30 — 17:10</div>
                </div>
              </div>

              {/* Hotel Item */}
              <div className="flex items-start gap-4 p-3 rounded-xl bg-[#FAF8F5] border border-[#F1ECE1] hover:border-[#D97706]/30 transition-all">
                <div className="w-10 h-10 rounded-full bg-[#FEF3C7] flex items-center justify-center shrink-0">
                  <HotelIcon className="w-5 h-5 text-[#D97706]" />
                </div>
                <div className="flex-1">
                  <div className="text-xs font-bold text-[#94A3B8] uppercase">Hotel</div>
                  <div className="font-bold text-[#0F172A]">Tokyo Hotel</div>
                  <div className="text-xs text-[#64748B] mt-0.5">Check-in 10 May • Check-out 13 May</div>
                </div>
              </div>

              {/* Train Item */}
              <div className="flex items-start gap-4 p-3 rounded-xl bg-[#FAF8F5] border border-[#F1ECE1] hover:border-[#059669]/30 transition-all">
                <div className="w-10 h-10 rounded-full bg-[#D1FAE5] flex items-center justify-center shrink-0">
                  <TrainIcon className="w-5 h-5 text-[#059669]" />
                </div>
                <div className="flex-1">
                  <div className="text-xs font-bold text-[#94A3B8] uppercase">Train</div>
                  <div className="font-bold text-[#0F172A]">Tokyo → Kyoto</div>
                  <div className="text-xs text-[#64748B] mt-0.5">13 May, 2026 • 09:15 — 11:45</div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 3. FEATURES SECTION */}
      <section id="features" className="py-20 bg-[#FFFDF9] border-y border-[#EBE7DF]">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#0F172A]">
              Everything from <span className="underline decoration-[#D97706] underline-offset-8">your trip</span>, in one journey.
            </h2>
          </div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {/* Feature 1 */}
            <motion.div variants={fadeInUp} className="bg-[var(--color-surface-1)] border border-[var(--color-hairline)] rounded-3xl p-8 space-y-4 hover:shadow-2xl hover:border-[var(--color-primary)] hover:-translate-y-2 transition-all duration-300 relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-primary)]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
              <div className="flex items-center justify-between">
                <DocumentStackIllustration />
                <ArrowRight className="w-5 h-5 text-[#94A3B8]" />
              </div>
              <h3 className="text-xl font-bold font-serif text-[#0F172A]">AI Document Extraction</h3>
              <p className="text-sm text-[#64748B] leading-relaxed">
                Upload PDF, JPEG or PNG travel documents. Powered by Google Gemini API, Wander extracts every important detail.
              </p>
              <div className="flex items-center gap-2 pt-2">
                <span className="text-2xs font-bold bg-[#FFFDF9] border border-[#EBE7DF] px-2 py-0.5 rounded text-[#475569]">PDF</span>
                <span className="text-2xs font-bold bg-[#FFFDF9] border border-[#EBE7DF] px-2 py-0.5 rounded text-[#475569]">JPEG</span>
                <span className="text-2xs font-bold bg-[#FFFDF9] border border-[#EBE7DF] px-2 py-0.5 rounded text-[#475569]">PNG</span>
              </div>
            </motion.div>

            {/* Feature 2 */}
            <motion.div variants={fadeInUp} className="bg-[var(--color-surface-1)] border border-[var(--color-hairline)] rounded-3xl p-8 space-y-4 hover:shadow-2xl hover:border-[var(--color-primary)] hover:-translate-y-2 transition-all duration-300 relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-primary)]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
              <div className="flex items-center justify-between">
                <AIExtractionIllustration />
              </div>
              <h3 className="text-xl font-bold font-serif text-[#0F172A]">Chronological Itinerary</h3>
              <p className="text-sm text-[#64748B] leading-relaxed">
                Wander organizes your flights, stays, trains and activities in the right order—no manual sorting.
              </p>
            </motion.div>

            {/* Feature 3 */}
            <motion.div variants={fadeInUp} className="bg-[var(--color-surface-1)] border border-[var(--color-hairline)] rounded-3xl p-8 space-y-4 hover:shadow-2xl hover:border-[var(--color-primary)] hover:-translate-y-2 transition-all duration-300 relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-primary)]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
              <div className="flex items-center justify-between">
                <MapShareIllustration />
              </div>
              <h3 className="text-xl font-bold font-serif text-[#0F172A]">Secure & Shareable</h3>
              <p className="text-sm text-[#64748B] leading-relaxed">
                Generate a unique link and share your itinerary with anyone, anytime.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* 4. HOW IT WORKS SECTION */}
      <section id="how-it-works" className="py-20 bg-[#FAF8F5]">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center max-w-xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#0F172A]">How Wander Works</h2>
          </div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-8 relative"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {/* Step 1 */}
            <motion.div variants={fadeInUp} className="bg-[var(--color-surface-1)] border border-[var(--color-hairline)] rounded-2xl p-6 flex items-start gap-4 shadow-sm hover:shadow-xl transition-all duration-300 group hover:-translate-y-1">
              <div className="w-12 h-12 rounded-full bg-[var(--color-ink)] text-white font-bold flex items-center justify-center shrink-0 shadow-lg group-hover:scale-110 transition-transform duration-300">
                1
              </div>
              <div>
                <h4 className="font-bold text-lg text-[#0F172A]">Upload Documents</h4>
                <p className="text-xs text-[#64748B] mt-1 leading-relaxed">
                  Upload your flight tickets, hotel bookings, train tickets or travel receipts.
                </p>
              </div>
            </motion.div>

            {/* Step 2 */}
            <motion.div variants={fadeInUp} className="bg-[var(--color-surface-1)] border border-[var(--color-hairline)] rounded-2xl p-6 flex items-start gap-4 shadow-sm hover:shadow-xl transition-all duration-300 group hover:-translate-y-1">
              <div className="w-12 h-12 rounded-full bg-[var(--color-ink)] text-white font-bold flex items-center justify-center shrink-0 shadow-lg group-hover:scale-110 transition-transform duration-300">
                2
              </div>
              <div>
                <h4 className="font-bold text-lg text-[#0F172A]">AI Extraction</h4>
                <p className="text-xs text-[#64748B] mt-1 leading-relaxed">
                  Our AI reads and extracts important travel details using Gemini API.
                </p>
              </div>
            </motion.div>

            {/* Step 3 */}
            <motion.div variants={fadeInUp} className="bg-[var(--color-surface-1)] border border-[var(--color-hairline)] rounded-2xl p-6 flex items-start gap-4 shadow-sm hover:shadow-xl transition-all duration-300 group hover:-translate-y-1">
              <div className="w-12 h-12 rounded-full bg-[var(--color-ink)] text-white font-bold flex items-center justify-center shrink-0 shadow-lg group-hover:scale-110 transition-transform duration-300">
                3
              </div>
              <div>
                <h4 className="font-bold text-lg text-[#0F172A]">View & Share</h4>
                <p className="text-xs text-[#64748B] mt-1 leading-relaxed">
                  Get a clean itinerary, explore your trip and share it with anyone.
                </p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* 5. DEMO BANNER SECTION */}
      <section id="demo" className="py-20 bg-[#FFFDF9] border-t border-[#EBE7DF]">
        <div className="mx-auto max-w-7xl px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-5 space-y-6">
            <span className="text-2xs font-bold uppercase tracking-wider text-[#64748B]">YOUR JOURNEY, ORGANIZED</span>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#0F172A]">
              See your entire trip come to life.
            </h2>
            <p className="text-sm text-[#64748B] leading-relaxed">
              A clean, interactive itinerary with timeline, map view and all your travel details.
            </p>
            <button
              onClick={handleTryDashboard}
              className="bg-[var(--color-ink)] hover:bg-black text-white font-medium px-7 py-3.5 rounded-xl shadow-lg transition-all flex items-center gap-2 cursor-pointer hover:-translate-y-0.5 hover:shadow-xl"
            >
              <span>Try Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Full App Interface Mockup Card */}
          <motion.div
            className="lg:col-span-7 bg-[#FFFDF9] border border-[#EBE7DF] rounded-3xl p-4 sm:p-6 shadow-2xl overflow-hidden"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            {/* Top Mockup Nav */}
            <div className="flex items-center justify-between border-b border-[#EBE7DF] pb-3 mb-4">
              <div className="flex items-center gap-2">
                <WanderLogo className="h-6 w-6" textClass="text-sm font-bold font-serif text-[#1D3B3A]" />
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-[#1D3B3A] text-white text-3xs font-bold flex items-center justify-center">
                  {user?.email ? user.email.slice(0, 2).toUpperCase() : 'DU'}
                </div>
                <span className="text-2xs font-bold text-[#0F172A]">
                  {user?.email ? user.email.split('@')[0] : 'Demo User'}
                </span>
              </div>
            </div>

            {/* Mockup Body Grid */}
            <div className="grid grid-cols-12 gap-4">
              {/* Mini Sidebar */}
              <div className="col-span-3 border-r border-[#EBE7DF] pr-3 space-y-2 hidden sm:block text-3xs font-semibold text-[#64748B]">
                <div className="bg-[#FAF8F5] text-[#1D3B3A] font-bold p-1.5 rounded-lg flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#1D3B3A]" />
                  <span>Dashboard</span>
                </div>
                <div className="p-1.5 hover:text-[#1D3B3A]">My Trips</div>
                <div className="p-1.5 hover:text-[#1D3B3A]">Shared</div>
                <div className="p-1.5 hover:text-[#1D3B3A]">Profile</div>
                <div className="p-1.5 hover:text-[#1D3B3A]">Settings</div>
              </div>

              {/* Mini Timeline List */}
              <div className="col-span-12 sm:col-span-5 space-y-3">
                <div>
                  <h4 className="font-serif font-bold text-sm text-[#0F172A]">Japan Trip</h4>
                  <span className="text-3xs text-[#94A3B8]">10 – 20 May, 2026</span>
                </div>

                <div className="space-y-2 border-l border-dashed border-[#CBD5E1] pl-3 text-3xs">
                  <div className="relative">
                    <div className="absolute -left-[17px] top-1 w-2.5 h-2.5 rounded-full bg-[#1D3B3A]" />
                    <div className="font-bold text-[#0F172A]">Delhi → Tokyo</div>
                    <div className="text-[#94A3B8]">08:30 — 17:10</div>
                  </div>
                  <div className="relative pt-1">
                    <div className="absolute -left-[17px] top-2 w-2.5 h-2.5 rounded-full bg-[#D97706]" />
                    <div className="font-bold text-[#0F172A]">Tokyo Hotel</div>
                    <div className="text-[#94A3B8]">Check-in 10 May</div>
                  </div>
                  <div className="relative pt-1">
                    <div className="absolute -left-[17px] top-2 w-2.5 h-2.5 rounded-full bg-[#059669]" />
                    <div className="font-bold text-[#0F172A]">Tokyo → Kyoto</div>
                    <div className="text-[#94A3B8]">09:15 — 11:45</div>
                  </div>
                </div>
              </div>

              {/* Mini Map */}
              <div className="col-span-12 sm:col-span-4 bg-[#FAF8F5] border border-[#EBE7DF] rounded-xl p-2.5 flex flex-col justify-between">
                <span className="text-3xs font-bold text-[#0F172A] block mb-1">Route Map</span>
                <div className="w-full h-28 relative overflow-hidden rounded-lg bg-[#FFFDF9]">
                  <JapanMapGraphic className="w-full h-full object-cover" />
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 6. FOOTER */}
      <footer className="bg-[#FAF8F5] border-t border-[#EBE7DF] pt-16 pb-12">
        <div className="mx-auto max-w-7xl px-6 grid grid-cols-1 md:grid-cols-12 gap-10">
          <div className="md:col-span-4 space-y-4">
            <WanderLogo />
            <p className="text-xs text-[#64748B] leading-relaxed max-w-xs">
              Turn your scattered travel bookings into one beautiful journey.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <a
                href="https://github.com/ashishsharma349/ORBITRA_TRIP"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-[#FFFDF9] border border-[#EBE7DF] flex items-center justify-center text-[#475569] hover:text-[#1D3B3A] hover:border-[#1D3B3A] transition-colors"
                title="GitHub Repository"
              >
                <GithubIcon className="w-4 h-4" />
              </a>
              <a
                href="https://www.linkedin.com/in/ashish-sharma-8802a8346/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-[#FFFDF9] border border-[#EBE7DF] flex items-center justify-center text-[#475569] hover:text-[#1D3B3A] hover:border-[#1D3B3A] transition-colors"
                title="LinkedIn Profile"
              >
                <LinkedinIcon className="w-4 h-4" />
              </a>
              <a
                href="mailto:ashishsharma90807@gmail.com"
                className="w-9 h-9 rounded-full bg-[#FFFDF9] border border-[#EBE7DF] flex items-center justify-center text-[#475569] hover:text-[#1D3B3A] hover:border-[#1D3B3A] transition-colors"
                title="Contact Email"
              >
                <Mail className="w-4 h-4" />
              </a>
            </div>
          </div>

          <div className="md:col-span-4 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#0F172A]">Navigation</h4>
            <ul className="space-y-2 text-xs text-[#64748B]">
              <li><a href="#features" className="hover:text-[#1D3B3A]">Features</a></li>
              <li><a href="#how-it-works" className="hover:text-[#1D3B3A]">How It Works</a></li>
              <li><a href="#demo" className="hover:text-[#1D3B3A]">Demo</a></li>
              <li><Link to="/dashboard" className="hover:text-[#1D3B3A]">Dashboard</Link></li>
            </ul>
          </div>

          <div className="md:col-span-4 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#0F172A]">Connect</h4>
            <ul className="space-y-2 text-xs text-[#64748B]">
              <li>
                <a href="https://github.com/ashishsharma349/ORBITRA_TRIP" target="_blank" rel="noreferrer" className="hover:text-[#1D3B3A] flex items-center gap-1.5">
                  <span>GitHub Repository</span>
                </a>
              </li>
              <li>
                <a href="https://www.linkedin.com/in/ashish-sharma-8802a8346/" target="_blank" rel="noreferrer" className="hover:text-[#1D3B3A] flex items-center gap-1.5">
                  <span>LinkedIn Profile</span>
                </a>
              </li>
              <li>
                <a href="mailto:ashishsharma90807@gmail.com" className="hover:text-[#1D3B3A] flex items-center gap-1.5">
                  <span>ashishsharma90807@gmail.com</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mx-auto max-w-7xl px-6 mt-12 pt-6 border-t border-[#EBE7DF] text-center text-xs text-[#94A3B8]">
          © 2026 Wander. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
