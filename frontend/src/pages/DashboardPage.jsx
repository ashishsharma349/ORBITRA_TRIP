import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import {
  LogOut,
  Plus,
  Cloud,
  Share2,
  Trash2,
  HelpCircle,
  CheckCircle2,
  Edit2,
  Upload,
  Calendar,
  GripVertical
} from 'lucide-react';
import * as itineraryApi from '../api/itineraryApi';
import {
  WanderLogo,
  FlightIcon,
  HotelIcon,
  TrainIcon,
  ActivityIcon
} from '../components/common/WanderIcons';
import InteractiveMap from '../components/map/InteractiveMap';
import ExpenseBreakdownCard from '../components/dashboard/ExpenseBreakdownCard';
import ActivityEditModal from '../components/dashboard/ActivityEditModal';
import { DashboardSkeleton, TimelineItemSkeleton } from '../components/common/SkeletonLoaders';

const DashboardPage = () => {
  const { user, logout } = useAuth();
  const [itineraries, setItineraries] = useState([]);
  const [selectedItinerary, setSelectedItinerary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  // Edit Modal State
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingActivity, setEditingActivity] = useState(null);
  const [editingDayIdx, setEditingDayIdx] = useState(0);
  const [editingActIdx, setEditingActIdx] = useState(null);

  const fileInputRef = useRef(null);

  useEffect(() => {
    fetchItineraries();
  }, []);

  const fetchItineraries = async () => {
    setLoading(true);
    try {
      const data = await itineraryApi.getItineraries();
      const list = data.itineraries || [];
      setItineraries(list);
      if (list.length > 0 && !selectedItinerary) {
        setSelectedItinerary(list[0]);
      }
    } catch (err) {
      console.error(err);
      setError('Failed to fetch itineraries.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (err) {
      console.error(err);
    }
  };

  const handleShare = () => {
    if (!selectedItinerary) return;
    const shareUrl = `${window.location.origin}/shared/${selectedItinerary.shareToken}`;
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDelete = async (id, e) => {
    e.stopPropagation();
    if (!window.confirm('Are you sure you want to delete this trip?')) return;
    try {
      await itineraryApi.deleteItinerary(id);
      const updated = itineraries.filter((item) => item._id !== id);
      setItineraries(updated);
      if (selectedItinerary && selectedItinerary._id === id) {
        setSelectedItinerary(updated[0] || null);
      }
    } catch (err) {
      console.error(err);
      setError('Failed to delete itinerary.');
    }
  };

  const handleFileUpload = async (file) => {
    if (!file) return;
    setUploading(true);
    setError('');
    try {
      const response = await itineraryApi.uploadDocument(file);
      if (response.itinerary) {
        setItineraries((prev) => [response.itinerary, ...prev]);
        setSelectedItinerary(response.itinerary);
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error?.message || 'Failed to process document with Gemini AI.');
    } finally {
      setUploading(false);
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

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  // Drag and Drop Timeline Reordering
  const handleOnDragEnd = (result) => {
    if (!result.destination || !selectedItinerary) return;
    const { source, destination } = result;

    const daySourceIdx = Number(source.droppableId.replace('day-', ''));
    const dayDestIdx = Number(destination.droppableId.replace('day-', ''));

    const updatedDays = [...selectedItinerary.days];
    const sourceActivities = [...updatedDays[daySourceIdx].activities];
    const [movedAct] = sourceActivities.splice(source.index, 1);

    if (daySourceIdx === dayDestIdx) {
      sourceActivities.splice(destination.index, 0, movedAct);
      updatedDays[daySourceIdx].activities = sourceActivities;
    } else {
      const destActivities = [...updatedDays[dayDestIdx].activities];
      destActivities.splice(destination.index, 0, movedAct);
      updatedDays[daySourceIdx].activities = sourceActivities;
      updatedDays[dayDestIdx].activities = destActivities;
    }

    setSelectedItinerary({
      ...selectedItinerary,
      days: updatedDays
    });
  };

  // Activity Editing Handlers
  const handleOpenEditModal = (dayIdx, actIdx = null) => {
    setEditingDayIdx(dayIdx);
    setEditingActIdx(actIdx);
    if (actIdx !== null && selectedItinerary) {
      setEditingActivity(selectedItinerary.days[dayIdx].activities[actIdx]);
    } else {
      setEditingActivity(null);
    }
    setIsEditModalOpen(true);
  };

  const handleSaveActivity = (savedAct) => {
    if (!selectedItinerary) return;
    const updatedDays = [...selectedItinerary.days];
    const dayActs = [...updatedDays[editingDayIdx].activities];

    if (editingActIdx !== null) {
      dayActs[editingActIdx] = savedAct;
    } else {
      dayActs.push(savedAct);
    }

    updatedDays[editingDayIdx].activities = dayActs;
    setSelectedItinerary({
      ...selectedItinerary,
      days: updatedDays
    });
  };

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

  const getAllActivities = () => {
    if (!selectedItinerary?.days) return [];
    return selectedItinerary.days.flatMap((d) => d.activities || []);
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#1E293B] flex flex-col font-sans selection:bg-[#D97706]/20">
      {/* 1. TOP NAVBAR */}
      <header className="bg-[#FFFDF9] border-b border-[#EBE7DF] px-6 h-18 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-6">
          <WanderLogo />
          <div className="hidden md:flex items-center gap-2 text-xs font-semibold text-[#64748B] bg-[#FAF8F5] px-3 py-1.5 rounded-full border border-[#EBE7DF]">
            <FlightIcon className="w-4 h-4 text-[#D97706]" />
            <span>Your Travel Workspace</span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button className="text-[#64748B] hover:text-[#1D3B3A] p-2 rounded-full hover:bg-[#FAF8F5] transition-colors" title="Help">
            <HelpCircle className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3 border-l border-[#EBE7DF] pl-4">
            <div className="w-9 h-9 rounded-full bg-[#1D3B3A] text-white font-bold text-xs flex items-center justify-center">
              {user?.email ? user.email.slice(0, 2).toUpperCase() : 'US'}
            </div>
            <div className="hidden sm:block text-left">
              <div className="text-xs font-bold text-[#0F172A]">{user?.email?.split('@')[0] || 'Traveler'}</div>
              <div className="text-2xs text-[#94A3B8]">{user?.email || 'user@example.com'}</div>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="border border-[#EBE7DF] bg-[#FFFDF9] hover:bg-[#FAF8F5] text-[#475569] hover:text-[#1D3B3A] text-xs font-semibold px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer ml-2"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </header>

      {/* 2. MAIN LAYOUT WITH SIDEBAR & CONTENT */}
      <div className="flex-1 flex flex-col md:flex-row">
        {/* LEFT SIDEBAR */}
        <aside className="w-full md:w-72 bg-[#FFFDF9] border-r border-[#EBE7DF] p-6 flex flex-col justify-between shrink-0">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="font-serif font-bold text-lg text-[#0F172A]">My Trips</h2>
            </div>

            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-full bg-[#1D3B3A] hover:bg-[#162E2D] text-white font-medium text-sm py-3 rounded-xl shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>New Trip</span>
            </button>

            <input
              type="file"
              ref={fileInputRef}
              onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0])}
              className="hidden"
              accept=".pdf,.png,.jpg,.jpeg,.webp"
            />

            {/* TRIPS LIST */}
            <div className="space-y-2 max-h-[55vh] overflow-y-auto pr-1">
              {itineraries.length === 0 ? (
                <div className="text-center py-8 space-y-3">
                  <div className="w-12 h-12 rounded-full bg-[#FAF8F5] border border-[#EBE7DF] mx-auto flex items-center justify-center text-[#94A3B8]">
                    <FlightIcon className="w-6 h-6 rotate-45 text-[#94A3B8]" />
                  </div>
                  <p className="text-xs text-[#64748B] leading-relaxed">
                    Your journeys will appear here.<br />Start by creating a new trip.
                  </p>
                </div>
              ) : (
                itineraries.map((trip) => {
                  const isSelected = selectedItinerary?._id === trip._id;
                  return (
                    <div
                      key={trip._id}
                      onClick={() => setSelectedItinerary(trip)}
                      className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between group ${
                        isSelected
                          ? 'bg-[#FAF8F5] border-[#1D3B3A]/40 shadow-xs'
                          : 'bg-[#FFFDF9] border-[#EBE7DF] hover:border-[#CBD5E1]'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-9 h-9 rounded-xl bg-[#E8F3F1] flex items-center justify-center shrink-0">
                          <FlightIcon className="w-4 h-4 text-[#1D3B3A]" />
                        </div>
                        <div className="min-w-0">
                          <h4 className="text-xs font-bold text-[#0F172A] truncate">{trip.title || 'Untitled Trip'}</h4>
                          <p className="text-2xs text-[#64748B] mt-0.5">
                            {trip.startDate ? new Date(trip.startDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : 'Flexible'}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-1">
                        {isSelected && <span className="w-2 h-2 rounded-full bg-[#D97706]" />}
                        <button
                          onClick={(e) => handleDelete(trip._id, e)}
                          className="opacity-0 group-hover:opacity-100 p-1 text-[#94A3B8] hover:text-[#DC2626] transition-opacity"
                          title="Delete trip"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* STORAGE INDICATOR */}
          <div className="pt-6 border-t border-[#EBE7DF] space-y-2">
            <div className="flex items-center justify-between text-2xs font-semibold text-[#64748B]">
              <span className="flex items-center gap-1">
                <Cloud className="w-3.5 h-3.5 text-[#1D3B3A]" />
                <span>Storage Used</span>
              </span>
              <span>2.4 GB / 10 GB</span>
            </div>
            <div className="w-full bg-[#FAF8F5] border border-[#EBE7DF] h-2 rounded-full overflow-hidden">
              <div className="bg-[#1D3B3A] h-full w-1/4 rounded-full" />
            </div>
          </div>
        </aside>

        {/* MAIN WORKSPACE CONTENT */}
        <main className="flex-1 p-6 lg:p-8 space-y-8 overflow-y-auto">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-xs font-semibold p-4 rounded-xl">
              {error}
            </div>
          )}

          {/* SHIMMER LOADING STATES */}
          {loading && <DashboardSkeleton />}

          {uploading && (
            <div className="space-y-4">
              <div className="bg-[#FFFDF9] border-2 border-dashed border-[#1D3B3A] rounded-2xl p-6 text-center space-y-2">
                <h3 className="font-serif font-bold text-lg text-[#0F172A]">Gemini AI Reading Travel Documents...</h3>
                <p className="text-xs text-[#64748B]">Extracting dates, flights, hotels, and activities automatically.</p>
              </div>
              <TimelineItemSkeleton />
              <TimelineItemSkeleton />
            </div>
          )}

          {!selectedItinerary && !loading && !uploading && (
            <div
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              className={`bg-[#FFFDF9] border-2 border-dashed rounded-3xl p-12 text-center space-y-4 transition-all ${
                dragActive ? 'border-[#1D3B3A] bg-[#E8F3F1]/30' : 'border-[#EBE7DF]'
              }`}
            >
              <div className="w-16 h-16 rounded-full bg-[#FAF8F5] border border-[#EBE7DF] mx-auto flex items-center justify-center text-[#1D3B3A]">
                <Upload className="w-8 h-8 text-[#1D3B3A]" />
              </div>
              <div>
                <h3 className="font-serif font-bold text-xl text-[#0F172A]">Upload Travel Booking Documents</h3>
                <p className="text-xs text-[#64748B] mt-1">Drop PDF, JPEG or PNG flight/hotel tickets to generate a trip itinerary.</p>
              </div>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="bg-[#1D3B3A] hover:bg-[#162E2D] text-white text-xs font-semibold px-6 py-3 rounded-xl transition-all shadow-sm cursor-pointer"
              >
                Upload Document Now
              </button>
            </div>
          )}

          {selectedItinerary && !loading && !uploading && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* TIMELINE FEED (LEFT 8 COLS) */}
              <div className="lg:col-span-8 space-y-6">
                {/* TRIP HEADER */}
                <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#EBE7DF] pb-6">
                  <div>
                    <div className="flex items-center gap-2">
                      <h1 className="font-serif font-extrabold text-2xl sm:text-3xl text-[#0F172A]">
                        {selectedItinerary.title || 'Japan Adventure'}
                      </h1>
                      <Edit2 className="w-4 h-4 text-[#94A3B8] hover:text-[#1D3B3A] cursor-pointer" />
                    </div>
                    <p className="text-xs font-semibold text-[#64748B] mt-1 flex items-center gap-2">
                      <Calendar className="w-3.5 h-3.5 text-[#D97706]" />
                      <span>
                        {selectedItinerary.startDate ? new Date(selectedItinerary.startDate).toLocaleDateString() : '10 May 2026'}
                        {selectedItinerary.endDate ? ` – ${new Date(selectedItinerary.endDate).toLocaleDateString()}` : ' – 20 May 2026'}
                      </span>
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="border border-[#EBE7DF] bg-[#FFFDF9] hover:bg-[#FAF8F5] text-[#1D3B3A] text-xs font-semibold px-4 py-2.5 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>Add Documents</span>
                    </button>

                    <button
                      onClick={handleShare}
                      className="bg-[#1D3B3A] hover:bg-[#162E2D] text-white text-xs font-semibold px-4 py-2.5 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
                    >
                      <Share2 className="w-3.5 h-3.5" />
                      <span>{copied ? 'Copied Link!' : 'Share Itinerary'}</span>
                    </button>
                  </div>
                </div>

                {/* SUCCESS BANNER */}
                <div className="bg-[#FFFDF9] border border-[#EBE7DF] rounded-2xl p-5 flex items-center justify-between shadow-2xs">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-[#D1FAE5] text-[#059669] flex items-center justify-center shrink-0">
                      <CheckCircle2 className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-[#0F172A]">Itinerary ready!</h4>
                      <p className="text-2xs text-[#64748B]">
                        We've extracted {selectedItinerary.days?.reduce((acc, d) => acc + d.activities.length, 0) || 18} travel plans from your documents.
                      </p>
                    </div>
                  </div>
                  <img
                    src="/assets/dash_pagoda_banner.png"
                    alt="Pagoda Banner"
                    className="w-36 h-14 object-cover rounded-lg hidden sm:block"
                  />
                </div>

                {/* DRAG AND DROP TIMELINE FEED */}
                <DragDropContext onDragEnd={handleOnDragEnd}>
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h3 className="font-serif font-bold text-lg text-[#0F172A]">
                        Itinerary Timeline
                      </h3>
                      <span className="text-2xs text-[#94A3B8]">Drag items to reorder</span>
                    </div>

                    <div className="relative border-l-2 border-dashed border-[#CBD5E1] ml-4 pl-8 space-y-8 py-2">
                      {selectedItinerary.days?.map((day, dIdx) => (
                        <div key={dIdx} className="space-y-4 relative">
                          {/* Day Marker */}
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-extrabold uppercase text-[#0F172A] tracking-wider">
                              Day {day.dayNumber} • {day.date}
                            </span>
                            <button
                              onClick={() => handleOpenEditModal(dIdx, null)}
                              className="text-2xs font-bold text-[#1D3B3A] hover:underline flex items-center gap-1"
                            >
                              <Plus className="w-3 h-3" />
                              <span>Add Activity</span>
                            </button>
                          </div>

                          {/* Droppable Container per Day */}
                          <Droppable droppableId={`day-${dIdx}`}>
                            {(provided) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.droppableProps}
                                className="space-y-4 min-h-[50px]"
                              >
                                {day.activities?.map((act, aIdx) => (
                                  <Draggable
                                    key={`${dIdx}-${aIdx}-${act.title}`}
                                    draggableId={`act-${dIdx}-${aIdx}`}
                                    index={aIdx}
                                  >
                                    {(dragProvided) => (
                                      <div
                                        ref={dragProvided.innerRef}
                                        {...dragProvided.draggableProps}
                                        className="relative group"
                                      >
                                        {/* Node Icon on Timeline Line */}
                                        <div className="absolute -left-[45px] top-3 w-8 h-8 rounded-full bg-[#FFFDF9] border-2 border-[#1D3B3A] flex items-center justify-center shadow-xs z-10">
                                          {getActivityIcon(act.type)}
                                        </div>

                                        {/* Activity Card */}
                                        <div className="bg-[#FFFDF9] border border-[#EBE7DF] rounded-2xl p-5 space-y-2 hover:border-[#1D3B3A]/40 transition-all shadow-2xs">
                                          <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                              <div
                                                {...dragProvided.dragHandleProps}
                                                className="cursor-grab text-[#94A3B8] hover:text-[#0F172A]"
                                                title="Drag to reorder"
                                              >
                                                <GripVertical className="w-4 h-4" />
                                              </div>
                                              <span className={`text-2xs font-bold uppercase px-2.5 py-0.5 rounded-full border ${getActivityBadgeClass(act.type)}`}>
                                                {act.type || 'Activity'}
                                              </span>
                                            </div>
                                            <div className="flex items-center gap-3">
                                              <span className="text-xs font-semibold text-[#64748B]">{act.time}</span>
                                              <button
                                                onClick={() => handleOpenEditModal(dIdx, aIdx)}
                                                className="opacity-0 group-hover:opacity-100 text-[#94A3B8] hover:text-[#1D3B3A] p-1 transition-opacity"
                                                title="Edit activity"
                                              >
                                                <Edit2 className="w-3.5 h-3.5" />
                                              </button>
                                            </div>
                                          </div>

                                          <h4 className="font-bold text-base text-[#0F172A]">{act.title}</h4>

                                          {act.description && (
                                            <p className="text-xs text-[#64748B] leading-relaxed">{act.description}</p>
                                          )}

                                          <div className="flex items-center justify-between pt-1 text-2xs text-[#94A3B8]">
                                            {act.location ? <span>Location: {act.location}</span> : <span />}
                                            {act.cost ? <span className="font-bold text-[#1D3B3A]">${act.cost}</span> : null}
                                          </div>
                                        </div>
                                      </div>
                                    )}
                                  </Draggable>
                                ))}
                                {provided.placeholder}
                              </div>
                            )}
                          </Droppable>
                        </div>
                      ))}
                    </div>
                  </div>
                </DragDropContext>
              </div>

              {/* RIGHT SIDEBAR MAP & EXPENSE TRACKER */}
              <div className="lg:col-span-4 space-y-6">
                {/* INTERACTIVE LEAFLET MAP */}
                <div className="bg-[#FFFDF9] border border-[#EBE7DF] rounded-2xl p-5 space-y-4 shadow-2xs">
                  <h4 className="font-serif font-bold text-base text-[#0F172A] flex items-center gap-2">
                    <FlightIcon className="w-4 h-4 text-[#1D3B3A]" />
                    <span>Interactive Journey Map</span>
                  </h4>

                  <InteractiveMap itineraries={itineraries} className="w-full h-56" />

                  <div className="space-y-2 pt-1 text-xs">
                    <div className="flex items-center justify-between p-2 rounded-lg bg-[#FAF8F5]">
                      <span className="font-semibold text-[#0F172A]">Delhi → Tokyo</span>
                      <span className="text-2xs font-bold text-[#059669] bg-[#D1FAE5] px-2 py-0.5 rounded">Completed</span>
                    </div>
                    <div className="flex items-center justify-between p-2 rounded-lg bg-[#FAF8F5]">
                      <span className="font-semibold text-[#0F172A]">Tokyo → Kyoto</span>
                      <span className="text-2xs font-bold text-[#D97706] bg-[#FEF3C7] px-2 py-0.5 rounded">Upcoming</span>
                    </div>
                  </div>
                </div>

                {/* EXPENSE BREAKDOWN CARD */}
                <ExpenseBreakdownCard activities={getAllActivities()} />
              </div>
            </div>
          )}
        </main>
      </div>

      {/* EDIT / ADD ACTIVITY MODAL */}
      <ActivityEditModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSave={handleSaveActivity}
        activity={editingActivity}
      />
    </div>
  );
};

export default DashboardPage;
