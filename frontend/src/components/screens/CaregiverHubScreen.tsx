import React, { useState } from 'react';
import { ScreenId } from '../../types';
import { ASSETS } from '../../data/mockData';
import { playChime, speakMessage } from '../../utils/audio';

interface CaregiverHubProps {
  onNavigate: (screen: ScreenId) => void;
}

export const CaregiverHubScreen: React.FC<CaregiverHubProps> = ({ onNavigate }) => {
  const [recordingVoiceHug, setRecordingVoiceHug] = useState(false);
  const [recordedAudioSuccess, setRecordedAudioSuccess] = useState(false);
  const [sundowningMode, setSundowningMode] = useState(true);

  const handleVoiceHugRecord = () => {
    if (!recordingVoiceHug) {
      playChime('bell');
      setRecordingVoiceHug(true);
      setRecordedAudioSuccess(false);
      setTimeout(() => {
        setRecordingVoiceHug(false);
        setRecordedAudioSuccess(true);
        playChime('confirm');
      }, 3500);
    }
  };

  const handleBroadcastToDadaji = () => {
    playChime('bell');
    speakMessage('Voice hug sent to Dadaji’s bedside screen. Playing now with warm chime.', 'en-US', 0.9);
    alert('Voice Hug broadcasted to Dadaji’s bedside device! He will hear it next time he taps Mitra.');
  };

  return (
    <div className="w-full min-h-screen bg-surface px-4 pt-20 pb-28 flex flex-col max-w-lg mx-auto">
      {/* Header Banner */}
      <div className="bg-surface-container-low rounded-2xl p-4 shadow-xs border border-surface-container mb-5 flex items-center justify-between">
        <div className="flex flex-col min-w-0">
          <div className="flex items-center gap-1.5 text-secondary text-xs font-semibold uppercase tracking-wider mb-0.5">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
            <span>Live Guardian Telemetry • 24/7 Sync</span>
          </div>
          <h1 className="font-headline-md text-xl sm:text-2xl text-on-surface font-bold">
            Caregiver Hub
          </h1>
          <p className="font-body-md text-xs text-on-surface-variant">
            Dadaji Ramesh Chandra • Bedside Device Online
          </p>
        </div>

        <button
          className="w-12 h-12 rounded-2xl bg-secondary-container text-on-secondary-container flex items-center justify-center shrink-0 shadow-xs"
          onClick={() => onNavigate('life-story-repository')}
          title="Open Archival Life Story"
          type="button"
        >
          <span className="material-symbols-outlined text-2xl">auto_stories</span>
        </button>
      </div>

      {/* Patient Live Status Widget */}
      <div className="rounded-3xl bg-surface-container-lowest p-5 shadow-sm border border-surface-container mb-4 flex flex-col gap-3.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative w-12 h-12 rounded-full overflow-hidden ring-2 ring-primary/20">
              <img src={ASSETS.dadajiAvatar} alt="Dadaji" className="w-full h-full object-cover" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-headline-sm text-base text-on-surface font-bold">Current State: Calm</span>
                <span className="w-2 h-2 rounded-full bg-primary inline-block"></span>
              </div>
              <span className="font-body-md text-xs text-on-surface-variant">Resting in living room near Tulsi garden</span>
            </div>
          </div>
          <span className="font-label-sm text-xs bg-primary-fixed text-on-primary-fixed px-2.5 py-1 rounded-full font-semibold">
            Vitals Good
          </span>
        </div>

        <div className="grid grid-cols-3 gap-2 text-center pt-1 border-t border-surface-container">
          <div className="p-2 bg-surface-container-low rounded-xl">
            <span className="text-[10px] text-outline uppercase font-semibold block">Heart Rate</span>
            <span className="font-headline-sm text-sm font-bold text-on-surface">72 bpm</span>
          </div>
          <div className="p-2 bg-surface-container-low rounded-xl">
            <span className="text-[10px] text-outline uppercase font-semibold block">Blood Press.</span>
            <span className="font-headline-sm text-sm font-bold text-on-surface">124 / 82</span>
          </div>
          <div className="p-2 bg-surface-container-low rounded-xl">
            <span className="text-[10px] text-outline uppercase font-semibold block">Sleep Quality</span>
            <span className="font-headline-sm text-sm font-bold text-primary">7.5 hrs</span>
          </div>
        </div>
      </div>

      {/* Routine Pace Barometer */}
      <div className="rounded-3xl bg-surface-container-lowest p-5 shadow-sm border border-surface-container mb-4 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <span className="font-headline-sm text-sm font-bold text-on-surface">
            Today's Routine Pace Barometer
          </span>
          <span className="font-label-sm text-xs text-primary font-bold">3 of 4 Completed</span>
        </div>

        <div className="w-full bg-surface-container h-2.5 rounded-full overflow-hidden">
          <div className="bg-primary h-full rounded-full w-3/4"></div>
        </div>

        <div className="flex flex-col gap-2 pt-1 text-xs">
          <div className="flex items-center justify-between text-on-surface">
            <span className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-base text-primary">check_circle</span>
              <span>07:30 AM • Morning Tulsi Garden Walk</span>
            </span>
            <span className="text-outline">Done</span>
          </div>
          <div className="flex items-center justify-between text-on-surface">
            <span className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-base text-primary">check_circle</span>
              <span>09:00 AM • Morning BP Medicine + Chai</span>
            </span>
            <span className="text-outline">Done</span>
          </div>
          <div className="flex items-center justify-between text-on-surface">
            <span className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-base text-primary">check_circle</span>
              <span>11:30 AM • Diwali 2022 Reminiscence Game</span>
            </span>
            <span className="text-primary font-bold">100% Score</span>
          </div>
          <div className="flex items-center justify-between text-on-surface-variant opacity-80">
            <span className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-base text-outline">radio_button_unchecked</span>
              <span>07:00 PM • Evening Bhajan & Rest</span>
            </span>
            <span className="text-outline">Scheduled</span>
          </div>
        </div>
      </div>

      {/* Voice Hug Quick Recorder */}
      <div className="rounded-3xl bg-surface-container-lowest p-5 shadow-sm border border-tertiary/20 mb-4 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-tertiary text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>
              favorite
            </span>
            <span className="font-headline-sm text-base text-on-surface font-bold">
              Record a "Voice Hug" for Dadaji
            </span>
          </div>
          <span className="text-[11px] font-semibold bg-tertiary-fixed text-on-tertiary-fixed px-2 py-0.5 rounded-full">
            Instant Audio
          </span>
        </div>

        <p className="font-body-md text-xs text-on-surface-variant leading-relaxed">
          Record a comforting 20-sec message. It will gently play from Dadaji's device when he wakes up or feels restless.
        </p>

        <button
          className={`w-full h-13 rounded-2xl flex items-center justify-center gap-2 font-headline-sm text-sm font-bold shadow-sm transition-all cursor-pointer ${
            recordingVoiceHug
              ? 'bg-error text-on-error animate-pulse'
              : 'bg-tertiary text-on-tertiary hover:bg-tertiary/90'
          }`}
          onClick={handleVoiceHugRecord}
          type="button"
        >
          <span className="material-symbols-outlined text-xl">
            {recordingVoiceHug ? 'mic' : 'mic_none'}
          </span>
          <span>
            {recordingVoiceHug ? 'Recording... Speak now (3s)' : 'Tap to Record Voice Hug'}
          </span>
        </button>

        {recordedAudioSuccess && (
          <div className="p-3 bg-tertiary-fixed/30 rounded-2xl flex items-center justify-between gap-2 text-xs text-on-surface animate-in fade-in duration-200">
            <span className="flex items-center gap-1.5 font-medium">
              <span className="material-symbols-outlined text-base text-tertiary">check_circle</span>
              "Priya's Evening Hug (0:18)" recorded!
            </span>
            <button
              className="px-3 py-1 bg-tertiary text-on-tertiary rounded-xl font-bold shadow-xs active:scale-95"
              onClick={handleBroadcastToDadaji}
              type="button"
            >
              Send to Device
            </button>
          </div>
        )}
      </div>

      {/* Sensory Sanctuary Settings */}
      <div className="rounded-3xl bg-surface-container-lowest p-5 shadow-sm border border-surface-container mb-4 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <span className="font-headline-sm text-base text-on-surface font-bold">
            Sensory Sanctuary Safeguards
          </span>
          <span className="material-symbols-outlined text-primary text-xl">spa</span>
        </div>

        <div className="flex items-center justify-between py-2 border-b border-surface-container">
          <div>
            <span className="font-patient-label text-sm text-on-surface block font-semibold">Sundowning Shield (सांध्य-प्रहर रक्षा)</span>
            <span className="font-body-md text-xs text-on-surface-variant">Auto warm amber ambient light at 5:30 PM</span>
          </div>
          <button
            onClick={() => setSundowningMode(!sundowningMode)}
            className={`w-12 h-7 rounded-full p-1 transition-colors ${sundowningMode ? 'bg-primary' : 'bg-surface-container-highest'}`}
            type="button"
          >
            <div className={`w-5 h-5 rounded-full bg-white transition-transform ${sundowningMode ? 'translate-x-5' : 'translate-x-0'}`}></div>
          </button>
        </div>

        <div className="flex items-center justify-between py-1">
          <div>
            <span className="font-patient-label text-sm text-on-surface block font-semibold">Maximum Companion Volume</span>
            <span className="font-body-md text-xs text-on-surface-variant">Prevents startling loud noise during nap</span>
          </div>
          <span className="font-bold text-xs bg-surface-container px-2.5 py-1 rounded-lg text-primary">65 dB Safe</span>
        </div>
      </div>

      {/* Link to Archival Story Repository */}
      <button
        className="w-full h-14 rounded-2xl bg-secondary text-on-secondary font-headline-sm text-base font-bold flex items-center justify-center gap-2 shadow-md hover:bg-secondary/90 active:scale-98 transition-all cursor-pointer"
        onClick={() => {
          playChime('confirm');
          onNavigate('life-story-repository');
        }}
        type="button"
      >
        <span className="material-symbols-outlined text-2xl">menu_book</span>
        <span>Curate Dadaji's Archival Life Story</span>
      </button>
    </div>
  );
};
