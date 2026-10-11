import React, { useState } from 'react';
import { X, Check, Car, Sparkles, Award, Coffee, Shield } from 'lucide-react';
import { api } from '../api';

interface SignUpModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRegisterSuccess: (userData: { name: string; email: string; plateNumber: string; vehicleModel: string }) => void;
}

export const SignUpModal: React.FC<SignUpModalProps> = ({
  isOpen,
  onClose,
  onRegisterSuccess,
}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [plateNumber, setPlateNumber] = useState('');
  const [vehicleModel, setVehicleModel] = useState('');
  const [membershipType, setMembershipType] = useState<'unli' | 'club'>('unli');
  const [isSuccess, setIsSuccess] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsSaving(true);

    const user = {
      name: name.trim(),
      email: email.trim(),
      plateNumber: plateNumber.trim().toUpperCase(),
      vehicleModel: vehicleModel.trim(),
    };

    try {
      await api.register({ ...user, membership: membershipType });
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Could not save your registration. Please try again.');
      setIsSaving(false);
      return;
    }

    setIsSaving(false);
    setIsSuccess(true);
    setTimeout(() => {
      onRegisterSuccess(user);
      setIsSuccess(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="relative bg-[#1c1815] border border-white/10 rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl z-10 text-[#ede8e3]">
        {/* Header */}
        <div className="px-6 py-5 border-b border-white/10 flex items-center justify-between bg-[#231e19]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#c0392b]/20 border border-[#c0392b] flex items-center justify-center text-[#c0392b]">
              <Award className="w-5 h-5 text-[#d4af37]" />
            </div>
            <div>
              <h3 className="font-serif text-xl font-bold text-white">Join the Ave Patron Club</h3>
              <p className="text-xs text-[#ede8e3]/60">Auto Ave Unli Car Wash & Coffee Lounge Membership</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#ede8e3]/70 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {isSuccess ? (
          <div className="p-8 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500 text-emerald-400 flex items-center justify-center mx-auto">
              <Check className="w-8 h-8" />
            </div>
            <h4 className="font-serif text-2xl font-bold text-white">Welcome to the Club!</h4>
            <p className="text-xs text-[#ede8e3]/70 max-w-xs mx-auto leading-relaxed">
              Your vehicle <span className="text-white font-mono font-bold">{plateNumber.toUpperCase()}</span> has been enrolled. Enjoy 1 free specialty coffee on your next visit to Nieves Hills!
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            
            {/* Membership Tier Tabs */}
            <div className="grid grid-cols-2 gap-2 p-1 bg-[#14110f] rounded-xl border border-white/5">
              <button
                type="button"
                onClick={() => setMembershipType('unli')}
                className={`py-2 px-3 rounded-lg text-xs font-semibold transition-all ${
                  membershipType === 'unli'
                    ? 'bg-[#c0392b] text-white shadow-md'
                    : 'text-[#ede8e3]/60 hover:text-white'
                }`}
              >
                Auto Ave Unli-Wash VIP
              </button>
              <button
                type="button"
                onClick={() => setMembershipType('club')}
                className={`py-2 px-3 rounded-lg text-xs font-semibold transition-all ${
                  membershipType === 'club'
                    ? 'bg-[#c0392b] text-white shadow-md'
                    : 'text-[#ede8e3]/60 hover:text-white'
                }`}
              >
                Coffee Ave Lounge Club
              </button>
            </div>

            {/* Form Fields */}
            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-[#ede8e3]/80 font-medium mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Kenneth Tan"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg bg-[#14110f] border border-white/10 text-white placeholder-white/20 focus:outline-none focus:border-[#d4af37]"
                />
              </div>

              <div>
                <label className="block text-[#ede8e3]/80 font-medium mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="patron@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg bg-[#14110f] border border-white/10 text-white placeholder-white/20 focus:outline-none focus:border-[#d4af37]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#ede8e3]/80 font-medium mb-1">
                    Plate Number <span className="text-[#d4af37]">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="NDE 4821"
                    value={plateNumber}
                    onChange={(e) => setPlateNumber(e.target.value.toUpperCase())}
                    className="w-full px-3.5 py-2.5 rounded-lg bg-[#14110f] border border-white/10 text-white placeholder-white/20 font-mono focus:outline-none focus:border-[#d4af37]"
                  />
                </div>

                <div>
                  <label className="block text-[#ede8e3]/80 font-medium mb-1">Vehicle Make & Model</label>
                  <input
                    type="text"
                    required
                    placeholder="Toyota GR Yaris / Mazda 3"
                    value={vehicleModel}
                    onChange={(e) => setVehicleModel(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-lg bg-[#14110f] border border-white/10 text-white placeholder-white/20 focus:outline-none focus:border-[#d4af37]"
                  />
                </div>
              </div>
            </div>

            {/* Member Perks Box */}
            <div className="p-3.5 rounded-xl bg-[#231d19] border border-white/5 space-y-1.5 text-xs text-[#ede8e3]/70">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#d4af37] flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#d4af37]" />
                Patron Membership Inclusions
              </span>
              <ul className="space-y-1 text-[11px] list-disc list-inside">
                <li>Automatic license plate scanner recognition at entry gate</li>
                <li>Live camera stream access on personal mobile device</li>
                <li>15% discount on all espresso, cold brews, and fresh bakery items</li>
                <li>Zero-wait priority bay assignment during peak weekend hours</li>
              </ul>
            </div>

            {errorMessage && (
              <p role="alert" className="text-xs text-red-400">
                {errorMessage}
              </p>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSaving}
              className="w-full py-3 px-4 rounded-xl bg-[#c0392b] hover:bg-[#a93226] text-white font-semibold text-xs tracking-wide uppercase transition-all shadow-lg shadow-[#c0392b]/30 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isSaving ? 'Saving...' : 'Complete Registration & Unlock Perks'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
