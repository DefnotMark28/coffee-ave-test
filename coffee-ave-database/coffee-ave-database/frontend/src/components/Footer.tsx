import React from 'react';
import { MapPin, Clock, Phone, Mail, Instagram, Facebook, ShieldCheck, Heart } from 'lucide-react';

interface FooterProps {
  onNavigate: (tab: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="bg-[#120f0d] border-t border-white/5 text-[#ede8e3] pt-16 pb-12 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-white/10">
          
          {/* Brand Blurb + Socials */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#28211c] to-[#120e0b] border border-[#d4af37]/40 flex items-center justify-center">
                <span className="font-serif text-sm font-bold text-[#d4af37]">CA</span>
              </div>
              <div className="flex flex-col">
                <span className="font-serif text-lg font-bold text-white tracking-wide leading-none">
                  COFFEE AVE
                </span>
                <span className="text-[9px] tracking-[0.2em] text-[#d4af37] uppercase font-semibold">
                  BY AUTO AVE
                </span>
              </div>
            </div>

            <p className="text-xs text-[#ede8e3]/70 leading-relaxed">
              Angono’s premier hybrid automotive spa & specialty coffee lounge. Masterful micro-lot roasting meets spotless ceramic detailing under one roof. Sip while we shine.
            </p>

            <div className="flex items-center gap-3 pt-2">
              <a 
                href="#instagram" 
                aria-label="Instagram"
                className="w-8 h-8 rounded-full bg-[#211d1a] border border-white/10 flex items-center justify-center text-[#ede8e3]/70 hover:text-[#c0392b] hover:border-[#c0392b] transition-colors"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a 
                href="#facebook" 
                aria-label="Facebook"
                className="w-8 h-8 rounded-full bg-[#211d1a] border border-white/10 flex items-center justify-center text-[#ede8e3]/70 hover:text-[#c0392b] hover:border-[#c0392b] transition-colors"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <div className="text-[11px] text-[#ede8e3]/50 pl-1 font-mono">
                @coffeeave.autoave
              </div>
            </div>
          </div>

          {/* Reservations Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-widest text-[#d4af37]">
              Reservations & Services
            </h4>
            <ul className="space-y-2 text-xs text-[#ede8e3]/70">
              <li>
                <button 
                  onClick={() => onNavigate('wash')} 
                  className="hover:text-white hover:underline transition-colors text-left"
                >
                  Auto Spa Booking & Detailing
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate('cafe')} 
                  className="hover:text-white hover:underline transition-colors text-left"
                >
                  Order Ahead & Table Service
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate('community')} 
                  className="hover:text-white hover:underline transition-colors text-left"
                >
                  Private Car Club & Cupping Events
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate('tracker')} 
                  className="hover:text-white hover:underline transition-colors text-left"
                >
                  Live Bay Queue & Camera Stream
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate('community')} 
                  className="hover:text-white hover:underline transition-colors text-left"
                >
                  Unli-Wash Monthly VIP Pass
                </button>
              </li>
            </ul>
          </div>

          {/* Visit Us: Address & Hours */}
          <div className="space-y-3 lg:col-span-2">
            <h4 className="text-xs font-semibold uppercase tracking-widest text-[#d4af37]">
              Visit Us in Nieves Hills
            </h4>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-[#ede8e3]/75">
              <div className="space-y-2">
                <div className="flex items-start gap-2.5">
                  <MapPin className="w-4 h-4 text-[#c0392b] shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white block font-medium">Auto Ave / Coffee Ave Station</strong>
                    <span>Blk 5, Nieves Hills, Lot 9 Ilang-Ilang</span>
                    <span className="block">Angono, 1920 Rizal, Philippines</span>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 pt-1">
                  <Phone className="w-4 h-4 text-[#d4af37] shrink-0" />
                  <span>+63 (02) 8924-AUTO / +63 917 555 AVE1</span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-start gap-2.5">
                  <Clock className="w-4 h-4 text-[#c0392b] shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white block font-medium">Operating Hours</strong>
                    <span>Café Lounge: Daily 7:00 AM – 10:00 PM</span>
                    <span className="block text-[#ede8e3]/60">Wash Bays: Daily 7:00 AM – 9:00 PM</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-1 text-[11px] text-[#ede8e3]/60">
                  <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Eco-Certified Wastewater Treatment Compliant</span>
                </div>
              </div>
            </div>

            {/* Quick Banner */}
            <div className="mt-4 p-3 rounded-xl bg-[#1c1815] border border-white/5 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-white font-medium">Now Open at Nieves Hills</span>
                <span className="text-[#ede8e3]/50 hidden sm:inline">· 4 Detailing Bays Active</span>
              </div>
              <button 
                onClick={() => onNavigate('tracker')}
                className="text-[#c0392b] hover:text-[#d32f2f] font-semibold text-xs transition-colors"
              >
                Check Bay Wait Times →
              </button>
            </div>

          </div>

        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-[#ede8e3]/50 gap-4">
          <p>© 2026 Auto Ave Unli Car Wash & Coffee Ave Lounge. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span className="hover:text-white cursor-pointer transition-colors">Privacy Policy</span>
            <span className="hover:text-white cursor-pointer transition-colors">Terms of Service</span>
            <span className="hover:text-white cursor-pointer transition-colors">Angono Environmental Portal</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
