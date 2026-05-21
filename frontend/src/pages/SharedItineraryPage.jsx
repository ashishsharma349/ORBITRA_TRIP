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
        return <Plane className="h-5 w-5 text-sky-400 rotate-45" />;
      case 'hotel':
        return <Building className="h-5 w-5 text-emerald-400" />;
      case 'train':
        return <Train className="h-5 w-5 text-amber-400" />;
      case 'activity':
        return <Compass className="h-5 w-5 text-purple-400" />;
      default:
        return <Calendar className="h-5 w-5 text-slate-400" />;
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
            <span className="inline-block rounded-full bg-indigo-500/10 px-3 py-1 text-2xs font-bold text-indigo-400 uppercase tracking-wider mb-2">
              Shared Itinerary
            </span>
            <h1 className="text-3xl font-extrabold text-white tracking-tight sm:text-4xl">{itinerary.title}</h1>
            {(itinerary.startDate || itinerary.endDate) && (
              <p className="text-sm text-indigo-400 mt-2.5 flex items-center gap-2">
                <Calendar className="h-4 w-4" />
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
                <div className="absolute -left-12 top-1.5 flex h-8 w-8 items-center justify-center rounded-full border border-indigo-500 bg-slate-950 font-bold text-xs text-indigo-400">
                  {day.dayNumber}
                </div>

                <div className="mb-4">
                  <h3 className="text-lg font-bold text-slate-200">{day.date}</h3>
                </div>

                <div className="space-y-4">
                  {day.activities.map((act, index) => (
                    <div
                      key={index}
                      className="flex gap-4 p-4 rounded-xl border border-slate-800/80 bg-slate-950/20 hover:border-slate-700/60 hover:bg-slate-900/20 transition-all duration-200"
                    >
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-900 border border-slate-800">
                        {getActivityIcon(act.type)}
                      </div>

                      <div className="min-w-0 flex-1">
                        <h4 className="text-sm font-bold text-slate-200">{act.title}</h4>
                        {act.description && (
                          <p className="text-xs text-slate-400 mt-1 leading-relaxed">{act.description}</p>
                        )}
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 mt-3 text-2xs text-slate-500 font-medium">
                          <span className="flex items-center gap-1">
                            <Clock className="h-3.5 w-3.5" />
                            <span>{act.time}</span>
                          </span>
                          {act.location && (
                            <span className="flex items-center gap-1">
                              <MapPin className="h-3.5 w-3.5" />
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
