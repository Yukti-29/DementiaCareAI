import React, { useState } from 'react';
import { ScreenId, FamilyMember } from '../../types';
import { FAMILY_MEMBERS } from '../../data/mockData';
import { playChime, speakMessage, stopSpeech } from '../../utils/audio';

interface FamilyConnectProps {
  onNavigate: (screen: ScreenId) => void;
}

export const FamilyConnectScreen: React.FC<FamilyConnectProps> = ({ onNavigate }) => {
  const [activeCall, setActiveCall] = useState<FamilyMember | null>(null);
  const [activeAudioId, setActiveAudioId] = useState<string | null>(null);

  const handlePlayVoice = (member: FamilyMember) => {
    if (activeAudioId === member.id) {
      stopSpeech();
      setActiveAudioId(null);
    } else {
      playChime('gentle');
      setActiveAudioId(member.id);
      speakMessage(member.audioVoiceText, 'hi-IN', 0.85);
      setTimeout(() => {
        setActiveAudioId(null);
      }, 7000);
    }
  };

  const startCall = (member: FamilyMember) => {
    playChime('bell');
    setActiveCall(member);
    speakMessage(`Calling ${member.name}. कृपया प्रतीक्षा करें।`, 'hi-IN', 0.85);
  };

  const endCall = () => {
    playChime('gentle');
    stopSpeech();
    setActiveCall(null);
  };

  return (
    <div className="w-full min-h-screen bg-surface px-4 pt-20 pb-28 flex flex-col max-w-lg mx-auto">
      {/* Header Banner */}
      <div className="bg-surface-container-low rounded-2xl p-4 shadow-xs border border-surface-container mb-5 flex items-center justify-between">
        <div className="flex flex-col min-w-0">
          <div className="flex items-center gap-1.5 text-primary text-xs font-semibold uppercase tracking-wider mb-0.5">
            <span className="material-symbols-outlined text-sm">diversity_1</span>
            <span>अपनों की आवाज़ • Family Connect</span>
          </div>
          <h1 className="font-patient-title text-2xl text-on-surface font-bold">
            मेरे अपने • My Loved Ones
          </h1>
          <p className="font-patient-body-md text-sm text-on-surface-variant">
            Touch to hear their warm voice or call with 1 tap
          </p>
        </div>

        <div className="w-12 h-12 rounded-2xl bg-secondary-container text-on-secondary-container flex items-center justify-center shrink-0 shadow-xs">
          <span className="material-symbols-outlined text-2xl">call</span>
        </div>
      </div>

      {/* Family Members List */}
      <div className="flex flex-col gap-4">
        {FAMILY_MEMBERS.map((member) => (
          <div
            key={member.id}
            className="rounded-3xl bg-surface-container-lowest p-5 shadow-sm border border-surface-container flex flex-col gap-3.5 transition-all hover:border-primary/40"
          >
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3.5 min-w-0">
                <div className="relative w-16 h-16 rounded-full overflow-hidden shrink-0 ring-2 ring-primary/20">
                  <img src={member.photoUrl} alt={member.name} className="w-full h-full object-cover" />
                  <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-primary rounded-full ring-2 ring-white"></span>
                </div>
                <div className="flex flex-col min-w-0">
                  <div className="flex items-center gap-2">
                    <h2 className="font-patient-label text-xl text-on-surface font-bold truncate">
                      {member.name}
                    </h2>
                    <span className="font-label-sm text-xs text-primary font-semibold">
                      ({member.nameHindi})
                    </span>
                  </div>
                  <span className="font-body-md text-xs text-on-surface-variant">
                    {member.relation} • {member.relationHindi} • {member.status}
                  </span>
                </div>
              </div>

              {/* Voice Hug Audio Preview Button */}
              <button
                className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-xs transition-transform active:scale-95 shrink-0 ${
                  activeAudioId === member.id
                    ? 'bg-primary text-on-primary animate-pulse'
                    : 'bg-surface-container text-primary hover:bg-surface-container-high'
                }`}
                onClick={() => handlePlayVoice(member)}
                title="Hear voice note"
                type="button"
              >
                <span className="material-symbols-outlined text-2xl">
                  {activeAudioId === member.id ? 'pause' : 'volume_up'}
                </span>
              </button>
            </div>

            {/* Audio Snippet Quote */}
            <div className="p-3 bg-surface-container-low rounded-2xl flex items-center gap-2 text-xs text-on-surface-variant italic">
              <span className="material-symbols-outlined text-sm text-primary shrink-0">record_voice_over</span>
              <span className="truncate">{member.snippet}</span>
            </div>

            {/* Giant 1-Tap Call Action */}
            <button
              className="w-full h-14 rounded-2xl bg-primary text-on-primary font-patient-label text-base font-bold flex items-center justify-center gap-2 shadow-sm hover:bg-primary-container active:scale-[0.98] transition-all cursor-pointer"
              onClick={() => startCall(member)}
              type="button"
            >
              <span className="material-symbols-outlined text-2xl">call</span>
              <span>{member.callLabel}</span>
            </button>
          </div>
        ))}
      </div>

      {/* Simulated Active Call Modal */}
      {activeCall && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-6">
          <div className="bg-surface-container-lowest rounded-3xl p-6 shadow-2xl flex flex-col items-center text-center max-w-sm w-full animate-in zoom-in-95 duration-200">
            <div className="relative w-28 h-28 rounded-full overflow-hidden ring-4 ring-primary/30 mb-4 shadow-md">
              <img src={activeCall.photoUrl} alt={activeCall.name} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-primary/10 animate-pulse"></div>
            </div>

            <span className="font-label-sm text-xs text-primary uppercase font-bold tracking-wider mb-1">
              Calling Now • घंटी बज रही है...
            </span>
            <h3 className="font-headline-md text-2xl text-on-surface font-bold">
              {activeCall.name} ({activeCall.nameHindi})
            </h3>
            <p className="font-body-md text-sm text-on-surface-variant mt-0.5">
              {activeCall.relation} • {activeCall.relationHindi}
            </p>

            <div className="flex items-center gap-3 my-6">
              <button
                className="w-14 h-14 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant hover:text-primary transition-colors"
                type="button"
              >
                <span className="material-symbols-outlined text-2xl">volume_up</span>
              </button>
              <button
                className="w-14 h-14 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant hover:text-primary transition-colors"
                type="button"
              >
                <span className="material-symbols-outlined text-2xl">mic</span>
              </button>
              <button
                className="w-14 h-14 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant hover:text-primary transition-colors"
                type="button"
              >
                <span className="material-symbols-outlined text-2xl">videocam</span>
              </button>
            </div>

            <button
              className="w-full h-14 rounded-2xl bg-error text-on-error font-patient-label text-base font-bold flex items-center justify-center gap-2 shadow-md active:scale-95 transition-all"
              onClick={endCall}
              type="button"
            >
              <span className="material-symbols-outlined text-2xl">call_end</span>
              <span>End Call • कॉल समाप्त करें</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
