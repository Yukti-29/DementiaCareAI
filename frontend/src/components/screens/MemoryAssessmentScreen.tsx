import React, { useState } from 'react';
import { ScreenId } from '../../types';
import { ASSETS } from '../../data/mockData';
import { playChime, speakMessage } from '../../utils/audio';

interface MemoryAssessmentProps {
  onNavigate: (screen: ScreenId) => void;
}

export const MemoryAssessmentScreen: React.FC<MemoryAssessmentProps> = ({ onNavigate }) => {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [playingVoiceNote, setPlayingVoiceNote] = useState<boolean>(false);

  const handleSelect = (option: string) => {
    setSelectedOption(option);
    if (option === 'priya') {
      playChime('bell');
      setIsCorrect(true);
      speakMessage('बिल्कुल सही दादाजी! यह आपकी प्यारी बेटी प्रिया है। दिवाली 2022 की सुंदर याद!', 'hi-IN', 0.85);
    } else {
      playChime('gentle');
      setIsCorrect(false);
      speakMessage('यह आपकी बेटी प्रिया है। ध्यान से देखिए, दिवाली पर आपके साथ मुस्कुरा रही है।', 'hi-IN', 0.85);
    }
  };

  const playPriyaAudio = () => {
    playChime('gentle');
    setPlayingVoiceNote(true);
    speakMessage('पिताजी, याद है हम सबने कैसे छत पर दीये जलाए थे? आरव ने फूलझड़ी जलाई थी। बहुत सुंदर शाम थी!', 'hi-IN', 0.85);
    setTimeout(() => {
      setPlayingVoiceNote(false);
    }, 6000);
  };

  return (
    <div className="w-full min-h-screen bg-surface px-4 pt-20 pb-28 flex flex-col max-w-lg mx-auto">
      {/* Top Banner with Audio Guidance */}
      <div className="bg-surface-container-low rounded-2xl p-4 shadow-xs border border-surface-container mb-4 flex items-center justify-between">
        <div className="flex flex-col min-w-0">
          <div className="flex items-center gap-1.5 text-primary text-xs font-semibold uppercase tracking-wider mb-0.5">
            <span className="material-symbols-outlined text-sm">psychology</span>
            <span>Cognitive Reminiscence • यादों का संगम</span>
          </div>
          <h1 className="font-patient-title text-xl sm:text-2xl text-on-surface font-bold">
            Who is in this memory?
          </h1>
          <p className="font-patient-body-md text-sm text-on-surface-variant">
            यह कौन हैं? पहचानिए
          </p>
        </div>

        <button
          className="w-12 h-12 rounded-2xl bg-surface-container-high text-primary flex items-center justify-center shrink-0 shadow-sm active:scale-95 transition-all"
          onClick={() => {
            playChime('bell');
            speakMessage('Who is with you in this memory? यह कौन हैं? पहचानिए।', 'en-US', 0.85);
          }}
          type="button"
        >
          <span className="material-symbols-outlined text-2xl">volume_up</span>
        </button>
      </div>

      {/* Memory Photo Card with Warm Frame */}
      <div className="relative rounded-3xl overflow-hidden bg-surface-container-lowest shadow-md border border-surface-container mb-4">
        <div className="relative aspect-[4/3] w-full overflow-hidden bg-surface-container">
          <img
            alt="Diwali Memory"
            className="w-full h-full object-cover"
            src={ASSETS.diwali2022}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20"></div>

          {/* Location & Year Badge */}
          <div className="absolute top-3 left-3 bg-black/50 backdrop-blur-md px-3 py-1 rounded-full text-white text-xs font-medium flex items-center gap-1.5">
            <span className="material-symbols-outlined text-sm text-tertiary-fixed">celebration</span>
            <span>Diwali 2022 • New Delhi</span>
          </div>

          <div className="absolute bottom-3 left-3 right-3 text-white">
            <p className="font-headline-sm text-base font-semibold drop-shadow-sm">
              "Lighting evening diyas on the terrace together"
            </p>
            <span className="text-xs opacity-90">छत पर दीये जलाते हुए</span>
          </div>
        </div>
      </div>

      {/* Multiple Choice Answers */}
      <div className="flex flex-col gap-3 mb-4">
        {/* Option 1: Priya */}
        <button
          className={`w-full p-4 rounded-2xl border-2 flex items-center justify-between text-left transition-all active:scale-[0.98] ${
            selectedOption === 'priya'
              ? 'bg-primary-fixed/40 border-primary shadow-sm'
              : 'bg-surface-container-lowest border-surface-container hover:border-primary/40 shadow-xs'
          }`}
          onClick={() => handleSelect('priya')}
          type="button"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-full overflow-hidden shrink-0 ring-2 ring-primary/20">
              <img src={ASSETS.priyaProfile} alt="Priya" className="w-full h-full object-cover" />
            </div>
            <div>
              <span className="font-patient-label text-lg text-on-surface block font-bold">
                Priya (प्रिया)
              </span>
              <span className="font-body-md text-xs text-on-surface-variant">Beti • Daughter</span>
            </div>
          </div>
          {selectedOption === 'priya' && (
            <span className="material-symbols-outlined text-2xl text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>
              check_circle
            </span>
          )}
        </button>

        {/* Option 2: Sunita */}
        <button
          className={`w-full p-4 rounded-2xl border-2 flex items-center justify-between text-left transition-all active:scale-[0.98] ${
            selectedOption === 'sunita'
              ? 'bg-error-container/40 border-error shadow-sm'
              : 'bg-surface-container-lowest border-surface-container hover:border-outline/40 shadow-xs'
          }`}
          onClick={() => handleSelect('sunita')}
          type="button"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-full overflow-hidden shrink-0 ring-1 ring-surface-container">
              <img src={ASSETS.sunitaSister} alt="Sunita" className="w-full h-full object-cover" />
            </div>
            <div>
              <span className="font-patient-label text-lg text-on-surface block font-bold">
                Sunita (सुनीता दीदी)
              </span>
              <span className="font-body-md text-xs text-on-surface-variant">Sister • बहन</span>
            </div>
          </div>
          {selectedOption === 'sunita' && (
            <span className="material-symbols-outlined text-2xl text-error">info</span>
          )}
        </button>

        {/* Option 3: Kamala */}
        <button
          className={`w-full p-4 rounded-2xl border-2 flex items-center justify-between text-left transition-all active:scale-[0.98] ${
            selectedOption === 'kamala'
              ? 'bg-error-container/40 border-error shadow-sm'
              : 'bg-surface-container-lowest border-surface-container hover:border-outline/40 shadow-xs'
          }`}
          onClick={() => handleSelect('kamala')}
          type="button"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-full overflow-hidden shrink-0 ring-1 ring-surface-container">
              <img src={ASSETS.nanijiKamala} alt="Kamala" className="w-full h-full object-cover" />
            </div>
            <div>
              <span className="font-patient-label text-lg text-on-surface block font-bold">
                Kamala (कमला)
              </span>
              <span className="font-body-md text-xs text-on-surface-variant">Wife • पत्नी</span>
            </div>
          </div>
          {selectedOption === 'kamala' && (
            <span className="material-symbols-outlined text-2xl text-error">info</span>
          )}
        </button>
      </div>

      {/* Success Celebration & Audio Story Card */}
      {isCorrect && (
        <div className="rounded-3xl bg-surface-container-lowest p-5 shadow-md border border-primary/30 flex flex-col gap-3 animate-in fade-in zoom-in-95 duration-200 mb-4">
          <div className="flex items-center gap-2.5 text-primary">
            <div className="w-8 h-8 rounded-full bg-primary-fixed flex items-center justify-center">
              <span className="material-symbols-outlined text-lg">celebration</span>
            </div>
            <span className="font-headline-sm text-base font-bold">
              बिल्कुल सही! You got it right!
            </span>
          </div>

          <p className="font-body-md text-sm text-on-surface leading-relaxed">
            This is your daughter Priya celebrating Diwali with you in 2022. Listen to the voice hug she recorded:
          </p>

          <button
            className="w-full py-3 px-4 rounded-2xl bg-secondary-container text-on-secondary-container flex items-center justify-between shadow-xs active:scale-[0.98] transition-all"
            onClick={playPriyaAudio}
            type="button"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-secondary text-on-secondary flex items-center justify-center">
                <span className="material-symbols-outlined text-xl">
                  {playingVoiceNote ? 'pause' : 'play_arrow'}
                </span>
              </div>
              <div className="flex flex-col text-left">
                <span className="font-label-md text-xs font-bold">Listen to Priya's Voice Hug</span>
                <span className="font-label-sm text-[11px] opacity-80">प्रिया की आवाज़ सुनें (0:45)</span>
              </div>
            </div>
            <span className="material-symbols-outlined text-xl">graphic_eq</span>
          </button>
        </div>
      )}

      {/* Next Memory Button */}
      <button
        className="w-full h-14 rounded-2xl bg-primary text-on-primary font-patient-label text-base font-bold shadow-md flex items-center justify-center gap-2 active:scale-98 transition-transform"
        onClick={() => {
          playChime('confirm');
          onNavigate('memory-storybook');
        }}
        type="button"
      >
        <span>Next Memory • अगली याद देखें</span>
        <span className="material-symbols-outlined text-xl">arrow_forward</span>
      </button>
    </div>
  );
};
