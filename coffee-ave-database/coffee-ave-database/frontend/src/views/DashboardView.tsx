import React, { useEffect, useState } from 'react';
import { Car, Coffee, Video, Bell, KeyRound, LogOut, CheckCircle2, Sparkles, UserRound, Droplets } from 'lucide-react';
import { api } from '../api';
import type { Member, UserNotification, VehicleQueueItem } from '../types';

interface DashboardViewProps {
  member: Member | null;
  vehicles: VehicleQueueItem[];
  notifications: UserNotification[];
  onMemberUpdated: (member: Member) => void;
  onOpenLiveCamera: (vehicle: VehicleQueueItem) => void;
  onNavigate: (tab: string) => void;
  onOpenSignIn: () => void;
  onSignOut: () => void;
  showToast: (message: string) => void;
}

const normalizePlate = (plate: string) => plate.replace(/[^a-z0-9]/gi, '').toUpperCase();

const card = 'rounded-2xl bg-[#211d1a] border border-white/8 p-6';
const inputClass =
  'w-full px-3.5 py-2.5 rounded-lg bg-[#14110f] border border-white/10 text-white text-sm placeholder-white/20 focus:outline-none focus:border-[#d4af37]';
const labelClass = 'block text-xs font-medium text-[#ede8e3]/70 mb-1';

const STEPS = ['Preparing', 'Cleaning & Prep', 'Ready for Pickup'];

export const DashboardView: React.FC<DashboardViewProps> = ({
  member,
  vehicles,
  notifications,
  onMemberUpdated,
  onOpenLiveCamera,
  onNavigate,
  onOpenSignIn,
  onSignOut,
  showToast,
}) => {
  const [name, setName] = useState('');
  const [plateNumber, setPlateNumber] = useState('');
  const [vehicleModel, setVehicleModel] = useState('');
  const [membership, setMembership] = useState<'unli' | 'club'>('unli');
  const [profileError, setProfileError] = useState<string | null>(null);
  const [savingProfile, setSavingProfile] = useState(false);

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [savingPassword, setSavingPassword] = useState(false);

  useEffect(() => {
    if (!member) return;
    setName(member.name);
    setPlateNumber(member.plateNumber);
    setVehicleModel(member.vehicleModel);
    setMembership(member.membership);
  }, [member]);

  if (!member) {
    return (
      <div className="max-w-xl mx-auto px-4 py-24 text-center space-y-5">
        <div className="w-16 h-16 rounded-full bg-[#c0392b]/15 border border-[#c0392b]/60 flex items-center justify-center mx-auto">
          <UserRound className="w-7 h-7 text-[#d4af37]" />
        </div>
        <h1 className="font-serif text-4xl font-bold text-white">Your member dashboard</h1>
        <p className="text-sm text-[#ede8e3]/70 leading-relaxed">
          Sign in to see your profile, your vehicle, and your car's live wash progress.
        </p>
        <button
          onClick={onOpenSignIn}
          className="px-6 py-3 rounded-xl bg-[#c0392b] hover:bg-[#a93226] text-white text-xs font-semibold uppercase tracking-wide cursor-pointer shadow-lg shadow-[#c0392b]/30"
        >
          Sign in or create account
        </button>
      </div>
    );
  }

  const myPlate = normalizePlate(member.plateNumber);
  const myVehicles = vehicles.filter((v) => normalizePlate(v.plateNumber) === myPlate);
  const profileChanged =
    name.trim() !== member.name ||
    plateNumber.trim().toUpperCase() !== member.plateNumber ||
    vehicleModel.trim() !== member.vehicleModel ||
    membership !== member.membership;

  const saveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileError(null);
    setSavingProfile(true);
    try {
      const updated = await api.updateProfile({
        name: name.trim(),
        plateNumber: plateNumber.trim().toUpperCase(),
        vehicleModel: vehicleModel.trim(),
        membership,
      });
      onMemberUpdated(updated);
      showToast('Profile saved');
    } catch (error) {
      setProfileError(error instanceof Error ? error.message : 'Could not save your profile.');
    }
    setSavingProfile(false);
  };

  const savePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError(null);
    setSavingPassword(true);
    try {
      await api.changePassword(currentPassword, newPassword);
      setCurrentPassword('');
      setNewPassword('');
      showToast('Password changed');
    } catch (error) {
      setPasswordError(error instanceof Error ? error.message : 'Could not change your password.');
    }
    setSavingPassword(false);
  };

  const joined = member.createdAt ? new Date(member.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' }) : '';
  const planLabel = member.membership === 'club' ? 'Coffee Ave Lounge Club' : 'Auto Ave Unli-Wash VIP';

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      {/* Header */}
      <div className="rounded-3xl bg-gradient-to-r from-[#241c18] via-[#1d1714] to-[#171412] border border-[#d4af37]/20 p-8 sm:p-10 relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-72 h-72 bg-[#c0392b]/15 rounded-full blur-[90px] pointer-events-none" />
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-5">
          <div className="space-y-2">
            <span className="text-xs font-semibold uppercase tracking-[0.25em] text-[#d4af37]">MEMBER DASHBOARD</span>
            <h1 className="font-serif text-3xl sm:text-5xl font-bold text-white leading-tight">Hello, {member.name.split(' ')[0]}.</h1>
            <p className="text-sm text-[#ede8e3]/70 flex flex-wrap items-center gap-x-3 gap-y-1">
              <span className="inline-flex items-center gap-1.5 text-[#d4af37] font-semibold">
                <Sparkles className="w-3.5 h-3.5" /> {planLabel}
              </span>
              {joined && <span>Member since {joined}</span>}
            </p>
          </div>
          <button
            onClick={onSignOut}
            className="self-start sm:self-auto inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/15 hover:border-[#c0392b] text-xs font-semibold text-[#ede8e3]/80 hover:text-white cursor-pointer transition-colors"
          >
            <LogOut className="w-4 h-4" /> Sign out
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-5 gap-6">
        {/* Left: vehicle status + alerts */}
        <div className="lg:col-span-3 space-y-6">
          <section className={card}>
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-serif text-2xl font-bold text-white flex items-center gap-2">
                <Car className="w-5 h-5 text-[#d4af37]" /> My Vehicle
              </h2>
              <span className="font-mono text-xs px-3 py-1 rounded-md bg-black/40 border border-white/10 text-white">{member.plateNumber}</span>
            </div>
            <p className="text-sm text-[#ede8e3]/70 mb-5">{member.vehicleModel}</p>

            {myVehicles.length === 0 ? (
              <div className="rounded-xl border border-dashed border-white/15 p-8 text-center space-y-4">
                <Droplets className="w-8 h-8 text-[#ede8e3]/30 mx-auto" />
                <p className="text-sm text-[#ede8e3]/70">Your car isn't in a wash bay right now.</p>
                <button
                  onClick={() => onNavigate('wash')}
                  className="px-5 py-2.5 rounded-xl bg-[#c0392b] hover:bg-[#a93226] text-white text-xs font-semibold uppercase tracking-wide cursor-pointer"
                >
                  Book a wash
                </button>
              </div>
            ) : (
              <div className="space-y-5">
                {myVehicles.map((v) => (
                  <div key={v.id} className="rounded-xl bg-[#14110f] border border-white/8 p-5 space-y-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-sm font-semibold text-white">{v.servicePackage}</p>
                        <p className="text-xs text-[#ede8e3]/60 mt-0.5">
                          Bay {v.bayNumber} · Started {v.startTime} · about {v.estimatedDuration}
                        </p>
                      </div>
                      <span
                        className={`shrink-0 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${
                          v.stage === 3
                            ? 'bg-emerald-600/25 text-emerald-300 border-emerald-500/40'
                            : v.stage === 2
                              ? 'bg-blue-600/25 text-blue-300 border-blue-500/40'
                              : 'bg-gray-600/30 text-gray-300 border-gray-500/40'
                        }`}
                      >
                        {v.stage === 3 && <CheckCircle2 className="w-3.5 h-3.5" />}
                        {v.stageName}
                      </span>
                    </div>

                    <div>
                      <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-700 ${v.stage === 3 ? 'bg-emerald-400' : 'bg-[#c0392b]'}`}
                          style={{ width: `${v.stageProgressPercent}%` }}
                        />
                      </div>
                      <div className="flex justify-between mt-2 text-[10px] uppercase tracking-wider font-semibold">
                        {STEPS.map((step, index) => (
                          <span key={step} className={v.stage >= index + 1 ? 'text-white' : 'text-[#ede8e3]/35'}>
                            {step}
                          </span>
                        ))}
                      </div>
                    </div>

                    {v.cafeOrderLinked && (
                      <p className="text-xs text-[#ede8e3]/70 flex items-center gap-2">
                        <Coffee className="w-4 h-4 text-[#d4af37] shrink-0" />
                        {v.cafeOrderLinked}
                        {v.drinkStatus && v.drinkStatus !== 'None' && <span className="text-[#d4af37]">· {v.drinkStatus}</span>}
                      </p>
                    )}

                    <button
                      onClick={() => onOpenLiveCamera(v)}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-[#d4af37]/40 hover:border-[#d4af37] text-xs font-semibold text-[#d4af37] hover:text-white cursor-pointer transition-colors"
                    >
                      <Video className="w-4 h-4" /> Watch live bay camera
                    </button>
                  </div>
                ))}
              </div>
            )}
          </section>

          <section className={card}>
            <h2 className="font-serif text-2xl font-bold text-white flex items-center gap-2 mb-4">
              <Bell className="w-5 h-5 text-[#d4af37]" /> Recent Alerts
            </h2>
            {notifications.length === 0 ? (
              <p className="text-sm text-[#ede8e3]/60">No alerts yet.</p>
            ) : (
              <div className="divide-y divide-white/5">
                {notifications.slice(0, 5).map((n) => (
                  <div key={n.id} className="py-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-white">{n.title}</span>
                      <span className="text-[10px] text-[#ede8e3]/50">{n.time}</span>
                    </div>
                    <p className="text-xs text-[#ede8e3]/75 mt-1 leading-relaxed">{n.message}</p>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>

        {/* Right: profile + password */}
        <div className="lg:col-span-2 space-y-6">
          <form onSubmit={saveProfile} className={`${card} space-y-4`}>
            <h2 className="font-serif text-2xl font-bold text-white flex items-center gap-2">
              <UserRound className="w-5 h-5 text-[#d4af37]" /> My Profile
            </h2>
            <div>
              <label className={labelClass}>Full name</label>
              <input className={inputClass} required value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div>
              <label className={labelClass}>Email (used to sign in)</label>
              <input className={`${inputClass} opacity-60`} value={member.email} readOnly />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelClass}>Plate number</label>
                <input
                  className={`${inputClass} font-mono`}
                  required
                  value={plateNumber}
                  onChange={(e) => setPlateNumber(e.target.value.toUpperCase())}
                />
              </div>
              <div>
                <label className={labelClass}>Vehicle</label>
                <input className={inputClass} required value={vehicleModel} onChange={(e) => setVehicleModel(e.target.value)} />
              </div>
            </div>
            <div>
              <label className={labelClass}>Membership</label>
              <select className={inputClass} value={membership} onChange={(e) => setMembership(e.target.value as 'unli' | 'club')}>
                <option value="unli">Auto Ave Unli-Wash VIP</option>
                <option value="club">Coffee Ave Lounge Club</option>
              </select>
            </div>
            {profileError && <p role="alert" className="text-xs text-red-400">{profileError}</p>}
            <button
              type="submit"
              disabled={!profileChanged || savingProfile}
              className="w-full py-2.5 rounded-xl bg-[#c0392b] hover:bg-[#a93226] text-white text-xs font-semibold uppercase tracking-wide cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {savingProfile ? 'Saving...' : 'Save changes'}
            </button>
          </form>

          <form onSubmit={savePassword} className={`${card} space-y-4`}>
            <h2 className="font-serif text-2xl font-bold text-white flex items-center gap-2">
              <KeyRound className="w-5 h-5 text-[#d4af37]" /> Password
            </h2>
            <div>
              <label className={labelClass}>Current password</label>
              <input type="password" autoComplete="current-password" className={inputClass} required value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} />
            </div>
            <div>
              <label className={labelClass}>New password (at least 8 characters)</label>
              <input type="password" autoComplete="new-password" minLength={8} className={inputClass} required value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
            </div>
            {passwordError && <p role="alert" className="text-xs text-red-400">{passwordError}</p>}
            <button
              type="submit"
              disabled={savingPassword}
              className="w-full py-2.5 rounded-xl border border-white/15 hover:border-[#d4af37] text-xs font-semibold uppercase tracking-wide text-white cursor-pointer disabled:opacity-40"
            >
              {savingPassword ? 'Saving...' : 'Change password'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
