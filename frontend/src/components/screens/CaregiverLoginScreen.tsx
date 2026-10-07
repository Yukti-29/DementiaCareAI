import React, { useState } from 'react';
import { ScreenId } from '../../types';
import { ASSETS } from '../../data/mockData';
import { playChime } from '../../utils/audio';

interface CaregiverLoginProps {
  onNavigate: (screen: ScreenId) => void;
  onLoginSuccess: () => void;
}

export const CaregiverLoginScreen: React.FC<CaregiverLoginProps> = ({ onNavigate, onLoginSuccess }) => {
  const [deviceCode, setDeviceCode] = useState('SNJ-882');
  const [relation, setRelation] = useState('Priya (Daughter & Primary Guardian)');
  const [phone, setPhone] = useState('+91 98765 43210');

  const handleConnect = (e: React.FormEvent) => {
    e.preventDefault();
    playChime('confirm');
    onLoginSuccess();
    onNavigate('caregiver-hub');
  };

  return (
    <div className="w-full min-h-screen bg-surface px-4 py-6 flex flex-col max-w-lg mx-auto">
      {/* Top Brand & Security Header */}
      <div className="flex flex-col items-center text-center mt-3 mb-6">
        <div className="w-18 h-18 rounded-3xl bg-secondary-container/50 flex items-center justify-center text-secondary mb-3 shadow-sm border border-secondary-container">
          <span className="material-symbols-outlined text-[38px]" style={{ fontVariationSettings: "'FILL' 1" }}>
            shield_person
          </span>
        </div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-fixed text-on-primary-fixed font-label-sm text-xs font-bold mb-2">
          <span className="w-2 h-2 rounded-full bg-primary"></span>
          Encrypted Family Health Link
        </div>
        <h1 className="font-headline-lg text-2xl text-on-surface font-bold">
          Caregiver & Family Portal
        </h1>
        <p className="font-body-md text-sm text-on-surface-variant max-w-xs mt-1">
          Monitor dadaji's daily routine, cognitive trends, schedule medicines, and record comforting voice hugs.
        </p>
      </div>

      {/* Login / Link Device Form */}
      <form onSubmit={handleConnect} className="rounded-3xl bg-surface-container-lowest p-6 shadow-md border border-surface-container flex flex-col gap-4">
        {/* Linked Patient Preview Card */}
        <div className="p-3.5 bg-surface-container-low rounded-2xl flex items-center gap-3 border border-surface-container">
          <img src={ASSETS.dadajiAvatar} alt="Dadaji Ramesh" className="w-14 h-14 rounded-full object-cover ring-2 ring-primary/20" />
          <div className="flex flex-col min-w-0">
            <span className="font-label-sm text-[11px] text-primary font-bold uppercase">Linked Patient Device</span>
            <span className="font-headline-sm text-base text-on-surface font-bold truncate">Dadaji Ramesh Chandra</span>
            <span className="font-body-md text-xs text-on-surface-variant">Bedside Tablet ID: SNJ-882 • Online</span>
          </div>
        </div>

        {/* Input: Device Linking Code */}
        <div className="flex flex-col gap-1.5">
          <label className="font-label-md text-xs font-bold text-on-surface flex items-center justify-between">
            <span>Bedside Device Pairing Code</span>
            <span className="text-primary text-[11px]">Synced via QR / Code</span>
          </label>
          <div className="relative flex items-center">
            <input
              type="text"
              value={deviceCode}
              onChange={(e) => setDeviceCode(e.target.value)}
              className="w-full h-12 px-4 rounded-xl bg-surface-container-low border border-surface-container text-on-surface font-headline-sm tracking-widest text-base focus:outline-primary"
              placeholder="e.g. SNJ-882"
              required
            />
            <span className="absolute right-3 material-symbols-outlined text-primary text-xl">qr_code_scanner</span>
          </div>
        </div>

        {/* Selector: Relationship */}
        <div className="flex flex-col gap-1.5">
          <label className="font-label-md text-xs font-bold text-on-surface">
            Your Relationship
          </label>
          <select
            value={relation}
            onChange={(e) => setRelation(e.target.value)}
            className="w-full h-12 px-4 rounded-xl bg-surface-container-low border border-surface-container text-on-surface text-sm font-medium focus:outline-primary"
          >
            <option value="Priya (Daughter & Primary Guardian)">Priya (Daughter & Primary Guardian)</option>
            <option value="Vikram (Son - Remote Telemetry)">Vikram (Son - Remote Telemetry)</option>
            <option value="Dr. Sen (Family Physician)">Dr. Sen (Family Physician / Geriatrician)</option>
            <option value="Nurse Anita (Day Attendant)">Nurse Anita (Day Attendant)</option>
          </select>
        </div>

        {/* Input: Phone */}
        <div className="flex flex-col gap-1.5">
          <label className="font-label-md text-xs font-bold text-on-surface">
            Caregiver Mobile Number (OTP Verified)
          </label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full h-12 px-4 rounded-xl bg-surface-container-low border border-surface-container text-on-surface text-sm focus:outline-primary"
            placeholder="+91 XXXXX XXXXX"
            required
          />
        </div>

        {/* Fast Pass Login Button */}
        <button
          type="submit"
          className="w-full h-14 mt-2 rounded-2xl bg-secondary text-on-secondary font-headline-sm text-base font-bold flex items-center justify-center gap-2 shadow-md hover:bg-secondary/90 active:scale-[0.98] transition-all cursor-pointer"
        >
          <span className="material-symbols-outlined text-2xl">lock_open</span>
          <span>Access Caregiver Sanctuary</span>
        </button>

        <p className="font-body-md text-xs text-outline text-center">
          HIPAA & NDHM compliant data encryption for elder healthcare.
        </p>
      </form>

      {/* Switch to Patient Mode */}
      <div className="mt-6 flex items-center justify-center">
        <button
          className="text-xs font-semibold text-primary flex items-center gap-1 hover:underline"
          onClick={() => {
            playChime('gentle');
            onNavigate('role-selection');
          }}
          type="button"
        >
          <span className="material-symbols-outlined text-sm">arrow_back</span>
          <span>Return to Role Selection</span>
        </button>
      </div>
    </div>
  );
};
