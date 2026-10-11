import React, { useState } from 'react';
import { ShoppingBag, Bell, Menu, X } from 'lucide-react';
import { UserNotification } from '../types';

interface NavbarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  cartCount: number;
  openCart: () => void;
  notifications: UserNotification[];
  markNotificationsAsRead: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  setCurrentTab,
  cartCount,
  openCart,
  notifications,
  markNotificationsAsRead
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showNotifPopover, setShowNotifPopover] = useState(false);

  const unreadCount = notifications.filter(n => !n.read).length;

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'cafe', label: 'Café Menu' },
    { id: 'wash', label: 'Wash Packages' },
    { id: 'tracker', label: 'Live Tracker' },
    { id: 'community', label: 'Community' },
  ];

  const handleNavClick = (id: string) => {
    setCurrentTab(id);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const toggleNotifPopover = () => {
    setShowNotifPopover(!showNotifPopover);
    if (!showNotifPopover && unreadCount > 0) {
      markNotificationsAsRead();
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-[#171412]/95 backdrop-blur-md border-b border-white/5 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        
        {/* Left: circular logo mark + "COFFEE AVE" wordmark with "BY AUTO AVE" subtext */}
        <button 
          onClick={() => handleNavClick('home')}
          className="flex items-center gap-3.5 group text-left cursor-pointer focus:outline-none"
        >
          {/* Circular logo mark */}
          <div className="relative w-11 h-11 rounded-full bg-gradient-to-br from-[#28211c] to-[#120e0b] border border-[#d4af37]/40 flex items-center justify-center shadow-lg shadow-black/40 group-hover:border-[#c0392b] transition-colors">
            {/* Custom vector emblem: coffee cup with speedline car silhouette & steam */}
            <svg 
              className="w-6 h-6 text-[#d4af37] group-hover:text-[#c0392b] transition-colors" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="1.75" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              {/* Cup */}
              <path d="M17 8h1a4 4 0 1 1 0 8h-1" />
              <path d="M3 8h14v7a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z" />
              {/* Speed / car grill accents */}
              <path d="M6 2v2" stroke="#c0392b" />
              <path d="M10 2v2" stroke="#c0392b" />
              <path d="M14 2v2" stroke="#c0392b" />
              <line x1="5" y1="12" x2="13" y2="12" strokeWidth="1.2" strokeOpacity="0.8" />
            </svg>
            <div className="absolute -inset-0.5 rounded-full border border-[#c0392b]/20 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
          </div>

          <div className="flex flex-col">
            <span className="font-serif text-xl sm:text-2xl font-bold tracking-wider text-[#ede8e3] group-hover:text-white transition-colors leading-none">
              COFFEE AVE
            </span>
            <span className="text-[10px] tracking-[0.25em] text-[#d4af37] uppercase font-semibold mt-1">
              BY AUTO AVE
            </span>
          </div>
        </button>

        {/* Center links: Home, Café Menu, Wash Packages, Live Tracker, Community — active link underlined in red */}
        <nav className="hidden md:flex items-center gap-8">
          {navItems.map((item) => {
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`relative py-2 text-sm font-medium transition-colors cursor-pointer whitespace-nowrap ${
                  isActive 
                    ? 'text-white font-semibold' 
                    : 'text-[#ede8e3]/70 hover:text-white'
                }`}
              >
                {item.label}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#c0392b] rounded-full shadow-[0_0_8px_rgba(192,57,43,0.8)]" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Right: notification bell icon (badge count), cart icon (badge count) */}
        <div className="flex items-center gap-3 sm:gap-4 relative">
          
          {/* Notification Bell */}
          <div className="relative">
            <button
              onClick={toggleNotifPopover}
              aria-label="Notifications"
              className="p-2.5 rounded-full text-[#ede8e3]/80 hover:text-white hover:bg-white/5 active:scale-95 transition-all relative cursor-pointer"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-[#c0392b] text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse shadow-[0_0_6px_rgba(192,57,43,0.8)]">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Notification Popover Dropdown */}
            {showNotifPopover && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-[#211d1a] border border-white/10 rounded-xl shadow-2xl p-4 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="flex items-center justify-between pb-3 border-b border-white/10">
                  <span className="text-sm font-semibold text-[#ede8e3]">Live Bay & Lounge Alerts</span>
                  <span className="text-[11px] text-[#d4af37] font-medium">Nieves Hills Station</span>
                </div>
                <div className="divide-y divide-white/5 max-h-72 overflow-y-auto mt-2">
                  {notifications.map((notif) => (
                    <div key={notif.id} className="py-2.5 hover:bg-white/5 px-2 rounded-lg transition-colors">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-white">{notif.title}</span>
                        <span className="text-[10px] text-[#ede8e3]/50">{notif.time}</span>
                      </div>
                      <p className="text-xs text-[#ede8e3]/80 mt-1 leading-relaxed">{notif.message}</p>
                    </div>
                  ))}
                </div>
                <div className="pt-3 border-t border-white/10 text-center">
                  <button 
                    onClick={() => { setShowNotifPopover(false); handleNavClick('tracker'); }}
                    className="text-xs text-[#c0392b] hover:text-[#d32f2f] font-semibold transition-colors"
                  >
                    Open Live Wash Tracker Queue →
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Cart Icon Button */}
          <button
            onClick={openCart}
            aria-label="View Cart"
            className="flex items-center gap-2.5 px-3.5 py-2 rounded-full bg-[#26201b] hover:bg-[#2f2721] border border-white/10 hover:border-[#d4af37]/40 text-[#ede8e3] hover:text-white transition-all cursor-pointer shadow-md group"
          >
            <div className="relative">
              <ShoppingBag className="w-5 h-5 text-[#d4af37] group-hover:text-[#c0392b] transition-colors" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2.5 min-w-[18px] h-[18px] px-1 bg-[#c0392b] text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-[0_0_8px_rgba(192,57,43,0.7)]">
                  {cartCount}
                </span>
              )}
            </div>
            <span className="text-xs font-semibold tracking-wide hidden sm:inline">
              Cart
            </span>
          </button>

          {/* Mobile menu hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-[#ede8e3]/80 hover:text-white hover:bg-white/5 focus:outline-none"
            aria-label="Toggle navigation"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile nav dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#1e1916] border-b border-white/10 px-4 pt-2 pb-6 space-y-1">
          {navItems.map((item) => {
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-colors flex items-center justify-between ${
                  isActive 
                    ? 'bg-[#c0392b]/15 text-white font-semibold border-l-4 border-[#c0392b]' 
                    : 'text-[#ede8e3]/80 hover:text-white hover:bg-white/5'
                }`}
              >
                <span>{item.label}</span>
                {isActive && <span className="w-2 h-2 rounded-full bg-[#c0392b]" />}
              </button>
            );
          })}
        </div>
      )}
    </header>
  );
};
