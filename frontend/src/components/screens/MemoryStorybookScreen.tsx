import React, { useState } from 'react';
import { ScreenId } from '../../types';
import { ASSETS } from '../../data/mockData';
import { playChime, speakMessage, stopSpeech } from '../../utils/audio';

interface MemoryStorybookProps {
  onNavigate: (screen: ScreenId) => void;
}

export const MemoryStorybookScreen: React.FC<MemoryStorybookProps> = ({ onNavigate }) => {
  const [isPlayingMaster, setIsPlayingMaster] = useState<boolean>(false);

  const toggleMasterStory = () => {
    if (isPlayingMaster) {
      stopSpeech();
      setIsPlayingMaster(false);
    } else {
      playChime('bell');
      setIsPlayingMaster(true);
      speakMessage(
        'आज का प्यारा दिन। सुबह दादाजी ने तुलसी उपवन में टहलकर ताज़ा हवा ली। फिर नौ बजे अदरक वाली चाय और दवाई ली। दोपहर को आरव के साथ तस्वीरें देखीं। बहुत सुंदर और शांत दिन रहा।',
        'hi-IN',
        0.85
      );
      setTimeout(() => {
        setIsPlayingMaster(false);
      }, 14000);
    }
  };

  const activities = [
    {
      time: '07:30 AM',
      title: 'Morning Garden Walk near Tulsi Plant',
      titleHindi: 'तुलसी उपवन में सुबह की सैर',
      desc: 'Dadaji walked 180 calm steps in the garden. Enjoyed golden morning sun.',
      photo: ASSETS.gardenWalk,
      audioText: 'सुबह 7:30 बजे आपने बगीचे में सैर की और ताज़ा हवा ली।',
    },
    {
      time: '09:00 AM',
      title: 'Ginger Chai & Morning BP Medicine',
      titleHindi: 'अदरक की चाय और सुबह की दवाई',
      desc: 'Took BP tablet with warm milk and roasted makhana.',
      photo: ASSETS.chaiMedicine,
      audioText: '9 बजे आपने अपनी सुबह की दवाई ली और नाश्ता किया।',
    },
    {
      time: '11:30 AM',
      title: 'Reminiscence Puzzle with Aarav',
      titleHindi: 'आरव के साथ यादों का खेल',
      desc: 'Grandson Aarav showed his school drawings. Dadaji smiled and laughed.',
      photo: ASSETS.aaravStory,
      audioText: 'दोपहर को पोते आरव ने आपके साथ तस्वीरें देखीं और खूब बातें कीं।',
    },
    {
      time: '02:00 PM',
      title: 'Peaceful Afternoon Nap (Raag Bhairav)',
      titleHindi: 'दोपहर का शांत विश्राम',
      desc: 'Rested for 45 minutes with gentle background tanpura melody.',
      photo: ASSETS.afternoonNap,
      audioText: 'दोपहर 2 बजे आपने शांत मन से विश्राम किया।',
    },
  ];

  return (
    <div className="w-full min-h-screen bg-surface px-4 pt-20 pb-28 flex flex-col max-w-lg mx-auto">
      {/* Top Banner */}
      <div className="bg-surface-container-low rounded-2xl p-4 shadow-xs border border-surface-container mb-5 flex items-center justify-between">
        <div className="flex flex-col min-w-0">
          <div className="flex items-center gap-1.5 text-primary text-xs font-semibold uppercase tracking-wider mb-0.5">
            <span className="material-symbols-outlined text-sm">auto_stories</span>
            <span>Daily Storybook • यादों की डायरी</span>
          </div>
          <h1 className="font-patient-title text-2xl text-on-surface font-bold">
            आज का प्यारा दिन
          </h1>
          <p className="font-patient-body-md text-sm text-on-surface-variant">
            A soothing visual timeline of Dadaji's day
          </p>
        </div>

        <button
          className="w-12 h-12 rounded-2xl bg-primary text-on-primary flex items-center justify-center shrink-0 shadow-sm active:scale-95 transition-all"
          onClick={() => onNavigate('life-story-repository')}
          title="Add Memory"
          type="button"
        >
          <span className="material-symbols-outlined text-2xl">add_photo_alternate</span>
        </button>
      </div>

      {/* Master Audio Story Player Card */}
      <div className="rounded-3xl bg-surface-container-lowest p-5 shadow-sm border border-primary/20 mb-6 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>
              headphones
            </span>
            <span className="font-headline-sm text-base text-on-surface font-bold">
              Listen to Today’s Story Recap
            </span>
          </div>
          <span className="font-label-sm text-xs bg-primary-fixed text-on-primary-fixed px-2.5 py-1 rounded-full font-bold">
            Audio Story • 2:15
          </span>
        </div>

        <p className="font-body-md text-xs text-on-surface-variant leading-relaxed">
          Narrated lovingly in Daughter Priya’s gentle voice to ease evening disorientation and comfort Dadaji.
        </p>

        {/* Progress Bar & Play Button */}
        <div className="flex items-center gap-3 pt-1">
          <button
            className="w-14 h-14 rounded-full bg-primary text-on-primary flex items-center justify-center shadow-md active:scale-95 transition-transform shrink-0"
            onClick={toggleMasterStory}
            type="button"
          >
            <span className="material-symbols-outlined text-3xl">
              {isPlayingMaster ? 'pause' : 'play_arrow'}
            </span>
          </button>

          <div className="flex-1 flex flex-col gap-1.5">
            <div className="h-2 w-full bg-surface-container rounded-full overflow-hidden">
              <div
                className={`h-full bg-primary rounded-full transition-all duration-300 ${
                  isPlayingMaster ? 'w-3/4 animate-pulse' : 'w-1/4'
                }`}
              ></div>
            </div>
            <div className="flex justify-between text-[11px] text-outline font-medium">
              <span>{isPlayingMaster ? '1:45' : '0:35'}</span>
              <span>2:15</span>
            </div>
          </div>
        </div>
      </div>

      {/* Chronological Timeline Activities */}
      <div className="flex flex-col gap-4">
        {activities.map((item, idx) => (
          <div
            key={idx}
            className="rounded-3xl bg-surface-container-lowest p-4 shadow-xs border border-surface-container flex flex-col gap-3 hover:border-primary/40 transition-all"
          >
            <div className="relative aspect-[16/9] w-full rounded-2xl overflow-hidden bg-surface-container">
              <img src={item.photo} alt={item.title} className="w-full h-full object-cover" />
              <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-white text-xs font-semibold flex items-center gap-1.5">
                <span className="material-symbols-outlined text-sm text-tertiary-fixed">schedule</span>
                <span>{item.time}</span>
              </div>
            </div>

            <div className="flex items-start justify-between gap-2">
              <div className="flex flex-col">
                <h3 className="font-headline-sm text-base text-on-surface font-bold leading-snug">
                  {item.title}
                </h3>
                <span className="font-patient-label text-xs text-primary font-semibold mt-0.5">
                  {item.titleHindi}
                </span>
                <p className="font-body-md text-xs text-on-surface-variant mt-1 leading-relaxed">
                  {item.desc}
                </p>
              </div>

              <button
                className="w-11 h-11 rounded-2xl bg-surface-container text-primary flex items-center justify-center shrink-0 shadow-xs active:scale-95 hover:bg-primary-fixed transition-all"
                onClick={() => {
                  playChime('gentle');
                  speakMessage(item.audioText, 'hi-IN', 0.85);
                }}
                type="button"
              >
                <span className="material-symbols-outlined text-xl">volume_up</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Button to open Archive Repository */}
      <div className="mt-6">
        <button
          className="w-full h-14 rounded-2xl bg-surface-container-high text-on-surface font-patient-label text-base font-bold flex items-center justify-center gap-2 shadow-xs hover:bg-primary-fixed active:scale-[0.98] transition-all"
          onClick={() => {
            playChime('confirm');
            onNavigate('life-story-repository');
          }}
          type="button"
        >
          <span className="material-symbols-outlined text-xl text-primary">auto_awesome</span>
          <span>Explore Dadaji's Archival Life Story (1968 - 2024)</span>
        </button>
      </div>
    </div>
  );
};
