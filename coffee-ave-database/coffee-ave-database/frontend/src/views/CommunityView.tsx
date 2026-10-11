import React from 'react';
import { Calendar, Users, Coffee, Car, Award, Sparkles, MapPin, ChevronRight, Heart } from 'lucide-react';

interface CommunityViewProps {
  onOpenSignUp: () => void;
  onNavigate: (tab: string) => void;
}

export const CommunityView: React.FC<CommunityViewProps> = ({ onOpenSignUp, onNavigate }) => {
  const events = [
    {
      date: 'Saturday, Oct 3, 2026',
      time: '7:00 AM – 10:30 AM',
      title: 'Cars & Coffee Angono: Morning Ridge Run',
      description: 'Meetup at Nieves Hills before a scenic cruise through Rizal highlands. Complimentary single-origin filter pour-overs for all participants.',
      attendees: '48 RSVP’d',
      tag: 'CARS & COFFEE'
    },
    {
      date: 'Wednesday, Oct 7, 2026',
      time: '6:00 PM – 8:00 PM',
      title: 'Benguet Micro-Lot Cupping & Espresso Profiling',
      description: 'Hosted by our Certified Master Barista team. Sample 4 experimental honey-processed beans from Atok, Benguet with dessert pairings.',
      attendees: '16 Seats Left',
      tag: 'WORKSHOP'
    },
    {
      date: 'Saturday, Oct 17, 2026',
      time: '9:00 AM – 12:00 PM',
      title: 'Ceramic Coating & Paint Correction Masterclass',
      description: 'Watch our detailing master demonstrate multi-stage rotary polishing and 9H ceramic sealant application with hands-on practice panels.',
      attendees: 'VIP Members Free',
      tag: 'AUTO SPA'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      
      {/* Header */}
      <div className="text-center space-y-3 max-w-3xl mx-auto">
        <span className="text-xs font-semibold uppercase tracking-[0.25em] text-[#d4af37]">
          COMMUNITY & LOUNGE CULTURE
        </span>
        <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-white tracking-tight">
          Where Motor Culture Meets Coffee Connoisseurs
        </h1>
        <p className="text-sm sm:text-base text-[#ede8e3]/70 leading-relaxed font-normal">
          Coffee Ave is more than a car wash. It is Angono’s gathering hub for car enthusiasts, design purists, and specialty coffee lovers. Join our weekly sunrise drives and member cupping sessions.
        </p>
      </div>

      {/* VIP Club Showcase Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-[#2a1a15] via-[#211a16] to-[#171412] border border-[#d4af37]/30 p-8 sm:p-12 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center shadow-2xl">
        <div className="lg:col-span-8 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#171412] border border-[#d4af37]/40 text-[#d4af37] text-xs font-bold uppercase tracking-wider">
            <Award className="w-3.5 h-3.5" />
            Auto Ave Unli-Wash VIP Club
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-white leading-tight">
            Unlimited Clean Cars. Unlimited Premium Brews.
          </h2>
          <p className="text-sm text-[#ede8e3]/80 leading-relaxed max-w-xl">
            For ₱2,499/month, drive through our deionized water bays as often as you want. Enjoy automated license plate recognition, express queuing, and an everyday 15% discount on our entire café menu.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2 text-xs font-medium text-[#ede8e3]">
            <div className="p-3 rounded-xl bg-black/40 border border-white/5">
              <span className="text-[#d4af37] font-bold block text-sm">Unlimited</span>
              <span className="text-[#ede8e3]/60">Exterior Foam Washes</span>
            </div>
            <div className="p-3 rounded-xl bg-black/40 border border-white/5">
              <span className="text-[#d4af37] font-bold block text-sm">15% Off</span>
              <span className="text-[#ede8e3]/60">Café & Bakery Orders</span>
            </div>
            <div className="p-3 rounded-xl bg-black/40 border border-white/5">
              <span className="text-[#d4af37] font-bold block text-sm">Zero Wait</span>
              <span className="text-[#ede8e3]/60">Priority Bay Assignment</span>
            </div>
          </div>
        </div>

        <div className="lg:col-span-4 flex flex-col items-center justify-center space-y-3 bg-[#171412]/80 p-6 rounded-2xl border border-white/10 text-center">
          <Sparkles className="w-8 h-8 text-[#d4af37]" />
          <span className="text-xs text-[#ede8e3]/60 uppercase tracking-widest font-mono">Monthly All-Inclusive</span>
          <span className="font-serif text-3xl font-bold text-white">₱2,499 / mo</span>
          <button
            onClick={onOpenSignUp}
            className="w-full py-3 px-4 rounded-xl bg-[#c0392b] hover:bg-[#a93226] text-white font-semibold text-xs uppercase tracking-wider transition-all shadow-lg shadow-[#c0392b]/30 cursor-pointer"
          >
            Apply for Membership
          </button>
          <span className="text-[10px] text-[#ede8e3]/50">Cancel anytime · No lock-in period</span>
        </div>
      </div>

      {/* Upcoming Events */}
      <div className="space-y-6">
        <div className="flex items-end justify-between">
          <div>
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#d4af37]">
              COMMUNITY CALENDAR
            </span>
            <h2 className="font-serif text-3xl font-bold text-white mt-1">
              Upcoming Gatherings at Nieves Hills
            </h2>
          </div>
          <span className="text-xs text-[#ede8e3]/50 hidden sm:inline">
            Free entry for all registered patrons
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {events.map((ev, idx) => (
            <div
              key={idx}
              className="p-6 rounded-2xl bg-[#201c19] border border-white/5 hover:border-white/15 transition-all flex flex-col justify-between space-y-4 shadow-lg group"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="px-2.5 py-1 rounded bg-[#171412] text-[#d4af37] border border-[#d4af37]/30 font-bold uppercase text-[10px]">
                    {ev.tag}
                  </span>
                  <span className="text-[#ede8e3]/50 font-mono text-[11px]">{ev.attendees}</span>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 text-xs text-[#c0392b] font-semibold">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{ev.date} · {ev.time}</span>
                  </div>
                  <h3 className="font-serif text-xl font-bold text-white group-hover:text-[#d4af37] transition-colors">
                    {ev.title}
                  </h3>
                </div>

                <p className="text-xs text-[#ede8e3]/70 leading-relaxed">
                  {ev.description}
                </p>
              </div>

              <div className="pt-3 border-t border-white/5 flex items-center justify-between">
                <span className="text-[11px] text-[#ede8e3]/50 flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-[#d4af37]" />
                  Nieves Hills Lounge
                </span>
                <button 
                  onClick={onOpenSignUp}
                  className="text-xs text-[#c0392b] hover:text-[#e74c3c] font-semibold flex items-center gap-1 cursor-pointer"
                >
                  <span>RSVP</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Patron Rides Showcase Gallery */}
      <div className="space-y-6">
        <div>
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#d4af37]">
            SHINE GALLERY
          </span>
          <h2 className="font-serif text-3xl font-bold text-white mt-1">
            Fresh Out of Bay 1 to 4
          </h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="relative aspect-square rounded-2xl overflow-hidden bg-[#171412] group border border-white/5">
            <img
              src="https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=600&q=80"
              alt="Polished sports car"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              referrerPolicy="no-referrer"
              onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
              <span className="text-xs font-mono text-white font-bold">Toyota GR Yaris · Ceramic 9H</span>
            </div>
          </div>

          <div className="relative aspect-square rounded-2xl overflow-hidden bg-[#171412] group border border-white/5">
            <img
              src="https://images.unsplash.com/photo-1541167760496-1628856ab772?auto=format&fit=crop&w=600&q=80"
              alt="Spanish Latte poured"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              referrerPolicy="no-referrer"
              onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
              <span className="text-xs font-mono text-white font-bold">Spanish Oat Latte · Table 04</span>
            </div>
          </div>

          <div className="relative aspect-square rounded-2xl overflow-hidden bg-[#171412] group border border-white/5">
            <img
              src="https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=600&q=80"
              alt="Corvette shine"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              referrerPolicy="no-referrer"
              onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
              <span className="text-xs font-mono text-white font-bold">Soul Red Crystal · Spa Wash</span>
            </div>
          </div>

          <div className="relative aspect-square rounded-2xl overflow-hidden bg-[#171412] group border border-white/5">
            <img
              src="https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=600&q=80"
              alt="Pistachio Croissant"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              referrerPolicy="no-referrer"
              onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
              <span className="text-xs font-mono text-white font-bold">72-Layer Croissant · Fresh Daily</span>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};
