import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Calendar,
  Plane,
  Building,
  Train,
  Compass,
  Clock,
  MapPin,
  Loader2,
  AlertCircle
} from 'lucide-react';
import * as itineraryApi from '../api/itineraryApi';

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
    switch (type) {
      case 'flight':
        return <Plane className="h-6 w-6 text-sky-400 rotate-45" />;
      case 'hotel':
        return <Building className="h-6 w-6 text-emerald-400" />;
      case 'train':
        return <Train className="h-6 w-6 text-amber-400" />;
      case 'activity':
        return <Compass className="h-6 w-6 text-purple-400" />;
      default:
        return <Calendar className="h-6 w-6 text-slate-400" />;
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-slate-950 text-slate-100">
        <Loader2 className="h-10 w-10 text-indigo-500 animate-spin" />
        <p className="mt-4 text-sm font-semibold text-slate-400">Loading travel roadmap...</p>
      </div>
    );
  }

  if (error || !itinerary) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-slate-950 text-slate-100 p-4">
        <div className="rounded-full bg-red-950/40 border border-red-500/30 p-4 mb-4 text-red-400">
          <AlertCircle className="h-10 w-10" />
        </div>
        <h2 className="text-xl font-bold text-white">Oops!</h2>
        <p className="mt-2 text-sm text-slate-400 text-center max-w-sm">{error || 'Unable to retrieve the shared itinerary.'}</p>
        <Link
          to="/login"
          className="mt-6 rounded-xl bg-indigo-600 hover:bg-indigo-500 px-6 py-2.5 text-sm font-semibold text-white transition-all shadow-lg shadow-indigo-500/20"
        >
          Go to Login
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-indigo-500 selection:text-white">
      <nav className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-md sticky top-0 z-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xl font-black tracking-wider text-indigo-400">ORBITRA</span>
              <span className="rounded-full bg-indigo-500/20 px-2 py-0.5 text-2xs font-semibold text-indigo-300">SHARED</span>
            </div>
            <Link
              to="/signup"
              className="rounded-xl bg-slate-800 hover:bg-slate-700 px-4 py-2 text-sm font-semibold text-slate-200 transition-all border border-slate-700/50"
            >
              Create My Account
            </Link>
          </div>
        </div>
      </nav>

      <main className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
        <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6 sm:p-8 backdrop-blur-md">
          <div className="border-b border-slate-800 pb-6 mb-8">
            <span className="inline-block rounded-full bg-indigo-500/10 px-3 py-1 text-2xs font-bold text-indigo-400 uppercase tracking-wider mb-2 font-semibold">
              Shared Itinerary
            </span>
            <h1 className="text-3xl font-black text-white tracking-tight sm:text-4xl font-display">{itinerary.title}</h1>
            {(itinerary.startDate || itinerary.endDate) && (
              <p className="text-sm font-semibold text-indigo-400 mt-3 flex items-center gap-2">
                <Calendar className="h-4 w-4 shrink-0" />
                <span>
                  {itinerary.startDate ? new Date(itinerary.startDate).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' }) : ''}
                  {itinerary.endDate ? ` - ${new Date(itinerary.endDate).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}` : ''}
                </span>
              </p>
            )}
          </div>

          <div className="relative border-l-2 border-slate-800 ml-4 pl-8 space-y-12 py-2">
            {itinerary.days.map((day) => (
              <div key={day.dayNumber} className="relative">
                <div className="absolute -left-[41px] top-1 flex h-9 w-9 items-center justify-center rounded-full border-2 border-indigo-500 bg-slate-900 font-extrabold text-sm text-indigo-300 shadow-[0_0_15px_rgba(99,102,241,0.25)] z-10">
                  {day.dayNumber}
                </div>

                <div className="mb-5 flex items-center gap-3">
                  <span className="text-2xs uppercase font-extrabold tracking-widest text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20">Day {day.dayNumber}</span>
                  <h3 className="text-lg font-extrabold text-white tracking-tight">{day.date}</h3>
                </div>

                <div className="space-y-4">
                  {day.activities.map((act, index) => (
                    <div
                      key={index}
                      className="group flex gap-5 p-5 rounded-2xl border border-slate-800/80 bg-slate-900/20 hover:border-indigo-500/40 hover:bg-indigo-950/5 hover:shadow-lg hover:shadow-indigo-500/5 transition-all duration-300"
                    >
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-slate-900 border border-slate-800 group-hover:border-indigo-500/30 group-hover:bg-slate-900 transition-all duration-300">
                        {getActivityIcon(act.type)}
                      </div>

                      <div className="min-w-0 flex-1">
                        <h4 className="text-base md:text-lg font-bold text-slate-100 tracking-tight group-hover:text-white transition-colors">{act.title}</h4>
                        {act.description && (
                          <p className="text-sm text-slate-300 mt-2 leading-relaxed font-normal antialiased">{act.description}</p>
                        )}
                        <div className="flex flex-wrap items-center gap-x-5 gap-y-2 mt-4 text-xs font-semibold text-slate-400">
                          <span className="flex items-center gap-1.5 bg-slate-900/60 px-2.5 py-1 rounded-md border border-slate-850">
                            <Clock className="h-4 w-4 text-slate-450" />
                            <span>{act.time}</span>
                          </span>
                          {act.location && (
                            <span className="flex items-center gap-1.5 bg-slate-900/60 px-2.5 py-1 rounded-md border border-slate-850">
                              <MapPin className="h-4 w-4 text-slate-455" />
                              <span>{act.location}</span>
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default SharedItineraryPage;
