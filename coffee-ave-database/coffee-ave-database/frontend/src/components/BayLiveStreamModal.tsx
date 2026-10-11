import React, { useState, useEffect } from 'react';
import { X, Video, ShieldCheck, Activity, Eye, RefreshCw, Sparkles, CheckCircle2 } from 'lucide-react';
import { VehicleQueueItem } from '../types';

interface BayLiveStreamModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedVehicle?: VehicleQueueItem | null;
}

export const BayLiveStreamModal: React.FC<BayLiveStreamModalProps> = ({
  isOpen,
  onClose,
  selectedVehicle,
}) => {
  const [activeCamera, setActiveCamera] = useState<number>(selectedVehicle ? selectedVehicle.bayNumber : 2);
  const [timestamp, setTimestamp] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimestamp(now.toLocaleTimeString('en-US', { hour12: false }) + '.' + Math.floor(now.getMilliseconds() / 100));
    };
    updateTime();
    const interval = setInterval(updateTime, 100);
    return () => clearInterval(interval);
  }, []);

  if (!isOpen) return null;

  const cameras = [
    { id: 1, name: 'Bay 01', label: 'Foam & Decon', status: 'ACTIVE 1080p' },
    { id: 2, name: 'Bay 02', label: 'Hand Scrub & Hydro', status: 'ACTIVE 1080p' },
    { id: 3, name: 'Bay 03', label: 'Spot-Free Dry & Ceramic', status: 'ACTIVE 1080p' },
    { id: 4, name: 'Bay 04', label: 'Interior Steam & Ozone', status: 'ACTIVE 1080p' },
    { id: 5, name: 'Lounge Bar', label: 'Barista Extraction', status: 'ACTIVE 1080p' },
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/85 backdrop-blur-md transition-opacity"
        onClick={onClose}
      />

      <div className="relative bg-[#1c1815] border border-white/10 rounded-2xl max-w-4xl w-full overflow-hidden shadow-2xl z-10 text-[#ede8e3]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-[#221d19]">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-[#c0392b] animate-ping" />
            <div>
              <h3 className="text-base font-semibold text-white flex items-center gap-2">
                <span>HD Live Bay Video Feed</span>
                <span className="text-[11px] px-2 py-0.5 rounded bg-white/10 text-[#d4af37] font-mono">
                  LIVE 60FPS
                </span>
              </h3>
              <p className="text-xs text-[#ede8e3]/60">
                Nieves Hills Angono Facility · Integrated Bay Sensor Network
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-[#ede8e3]/70 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Video Canvas Container */}
        <div className="p-6 space-y-4">
          
          {/* Simulated HD Feed with HUD */}
          <div className="relative aspect-video rounded-xl overflow-hidden bg-[#0d0b0a] border border-white/10 flex items-center justify-center group shadow-inner">
            
            {/* Background simulated video texture */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#1b242e]/40 via-[#101317] to-[#18110e] opacity-90" />

            {/* Simulated Live Action Visuals depending on camera */}
            <div className="relative z-10 flex flex-col items-center justify-center text-center p-6 space-y-3">
              <div className="relative">
                <div className="w-20 h-20 rounded-full border-2 border-dashed border-[#d4af37]/60 flex items-center justify-center animate-spin-slow">
                  <Video className="w-9 h-9 text-[#d4af37]" />
                </div>
                <div className="absolute -top-1 -right-1 px-1.5 py-0.5 bg-[#c0392b] text-[9px] font-bold rounded text-white tracking-widest uppercase">
                  REC
                </div>
              </div>

              <div>
                <p className="text-sm font-semibold text-white tracking-wide">
                  {cameras.find(c => c.id === activeCamera)?.name}: {cameras.find(c => c.id === activeCamera)?.label}
                </p>
                {selectedVehicle && activeCamera === selectedVehicle.bayNumber ? (
                  <div className="mt-1 flex items-center justify-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-black/60 border border-white/20 font-mono text-xs text-[#d4af37] font-bold">
                      {selectedVehicle.plateNumber}
                    </span>
                    <span className="text-xs text-[#ede8e3]/80">
                      {selectedVehicle.vehicleModel} ({selectedVehicle.vehicleColor})
                    </span>
                  </div>
                ) : (
                  <p className="text-xs text-[#ede8e3]/60 mt-0.5">
                    Sensor stream verified · Ultra-low latency H.265 transmission
                  </p>
                )}
              </div>

              {/* Bay Telemetry Chips */}
              <div className="flex flex-wrap items-center justify-center gap-2 pt-2 text-[11px] font-mono text-[#ede8e3]/70">
                <span className="px-2.5 py-1 rounded bg-black/50 border border-white/10 flex items-center gap-1.5">
                  <Activity className="w-3 h-3 text-emerald-400" />
                  Water Pressure: 175 PSI
                </span>
                <span className="px-2.5 py-1 rounded bg-black/50 border border-white/10 flex items-center gap-1.5">
                  <ShieldCheck className="w-3 h-3 text-[#d4af37]" />
                  DI Filtration: 0 PPM (Spot-Free)
                </span>
                <span className="px-2.5 py-1 rounded bg-black/50 border border-white/10 flex items-center gap-1.5">
                  <Sparkles className="w-3 h-3 text-[#c0392b]" />
                  pH: 7.0 Neutral Foam
                </span>
              </div>
            </div>

            {/* Camera Overlay HUD (Timestamp, Reticle, Grid) */}
            <div className="absolute top-4 left-4 font-mono text-xs text-white/80 bg-black/60 px-2.5 py-1 rounded backdrop-blur-sm border border-white/10 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              <span>CAM 0{activeCamera} // {timestamp}</span>
            </div>

            <div className="absolute top-4 right-4 text-xs font-mono text-[#d4af37] bg-black/60 px-2.5 py-1 rounded border border-white/10">
              ANGONO-NIEVES-BAYS
            </div>

            {/* Target Reticles */}
            <div className="absolute inset-8 border border-white/5 pointer-events-none rounded-lg flex items-center justify-center">
              <div className="w-8 h-8 border-t border-l border-[#c0392b]/50 absolute top-0 left-0" />
              <div className="w-8 h-8 border-t border-r border-[#c0392b]/50 absolute top-0 right-0" />
              <div className="w-8 h-8 border-b border-l border-[#c0392b]/50 absolute bottom-0 left-0" />
              <div className="w-8 h-8 border-b border-r border-[#c0392b]/50 absolute bottom-0 right-0" />
            </div>

            {/* Bottom notification banner in video */}
            <div className="absolute bottom-4 left-4 right-4 bg-black/75 backdrop-blur-md px-4 py-2 rounded-lg border border-white/10 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span className="text-[#ede8e3]">
                  {selectedVehicle 
                    ? `Tracking vehicle: ${selectedVehicle.plateNumber} · Stage: ${selectedVehicle.stageName}`
                    : 'Real-time vehicle detection active. Patrons can monitor detailing from their lounge table.'}
                </span>
              </div>
              <span className="text-[10px] text-[#d4af37] uppercase font-mono">Secured Stream</span>
            </div>
          </div>

          {/* Camera Selection Switcher */}
          <div className="space-y-2">
            <span className="text-xs font-semibold text-[#ede8e3]/60 uppercase tracking-wider">
              Select Camera Angle
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              {cameras.map((cam) => {
                const isActive = activeCamera === cam.id;
                return (
                  <button
                    key={cam.id}
                    onClick={() => setActiveCamera(cam.id)}
                    className={`p-2.5 rounded-lg border text-left transition-all cursor-pointer ${
                      isActive 
                        ? 'bg-[#c0392b]/20 border-[#c0392b] text-white shadow-md' 
                        : 'bg-[#25201c] border-white/10 hover:border-white/20 text-[#ede8e3]/70 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold font-mono">{cam.name}</span>
                      {isActive && <Eye className="w-3 h-3 text-[#c0392b]" />}
                    </div>
                    <p className="text-[11px] truncate font-medium">{cam.label}</p>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="px-6 py-3.5 bg-[#221d19] border-t border-white/10 flex items-center justify-between text-xs text-[#ede8e3]/60">
          <span>Automated Privacy Masking: Interior passenger zones blurred in compliance with data regulations.</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-white/10 hover:bg-white/15 text-white font-medium transition-colors"
          >
            Close Feed
          </button>
        </div>
      </div>
    </div>
  );
};
