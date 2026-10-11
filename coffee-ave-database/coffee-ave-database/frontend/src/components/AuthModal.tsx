import React, { useEffect, useState } from 'react';
import { X, Check, Award, Sparkles, Eye, EyeOff } from 'lucide-react';
import { api } from '../api';
import type { Member } from '../types';

export type AuthMode = 'signup' | 'signin';

interface AuthModalProps {
  isOpen: boolean;
  mode: AuthMode;
  onModeChange: (mode: AuthMode) => void;
  onClose: () => void;
  onSuccess: (member: Member, mode: AuthMode) => void;
}

const inputClass =
  'w-full px-3.5 py-2.5 rounded-lg bg-[#14110f] border border-white/10 text-white placeholder-white/20 focus:outline-none focus:border-[#d4af37]';

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, mode, onModeChange, onClose, onSuccess }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [plateNumber, setPlateNumber] = useState('');
  const [vehicleModel, setVehicleModel] = useState('');
  const [membershipType, setMembershipType] = useState<'unli' | 'club'>('unli');
  const [isSaving, setIsSaving] = useState(false);
  const [welcome, setWelcome] = useState<Member | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    setErrorMessage(null);
    setPassword('');
  }, [mode, isOpen]);

  if (!isOpen) return null;

  const isSignUp = mode === 'signup';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsSaving(true);
    try {
      const member = isSignUp
        ? await api.signUp({
            name: name.trim(),
            email: email.trim(),
            password,
            plateNumber: plateNumber.trim().toUpperCase(),
            vehicleModel: vehicleModel.trim(),
            membership: membershipType,
          })
        : await api.signIn(email.trim(), password);

      setIsSaving(false);
      setPassword('');
      if (isSignUp) {
        setWelcome(member);
        setTimeout(() => {
          setWelcome(null);
          onSuccess(member, mode);
          onClose();
        }, 1400);
      } else {
        onSuccess(member, mode);
        onClose();
      }
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Something went wrong. Please try again.');
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity" onClick={onClose} />

      <div className="relative bg-[#1c1815] border border-white/10 rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl z-10 text-[#ede8e3]">
        <div className="px-6 py-5 border-b border-white/10 flex items-center justify-between bg-[#231e19]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#c0392b]/20 border border-[#c0392b] flex items-center justify-center">
              <Award className="w-5 h-5 text-[#d4af37]" />
            </div>
            <div>
              <h3 className="font-serif text-xl font-bold text-white">
                {isSignUp ? 'Join the Ave Patron Club' : 'Welcome back, Patron'}
              </h3>
              <p className="text-xs text-[#ede8e3]/60">
                {isSignUp ? 'Auto Ave Unli Car Wash & Coffee Lounge Membership' : 'Sign in to open your member dashboard'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="p-1.5 rounded-lg text-[#ede8e3]/70 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {welcome ? (
          <div className="p-8 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500 text-emerald-400 flex items-center justify-center mx-auto">
              <Check className="w-8 h-8" />
            </div>
            <h4 className="font-serif text-2xl font-bold text-white">Welcome to the Club!</h4>
            <p className="text-xs text-[#ede8e3]/70 max-w-xs mx-auto leading-relaxed">
              Your vehicle <span className="text-white font-mono font-bold">{welcome.plateNumber}</span> has been enrolled and you are signed in. Enjoy 1 free specialty coffee on your next visit to Nieves Hills!
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {/* Sign up / sign in switch */}
            <div className="grid grid-cols-2 gap-2 p-1 bg-[#14110f] rounded-xl border border-white/5">
              {(['signup', 'signin'] as const).map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => onModeChange(m)}
                  className={`py-2 px-3 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    mode === m ? 'bg-[#c0392b] text-white shadow-md' : 'text-[#ede8e3]/60 hover:text-white'
                  }`}
                >
                  {m === 'signup' ? 'Create account' : 'Sign in'}
                </button>
              ))}
            </div>

            {isSignUp && (
              <div className="grid grid-cols-2 gap-2 p-1 bg-[#14110f] rounded-xl border border-white/5">
                {([
                  ['unli', 'Auto Ave Unli-Wash VIP'],
                  ['club', 'Coffee Ave Lounge Club'],
                ] as const).map(([value, label]) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setMembershipType(value)}
                    className={`py-2 px-3 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                      membershipType === value ? 'bg-[#d4af37]/90 text-[#171412]' : 'text-[#ede8e3]/60 hover:text-white'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            )}

            <div className="space-y-3 text-xs">
              {isSignUp && (
                <div>
                  <label className="block text-[#ede8e3]/80 font-medium mb-1">Full Name</label>
                  <input type="text" required placeholder="e.g. Kenneth Tan" value={name} onChange={(e) => setName(e.target.value)} className={inputClass} />
                </div>
              )}

              <div>
                <label className="block text-[#ede8e3]/80 font-medium mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  autoComplete="email"
                  placeholder="patron@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={inputClass}
                />
              </div>

              <div>
                <label className="block text-[#ede8e3]/80 font-medium mb-1">
                  Password {isSignUp && <span className="text-[#ede8e3]/40 font-normal">(at least 8 characters)</span>}
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    minLength={isSignUp ? 8 : undefined}
                    autoComplete={isSignUp ? 'new-password' : 'current-password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={`${inputClass} pr-10`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-[#ede8e3]/50 hover:text-white cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {isSignUp && (
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
                      className={`${inputClass} font-mono`}
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
                      className={inputClass}
                    />
                  </div>
                </div>
              )}
            </div>

            {isSignUp && (
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
            )}

            {errorMessage && (
              <p role="alert" className="text-xs text-red-400">
                {errorMessage}
              </p>
            )}

            <button
              type="submit"
              disabled={isSaving}
              className="w-full py-3 px-4 rounded-xl bg-[#c0392b] hover:bg-[#a93226] text-white font-semibold text-xs tracking-wide uppercase transition-all shadow-lg shadow-[#c0392b]/30 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isSaving ? 'Please wait...' : isSignUp ? 'Complete Registration & Unlock Perks' : 'Sign in'}
            </button>

            <p className="text-center text-[11px] text-[#ede8e3]/50">
              {isSignUp ? 'Already a member? ' : 'New to Coffee Ave? '}
              <button type="button" onClick={() => onModeChange(isSignUp ? 'signin' : 'signup')} className="text-[#d4af37] hover:underline cursor-pointer">
                {isSignUp ? 'Sign in' : 'Create an account'}
              </button>
            </p>
          </form>
        )}
      </div>
    </div>
  );
};
