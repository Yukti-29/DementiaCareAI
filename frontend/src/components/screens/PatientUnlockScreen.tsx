import React, { useState } from 'react';
import { ScreenId } from '../../types';
import { ASSETS } from '../../data/mockData';
import { playChime, speakMessage } from '../../utils/audio';

interface PatientUnlockProps {
  onNavigate: (screen: ScreenId) => void;
  onSelectUser: (name: string) => void;
}

export const PatientUnlockScreen: React.FC<PatientUnlockProps> = ({ onNavigate, onSelectUser }) => {
  const [activeTab, setActiveTab] = useState<'photo' | 'pin'>('photo');
  const [pin, setPin] = useState<string>('');
  const [welcomeModal, setWelcomeModal] = useState<{ open: boolean; name: string; message: string }>({
    open: false,
    name: '',
    message: '',
  });

  const handleDigit = (digit: string) => {
    if (pin.length < 4) {
      const nextPin = pin + digit;
      setPin(nextPin);
      playChime('gentle');
      if (nextPin.length === 4) {
        setTimeout(() => {
          unlockSuccess('Dadaji Ramesh', 'PIN Accepted • आपका स्वागत है');
        }, 300);
      }
    }
  };

  const handleClear = () => {
    setPin('');
    playChime('gentle');
  };

  const handleDelete = () => {
    setPin((prev) => prev.slice(0, -1));
    playChime('gentle');
  };

  const unlockSuccess = (name: string, message: string) => {
    playChime('confirm');
    onSelectUser(name);
    setWelcomeModal({ open: true, name, message });
    speakMessage(`Welcome home ${name}. आपका स्वागत है।`, 'hi-IN', 0.85);
    setTimeout(() => {
      onNavigate('companion-home');
    }, 1400);
  };

  return (
    <div className="w-full min-h-screen bg-surface px-4 py-5 flex flex-col max-w-lg mx-auto">
      {/* Lotus & Sanctuary Header */}
      <div className="flex flex-col items-center text-center mt-2 mb-4">
        <div className="relative flex items-center justify-center mb-2">
          <div className="absolute w-24 h-24 rounded-full bg-secondary-fixed/50 animate-pulse blur-xl"></div>
          <div className="relative w-18 h-18 rounded-full bg-surface-container-lowest shadow-md flex items-center justify-center p-2 border border-surface-container">
            <img src={ASSETS.emblemAlt} alt="Lotus" className="w-full h-full object-contain rounded-full" />
          </div>
        </div>

        <h1 className="font-patient-title text-2xl sm:text-3xl text-primary tracking-tight leading-snug">
          Welcome Home, Dadaji
        </h1>
        <p className="font-patient-body-md text-base sm:text-lg text-on-surface-variant mt-0.5 leading-normal">
          घर में आपका स्वागत है
        </p>

        {/* Auditory Prompt Banner */}
        <div className="mt-4 w-full bg-surface-container-low rounded-2xl p-4 shadow-xs flex items-center justify-between gap-3 border border-surface-container">
          <div className="flex items-center gap-3 text-left min-w-0">
            <div className="w-10 h-10 rounded-full bg-tertiary-fixed text-on-tertiary-fixed flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                volume_up
              </span>
            </div>
            <div className="flex flex-col min-w-0">
              <span className="font-patient-label text-base text-on-surface leading-snug">Tap your photo to enter</span>
              <span className="font-body-md text-xs text-on-surface-variant leading-normal">
                अपनी तस्वीर छुएं या 4 अंकों का कोड डालें
              </span>
            </div>
          </div>
          <button
            aria-label="Play instruction audio"
            className="w-11 h-11 rounded-full bg-primary-container text-on-primary flex items-center justify-center shadow-md active:scale-95 transition-transform shrink-0"
            onClick={() => {
              playChime('bell');
              speakMessage('Welcome home Dadaji. Please tap your picture to sign in, or choose four digit pin.', 'en-US', 0.85);
            }}
            type="button"
          >
            <span className="material-symbols-outlined text-2xl">campaign</span>
          </button>
        </div>
      </div>

      {/* Tab Selector: 1-Tap Photo vs PIN */}
      <div className="flex p-1 bg-surface-container rounded-full mb-5 border border-outline-variant/30">
        <button
          className={`flex-1 py-3 px-4 rounded-full font-patient-label text-sm text-center transition-all flex items-center justify-center gap-2 ${
            activeTab === 'photo'
              ? 'bg-surface-container-lowest text-primary shadow-xs font-bold'
              : 'text-on-surface-variant'
          }`}
          onClick={() => {
            playChime('gentle');
            setActiveTab('photo');
          }}
          type="button"
        >
          <span className="material-symbols-outlined text-xl">face</span>
          <span>My Face (मेरी फोटो)</span>
        </button>

        <button
          className={`flex-1 py-3 px-4 rounded-full font-patient-label text-sm text-center transition-all flex items-center justify-center gap-2 ${
            activeTab === 'pin'
              ? 'bg-surface-container-lowest text-primary shadow-xs font-bold'
              : 'text-on-surface-variant'
          }`}
          onClick={() => {
            playChime('gentle');
            setActiveTab('pin');
          }}
          type="button"
        >
          <span className="material-symbols-outlined text-xl">dialpad</span>
          <span>4-Digit PIN</span>
        </button>
      </div>

      {activeTab === 'photo' ? (
        /* SECTION 1: PHOTO SELECTOR */
        <div className="flex flex-col gap-3.5">
          <div className="text-center mb-0.5">
            <span className="font-label-md text-xs uppercase tracking-wider text-outline font-semibold">
              Touch your face to sign in
            </span>
          </div>

          {/* Profile 1: Dadaji Ramesh */}
          <button
            className="w-full bg-surface-container-lowest rounded-2xl p-4 shadow-xs hover:shadow-md border border-primary/25 active:scale-[0.98] transition-all flex items-center justify-between text-left group"
            onClick={() => unlockSuccess('Dadaji Ramesh', 'Photo Verified • आपका स्वागत है')}
            type="button"
          >
            <div className="flex items-center gap-3.5 min-w-0">
              <div className="relative w-18 h-18 rounded-full overflow-hidden shadow-inner shrink-0 ring-2 ring-primary/20">
                <img
                  className="w-full h-full object-cover"
                  alt="Dadaji Ramesh"
                  src={ASSETS.dadajiLarge}
                />
              </div>
              <div className="flex flex-col min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-patient-label text-lg text-on-surface group-hover:text-primary">
                    Dadaji Ramesh
                  </span>
                  <span className="bg-primary-fixed text-on-primary-fixed text-[11px] font-semibold px-2 py-0.5 rounded-full">
                    Self
                  </span>
                </div>
                <span className="font-patient-body-md text-sm text-on-surface-variant">दादाजी रमेश</span>
                <span className="font-body-md text-xs text-primary mt-0.5 flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm">verified_user</span>
                  Quick 1-tap sign in
                </span>
              </div>
            </div>

            <div className="w-12 h-12 rounded-full bg-surface-container flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-on-primary transition-colors shrink-0 ml-2">
              <span className="material-symbols-outlined text-2xl">arrow_forward</span>
            </div>
          </button>

          {/* Profile 2: Naniji Kamala */}
          <button
            className="w-full bg-surface-container-lowest rounded-2xl p-4 shadow-xs hover:shadow-md border border-surface-container active:scale-[0.98] transition-all flex items-center justify-between text-left group"
            onClick={() => unlockSuccess('Naniji Kamala', 'Welcome Naniji • आपका स्वागत है')}
            type="button"
          >
            <div className="flex items-center gap-3.5 min-w-0">
              <div className="relative w-18 h-18 rounded-full overflow-hidden shadow-inner shrink-0 ring-1 ring-surface-container">
                <img
                  className="w-full h-full object-cover"
                  alt="Naniji Kamala"
                  src={ASSETS.nanijiKamala}
                />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="font-patient-label text-lg text-on-surface group-hover:text-primary">
                  Naniji Kamala
                </span>
                <span className="font-patient-body-md text-sm text-on-surface-variant">नानीजी कमला</span>
                <span className="font-body-md text-xs text-outline mt-0.5">Family Resident</span>
              </div>
            </div>

            <div className="w-12 h-12 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant group-hover:bg-primary group-hover:text-on-primary transition-colors shrink-0 ml-2">
              <span className="material-symbols-outlined text-2xl">arrow_forward</span>
            </div>
          </button>

          {/* Profile 3: Family Guest */}
          <button
            className="w-full bg-surface-container-lowest rounded-2xl p-4 shadow-xs hover:shadow-md border border-surface-container active:scale-[0.98] transition-all flex items-center justify-between text-left group"
            onClick={() => unlockSuccess('Family Guest', 'Guest Companion Mode')}
            type="button"
          >
            <div className="flex items-center gap-3.5 min-w-0">
              <div className="w-18 h-18 rounded-full bg-secondary-fixed flex items-center justify-center text-secondary shrink-0 shadow-inner">
                <span className="material-symbols-outlined text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                  nature_people
                </span>
              </div>
              <div className="flex flex-col min-w-0">
                <span className="font-patient-label text-lg text-on-surface group-hover:text-primary">
                  Family Guest
                </span>
                <span className="font-patient-body-md text-sm text-on-surface-variant">अतिथि / सहायक</span>
                <span className="font-body-md text-xs text-outline mt-0.5">Care Companion Mode</span>
              </div>
            </div>

            <div className="w-12 h-12 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant group-hover:bg-primary group-hover:text-on-primary transition-colors shrink-0 ml-2">
              <span className="material-symbols-outlined text-2xl">arrow_forward</span>
            </div>
          </button>
        </div>
      ) : (
        /* SECTION 2: 4-DIGIT PIN PAD */
        <div className="flex flex-col items-center w-full my-auto">
          {/* PIN Indicator Dots */}
          <div className="flex items-center justify-center gap-4 my-2">
            {[1, 2, 3, 4].map((index) => (
              <div
                key={index}
                className={`w-5 h-5 rounded-full transition-all ${
                  index <= pin.length
                    ? 'bg-primary scale-110 shadow-sm'
                    : 'bg-surface-container-high'
                }`}
              />
            ))}
          </div>

          <p className="font-body-md text-xs text-on-surface-variant text-center mb-4">
            {pin.length > 0 ? `${pin.length} of 4 entered` : 'Enter your safe 4 numbers (e.g. 1 2 3 4)'}
          </p>

          {/* Keypad Grid */}
          <div className="grid grid-cols-3 gap-2.5 w-full max-w-xs mx-auto">
            {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
              <button
                key={digit}
                className="h-16 rounded-2xl bg-surface-container-lowest text-on-surface border border-surface-container shadow-xs active:bg-primary-container active:text-on-primary font-headline-md text-2xl flex items-center justify-center transition-all"
                onClick={() => handleDigit(digit)}
                type="button"
              >
                {digit}
              </button>
            ))}

            <button
              className="h-16 rounded-2xl bg-surface-container-low text-outline shadow-xs active:scale-95 font-patient-label text-sm flex items-center justify-center"
              onClick={handleClear}
              type="button"
            >
              Clear
            </button>

            <button
              className="h-16 rounded-2xl bg-surface-container-lowest text-on-surface border border-surface-container shadow-xs active:bg-primary-container active:text-on-primary font-headline-md text-2xl flex items-center justify-center transition-all"
              onClick={() => handleDigit('0')}
              type="button"
            >
              0
            </button>

            <button
              className="h-16 rounded-2xl bg-surface-container-low text-on-surface shadow-xs active:scale-95 flex items-center justify-center"
              onClick={handleDelete}
              type="button"
            >
              <span className="material-symbols-outlined text-2xl">backspace</span>
            </button>
          </div>
        </div>
      )}

      {/* Tactile Audio Readout & Assistance Footer */}
      <div className="mt-6 flex flex-col gap-3">
        <button
          className="w-full h-15 rounded-2xl bg-tertiary-fixed text-on-tertiary-fixed shadow-sm flex items-center justify-center gap-3 active:scale-[0.98] transition-transform"
          onClick={() => {
            playChime('bell');
            const codeToSpeak = pin.length > 0 ? pin.split('').join(' ') : 'Please enter four numbers on screen.';
            speakMessage(codeToSpeak, 'en-US', 0.85);
          }}
          type="button"
        >
          <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>
            hearing
          </span>
          <span className="font-patient-label text-base">Speak Code Out Loud (आवाज़ में सुनें)</span>
        </button>

        <div className="flex items-center justify-between bg-surface-container-lowest rounded-2xl p-3 shadow-xs border border-surface-container">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-error-container text-on-error-container flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-xl">support_agent</span>
            </div>
            <div className="flex flex-col text-left">
              <span className="font-label-md text-xs text-on-surface font-semibold">Need help signing in?</span>
              <span className="font-body-md text-xs text-on-surface-variant">Connecting with Anita (Daughter)</span>
            </div>
          </div>
          <button
            className="py-1.5 px-4 rounded-full bg-surface-container text-primary font-label-md text-xs font-semibold active:scale-95 hover:bg-surface-container-high transition-colors"
            onClick={() => {
              playChime('bell');
              alert('Calling Caregiver Anita for instant assistance...');
            }}
            type="button"
          >
            Call
          </button>
        </div>
      </div>

      {/* Confirmation Modal */}
      {welcomeModal.open && (
        <div className="fixed inset-0 bg-inverse-surface/40 backdrop-blur-sm z-50 flex items-center justify-center p-6">
          <div className="bg-surface-container-lowest rounded-3xl p-6 shadow-xl flex flex-col items-center text-center max-w-sm w-full animate-in fade-in zoom-in duration-200">
            <div className="w-16 h-16 rounded-full bg-primary-fixed text-on-primary-fixed flex items-center justify-center mb-3">
              <span className="material-symbols-outlined text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                sentiment_very_satisfied
              </span>
            </div>
            <h3 className="font-headline-md text-xl text-primary font-bold">
              Namaste {welcomeModal.name}!
            </h3>
            <p className="font-patient-body-md text-sm text-on-surface-variant mt-1.5">
              {welcomeModal.message}
            </p>
            <div className="w-full bg-surface-container rounded-full h-2 mt-5 overflow-hidden">
              <div className="bg-primary h-full w-full animate-pulse"></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
