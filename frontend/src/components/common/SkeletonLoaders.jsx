import React from 'react';

export const TimelineItemSkeleton = () => (
  <div className="bg-[#FFFDF9] border border-[#EBE7DF] rounded-2xl p-5 space-y-3 shadow-2xs animate-pulse">
    <div className="flex items-center justify-between">
      <div className="h-4 w-20 bg-[#E2E8F0] rounded-full" />
      <div className="h-3 w-16 bg-[#E2E8F0] rounded" />
    </div>
    <div className="h-5 w-48 bg-[#CBD5E1] rounded" />
    <div className="h-3 w-full bg-[#F1F5F9] rounded" />
    <div className="h-3 w-3/4 bg-[#F1F5F9] rounded" />
  </div>
);

export const DashboardSkeleton = () => (
  <div className="space-y-6 animate-pulse">
    <div className="bg-[#FFFDF9] border border-[#EBE7DF] rounded-3xl p-6 flex justify-between items-center">
      <div className="space-y-2">
        <div className="h-7 w-56 bg-[#CBD5E1] rounded-lg" />
        <div className="h-4 w-40 bg-[#E2E8F0] rounded" />
      </div>
      <div className="flex gap-3">
        <div className="h-10 w-28 bg-[#E2E8F0] rounded-xl" />
        <div className="h-10 w-28 bg-[#1D3B3A]/30 rounded-xl" />
      </div>
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      <div className="lg:col-span-8 space-y-4">
        <div className="h-6 w-36 bg-[#CBD5E1] rounded" />
        <TimelineItemSkeleton />
        <TimelineItemSkeleton />
        <TimelineItemSkeleton />
      </div>

      <div className="lg:col-span-4 space-y-6">
        <div className="h-56 bg-[#FFFDF9] border border-[#EBE7DF] rounded-2xl p-4 space-y-3">
          <div className="h-4 w-32 bg-[#CBD5E1] rounded" />
          <div className="h-36 bg-[#F1F5F9] rounded-xl" />
        </div>
        <div className="h-40 bg-[#FFFDF9] border border-[#EBE7DF] rounded-2xl p-4 space-y-3">
          <div className="h-4 w-28 bg-[#CBD5E1] rounded" />
          <div className="h-20 bg-[#F1F5F9] rounded-xl" />
        </div>
      </div>
    </div>
  </div>
);
