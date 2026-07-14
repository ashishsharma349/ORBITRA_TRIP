import React, { useState, useEffect } from 'react';
import { X, Check } from 'lucide-react';

const ActivityEditModal = ({ isOpen, onClose, onSave, activity = null }) => {
  const [title, setTitle] = useState('');
  const [type, setType] = useState('activity');
  const [time, setTime] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [cost, setCost] = useState('');

  useEffect(() => {
    if (activity) {
      setTitle(activity.title || '');
      setType(activity.type || 'activity');
      setTime(activity.time || '');
      setLocation(activity.location || '');
      setDescription(activity.description || '');
      setCost(activity.cost || '');
    } else {
      setTitle('');
      setType('activity');
      setTime('10:00 AM');
      setLocation('');
      setDescription('');
      setCost('');
    }
  }, [activity, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      ...activity,
      title,
      type,
      time,
      location,
      description,
      cost: Number(cost) || 0
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0F172A]/50 backdrop-blur-xs p-4">
      <div className="bg-[#FFFDF9] border border-[#EBE7DF] rounded-3xl p-6 sm:p-8 w-full max-w-lg shadow-2xl space-y-6">
        <div className="flex items-center justify-between border-b border-[#EBE7DF] pb-4">
          <h3 className="font-serif font-bold text-xl text-[#0F172A]">
            {activity ? 'Edit Activity' : 'Add New Activity'}
          </h3>
          <button onClick={onClose} className="p-1 text-[#94A3B8] hover:text-[#0F172A]">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase text-[#475569] mb-1">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded-xl border border-[#EBE7DF] bg-[#FAF8F5] px-3.5 py-2.5 text-sm text-[#0F172A] focus:outline-none focus:border-[#1D3B3A]"
              placeholder="e.g. Tokyo Hotel Check-in"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase text-[#475569] mb-1">Type</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full rounded-xl border border-[#EBE7DF] bg-[#FAF8F5] px-3.5 py-2.5 text-sm text-[#0F172A] focus:outline-none focus:border-[#1D3B3A]"
              >
                <option value="flight">Flight</option>
                <option value="hotel">Hotel</option>
                <option value="train">Train / Transit</option>
                <option value="activity">Activity</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-[#475569] mb-1">Time</label>
              <input
                type="text"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full rounded-xl border border-[#EBE7DF] bg-[#FAF8F5] px-3.5 py-2.5 text-sm text-[#0F172A] focus:outline-none focus:border-[#1D3B3A]"
                placeholder="e.g. 09:15 — 11:45"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase text-[#475569] mb-1">Location</label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full rounded-xl border border-[#EBE7DF] bg-[#FAF8F5] px-3.5 py-2.5 text-sm text-[#0F172A] focus:outline-none focus:border-[#1D3B3A]"
                placeholder="e.g. Narita Airport"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-[#475569] mb-1">Cost ($)</label>
              <input
                type="number"
                value={cost}
                onChange={(e) => setCost(e.target.value)}
                className="w-full rounded-xl border border-[#EBE7DF] bg-[#FAF8F5] px-3.5 py-2.5 text-sm text-[#0F172A] focus:outline-none focus:border-[#1D3B3A]"
                placeholder="e.g. 150"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-[#475569] mb-1">Description</label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full rounded-xl border border-[#EBE7DF] bg-[#FAF8F5] px-3.5 py-2.5 text-sm text-[#0F172A] focus:outline-none focus:border-[#1D3B3A]"
              placeholder="Additional details..."
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-[#EBE7DF] text-xs font-semibold text-[#475569] hover:bg-[#FAF8F5]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-[#1D3B3A] hover:bg-[#162E2D] text-xs font-semibold text-white flex items-center gap-1.5 shadow-sm"
            >
              <Check className="w-4 h-4" />
              <span>Save Changes</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ActivityEditModal;
