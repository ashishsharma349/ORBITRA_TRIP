import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  LogOut,
  Calendar,
  Map,
  Plane,
  Compass,
  FileText,
  UploadCloud,
  Trash2,
  Loader2,
  Building,
  Train,
  Clock,
  MapPin,
  AlertCircle,
  Share2
} from 'lucide-react';
import * as itineraryApi from '../api/itineraryApi';

const DashboardPage = () => {
  const { user, logout } = useAuth();
  const [itineraries, setItineraries] = useState([]);
  const [selectedItinerary, setSelectedItinerary] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const fileInputRef = useRef(null);

  const handleShare = () => {
    if (!selectedItinerary) return;
    const shareUrl = `${window.location.origin}/shared/${selectedItinerary.shareToken}`;
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  useEffect(() => {
    fetchItineraries();
  }, []);

  const fetchItineraries = async () => {
    try {
      const data = await itineraryApi.getItineraries();
      setItineraries(data.itineraries);
      if (data.itineraries.length > 0 && !selectedItinerary) {
        setSelectedItinerary(data.itineraries[0]);
      }
    } catch (err) {
      console.error(err);
      setError('Failed to fetch itineraries.');
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      await processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = async (e) => {
    if (e.target.files && e.target.files[0]) {
      await processFile(e.target.files[0]);
    }
  };

  const processFile = async (file) => {
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      setError('Unsupported file type. Please upload a PDF or an Image (JPEG/PNG/WebP).');
      return;
    }

    setError('');
    setUploading(true);
    try {
      const data = await itineraryApi.uploadDocument(file);
      setItineraries((prev) => [data.itinerary, ...prev]);
      setSelectedItinerary(data.itinerary);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error?.message || 'Failed to process document and generate itinerary.');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id, e) => {
    e.stopPropagation();
    try {
      await itineraryApi.deleteItinerary(id);
      setItineraries((prev) => prev.filter((item) => item._id !== id));
      if (selectedItinerary?._id === id) {
        setSelectedItinerary(null);
      }
    } catch (err) {
      console.error(err);
      setError('Failed to delete itinerary.');
    }
  };

  const formattedDate = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : 'N/A';

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

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-indigo-500 selection:text-white">
      <nav className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-md sticky top-0 z-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xl font-black tracking-wider text-indigo-400">ORBITRA</span>
              <span className="rounded-full bg-indigo-500/20 px-2 py-0.5 text-2xs font-semibold text-indigo-300">TRIP</span>
            </div>

            <div className="flex items-center gap-4">
              <div className="hidden sm:flex sm:flex-col sm:items-end text-right">
                <span className="text-sm font-medium text-slate-200">{user?.email}</span>
                <span className="text-xs text-slate-500">Explorer</span>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 rounded-xl bg-slate-800 hover:bg-slate-700 hover:text-red-400 px-4.5 py-2 text-sm font-semibold text-slate-300 transition-all border border-slate-700/50 cursor-pointer"
              >
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {error && (
          <div className="mb-6 flex items-start gap-3 rounded-xl bg-red-950/40 border border-red-500/30 p-4 text-sm text-red-400">
            <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold">Operation Error</p>
              <p className="mt-1 text-xs opacity-90">{error}</p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="lg:col-span-1 space-y-8">
            <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6 backdrop-blur-md">
              <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-2 border-b border-slate-800 pb-3">
                <Compass className="h-5 w-5 text-indigo-400" />
                <span>Traveler Profile</span>
              </h2>
              <div className="space-y-4">
                <div>
                  <span className="block text-xs font-semibold uppercase tracking-wider text-slate-500">Email Address</span>
                  <span className="mt-1 block text-sm font-medium text-slate-200">{user?.email}</span>
                </div>
                <div>
                  <span className="block text-xs font-semibold uppercase tracking-wider text-slate-500">Member Since</span>
                  <span className="mt-1 block text-sm font-medium text-slate-200">{formattedDate}</span>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6 backdrop-blur-md">
              <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2 border-b border-slate-800 pb-3">
                <UploadCloud className="h-5 w-5 text-indigo-400" />
                <span>Upload Bookings</span>
              </h2>
              <div
                onDragEnter={handleDrag}
                onDragOver={handleDrag}
                onDragLeave={handleDrag}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`relative flex flex-col items-center justify-center rounded-xl border border-dashed px-4 py-8 text-center cursor-pointer transition-all duration-200 ${
                  dragActive
                    ? 'border-indigo-500 bg-indigo-950/20'
                    : 'border-slate-800 hover:border-slate-700 bg-slate-950/40'
                }`}
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept=".pdf,image/jpeg,image/png,image/webp"
                  className="hidden"
                  disabled={uploading}
                />

                {uploading ? (
                  <div className="flex flex-col items-center py-4">
                    <Loader2 className="h-8 w-8 text-indigo-500 animate-spin" />
                    <p className="mt-4 text-sm font-semibold text-slate-200">Analyzing Document...</p>
                    <p className="mt-1 text-xs text-slate-500">Extracting details via AI</p>
                  </div>
                ) : (
                  <>
                    <div className="mb-3 rounded-full bg-slate-900 p-3 border border-slate-800">
                      <FileText className="h-6 w-6 text-slate-400" />
                    </div>
                    <p className="text-sm font-medium text-slate-300">Drag & drop travel booking</p>
                    <p className="mt-1 text-xs text-slate-500">Supports PDF and Images (up to 10MB)</p>
                  </>
                )}
              </div>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6 backdrop-blur-md">
              <div className="flex items-center justify-between mb-4 border-b border-slate-800 pb-3">
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <Map className="h-5 w-5 text-indigo-400" />
                  <span>My Trips</span>
                </h2>
                <span className="rounded-full bg-slate-800 px-2.5 py-0.5 text-xs font-medium text-slate-400">
                  {itineraries.length}
                </span>
              </div>
              <div className="space-y-3 max-h-72 overflow-y-auto custom-scrollbar">
                {itineraries.length === 0 ? (
                  <div className="py-6 text-center text-sm text-slate-500">No trips generated yet.</div>
                ) : (
                  itineraries.map((it) => (
                    <div
                      key={it._id}
                      onClick={() => setSelectedItinerary(it)}
                      className={`flex items-center justify-between p-3 rounded-xl border transition-all cursor-pointer ${
                        selectedItinerary?._id === it._id
                          ? 'border-indigo-500 bg-indigo-950/20'
                          : 'border-slate-850 bg-slate-950/30 hover:border-slate-800'
                      }`}
                    >
                      <div className="min-w-0 flex-1 pr-2">
                        <p className="text-sm font-semibold text-slate-200 truncate">{it.title}</p>
                        <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1">
                          <Calendar className="h-3 w-3 shrink-0" />
                          <span>{it.startDate ? new Date(it.startDate).toLocaleDateString() : 'Flexible Date'}</span>
                        </p>
                      </div>
                      <button
                        onClick={(e) => handleDelete(it._id, e)}
                        className="rounded-lg p-1.5 text-slate-500 hover:text-red-400 hover:bg-slate-800/50 transition-all cursor-pointer"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          <div className="lg:col-span-2">
            {selectedItinerary ? (
              <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6 backdrop-blur-md min-h-[400px]">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-800 pb-5 mb-6 gap-4">
                  <div>
                    <h1 className="text-2xl font-extrabold text-white tracking-tight">{selectedItinerary.title}</h1>
                    {(selectedItinerary.startDate || selectedItinerary.endDate) && (
                      <p className="text-xs text-indigo-400 mt-1 flex items-center gap-1.5">
                        <Calendar className="h-3.5 w-3.5" />
                        <span>
                          {selectedItinerary.startDate ? new Date(selectedItinerary.startDate).toLocaleDateString() : ''}
                          {selectedItinerary.endDate ? ` - ${new Date(selectedItinerary.endDate).toLocaleDateString()}` : ''}
                        </span>
                      </p>
                    )}
                  </div>
                  {selectedItinerary.shareToken && (
                    <button
                      onClick={handleShare}
                      className="flex items-center gap-2 rounded-xl bg-indigo-650 hover:bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition-all border border-indigo-500/30 cursor-pointer shrink-0 sm:self-center"
                    >
                      <Share2 className="h-4 w-4" />
                      <span>{copied ? 'Link Copied!' : 'Share Trip'}</span>
                    </button>
                  )}
                </div>

                <div className="relative border-l-2 border-slate-800 ml-4 pl-8 space-y-10 py-2">
                  {selectedItinerary.days.map((day) => (
                    <div key={day.dayNumber} className="relative">
                      <div className="absolute -left-12 top-1.5 flex h-8 w-8 items-center justify-center rounded-full border border-indigo-500 bg-slate-950 font-bold text-xs text-indigo-400">
                        {day.dayNumber}
                      </div>

                      <div className="mb-4">
                        <h3 className="text-base font-bold text-slate-200">{day.date}</h3>
                      </div>

                      <div className="space-y-4">
                        {day.activities.map((act, index) => (
                          <div
                            key={index}
                            className="group flex gap-4 p-4 rounded-xl border border-slate-800/80 bg-slate-950/20 hover:border-slate-700/60 hover:bg-slate-900/20 transition-all duration-200"
                          >
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-900 border border-slate-800">
                              {getActivityIcon(act.type)}
                            </div>

                            <div className="min-w-0 flex-1">
                              <div className="flex items-center gap-2">
                                <h4 className="text-sm font-bold text-slate-200">{act.title}</h4>
                              </div>

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
            ) : (
              <div className="flex flex-col items-center justify-center rounded-2xl border border-slate-800 bg-slate-900/10 p-12 text-center min-h-[400px]">
                <div className="rounded-full bg-slate-900 p-4 border border-slate-800 mb-4">
                  <Plane className="h-8 w-8 text-slate-600 rotate-45" />
                </div>
                <h3 className="text-base font-semibold text-slate-350">No Active Timeline</h3>
                <p className="mt-2 max-w-sm text-sm text-slate-500 leading-relaxed">
                  Select a generated trip from your list, or drop a flight/hotel booking document to create a brand new roadmap.
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;
