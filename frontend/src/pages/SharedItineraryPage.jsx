import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Loader2, AlertCircle, UserPlus, Lock, Share2, Mail } from 'lucide-react';
import * as itineraryApi from '../api/itineraryApi';
import {
  WanderLogo,
  FlightIcon,
  HotelIcon,
  TrainIcon,
  ActivityIcon,
  StampBadge,
  PagodaLandscapeIllustration,
  JapanMapGraphic,
  GithubIcon,
  LinkedinIcon
} from '../components/common/WanderIcons';
import InteractiveMap from '../components/map/InteractiveMap';
import ExpenseBreakdownCard from '../components/dashboard/ExpenseBreakdownCard';

const SharedItineraryPage = () => {
  const { shareToken } = useParams();
  const [itinerary, setItinerary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchShared = async () => {
      try {
        const data = await itineraryApi.getSharedItinerary(shareToken);
        setItinerary(data.itinerary);
      } catch (err) {
        console.error(err);
        setError('Itinerary not found or has been deleted.');
      } finally {
        setLoading(false);
      }
    };
    fetchShared();
  }, [shareToken]);

  const getActivityIcon = (type) => {
    switch (type?.toLowerCase()) {
      case 'flight':
        return <FlightIcon className="h-5 w-5 text-[#1D3B3A]" />;
      case 'hotel':
      case 'lodging':
        return <HotelIcon className="h-5 w-5 text-[#D97706]" />;
      case 'train':
      case 'transit':
        return <TrainIcon className="h-5 w-5 text-[#059669]" />;
      default:
        return <ActivityIcon className="h-5 w-5 text-[#7C3AED]" />;
    }
  };

  const getActivityBadgeClass = (type) => {
    switch (type?.toLowerCase()) {
      case 'flight':
        return 'bg-[#E8F3F1] text-[#1D3B3A] border-[#C2E0DC]';
      case 'hotel':
      case 'lodging':
        return 'bg-[#FEF3C7] text-[#B45309] border-[#FDE68A]';
      case 'train':
      case 'transit':
        return 'bg-[#D1FAE5] text-[#047857] border-[#A7F3D0]';
      default:
        return 'bg-[#F3E8FF] text-[#6D28D9] border-[#DDD6FE]';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAF8F5] flex flex-col items-center justify-center text-[#1E293B]">
        <Loader2 className="h-10 w-10 text-[#1D3B3A] animate-spin" />
        <p className="mt-4 text-sm font-semibold text-[#64748B]">Loading Wander travel roadmap...</p>
      </div>
    );
  }

  if (error || !itinerary) {
    return (
      <div className="min-h-screen bg-[#FAF8F5] flex flex-col items-center justify-center p-6 text-center">
        <div className="w-14 h-14 rounded-full bg-red-50 border border-red-200 flex items-center justify-center text-red-600 mb-4">
          <AlertCircle className="h-8 w-8" />
        </div>
        <h2 className="text-2xl font-serif font-bold text-[#0F172A]">Itinerary Not Found</h2>
        <p className="mt-2 text-sm text-[#64748B] max-w-sm">{error || 'Unable to retrieve the shared itinerary.'}</p>
        <Link
          to="/"
          className="mt-6 rounded-xl bg-[#1D3B3A] hover:bg-[#162E2D] px-6 py-3 text-sm font-semibold text-white transition-all shadow-md"
        >
          Go to Wander Home
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#1E293B] flex flex-col font-sans selection:bg-[#D97706]/20">
      {/* 1. PUBLIC TOP HEADER */}
      <header className="bg-[#FFFDF9] border-b border-[#EBE7DF] px-6 h-18 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-6">
          <Link to="/">
            <WanderLogo />
          </Link>
          <div className="hidden sm:flex items-center gap-2 text-xs font-semibold text-[#64748B] bg-[#FAF8F5] px-3 py-1.5 rounded-full border border-[#EBE7DF]">
            <Lock className="w-3.5 h-3.5 text-[#1D3B3A]" />
            <span>This is a public itinerary</span>
          </div>
        </div>

        <Link
          to="/signup"
          className="bg-[#1D3B3A] hover:bg-[#162E2D] text-white text-xs font-semibold px-5 py-2.5 rounded-xl transition-all flex items-center gap-2 shadow-sm"
        >
          <span>Create Your Own Journey</span>
          <UserPlus className="w-4 h-4" />
        </Link>
      </header>

      {/* 2. MAIN CONTAINER */}
      <main className="flex-1 max-w-7xl mx-auto w-full p-6 lg:p-10 space-y-8">
        {/* HERO TITLE BANNER & CREATOR CARD */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-8 bg-[#FFFDF9] border border-[#EBE7DF] rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-2xs">
            <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
              <div className="space-y-3 max-w-xl z-10">
                <h1 className="font-serif font-extrabold text-3xl sm:text-4xl text-[#0F172A]">
                  {itinerary.title || 'Japan Adventure'}
                </h1>
                <p className="text-xs font-bold text-[#64748B]">
                  {itinerary.startDate ? new Date(itinerary.startDate).toLocaleDateString() : '10 May 2026'}
                  {itinerary.endDate ? ` – ${new Date(itinerary.endDate).toLocaleDateString()}` : ' – 20 May 2026'} • Delhi → Tokyo → Kyoto → Osaka → Delhi
                </p>
                <p className="text-sm text-[#475569] leading-relaxed pt-2">
                  A beautiful multi-city journey parsed and organized automatically with Wander AI.
                </p>
              </div>

              <img
                src="/assets/shared_fuji_banner.png"
                alt="Fujisan Banner"
                className="w-48 h-28 object-cover rounded-xl shrink-0 hidden sm:block shadow-xs"
              />
            </div>
          </div>

          <div className="lg:col-span-4 bg-[#FFFDF9] border border-[#EBE7DF] rounded-3xl p-6 space-y-4 shadow-2xs">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#E8F3F1] flex items-center justify-center text-[#1D3B3A] font-bold text-sm">
                TR
              </div>
              <div>
                <div className="text-2xs font-bold uppercase text-[#94A3B8]">Shared by</div>
                <div className="text-xs font-bold text-[#0F172A]">{itinerary.user?.email || 'traveler@wander.app'}</div>
              </div>
            </div>
            <div className="text-2xs text-[#64748B] pt-2 border-t border-[#EBE7DF]">
              Anyone with this link can view this itinerary.
            </div>
          </div>
        </div>

        {/* ROADMAP TIMELINE & MAP GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* LEFT 8 COLS: TIMELINE */}
          <div className="lg:col-span-8 space-y-6">
            <h3 className="font-serif font-bold text-xl text-[#0F172A]">
              Your Itinerary
            </h3>

            <div className="relative border-l-2 border-dashed border-[#CBD5E1] ml-4 pl-8 space-y-8 py-2">
              {itinerary.days?.map((day, dIdx) => (
                <div key={dIdx} className="space-y-4 relative">
                  {/* Day Marker */}
                  <div className="mb-2">
                    <span className="text-xs font-extrabold uppercase text-[#0F172A] tracking-wider">
                      Day {day.dayNumber} • {day.date}
                    </span>
                  </div>

                  {/* Activities */}
                  {day.activities?.map((act, aIdx) => (
                    <div key={aIdx} className="relative">
                      {/* Node Icon on Timeline Line */}
                      <div className="absolute -left-[45px] top-3 w-8 h-8 rounded-full bg-[#FFFDF9] border-2 border-[#1D3B3A] flex items-center justify-center shadow-xs z-10">
                        {getActivityIcon(act.type)}
                      </div>

                      {/* Card Content */}
                      <div className="bg-[#FFFDF9] border border-[#EBE7DF] rounded-2xl p-5 space-y-2 hover:border-[#1D3B3A]/30 transition-all shadow-2xs">
                        <div className="flex items-center justify-between">
                          <span className={`text-2xs font-bold uppercase px-2.5 py-0.5 rounded-full border ${getActivityBadgeClass(act.type)}`}>
                            {act.type || 'Activity'}
                          </span>
                          <span className="text-xs font-semibold text-[#64748B]">{act.time}</span>
                        </div>

                        <h4 className="font-bold text-base text-[#0F172A]">{act.title}</h4>

                        {act.description && (
                          <p className="text-xs text-[#64748B] leading-relaxed">{act.description}</p>
                        )}

                        {act.location && (
                          <div className="text-2xs font-semibold text-[#94A3B8] pt-1">
                            Location: {act.location}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>

            <div className="text-center py-6">
              <span className="font-handwriting text-2xl text-[#B45309]">
                Have a wonderful journey!
              </span>
            </div>
          </div>

          {/* RIGHT 4 COLS: MAP & EXPENSE CARD */}
          <div className="lg:col-span-4 space-y-6">
            {/* INTERACTIVE MAP CARD */}
            <div className="bg-[#FFFDF9] border border-[#EBE7DF] rounded-3xl p-6 space-y-4 shadow-2xs">
              <h4 className="font-serif font-bold text-base text-[#0F172A] flex items-center gap-2">
                <FlightIcon className="w-4 h-4 text-[#1D3B3A]" />
                <span>Interactive Journey Map</span>
              </h4>

              <InteractiveMap className="w-full h-56" />
            </div>

            {/* EXPENSE BREAKDOWN CARD */}
            <ExpenseBreakdownCard activities={itinerary.days?.flatMap((d) => d.activities || []) || []} />
          </div>
        </div>
      </main>

      {/* 3. FOOTER */}
      <footer className="bg-[#FAF8F5] border-t border-[#EBE7DF] pt-12 pb-8 mt-12">
        <div className="mx-auto max-w-7xl px-6 grid grid-cols-1 md:grid-cols-12 gap-8 text-xs text-[#64748B]">
          <div className="md:col-span-6 space-y-3">
            <WanderLogo />
            <p className="max-w-xs leading-relaxed">
              Turn your scattered travel bookings into one beautiful journey.
            </p>
          </div>
          <div className="md:col-span-6 flex flex-wrap justify-start md:justify-end gap-6 items-center">
            <a href="https://github.com/ashishsharma349/ORBITRA_TRIP" target="_blank" rel="noreferrer" className="hover:text-[#1D3B3A]">GitHub</a>
            <a href="https://www.linkedin.com/in/ashish-sharma-8802a8346/" target="_blank" rel="noreferrer" className="hover:text-[#1D3B3A]">LinkedIn</a>
            <a href="mailto:ashishsharma90807@gmail.com" className="hover:text-[#1D3B3A]">ashishsharma90807@gmail.com</a>
          </div>
        </div>
        <div className="text-center text-2xs text-[#94A3B8] mt-8 pt-4 border-t border-[#EBE7DF]">
          © 2026 Wander. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default SharedItineraryPage;
