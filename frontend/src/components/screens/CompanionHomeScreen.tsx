import React from 'react';
import { ScreenId } from '../../types';
import { ASSETS } from '../../data/mockData';
import { playChime, speakMessage } from '../../utils/audio';

interface CompanionHomeScreenProps {
  onNavigate: (screen: ScreenId) => void;
}

export const CompanionHomeScreen: React.FC<CompanionHomeScreenProps> = ({ onNavigate }) => {
  const handleGreetingAudio = () => {
    playChime('bell');
    speakMessage('प्रणाम रमेश जी! आज का दिन शुभ और शांत हो। तुलसी उपवन में आपका स्वागत है।', 'hi-IN', 0.85);
  };

  return (
    <div className="w-full min-h-screen bg-surface px-4 pt-20 pb-28 flex flex-col max-w-lg mx-auto">
      {/* Morning Salutation & Audio Prompt */}
      <div className="flex items-center justify-between bg-surface-container-low rounded-2xl p-4 shadow-xs mb-5 border border-surface-container">
        <div className="flex flex-col min-w-0">
          <div className="flex items-center gap-1.5 text-primary text-xs font-semibold uppercase tracking-wider mb-0.5">
            <span className="w-2 h-2 rounded-full bg-primary inline-block"></span>
            <span>आज का दिन • TODAY</span>
          </div>
          <h1 className="font-patient-title text-2xl text-on-surface font-bold truncate">
            Pranam, Ramesh...
          </h1>
          <p className="font-patient-body-md text-base text-on-surface-variant flex items-center gap-1.5 mt-0.5">
            <span>आज का दिन शुभ और शांत हो</span>
            <span>☀️</span>
          </p>
        </div>

        <button
          aria-label="Listen to morning greeting"
          className="w-14 h-14 rounded-2xl bg-surface-container-high text-primary flex items-center justify-center shrink-0 shadow-sm active:scale-95 hover:bg-primary-fixed transition-all"
          onClick={handleGreetingAudio}
          type="button"
        >
          <span className="material-symbols-outlined text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>
            volume_up
          </span>
        </button>
      </div>

      {/* Mitra Loving Daily Companion Hero Card */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-surface-container-low via-surface-container-lowest to-surface-container-low p-6 shadow-sm border border-surface-container mb-6 text-center flex flex-col items-center">
        {/* Soft Ambient Radiance */}
        <div className="absolute top-0 w-48 h-48 rounded-full bg-tertiary-fixed/20 blur-3xl pointer-events-none"></div>

        {/* Mitra Sacred Orb Avatar */}
        <div className="relative flex items-center justify-center w-28 h-28 mb-3">
          <div className="absolute inset-0 rounded-full bg-primary-fixed/40 animate-pulse blur-md"></div>
          <div className="relative z-10 w-24 h-24 rounded-full bg-surface-container-lowest shadow-md flex items-center justify-center border border-primary/20">
            <div className="w-18 h-18 rounded-full bg-primary flex items-center justify-center text-on-primary">
              <span className="material-symbols-outlined text-[38px]">nature_people</span>
            </div>
          </div>
        </div>

        <h2 className="font-headline-md text-xl text-primary font-bold">
          Mitra (मित्र)
        </h2>
        <p className="font-body-md text-sm text-on-surface-variant max-w-sm mt-1 leading-normal">
          Your loving daily companion • मैं यहाँ आपकी मदद के लिए हूँ
        </p>

        {/* Giant Talk to Mitra Button */}
        <button
          className="w-full mt-4 min-h-[58px] py-2 px-4 rounded-2xl bg-primary text-on-primary flex items-center justify-center gap-3 shadow-md hover:bg-primary-container active:scale-[0.98] transition-all cursor-pointer"
          onClick={() => {
            playChime('confirm');
            onNavigate('mitra-voice');
          }}
          type="button"
        >
          <div className="w-9 h-9 rounded-full bg-primary-fixed text-primary flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-[20px]">mic</span>
          </div>
          <div className="flex flex-col text-left">
            <span className="font-patient-label text-base font-bold leading-snug">Talk to Mitra</span>
            <span className="font-label-sm text-xs text-on-primary-container leading-normal">मुझसे बात करें</span>
          </div>
        </button>
      </div>

      {/* Daily Routines Grid */}
      <div className="flex items-center justify-between px-1 mb-3">
        <h3 className="font-headline-sm text-lg text-on-surface font-semibold">
          Daily Routines • दिनचर्या
        </h3>
        <span className="font-label-sm text-xs bg-secondary-container text-on-secondary-container px-2.5 py-0.5 rounded-full font-semibold">
          4 Activities
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3.5 mb-6">
        {/* Tile 1: Today's Reminders */}
        <div
          className="bg-surface-container-lowest rounded-2xl p-4 shadow-xs border border-surface-container flex flex-col justify-between cursor-pointer hover:border-primary transition-all active:scale-[0.98] min-h-[170px]"
          onClick={() => {
            playChime('bell');
            speakMessage('सुबह की दवा: 9:00 AM पर चाय के बाद लेनी है।', 'hi-IN', 0.85);
          }}
        >
          <div>
            <div className="w-10 h-10 rounded-xl bg-tertiary-fixed/60 flex items-center justify-center text-tertiary mb-3">
              <span className="material-symbols-outlined text-2xl">medication</span>
            </div>
            <span className="font-patient-label text-base text-on-surface block leading-snug break-words">
              Today's Reminders
            </span>
            <span className="font-label-sm text-xs text-outline block mt-1 leading-normal">दवा और दिनचर्या</span>
          </div>

          <div className="mt-3 p-2 bg-surface-container-low rounded-xl flex items-center gap-1.5 text-xs text-on-surface-variant">
            <span className="material-symbols-outlined text-sm text-primary">schedule</span>
            <span className="truncate">9:00 AM • Morning BP</span>
          </div>
        </div>

        {/* Tile 2: Memory Time (Puzzle Game) */}
        <div
          className="bg-surface-container-lowest rounded-2xl p-4 shadow-xs border border-surface-container flex flex-col justify-between cursor-pointer hover:border-primary transition-all active:scale-[0.98] min-h-[170px]"
          onClick={() => {
            playChime('gentle');
            onNavigate('memory-assessment');
          }}
        >
          <div>
            <div className="w-10 h-10 rounded-xl bg-secondary-container flex items-center justify-center text-secondary mb-3">
              <span className="material-symbols-outlined text-2xl">extension</span>
            </div>
            <span className="font-patient-label text-base text-on-surface block leading-snug break-words">
              Memory Time
            </span>
            <span className="font-label-sm text-xs text-outline block mt-1 leading-normal">यादों का खेल</span>
          </div>

          <div className="mt-3 p-2 bg-secondary-fixed/40 rounded-xl flex items-center justify-between text-xs text-secondary font-semibold">
            <span>Photo Puzzle</span>
            <span className="material-symbols-outlined text-sm">play_arrow</span>
          </div>
        </div>

        {/* Tile 3: My People */}
        <div
          className="bg-surface-container-lowest rounded-2xl p-4 shadow-xs border border-surface-container flex flex-col justify-between cursor-pointer hover:border-primary transition-all active:scale-[0.98] min-h-[170px]"
          onClick={() => {
            playChime('gentle');
            onNavigate('family-connect');
          }}
        >
          <div>
            <div className="w-10 h-10 rounded-xl bg-primary-fixed flex items-center justify-center text-primary mb-3">
              <span className="material-symbols-outlined text-2xl">family_restroom</span>
            </div>
            <span className="font-patient-label text-base text-on-surface block leading-snug break-words">
              My People
            </span>
            <span className="font-label-sm text-xs text-outline block mt-1 leading-normal">मेरे अपने परिवार</span>
          </div>

          <div className="mt-3 flex items-center gap-1">
            <div className="flex -space-x-1.5 overflow-hidden">
              <div className="w-6 h-6 rounded-full bg-primary-container text-on-primary text-[10px] font-bold flex items-center justify-center ring-1 ring-white">P</div>
              <div className="w-6 h-6 rounded-full bg-secondary text-on-secondary text-[10px] font-bold flex items-center justify-center ring-1 ring-white">A</div>
              <div className="w-6 h-6 rounded-full bg-tertiary text-on-tertiary text-[10px] font-bold flex items-center justify-center ring-1 ring-white">S</div>
              <div className="w-6 h-6 rounded-full bg-surface-container-highest text-on-surface text-[9px] font-bold flex items-center justify-center ring-1 ring-white">+1</div>
            </div>
            <span className="font-label-sm text-[11px] text-outline ml-1">Family</span>
          </div>
        </div>

        {/* Tile 4: My Day */}
        <div
          className="bg-surface-container-lowest rounded-2xl p-4 shadow-xs border border-surface-container flex flex-col justify-between cursor-pointer hover:border-primary transition-all active:scale-[0.98] min-h-[170px]"
          onClick={() => {
            playChime('gentle');
            onNavigate('memory-storybook');
          }}
        >
          <div>
            <div className="w-10 h-10 rounded-xl bg-surface-container-high flex items-center justify-center text-primary mb-3">
              <span className="material-symbols-outlined text-2xl">auto_stories</span>
            </div>
            <span className="font-patient-label text-base text-on-surface block leading-snug break-words">
              My Day
            </span>
            <span className="font-label-sm text-xs text-outline block mt-1 leading-normal">यादों की डायरी</span>
          </div>

          <div className="mt-3 p-2 bg-surface-container-low rounded-xl flex items-center justify-between text-xs text-on-surface-variant">
            <span>Daily Story</span>
            <span className="material-symbols-outlined text-sm text-primary">arrow_forward</span>
          </div>
        </div>
      </div>

      {/* Gentle Calming Daily Advice Banner */}
      <div className="rounded-2xl bg-surface-container-low p-3.5 shadow-xs flex items-center gap-3 border border-surface-container mb-6">
        <div className="w-10 h-10 rounded-full bg-tertiary-fixed/60 flex items-center justify-center text-tertiary shrink-0">
          <span className="material-symbols-outlined text-xl">wb_sunny</span>
        </div>
        <div className="flex flex-col min-w-0">
          <span className="font-label-sm text-[10px] text-tertiary font-bold uppercase tracking-wider">
            SURAJ KI ROSHNI • MORNING SUNLIGHT
          </span>
          <p className="font-body-md text-xs text-on-surface truncate">
            Take 10 mindful breaths near the Tulsi plant...
          </p>
        </div>
      </div>

      {/* Giant Distress SOS / सहायता Button */}
      <button
        className="w-full min-h-[72px] rounded-3xl bg-error text-on-error flex items-center justify-center gap-3 shadow-lg active:scale-98 transition-all cursor-pointer"
        onClick={() => {
          playChime('bell');
          alert('Emergency SOS: Calling Daughter Priya and nearest attendant...');
        }}
        type="button"
      >
        <div className="w-11 h-11 rounded-full bg-white/20 flex items-center justify-center text-white shrink-0">
          <span className="material-symbols-outlined text-3xl animate-pulse">emergency</span>
        </div>
        <div className="flex flex-col text-left">
          <span className="font-patient-title text-xl font-bold leading-tight">
            SOS / सहायता
          </span>
          <span className="font-label-md text-xs opacity-90">Call Priya (Beti)</span>
        </div>
      </button>
    </div>
  );
};
