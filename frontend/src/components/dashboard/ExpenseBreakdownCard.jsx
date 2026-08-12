import React from 'react';
import { DollarSign, Plane, Building, Train, Compass } from 'lucide-react';

const ExpenseBreakdownCard = ({ activities = [] }) => {
  const calculateCategoryExpenses = () => {
    let flightCost = 0;
    let hotelCost = 0;
    let trainCost = 0;
    let activityCost = 0;

    activities.forEach((act) => {
      const cost = Number(act.cost || act.price || 0);
      switch (act.type?.toLowerCase()) {
        case 'flight':
          flightCost += cost;
          break;
        case 'hotel':
        case 'lodging':
          hotelCost += cost;
          break;
        case 'train':
        case 'transit':
          trainCost += cost;
          break;
        default:
          activityCost += cost;
          break;
      }
    });

    const total = flightCost + hotelCost + trainCost + activityCost;
    return { flightCost, hotelCost, trainCost, activityCost, total };
  };

  const { flightCost, hotelCost, trainCost, activityCost, total } = calculateCategoryExpenses();

  return (
    <div className="bg-[#FFFDF9] border border-[#EBE7DF] rounded-2xl p-5 space-y-4 shadow-2xs">
      <div className="flex items-center justify-between">
        <h4 className="font-serif font-bold text-base text-[#0F172A] flex items-center gap-2">
          <DollarSign className="w-4 h-4 text-[#1D3B3A]" />
          <span>Expense Breakdown</span>
        </h4>
        <span className="text-xs font-bold text-[#1D3B3A] bg-[#E8F3F1] px-2.5 py-1 rounded-full">
          Total: ${total}
        </span>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-[#FAF8F5] border border-[#EBE7DF] h-2.5 rounded-full overflow-hidden flex">
        <div style={{ width: total > 0 ? `${(flightCost / total) * 100}%` : '0%' }} className="bg-[#1D3B3A]" title="Flights" />
        <div style={{ width: total > 0 ? `${(hotelCost / total) * 100}%` : '0%' }} className="bg-[#D97706]" title="Hotels" />
        <div style={{ width: total > 0 ? `${(trainCost / total) * 100}%` : '0%' }} className="bg-[#059669]" title="Transit" />
        <div style={{ width: total > 0 ? `${(activityCost / total) * 100}%` : '0%' }} className="bg-[#7C3AED]" title="Activities" />
      </div>

      {/* Categories List */}
      <div className="space-y-2 text-xs pt-1">
        <div className="flex items-center justify-between p-2 rounded-lg bg-[#FAF8F5]">
          <span className="flex items-center gap-2 font-medium text-[#475569]">
            <Plane className="w-3.5 h-3.5 text-[#1D3B3A]" />
            <span>Flights</span>
          </span>
          <span className="font-bold text-[#0F172A]">${flightCost}</span>
        </div>

        <div className="flex items-center justify-between p-2 rounded-lg bg-[#FAF8F5]">
          <span className="flex items-center gap-2 font-medium text-[#475569]">
            <Building className="w-3.5 h-3.5 text-[#D97706]" />
            <span>Hotels</span>
          </span>
          <span className="font-bold text-[#0F172A]">${hotelCost}</span>
        </div>

        <div className="flex items-center justify-between p-2 rounded-lg bg-[#FAF8F5]">
          <span className="flex items-center gap-2 font-medium text-[#475569]">
            <Train className="w-3.5 h-3.5 text-[#059669]" />
            <span>Transit</span>
          </span>
          <span className="font-bold text-[#0F172A]">${trainCost}</span>
        </div>

        <div className="flex items-center justify-between p-2 rounded-lg bg-[#FAF8F5]">
          <span className="flex items-center gap-2 font-medium text-[#475569]">
            <Compass className="w-3.5 h-3.5 text-[#7C3AED]" />
            <span>Activities</span>
          </span>
          <span className="font-bold text-[#0F172A]">${activityCost}</span>
        </div>
      </div>
    </div>
  );
};

export default ExpenseBreakdownCard;
