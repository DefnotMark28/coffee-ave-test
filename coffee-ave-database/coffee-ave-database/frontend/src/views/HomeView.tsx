import React from 'react';
import { 
  ShieldCheck, 
  Sparkles, 
  Video, 
  Coffee, 
  Car, 
  CheckCircle2, 
  ArrowRight, 
  Plus, 
  Quote, 
  ChevronRight,
  Eye,
  Star
} from 'lucide-react';
import { Product } from '../types';
import { TESTIMONIALS } from '../data/mockData';

interface HomeViewProps {
  onNavigate: (tab: string) => void;
  onAddToCart: (product: Product) => void;
  bestSellers: Product[];
  onOpenSignUp: () => void;
  onOpenBayModal: () => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  onNavigate,
  onAddToCart,
  bestSellers,
  onOpenSignUp,
  onOpenBayModal,
}) => {
  return (
    <div className="space-y-20 pb-20">
      
      {/* Hero Section */}
      <section className="relative min-h-[580px] lg:min-h-[640px] flex items-center justify-center overflow-hidden">
        
        {/* Background visual collage (barista coffee craft + car detailing) */}
        <div className="absolute inset-0 bg-[#14100e]">
          <div className="absolute inset-0 grid grid-cols-1 md:grid-cols-2 opacity-35 mix-blend-luminosity">
            {/* Coffee Craft Left */}
            <div 
              className="h-full bg-cover bg-center"
              style={{
                backgroundImage: `url('https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=1200&q=80')`,
              }}
            />
            {/* Auto Detailing Right */}
            <div 
              className="h-full bg-cover bg-center hidden md:block"
              style={{
                backgroundImage: `url('https://images.unsplash.com/photo-1520340356584-f9917d1eea6f?auto=format&fit=crop&w=1200&q=80')`,
              }}
            />
          </div>

          {/* Moody Dark Aesthetic Gradient Overlays */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#171412] via-[#171412]/80 to-[#171412]/60" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#171412] via-[#171412]/70 to-[#171412]" />
          
          {/* Subtle Ambient Radial Lighting */}
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-[#c0392b]/15 rounded-full blur-[120px] pointer-events-none" />
          <div className="absolute bottom-10 right-10 w-[400px] h-[250px] bg-[#d4af37]/10 rounded-full blur-[100px] pointer-events-none" />
        </div>

        {/* Hero Content */}
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center space-y-8 z-10">
          
          {/* Eyebrow Label */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#26201b]/90 border border-[#d4af37]/30 backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-[#c0392b] animate-ping" />
            <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#d4af37]">
              Auto Ave Car Wash & Coffee Lounge · Angono, Rizal
            </span>
          </div>

          {/* Overlaid Headline */}
          <h1 className="font-serif text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight text-white leading-[1.05]">
            Sip While We <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-[#ede8e3] to-[#d4af37]">Shine.</span>
          </h1>

          {/* Subtext */}
          <p className="max-w-2xl mx-auto text-base sm:text-lg text-[#ede8e3]/80 leading-relaxed font-normal">
            The hybrid sanctuary where precision automotive care meets handcrafted artisanal coffee. Drop your keys, sink into our mezzanine lounge with a Benguet micro-lot pour-over, and watch your vehicle undergo showroom restoration in real-time.
          </p>

          {/* Two CTAs: "Sign Up" (outline) and "Order Coffee" (solid red) */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <button
              onClick={() => onNavigate('cafe')}
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-[#c0392b] hover:bg-[#a93226] active:scale-95 text-white font-semibold text-sm tracking-wide transition-all shadow-xl shadow-[#c0392b]/30 flex items-center justify-center gap-2.5 cursor-pointer group"
            >
              <Coffee className="w-4 h-4 text-[#d4af37] group-hover:rotate-12 transition-transform" />
              <span>Order Coffee</span>
            </button>

            <button
              onClick={onOpenSignUp}
              className="w-full sm:w-auto px-8 py-4 rounded-xl border border-white/20 hover:border-[#d4af37] hover:bg-white/5 active:scale-95 text-white font-semibold text-sm tracking-wide transition-all flex items-center justify-center gap-2.5 cursor-pointer group"
            >
              <span>Sign Up</span>
              <ChevronRight className="w-4 h-4 text-[#d4af37] group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          {/* Quick status pill under CTA */}
          <div className="pt-2 flex items-center justify-center gap-4 text-xs text-[#ede8e3]/60 font-mono">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              Bays 1–4 Operational
            </span>
            <span>·</span>
            <span>Est. Wait: 35 Mins</span>
            <span>·</span>
            <button 
              onClick={onOpenBayModal}
              className="text-[#d4af37] hover:underline flex items-center gap-1 font-sans"
            >
              <Eye className="w-3.5 h-3.5" />
              Watch Live Stream
            </button>
          </div>

        </div>

      </section>

      {/* Thin Gold/Red Divider Rule under hero section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative h-[1px] w-full bg-gradient-to-r from-transparent via-[#c0392b]/60 via-[#d4af37]/60 to-transparent shadow-[0_0_12px_rgba(192,57,43,0.5)]" />
      </div>

      {/* Row of 4 Trust Badges under hero */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          <div className="p-5 rounded-2xl bg-[#201c19] border border-white/5 hover:border-[#d4af37]/30 transition-all flex items-start gap-4 group">
            <div className="p-3 rounded-xl bg-[#2b241e] border border-white/10 text-[#d4af37] group-hover:text-white group-hover:bg-[#c0392b] transition-all shrink-0">
              <Car className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white">Premium Equipment Only</h3>
              <p className="text-xs text-[#ede8e3]/60 mt-1 leading-relaxed">
                Deionized spot-free water filtration, zero-scratch wash mitts, and pH-neutral snow foam.
              </p>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-[#201c19] border border-white/5 hover:border-[#d4af37]/30 transition-all flex items-start gap-4 group">
            <div className="p-3 rounded-xl bg-[#2b241e] border border-white/10 text-[#d4af37] group-hover:text-white group-hover:bg-[#c0392b] transition-all shrink-0">
              <Coffee className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white">Handcrafted Ingredients</h3>
              <p className="text-xs text-[#ede8e3]/60 mt-1 leading-relaxed">
                Single-origin Philippine Arabica, organic barista oat milk, and daily artisanal pastries.
              </p>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-[#201c19] border border-white/5 hover:border-[#d4af37]/30 transition-all flex items-start gap-4 group">
            <div className="p-3 rounded-xl bg-[#2b241e] border border-white/10 text-[#d4af37] group-hover:text-white group-hover:bg-[#c0392b] transition-all shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white">100% Satisfaction Guaranteed</h3>
              <p className="text-xs text-[#ede8e3]/60 mt-1 leading-relaxed">
                Rigorous final inspection under high-intensity inspection LEDs before key handoff.
              </p>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-[#201c19] border border-white/5 hover:border-[#d4af37]/30 transition-all flex items-start gap-4 group">
            <div className="p-3 rounded-xl bg-[#2b241e] border border-white/10 text-[#d4af37] group-hover:text-white group-hover:bg-[#c0392b] transition-all shrink-0">
              <Video className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white">Real-Time Video Tracking</h3>
              <p className="text-xs text-[#ede8e3]/60 mt-1 leading-relaxed">
                High-definition live camera feeds and automated stage alerts delivered straight to your seat.
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* "Best Sellers This Week" Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="space-y-1">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#d4af37]">
              Curated Favorites
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-white">
              Best Sellers This Week
            </h2>
          </div>

          {/* "Explore Full Menu" link */}
          <button
            onClick={() => onNavigate('cafe')}
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#c0392b] hover:text-[#e74c3c] group transition-colors cursor-pointer"
          >
            <span>Explore Full Menu & Packages</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* 3 Product Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {bestSellers.map((product) => (
            <div
              key={product.id}
              className="group rounded-2xl bg-[#201c19] border border-white/5 hover:border-white/15 overflow-hidden transition-all duration-300 flex flex-col justify-between hover:-translate-y-1 shadow-xl"
            >
              {/* Image Container with Tag */}
              <div className="relative aspect-[4/3] overflow-hidden bg-[#171412]">
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    // Graceful fallback
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
                
                {/* Fallback container with styled gradient */}
                <div className={`absolute inset-0 bg-gradient-to-br ${product.imageFallbackGradient} -z-10 flex items-center justify-center p-6 text-center`}>
                  <div className="space-y-1">
                    {product.isWashPackage ? (
                      <Car className="w-10 h-10 text-[#d4af37] mx-auto opacity-70" />
                    ) : (
                      <Coffee className="w-10 h-10 text-[#d4af37] mx-auto opacity-70" />
                    )}
                    <span className="text-xs font-serif text-white/80 block">{product.name}</span>
                  </div>
                </div>

                {/* Tag Top-Left (BEST SELLER / FRESH DAILY) */}
                {product.tag && (
                  <div className="absolute top-3 left-3 px-2.5 py-1 rounded bg-[#171412]/90 backdrop-blur-md border border-[#d4af37]/40 text-[#d4af37] text-[10px] font-bold tracking-wider uppercase">
                    {product.tag}
                  </div>
                )}

                {/* Wash badge or duration */}
                {product.isWashPackage && product.estimatedTime && (
                  <div className="absolute bottom-3 right-3 px-2 py-0.5 rounded bg-black/70 backdrop-blur-md border border-white/10 text-white/80 text-[10px] font-mono">
                    {product.estimatedTime}
                  </div>
                )}
              </div>

              {/* Card Body */}
              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[#d4af37] uppercase tracking-wider font-semibold text-[11px]">
                      {product.isWashPackage ? 'Automotive Detailing' : 'Specialty Café'}
                    </span>
                    <span className="text-lg font-bold text-white font-mono">
                      ₱{product.price.toLocaleString()}
                    </span>
                  </div>

                  <h3 className="font-serif text-xl font-bold text-white group-hover:text-[#d4af37] transition-colors">
                    {product.name}
                  </h3>

                  <p className="text-xs text-[#ede8e3]/70 leading-relaxed line-clamp-2">
                    {product.description}
                  </p>
                </div>

                {/* Small add button */}
                <div className="pt-2 border-t border-white/5 flex items-center justify-between">
                  <span className="text-[11px] text-[#ede8e3]/50">
                    {product.isWashPackage ? 'Includes vehicle intake' : 'Freshly made to order'}
                  </span>
                  
                  <button
                    onClick={() => onAddToCart(product)}
                    className="py-2 px-3.5 rounded-lg bg-[#c0392b] hover:bg-[#a93226] text-white text-xs font-semibold flex items-center gap-1.5 transition-all shadow-md shadow-[#c0392b]/20 cursor-pointer active:scale-95"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add to Cart</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Split Content Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-[#201c19] border border-white/5 overflow-hidden grid grid-cols-1 lg:grid-cols-12 shadow-2xl">
          
          {/* Left: Heading + Paragraph + Checklist */}
          <div className="lg:col-span-7 p-8 sm:p-12 lg:p-14 flex flex-col justify-center space-y-6">
            <div className="space-y-2">
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#d4af37]">
                The Ave Philosophy
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight">
                While we restore your shine, enjoy the grind.
              </h2>
            </div>

            <p className="text-sm sm:text-base text-[#ede8e3]/75 leading-relaxed">
              We eliminated the dreary waiting room experience. Located at Nieves Hills in Angono, our hybrid facility pairs an unli-wash automotive detailing center with an artisanal coffee lounge. No lost slips, no shouting across the garage — just quiet luxury, ultra-fast fiber Wi-Fi, and real-time bay cameras displayed right on your screen.
            </p>

            {/* Checklist */}
            <div className="space-y-3.5 pt-2">
              <div className="flex items-start gap-3">
                <div className="p-1 rounded-full bg-[#c0392b]/20 text-[#c0392b] shrink-0 mt-0.5">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div>
                  <strong className="text-sm font-semibold text-white block">Certified Master Baristas</strong>
                  <span className="text-xs text-[#ede8e3]/60">
                    SCA-trained staff pulling specialty espresso on commercial multi-boiler machines.
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-1 rounded-full bg-[#c0392b]/20 text-[#c0392b] shrink-0 mt-0.5">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div>
                  <strong className="text-sm font-semibold text-white block">Premium Micro-Lot Coffee Roasts</strong>
                  <span className="text-xs text-[#ede8e3]/60">
                    Ethically sourced single origins from Atok Benguet and Mount Apo, roasted weekly.
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-1 rounded-full bg-[#c0392b]/20 text-[#c0392b] shrink-0 mt-0.5">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div>
                  <strong className="text-sm font-semibold text-white block">Real-Time High-Definition Video Tracker</strong>
                  <span className="text-xs text-[#ede8e3]/60">
                    Sensor-linked camera streams across 4 active wash bays. Never leave your lounge seat.
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-4 flex items-center gap-4">
              <button
                onClick={() => onNavigate('tracker')}
                className="px-6 py-3 rounded-xl bg-[#c0392b] hover:bg-[#a93226] text-white font-semibold text-xs uppercase tracking-wider transition-all cursor-pointer shadow-lg shadow-[#c0392b]/20"
              >
                Inspect Live Bay Queues
              </button>
              <button
                onClick={onOpenBayModal}
                className="px-5 py-3 rounded-xl border border-white/20 hover:border-[#d4af37] text-[#ede8e3] text-xs font-semibold transition-all cursor-pointer flex items-center gap-2"
              >
                <Video className="w-4 h-4 text-[#d4af37]" />
                <span>Launch Video Stream</span>
              </button>
            </div>
          </div>

          {/* Right: Image showcase */}
          <div className="lg:col-span-5 relative min-h-[360px] lg:min-h-full bg-[#171412] overflow-hidden border-t lg:border-t-0 lg:border-l border-white/5">
            <img
              src="https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=1000&q=80"
              alt="Coffee Ave Lounge Interior"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
              onError={(e) => {
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
            {/* Fallback & overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent flex flex-col justify-end p-8 text-left">
              <span className="text-[11px] font-mono text-[#d4af37] uppercase tracking-widest font-semibold">
                Nieves Hills Angono Lounge
              </span>
              <h4 className="font-serif text-2xl font-bold text-white mt-1">
                Lounge Overlooking The Detail Bays
              </h4>
              <p className="text-xs text-[#ede8e3]/80 mt-1 leading-relaxed">
                Floor-to-ceiling glass partition allows patrons to observe master ceramic coatings while enjoying signature lattes.
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* "What Our Patrons Say" — 3 Testimonial Cards */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center space-y-2">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#d4af37]">
            Rizal Community Voices
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-white">
            What Our Patrons Say
          </h2>
          <p className="text-xs sm:text-sm text-[#ede8e3]/60 max-w-lg mx-auto">
            From daily commuters to weekend automotive clubs, here is why patrons make Coffee Ave their regular haven.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TESTIMONIALS.map((testimonial, idx) => (
            <div 
              key={idx}
              className="p-7 rounded-2xl bg-[#201c19] border border-white/5 hover:border-white/15 transition-all flex flex-col justify-between space-y-6 shadow-lg"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="p-2 rounded-lg bg-[#2b241e] text-[#d4af37]">
                    <Quote className="w-4 h-4" />
                  </div>
                  <div className="flex items-center gap-1 text-[#d4af37]">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-[#d4af37]" />
                    ))}
                  </div>
                </div>

                <p className="text-sm text-[#ede8e3]/85 italic leading-relaxed">
                  "{testimonial.quote}"
                </p>
              </div>

              <div className="pt-4 border-t border-white/5">
                <h4 className="text-sm font-semibold text-white">{testimonial.name}</h4>
                <p className="text-xs text-[#ede8e3]/50 mt-0.5">{testimonial.subtitle}</p>
                <div className="mt-2 inline-flex items-center gap-1.5 text-[11px] font-mono text-[#d4af37] bg-black/40 px-2 py-0.5 rounded border border-white/5">
                  <Car className="w-3 h-3" />
                  <span>{testimonial.vehicle}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
};
