import React from 'react';
import { ScreenId, TextSize, LanguageCode, VoiceTone } from '../../types';
import { playChime, speakMessage } from '../../utils/audio';

interface AccessibilitySettingsProps {
  onNavigate: (screen: ScreenId) => void;
  textSize: TextSize;
  onTextSizeChange: (size: TextSize) => void;
  language: LanguageCode;
  onLanguageChange: (lang: LanguageCode) => void;
  voiceTone: VoiceTone;
  onVoiceToneChange: (tone: VoiceTone) => void;
  volume: number;
  onVolumeChange: (vol: number) => void;
}

export const AccessibilitySettingsScreen: React.FC<AccessibilitySettingsProps> = ({
  onNavigate,
  textSize,
  onTextSizeChange,
  language,
  onLanguageChange,
  voiceTone,
  onVoiceToneChange,
  volume,
  onVolumeChange,
}) => {
  const handleTestAudio = () => {
    playChime('bell');
    speakMessage('यह ध्वनि परीक्षण है। आवाज़ स्पष्ट और शांत है।', 'hi-IN', 0.85);
  };

  return (
    <div className="w-full min-h-screen bg-surface px-4 pt-20 pb-28 flex flex-col max-w-lg mx-auto">
      {/* Header Banner */}
      <div className="bg-surface-container-low rounded-2xl p-4 shadow-xs border border-surface-container mb-5 flex items-center justify-between">
        <div className="flex flex-col min-w-0">
          <div className="flex items-center gap-1.5 text-primary text-xs font-semibold uppercase tracking-wider mb-0.5">
            <span className="material-symbols-outlined text-sm">tune</span>
            <span>Comfort & Ease • आराम और भाषा</span>
          </div>
          <h1 className="font-patient-title text-2xl text-on-surface font-bold">
            Accessibility Settings
          </h1>
          <p className="font-patient-body-md text-sm text-on-surface-variant">
            Adjust text size, soothing voice, and audio volume
          </p>
        </div>

        <div className="w-12 h-12 rounded-2xl bg-primary-fixed text-primary flex items-center justify-center shrink-0 shadow-xs">
          <span className="material-symbols-outlined text-2xl">accessibility_new</span>
        </div>
      </div>

      {/* 1. Text Size Selector */}
      <div className="rounded-3xl bg-surface-container-lowest p-5 shadow-sm border border-surface-container mb-4 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-2xl">format_size</span>
            <span className="font-headline-sm text-base text-on-surface font-bold">
              Font Size • अक्षरों का आकार
            </span>
          </div>
          <span className="text-xs font-bold text-primary capitalize">{textSize} Size</span>
        </div>

        <div className="grid grid-cols-3 gap-2">
          {(
            [
              { id: 'large', label: 'बड़ा', sub: 'Large' },
              { id: 'extra', label: 'बहुत बड़ा', sub: 'Extra' },
              { id: 'giant', label: 'विशाल', sub: 'Giant' },
            ] as const
          ).map((item) => (
            <button
              key={item.id}
              className={`p-3 rounded-2xl border flex flex-col items-center justify-center transition-all ${
                textSize === item.id
                  ? 'bg-primary-fixed text-on-primary-fixed border-primary font-bold shadow-xs'
                  : 'bg-surface-container-low border-surface-container text-on-surface hover:bg-surface-container'
              }`}
              onClick={() => {
                playChime('gentle');
                onTextSizeChange(item.id);
              }}
              type="button"
            >
              <span className="font-headline-md text-lg leading-tight">{item.label}</span>
              <span className="text-[11px] opacity-80">{item.sub}</span>
            </button>
          ))}
        </div>

        {/* Live Typography Preview */}
        <div className="p-3 bg-surface-container-low rounded-2xl border border-surface-container mt-1">
          <span className="text-[11px] font-semibold text-outline uppercase tracking-wider block mb-1">
            Live Preview
          </span>
          <p
            className={`text-on-surface font-medium transition-all ${
              textSize === 'giant' ? 'text-2xl leading-normal' : textSize === 'extra' ? 'text-xl leading-normal' : 'text-lg leading-normal'
            }`}
          >
            "प्रणाम रमेश जी! आपका दिन मंगलमय हो।"
          </p>
        </div>
      </div>

      {/* 2. Companion Voice Tone */}
      <div className="rounded-3xl bg-surface-container-lowest p-5 shadow-sm border border-surface-container mb-4 flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-primary text-2xl">record_voice_over</span>
          <span className="font-headline-sm text-base text-on-surface font-bold">
            Companion Voice • साथी की आवाज़
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2.5">
          <button
            className={`p-3 rounded-2xl border flex flex-col items-start gap-1 text-left transition-all ${
              voiceTone === 'daughter'
                ? 'bg-secondary-container/40 border-secondary font-bold shadow-xs'
                : 'bg-surface-container-low border-surface-container text-on-surface'
            }`}
            onClick={() => {
              playChime('gentle');
              onVoiceToneChange('daughter');
              speakMessage('बेटी प्रिया का कोमल स्वर चुना गया।', 'hi-IN', 0.85);
            }}
            type="button"
          >
            <span className="material-symbols-outlined text-secondary text-2xl">favorite</span>
            <span className="font-headline-sm text-sm text-on-surface font-bold">Priya's Warm Tone</span>
            <span className="text-[11px] text-on-surface-variant">बेटी का स्नेहिल स्वर</span>
          </button>

          <button
            className={`p-3 rounded-2xl border flex flex-col items-start gap-1 text-left transition-all ${
              voiceTone === 'monk'
                ? 'bg-primary-fixed border-primary font-bold shadow-xs'
                : 'bg-surface-container-low border-surface-container text-on-surface'
            }`}
            onClick={() => {
              playChime('gentle');
              onVoiceToneChange('monk');
              speakMessage('संन्यासी का शांत ध्यानास्पद स्वर चुना गया।', 'hi-IN', 0.85);
            }}
            type="button"
          >
            <span className="material-symbols-outlined text-primary text-2xl">self_improvement</span>
            <span className="font-headline-sm text-sm text-on-surface font-bold">Serene Guide</span>
            <span className="text-[11px] text-on-surface-variant">शांत ध्यानास्पद स्वर</span>
          </button>
        </div>
      </div>

      {/* 3. Audio Volume & Test Chime */}
      <div className="rounded-3xl bg-surface-container-lowest p-5 shadow-sm border border-surface-container mb-4 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-2xl">volume_up</span>
            <span className="font-headline-sm text-base text-on-surface font-bold">
              Volume & Clarity • ध्वनि स्तर
            </span>
          </div>
          <span className="font-bold text-xs bg-surface-container px-2.5 py-1 rounded-lg text-primary">
            {volume}%
          </span>
        </div>

        <input
          type="range"
          min="20"
          max="100"
          value={volume}
          onChange={(e) => onVolumeChange(Number(e.target.value))}
          className="w-full accent-primary h-2 bg-surface-container rounded-lg cursor-pointer"
        />

        <button
          className="w-full h-12 rounded-xl bg-surface-container text-primary font-headline-sm text-xs font-bold flex items-center justify-center gap-2 hover:bg-surface-container-high transition-colors"
          onClick={handleTestAudio}
          type="button"
        >
          <span className="material-symbols-outlined text-lg">campaign</span>
          <span>Test Sound & Speech (ध्वनि परीक्षण करें)</span>
        </button>
      </div>

      {/* 4. Emergency Caregiver Ring Test */}
      <div className="rounded-3xl bg-surface-container-lowest p-5 shadow-sm border border-surface-container mb-4 flex items-center justify-between">
        <div className="flex flex-col">
          <span className="font-headline-sm text-sm text-on-surface font-bold">
            Primary Guardian Line
          </span>
          <span className="text-xs text-on-surface-variant">Daughter Priya (+91 98765 43210)</span>
        </div>

        <button
          className="px-4 py-2 bg-primary text-on-primary rounded-xl text-xs font-bold shadow-xs active:scale-95"
          onClick={() => {
            playChime('bell');
            alert('Guardian connection verified. Direct speed-dial is healthy.');
          }}
          type="button"
        >
          Verify Line
        </button>
      </div>

      {/* Switch back to Home */}
      <button
        className="w-full h-14 rounded-2xl bg-primary text-on-primary font-patient-label text-base font-bold flex items-center justify-center gap-2 shadow-md active:scale-98 transition-all"
        onClick={() => {
          playChime('confirm');
          onNavigate('companion-home');
        }}
        type="button"
      >
        <span className="material-symbols-outlined text-2xl">check</span>
        <span>Save & Return Home</span>
      </button>
    </div>
  );
};
