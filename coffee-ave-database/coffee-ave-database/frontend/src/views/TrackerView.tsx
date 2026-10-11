import React, { useState } from 'react';
import { 
  Car, 
  Clock, 
  Video, 
  Search, 
  CheckCircle2, 
  Sparkles, 
  Coffee, 
  Play, 
  RefreshCw,
  SlidersHorizontal,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';
import { VehicleQueueItem, WashStage } from '../types';

interface TrackerViewProps {
  vehicles: VehicleQueueItem[];
  onOpenLiveCamera: (vehicle: VehicleQueueItem) => void;
  onAdvanceVehicleStage: (vehicleId: string) => void;
  userPlateNumber?: string;
}

export const TrackerView: React.FC<TrackerViewProps> = ({
  vehicles,
  onOpenLiveCamera,
  onAdvanceVehicleStage,
  userPlateNumber = '',
}) => {
  const [searchQuery, setSearchQuery] = useState(userPlateNumber);
  const [filterStage, setFilterStage] = useState<'all' | '1' | '2' | '3'>('all');

  const filteredVehicles = vehicles.filter((v) => {
    const matchesSearch = 
      v.plateNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.vehicleModel.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.customerName?.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (filterStage === 'all') return matchesSearch;
    return matchesSearch && v.stage.toString() === filterStage;
  });

  const activeCount = vehicles.length;
  const preparingCount = vehicles.filter(v => v.stage === 1).length;
  const cleaningCount = vehicles.filter(v => v.stage === 2).length;
  const readyCount = vehicles.filter(v => v.stage === 3).length;

  const getStatusPill = (stage: WashStage) => {
    switch (stage) {
      case 1:
        // gray=Preparing
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-gray-600/30 text-gray-300 border border-gray-500/40">
            <span className="w-2 h-2 rounded-full bg-gray-400" />
            Stage 1: Preparing
          </span>
        );
      case 2:
        // blue=Cleaning
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-600/25 text-blue-300 border border-blue-500/40">
            <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
            Stage 2: Cleaning & Prep
          </span>
        );
      case 3:
        // green=Ready
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-600/25 text-emerald-300 border border-emerald-500/40">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            Stage 3: Ready for Pickup
          </span>
        );
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      
      {/* Header Band */}
      <div className="rounded-3xl bg-gradient-to-r from-[#241c18] via-[#1d1714] to-[#171412] border border-[#d4af37]/20 p-8 sm:p-12 text-center space-y-4 shadow-2xl relative overflow-hidden">
        {/* Glow ambient background */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#c0392b]/15 rounded-full blur-[90px] pointer-events-none" />
        
        <div className="relative z-10 space-y-2">
          <span className="text-xs font-semibold uppercase tracking-[0.25em] text-[#d4af37]">
            LIVE WASH TRACKER
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-white tracking-tight leading-tight">
            Relax, your coffee is hot and your car is in good hands.
          </h1>
          <p className="max-w-2xl mx-auto text-sm sm:text-base text-[#ede8e3]/75 leading-relaxed font-normal">
            Track real-time detailing progression across bays 1 to 4 at our Nieves Hills facility. Detailing milestones synchronize with your lounge café tab automatically.
          </p>
        </div>

        {/* Stage Legend Row & Live Stats */}
        <div className="relative z-10 pt-6 border-t border-white/10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 text-left">
          
          {/* Legend 1 */}
          <div className="p-3 rounded-xl bg-black/40 border border-white/5 flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-gray-400 shrink-0" />
            <div>
              <span className="text-[10px] text-[#ede8e3]/50 uppercase font-mono block">Stage 1</span>
              <strong className="text-xs text-white">Preparing ({preparingCount})</strong>
            </div>
          </div>

          {/* Legend 2 */}
          <div className="p-3 rounded-xl bg-black/40 border border-white/5 flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-blue-400 animate-pulse shrink-0" />
            <div>
              <span className="text-[10px] text-[#ede8e3]/50 uppercase font-mono block">Stage 2</span>
              <strong className="text-xs text-white">Cleaning & Prep ({cleaningCount})</strong>
            </div>
          </div>

          {/* Legend 3 */}
          <div className="p-3 rounded-xl bg-black/40 border border-white/5 flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-emerald-400 shrink-0" />
            <div>
              <span className="text-[10px] text-[#ede8e3]/50 uppercase font-mono block">Stage 3</span>
              <strong className="text-xs text-white">Ready for Pickup ({readyCount})</strong>
            </div>
          </div>

          {/* Stat 1: Active Wash Queue */}
          <div className="p-3 rounded-xl bg-[#261f1a] border border-[#d4af37]/30 flex items-center justify-between">
            <div>
              <span className="text-[10px] text-[#d4af37] uppercase font-bold tracking-wider block">Live Queue</span>
              <strong className="text-sm text-white font-mono">{activeCount} Vehicles</strong>
            </div>
            <Car className="w-5 h-5 text-[#d4af37]" />
          </div>

          {/* Stat 2: Average Wait Time */}
          <div className="p-3 rounded-xl bg-[#261f1a] border border-[#c0392b]/40 flex items-center justify-between">
            <div>
              <span className="text-[10px] text-[#ff8e8e] uppercase font-bold tracking-wider block">Avg. Wait</span>
              <strong className="text-sm text-white font-mono">35 Minutes</strong>
            </div>
            <Clock className="w-5 h-5 text-[#c0392b]" />
          </div>

        </div>

      </div>

      {/* Search & Filter Toolbar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        
        {/* Search Plate Input */}
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-[#ede8e3]/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search Plate #, model, or patron..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#201c19] border border-white/10 text-xs text-white placeholder-[#ede8e3]/40 font-mono focus:outline-none focus:border-[#d4af37]"
          />
        </div>

        {/* Filter Stage Pills */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-[#201c19] border border-white/10 w-full sm:w-auto overflow-x-auto">
          <button
            onClick={() => setFilterStage('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
              filterStage === 'all' ? 'bg-[#c0392b] text-white' : 'text-[#ede8e3]/60 hover:text-white'
            }`}
          >
            All ({vehicles.length})
          </button>
          <button
            onClick={() => setFilterStage('1')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
              filterStage === '1' ? 'bg-gray-600 text-white' : 'text-[#ede8e3]/60 hover:text-white'
            }`}
          >
            Preparing ({preparingCount})
          </button>
          <button
            onClick={() => setFilterStage('2')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
              filterStage === '2' ? 'bg-blue-600 text-white' : 'text-[#ede8e3]/60 hover:text-white'
            }`}
          >
            Cleaning ({cleaningCount})
          </button>
          <button
            onClick={() => setFilterStage('3')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
              filterStage === '3' ? 'bg-emerald-600 text-white' : 'text-[#ede8e3]/60 hover:text-white'
            }`}
          >
            Ready ({readyCount})
          </button>
        </div>

      </div>

      {/* Stacked Vehicle Cards */}
      <div className="space-y-5">
        {filteredVehicles.length === 0 ? (
          <div className="p-12 text-center rounded-2xl bg-[#201c19] border border-white/5 space-y-3">
            <Car className="w-10 h-10 text-[#ede8e3]/30 mx-auto" />
            <h4 className="font-serif text-lg text-white font-semibold">No vehicles found</h4>
            <p className="text-xs text-[#ede8e3]/60">
              No matching license plates found in today's active wash queue.
            </p>
          </div>
        ) : (
          filteredVehicles.map((vehicle) => {
            const isUserVehicle = userPlateNumber && vehicle.plateNumber.toUpperCase().includes(userPlateNumber.toUpperCase());

            return (
              <div
                key={vehicle.id}
                className={`p-6 sm:p-7 rounded-2xl bg-[#201c19] border transition-all duration-300 shadow-xl space-y-6 ${
                  isUserVehicle 
                    ? 'border-[#d4af37] ring-1 ring-[#d4af37]/50 bg-gradient-to-r from-[#241f19] to-[#201c19]' 
                    : 'border-white/5 hover:border-white/15'
                }`}
              >
                {/* Top Row: Plate Badge + Model + Status Pill */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  
                  {/* Left: Plate Badge & Model */}
                  <div className="flex items-center gap-4">
                    {/* License Plate Badge */}
                    <div className="px-3.5 py-1.5 rounded-lg bg-black border-2 border-white/20 shadow-md flex flex-col items-center justify-center shrink-0">
                      <span className="text-[8px] font-mono tracking-widest text-[#d4af37] uppercase">
                        PILIPINAS
                      </span>
                      <span className="font-mono text-base sm:text-lg font-black tracking-widest text-white leading-none">
                        {vehicle.plateNumber}
                      </span>
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-serif text-lg sm:text-xl font-bold text-white">
                          {vehicle.vehicleModel}
                        </h3>
                        {isUserVehicle && (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#d4af37] text-black tracking-wider uppercase">
                            Your Vehicle
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-[#ede8e3]/60 mt-0.5">
                        <span className="flex items-center gap-1.5">
                          <span 
                            className="w-2.5 h-2.5 rounded-full border border-white/20 inline-block" 
                            style={{ backgroundColor: vehicle.colorHex }}
                          />
                          {vehicle.vehicleColor}
                        </span>
                        <span>·</span>
                        <span>Bay {vehicle.bayNumber}</span>
                        {vehicle.customerName && (
                          <>
                            <span>·</span>
                            <span>{vehicle.customerName}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Right: Status Pill & Time */}
                  <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-1.5">
                    {getStatusPill(vehicle.stage)}
                    <span className="text-[11px] font-mono text-[#ede8e3]/50">
                      Started: {vehicle.startTime} (Est. {vehicle.estimatedDuration})
                    </span>
                  </div>

                </div>

                {/* Middle Info: Service Package Name & Linked Café Order */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 p-3.5 rounded-xl bg-[#171412] border border-white/5 text-xs">
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-[#d4af37] font-semibold block">
                      Service Package
                    </span>
                    <span className="font-medium text-white">{vehicle.servicePackage}</span>
                  </div>

                  {vehicle.cafeOrderLinked && (
                    <div className="border-t md:border-t-0 md:border-l border-white/5 pt-2 md:pt-0 md:pl-4">
                      <span className="text-[10px] uppercase tracking-wider text-[#d4af37] font-semibold flex items-center gap-1">
                        <Coffee className="w-3 h-3 text-[#d4af37]" />
                        Linked Lounge Order ({vehicle.tableNumber || 'Mezzanine'})
                      </span>
                      <span className="text-[#ede8e3]/90 font-medium">
                        {vehicle.cafeOrderLinked}
                        {vehicle.drinkStatus && (
                          <span className="ml-2 text-[10px] px-1.5 py-0.5 rounded bg-white/10 text-emerald-400 font-mono">
                            {vehicle.drinkStatus}
                          </span>
                        )}
                      </span>
                    </div>
                  )}
                </div>

                {/* 3-Segment Progress Bar with Stage Labels Underneath */}
                <div className="space-y-2">
                  <div className="grid grid-cols-3 gap-2">
                    {/* Stage 1 Bar */}
                    <div className="space-y-1.5">
                      <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                        <div 
                          className="h-full bg-gray-400 transition-all duration-500"
                          style={{
                            width: vehicle.stage >= 1 ? (vehicle.stage === 1 ? `${vehicle.stageProgressPercent}%` : '100%') : '0%'
                          }}
                        />
                      </div>
                      <div className="flex items-center justify-between text-[11px]">
                        <span className={`font-medium ${vehicle.stage >= 1 ? 'text-white' : 'text-[#ede8e3]/40'}`}>
                          1. Preparing
                        </span>
                        {vehicle.stage === 1 && (
                          <span className="text-[10px] font-mono text-[#d4af37]">In Progress</span>
                        )}
                      </div>
                    </div>

                    {/* Stage 2 Bar */}
                    <div className="space-y-1.5">
                      <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                        <div 
                          className="h-full bg-blue-500 transition-all duration-500"
                          style={{
                            width: vehicle.stage >= 2 ? (vehicle.stage === 2 ? `${vehicle.stageProgressPercent}%` : '100%') : '0%'
                          }}
                        />
                      </div>
                      <div className="flex items-center justify-between text-[11px]">
                        <span className={`font-medium ${vehicle.stage >= 2 ? 'text-white' : 'text-[#ede8e3]/40'}`}>
                          2. Cleaning & Prep
                        </span>
                        {vehicle.stage === 2 && (
                          <span className="text-[10px] font-mono text-blue-400">Bay {vehicle.bayNumber}</span>
                        )}
                      </div>
                    </div>

                    {/* Stage 3 Bar */}
                    <div className="space-y-1.5">
                      <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                        <div 
                          className="h-full bg-emerald-500 transition-all duration-500"
                          style={{
                            width: vehicle.stage === 3 ? '100%' : '0%'
                          }}
                        />
                      </div>
                      <div className="flex items-center justify-between text-[11px]">
                        <span className={`font-medium ${vehicle.stage === 3 ? 'text-emerald-400 font-bold' : 'text-[#ede8e3]/40'}`}>
                          3. Ready for Pickup
                        </span>
                        {vehicle.stage === 3 && (
                          <span className="text-[10px] font-mono text-emerald-400">Bay Exit</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card Actions */}
                <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-white/5">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onOpenLiveCamera(vehicle)}
                      className="px-3.5 py-1.5 rounded-lg bg-[#27211d] hover:bg-[#322a25] border border-white/10 text-xs font-semibold text-white flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Video className="w-3.5 h-3.5 text-[#d4af37]" />
                      <span>Watch Bay {vehicle.bayNumber} Camera Feed</span>
                    </button>
                  </div>

                  {/* Interactive Demo Control to test workflow */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onAdvanceVehicleStage(vehicle.id)}
                      className="px-3 py-1.5 rounded-lg border border-white/10 hover:border-[#c0392b] text-[11px] text-[#ede8e3]/70 hover:text-white transition-colors cursor-pointer flex items-center gap-1"
                      title="Simulate detailer advancing this car to next stage"
                    >
                      <Play className="w-3 h-3 text-[#c0392b]" />
                      <span>Advance Stage (Demo)</span>
                    </button>
                  </div>
                </div>

              </div>
            );
          })
        )}
      </div>

      {/* Compliance / Water Safety Notice (referencing project charter) */}
      <div className="p-6 rounded-2xl bg-[#171412] border border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#ede8e3]/60">
        <div className="flex items-center gap-3">
          <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>
            Strict compliance with Municipal Environmental Disposal Regulations in Rizal. All water runoff is treated through multi-stage sediment separation before safe recycling.
          </span>
        </div>
        <span className="font-mono text-[#d4af37] shrink-0">Permit: ENV-RIZ-2026-09</span>
      </div>

    </div>
  );
};
