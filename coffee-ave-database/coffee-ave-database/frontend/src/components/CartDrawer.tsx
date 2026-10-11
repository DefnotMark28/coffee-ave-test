import React, { useState } from 'react';
import { X, Trash2, Plus, Minus, AlertCircle, Sparkles, CheckCircle2, Car, Coffee } from 'lucide-react';
import { CartItem } from '../types';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQuantity: (id: string, newQty: number) => void;
  onRemoveItem: (id: string) => void;
  onClearCart: () => void;
  onOrderConfirmed: (orderDetails: {
    plateNumber: string;
    tableNumber: string;
    totalAmount: number;
    items: CartItem[];
  }) => void;
  savedPlateNumber: string;
  setSavedPlateNumber: (plate: string) => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onOrderConfirmed,
  savedPlateNumber,
  setSavedPlateNumber,
}) => {
  const [tableNumber, setTableNumber] = useState('Table 04');
  const [plateError, setPlateError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);

  if (!isOpen) return null;

  const hasWashPackage = cartItems.some((item) => item.isWashPackage);
  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const detailingTax = Math.round(subtotal * 0.05); // 5% detailing and environmental compliance fee
  const totalAmount = subtotal + detailingTax;

  const handleCheckout = () => {
    // If order contains a wash package, plate number is strictly required
    if (hasWashPackage && (!savedPlateNumber || savedPlateNumber.trim().length < 3)) {
      setPlateError('Please provide your vehicle plate number to link your wash bay slot.');
      return;
    }

    setPlateError('');
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      setOrderSuccess(true);
      onOrderConfirmed({
        plateNumber: savedPlateNumber.trim().toUpperCase() || 'WALK-IN',
        tableNumber: tableNumber.trim(),
        totalAmount,
        items: [...cartItems],
      });
    }, 800);
  };

  const handleCloseAndReset = () => {
    if (orderSuccess) {
      setOrderSuccess(false);
      onClearCart();
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/70 backdrop-blur-sm transition-opacity duration-300"
        onClick={handleCloseAndReset}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#1c1815] border-l border-white/10 shadow-2xl flex flex-col justify-between text-[#ede8e3]">
          
          {/* Header */}
          <div className="px-6 py-5 border-b border-white/10 flex items-center justify-between bg-[#211d19]">
            <div className="flex items-center gap-3">
              <span className="font-serif text-2xl font-bold text-white tracking-wide">
                Your Cart
              </span>
              <span className="text-xs bg-[#c0392b]/20 text-[#ede8e3] border border-[#c0392b]/40 px-2.5 py-0.5 rounded-full font-medium">
                {cartItems.reduce((acc, i) => acc + i.quantity, 0)} items
              </span>
            </div>
            <button
              onClick={handleCloseAndReset}
              className="p-2 rounded-lg text-[#ede8e3]/70 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              aria-label="Close cart"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content Area */}
          {orderSuccess ? (
            <div className="flex-1 p-6 flex flex-col items-center justify-center text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-[#c0392b]/20 border border-[#c0392b] flex items-center justify-center text-[#c0392b] animate-bounce">
                <CheckCircle2 className="w-9 h-9" />
              </div>
              <h3 className="font-serif text-2xl font-bold text-white">Order Confirmed!</h3>
              <p className="text-sm text-[#ede8e3]/70 max-w-xs leading-relaxed">
                Your café & vehicle service order has been posted to our Nieves Hills POS & wash dispatch.
              </p>
              
              <div className="w-full bg-[#25201b] border border-white/10 rounded-xl p-4 text-left space-y-2 text-xs">
                {savedPlateNumber && (
                  <div className="flex justify-between items-center">
                    <span className="text-[#ede8e3]/60">Vehicle Plate:</span>
                    <span className="font-mono font-bold text-white bg-black/40 px-2 py-0.5 rounded border border-white/10">
                      {savedPlateNumber.toUpperCase()}
                    </span>
                  </div>
                )}
                <div className="flex justify-between items-center">
                  <span className="text-[#ede8e3]/60">Lounge Station:</span>
                  <span className="text-white font-medium">{tableNumber || 'Takeout / Lounge'}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[#ede8e3]/60">Total Paid:</span>
                  <span className="text-[#d4af37] font-bold">₱{totalAmount.toLocaleString()}</span>
                </div>
              </div>

              <div className="pt-4 w-full space-y-2">
                <button
                  onClick={handleCloseAndReset}
                  className="w-full py-3 px-4 rounded-lg bg-[#c0392b] hover:bg-[#a93226] text-white font-semibold text-sm transition-colors cursor-pointer"
                >
                  View Live Wash Status Tracker
                </button>
              </div>
            </div>
          ) : cartItems.length === 0 ? (
            <div className="flex-1 p-6 flex flex-col items-center justify-center text-center space-y-3">
              <div className="w-14 h-14 rounded-full bg-white/5 flex items-center justify-center text-[#ede8e3]/40">
                <Coffee className="w-7 h-7" />
              </div>
              <h4 className="font-serif text-lg text-white font-semibold">Your cart is currently empty</h4>
              <p className="text-xs text-[#ede8e3]/60 max-w-xs leading-relaxed">
                Explore our artisanal coffee drinks, freshly baked croissants, and premium automotive wash packages.
              </p>
              <button
                onClick={onClose}
                className="mt-2 text-xs text-[#d4af37] hover:underline font-semibold"
              >
                Browse Menu & Services →
              </button>
            </div>
          ) : (
            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-6">
              
              {/* Items List */}
              <div className="space-y-4">
                {cartItems.map((item) => (
                  <div 
                    key={item.id}
                    className="flex gap-3.5 p-3 rounded-xl bg-[#25201c] border border-white/5 hover:border-white/10 transition-colors"
                  >
                    {/* Thumbnail */}
                    <div className="w-16 h-16 rounded-lg overflow-hidden bg-[#171412] shrink-0 border border-white/10 relative">
                      <img 
                        src={item.imageUrl} 
                        alt={item.name}
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                        onError={(e) => {
                          // Clean fallback container
                          (e.target as HTMLElement).style.display = 'none';
                        }}
                      />
                      <div className="absolute inset-0 flex items-center justify-center -z-10 bg-[#2d241e]">
                        {item.isWashPackage ? <Car className="w-6 h-6 text-[#d4af37]" /> : <Coffee className="w-6 h-6 text-[#d4af37]" />}
                      </div>
                    </div>

                    {/* Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="text-sm font-semibold text-white truncate">{item.name}</h4>
                        <button
                          onClick={() => onRemoveItem(item.id)}
                          className="text-[#ede8e3]/40 hover:text-[#c0392b] p-1 transition-colors"
                          title="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {item.selectedOption && (
                        <p className="text-[11px] text-[#ede8e3]/60 mt-0.5 truncate">
                          {item.selectedOption}
                        </p>
                      )}

                      <div className="flex items-center justify-between mt-2.5">
                        <span className="text-sm font-semibold text-[#d4af37]">
                          ₱{(item.price * item.quantity).toLocaleString()}
                        </span>

                        {/* Qty Stepper */}
                        <div className="flex items-center gap-1.5 bg-[#171412] border border-white/10 rounded-md p-0.5">
                          <button
                            onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                            className="w-6 h-6 flex items-center justify-center rounded text-[#ede8e3]/70 hover:text-white hover:bg-white/10 transition-colors"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="w-6 text-center text-xs font-semibold text-white">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                            className="w-6 h-6 flex items-center justify-center rounded text-[#ede8e3]/70 hover:text-white hover:bg-white/10 transition-colors"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Required Plate Number Input */}
              <div className="p-4 rounded-xl bg-[#231e1a] border border-[#d4af37]/20 space-y-2.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold uppercase tracking-wider text-[#d4af37] flex items-center gap-1.5">
                    <Car className="w-3.5 h-3.5 text-[#d4af37]" />
                    Plate Number {hasWashPackage ? <span className="text-[#c0392b]">* (required for wash)</span> : <span className="text-[#ede8e3]/40">(optional for lounge)</span>}
                  </label>
                  {hasWashPackage && (
                    <span className="text-[10px] text-[#c0392b] font-medium uppercase tracking-wide">
                      Wash Bay Link
                    </span>
                  )}
                </div>

                <input
                  type="text"
                  placeholder="e.g. NDE 4821 or CBD 9024"
                  value={savedPlateNumber}
                  onChange={(e) => {
                    setSavedPlateNumber(e.target.value.toUpperCase());
                    if (plateError) setPlateError('');
                  }}
                  className={`w-full px-3.5 py-2.5 rounded-lg bg-[#171412] border text-sm text-white placeholder-[#ede8e3]/30 font-mono focus:outline-none transition-colors ${
                    plateError ? 'border-[#c0392b] ring-1 ring-[#c0392b]' : 'border-white/15 focus:border-[#d4af37]'
                  }`}
                />

                <p className="text-[11px] text-[#ede8e3]/60 leading-relaxed">
                  Links your order directly to your vehicle's live wash queue slot and notifies our barista team to serve your drinks directly to your lounge seat.
                </p>

                {plateError && (
                  <div className="flex items-center gap-1.5 text-xs text-[#c0392b] font-medium pt-1">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{plateError}</span>
                  </div>
                )}

                <div className="pt-2 border-t border-white/5 flex items-center gap-3">
                  <label className="text-[11px] text-[#ede8e3]/60 shrink-0">Lounge Seat / Table:</label>
                  <input
                    type="text"
                    value={tableNumber}
                    onChange={(e) => setTableNumber(e.target.value)}
                    placeholder="Table 04, Lounge B, or Takeout"
                    className="flex-1 bg-[#171412] border border-white/10 rounded px-2.5 py-1 text-xs text-white focus:outline-none focus:border-[#d4af37]"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Footer Summary & Action */}
          {!orderSuccess && cartItems.length > 0 && (
            <div className="p-6 border-t border-white/10 bg-[#211d19] space-y-4">
              <div className="space-y-2 text-xs">
                <div className="flex justify-between text-[#ede8e3]/70">
                  <span>Subtotal</span>
                  <span>₱{subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-[#ede8e3]/70">
                  <span className="flex items-center gap-1">
                    Estimated Detailing Tax & Eco Surcharge
                    <span className="text-[10px] text-[#ede8e3]/40">(Rizal compliant)</span>
                  </span>
                  <span>₱{detailingTax.toLocaleString()}</span>
                </div>
                <div className="pt-2 border-t border-white/10 flex justify-between items-baseline">
                  <span className="text-sm font-semibold text-white">Total Amount</span>
                  <span className="text-xl font-bold text-[#c0392b] font-mono">
                    ₱{totalAmount.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Full-width red "Confirm & Post Order" button */}
              <button
                onClick={handleCheckout}
                disabled={isSubmitting}
                className="w-full py-3.5 px-4 rounded-xl bg-[#c0392b] hover:bg-[#a93226] active:scale-[0.99] text-white font-semibold text-sm transition-all shadow-lg shadow-[#c0392b]/30 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Transmitting to Bay POS...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-[#d4af37]" />
                    <span>Confirm & Post Order</span>
                  </>
                )}
              </button>
              
              <div className="flex items-center justify-center gap-2 text-[10px] text-[#ede8e3]/50">
                <span>Unified receipting</span>
                <span>·</span>
                <span>GCash / Maya / Card accepted on pickup</span>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
