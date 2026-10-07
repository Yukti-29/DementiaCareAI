import React from 'react';
import { ScreenId } from '../../types';
import { ASSETS } from '../../data/mockData';
import { playChime } from '../../utils/audio';

interface RoleSelectionProps {
  onNavigate: (screen: ScreenId) => void;
  onSelectRole: (role: 'patient' | 'caregiver') => void;
}

export const RoleSelectionScreen: React.FC<RoleSelectionProps> = ({
  onNavigate,
  onSelectRole,
}) => {
  const selectPatient = () => {
    playChime('confirm');
    onSelectRole('patient');
    onNavigate('patient-unlock');
  };

  const selectCaregiver = () => {
    playChime('confirm');
    onSelectRole('caregiver');
    onNavigate('caregiver-login');
  };

  return (
    <div className="w-full min-h-screen bg-surface px-4 py-8 flex flex-col justify-between max-w-md mx-auto">
      {/* Top Branding Section */}
      <div className="flex flex-col items-center text-center mt-4 sm:mt-6">
        <div className="relative flex items-center justify-center w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-surface-container-lowest shadow-md p-2 mb-3 border border-surface-container">
          <img
            alt="MemoryCare Emblem"
            className="w-full h-full object-contain rounded-2xl"
            src={ASSETS.emblemAlt}
          />
        </div>
        <h1 className="font-patient-title text-2xl text-on-surface font-semibold tracking-tight">
          Namaste!
        </h1>
        <p className="font-headline-sm text-base text-primary font-medium mt-0.5">
          Welcome to MemoryCare
        </p>
      </div>

      {/* Role Selection Cards */}
      <div className="flex flex-col gap-3.5 w-full my-auto py-4">
        <span className="font-label-md text-xs font-semibold text-on-surface-variant tracking-wider uppercase px-1">
          Please Select Your Role
        </span>

        {/* Patient Role Card */}
        <button
          className="group w-full rounded-2xl bg-surface-container-lowest border-2 border-primary/20 shadow-sm hover:border-primary p-4 flex items-center justify-between transition-all active:scale-[0.98] text-left cursor-pointer"
          onClick={selectPatient}
          type="button"
        >
          <div className="flex items-center gap-3.5 min-w-0 flex-1">
            <div className="w-12 h-12 sm:w-13 sm:h-13 rounded-2xl bg-primary-fixed flex items-center justify-center text-primary shrink-0">
              <span className="material-symbols-outlined text-[28px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                sentiment_satisfied
              </span>
            </div>
            <div className="flex flex-col min-w-0 flex-1">
              <span className="font-label-sm text-[11px] font-semibold text-primary uppercase tracking-wider">
                Simple & Calming
              </span>
              <span className="font-headline-md text-base sm:text-lg font-semibold text-on-surface leading-snug break-words">
                I am the Patient
              </span>
            </div>
          </div>
          <div className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-primary shrink-0 ml-2 group-hover:bg-primary group-hover:text-on-primary transition-colors">
            <span className="material-symbols-outlined text-[22px]">arrow_forward</span>
          </div>
        </button>

        {/* Caregiver Role Card */}
        <button
          className="group w-full rounded-2xl bg-surface-container-lowest border border-outline-variant/50 shadow-sm hover:border-secondary p-4 flex items-center justify-between transition-all active:scale-[0.98] text-left cursor-pointer"
          onClick={selectCaregiver}
          type="button"
        >
          <div className="flex items-center gap-3.5 min-w-0 flex-1">
            <div className="w-12 h-12 sm:w-13 sm:h-13 rounded-2xl bg-secondary-container/60 flex items-center justify-center text-secondary shrink-0">
              <span className="material-symbols-outlined text-[28px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                volunteer_activism
              </span>
            </div>
            <div className="flex flex-col min-w-0 flex-1">
              <span className="font-label-sm text-[11px] font-semibold text-secondary uppercase tracking-wider">
                Family & Guardian
              </span>
              <span className="font-headline-md text-base sm:text-lg font-semibold text-on-surface leading-snug break-words">
                I am the Caregiver / Family
              </span>
            </div>
          </div>
          <div className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-secondary shrink-0 ml-2 group-hover:bg-secondary group-hover:text-on-secondary transition-colors">
            <span className="material-symbols-outlined text-[22px]">arrow_forward</span>
          </div>
        </button>
      </div>

      {/* Footer Support Hotline */}
      <footer className="flex items-center justify-center pb-2">
        <button
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold text-outline hover:text-on-surface active:scale-95 transition-all"
          onClick={() => {
            playChime('bell');
            alert('Calling 24/7 Sanjeevani Care Helpline (1800-SANJEEVANI)...');
          }}
          type="button"
        >
          <span className="material-symbols-outlined text-[16px] text-error">call</span>
          <span>Need help? 24/7 Sanjeevani Helpline</span>
        </button>
      </footer>
    </div>
  );
};
