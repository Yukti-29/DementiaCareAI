import React, { useState } from 'react';
import { ScreenId, LanguageCode, TextSize, VoiceTone } from './types';
import { Header, BottomNav } from './components/Navigation';
import { RoleSelectionScreen } from './components/screens/RoleSelectionScreen';
import { PatientUnlockScreen } from './components/screens/PatientUnlockScreen';
import { CompanionHomeScreen } from './components/screens/CompanionHomeScreen';
import { MitraVoiceScreen } from './components/screens/MitraVoiceScreen';
import { MemoryAssessmentScreen } from './components/screens/MemoryAssessmentScreen';
import { FamilyConnectScreen } from './components/screens/FamilyConnectScreen';
import { MemoryStorybookScreen } from './components/screens/MemoryStorybookScreen';
import { CaregiverLoginScreen } from './components/screens/CaregiverLoginScreen';
import { CaregiverHubScreen } from './components/screens/CaregiverHubScreen';
import { LifeStoryRepositoryScreen } from './components/screens/LifeStoryRepositoryScreen';
import { AccessibilitySettingsScreen } from './components/screens/AccessibilitySettingsScreen';
import { playChime } from './utils/audio';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<ScreenId>('role-selection');
  const [userRole, setUserRole] = useState<'patient' | 'caregiver'>('patient');
  const [patientName, setPatientName] = useState<string>('Dadaji Ramesh');
  const [language, setLanguage] = useState<LanguageCode>('hi');
  const [textSize, setTextSize] = useState<TextSize>('large');
  const [voiceTone, setVoiceTone] = useState<VoiceTone>('daughter');
  const [volume, setVolume] = useState<number>(85);
  const [showScreenSwitcher, setShowScreenSwitcher] = useState<boolean>(false);

  const handleNavigate = (screen: ScreenId) => {
    setCurrentScreen(screen);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getSubTitle = () => {
    switch (currentScreen) {
      case 'companion-home':
        return 'Companion Home';
      case 'mitra-voice':
        return 'Mitra Voice';
      case 'memory-assessment':
        return 'Cognitive Game';
      case 'family-connect':
        return 'Family Connect';
      case 'memory-storybook':
        return 'Memory Storybook';
      case 'caregiver-hub':
        return 'Guardian Hub';
      case 'life-story-repository':
        return 'Life Story Archive';
      case 'accessibility-settings':
        return 'Accessibility';
      case 'patient-unlock':
        return 'Welcome Home';
      case 'caregiver-login':
        return 'Caregiver Portal';
      default:
        return 'Welcome';
    }
  };

  const showHeader = currentScreen !== 'role-selection';
  const showBottomNav =
    currentScreen !== 'role-selection' &&
    currentScreen !== 'patient-unlock' &&
    currentScreen !== 'caregiver-login';

  return (
    <div
      className={`min-h-screen bg-surface text-on-surface flex flex-col relative selection:bg-primary-fixed selection:text-on-primary-fixed ${
        textSize === 'giant'
          ? 'text-[1.125rem] leading-relaxed'
          : textSize === 'extra'
          ? 'text-[1.025rem] leading-relaxed'
          : 'text-[0.95rem] sm:text-base leading-normal'
      }`}
    >
      {/* Top Universal Header */}
      {showHeader && (
        <Header
          currentScreen={currentScreen}
          onNavigate={handleNavigate}
          subTitle={getSubTitle()}
          showBackButton={currentScreen !== 'companion-home' && currentScreen !== 'caregiver-hub'}
          onBack={() => {
            if (currentScreen === 'mitra-voice' || currentScreen === 'memory-assessment') {
              handleNavigate('companion-home');
            } else if (currentScreen === 'life-story-repository') {
              handleNavigate('caregiver-hub');
            } else {
              handleNavigate('role-selection');
            }
          }}
          userRole={userRole}
        />
      )}

      {/* Main View Router */}
      <main className="flex-1 flex flex-col w-full">
        {currentScreen === 'role-selection' && (
          <RoleSelectionScreen
            onNavigate={handleNavigate}
            onSelectRole={(role) => setUserRole(role)}
          />
        )}

        {currentScreen === 'patient-unlock' && (
          <PatientUnlockScreen
            onNavigate={handleNavigate}
            onSelectUser={(name) => setPatientName(name)}
          />
        )}

        {currentScreen === 'companion-home' && (
          <CompanionHomeScreen onNavigate={handleNavigate} />
        )}

        {currentScreen === 'mitra-voice' && (
          <MitraVoiceScreen onNavigate={handleNavigate} />
        )}

        {currentScreen === 'memory-assessment' && (
          <MemoryAssessmentScreen onNavigate={handleNavigate} />
        )}

        {currentScreen === 'family-connect' && (
          <FamilyConnectScreen onNavigate={handleNavigate} />
        )}

        {currentScreen === 'memory-storybook' && (
          <MemoryStorybookScreen onNavigate={handleNavigate} />
        )}

        {currentScreen === 'caregiver-login' && (
          <CaregiverLoginScreen
            onNavigate={handleNavigate}
            onLoginSuccess={() => setUserRole('caregiver')}
          />
        )}

        {currentScreen === 'caregiver-hub' && (
          <CaregiverHubScreen onNavigate={handleNavigate} />
        )}

        {currentScreen === 'life-story-repository' && (
          <LifeStoryRepositoryScreen onNavigate={handleNavigate} />
        )}

        {currentScreen === 'accessibility-settings' && (
          <AccessibilitySettingsScreen
            onNavigate={handleNavigate}
            textSize={textSize}
            onTextSizeChange={setTextSize}
            language={language}
            onLanguageChange={setLanguage}
            voiceTone={voiceTone}
            onVoiceToneChange={setVoiceTone}
            volume={volume}
            onVolumeChange={setVolume}
          />
        )}
      </main>

      {/* Bottom Floating Navigation Bar */}
      {showBottomNav && (
        <BottomNav currentScreen={currentScreen} onNavigate={handleNavigate} />
      )}

      {/* Floating Screen Explorer for Complete User Discovery */}
      <div className="fixed bottom-22 right-4 z-40">
        <button
          onClick={() => {
            playChime('gentle');
            setShowScreenSwitcher(!showScreenSwitcher);
          }}
          className="h-10 px-3.5 rounded-full bg-inverse-surface/90 text-inverse-on-surface shadow-lg backdrop-blur-md text-xs font-semibold flex items-center gap-2 hover:scale-105 active:scale-95 transition-all"
          type="button"
          aria-label="Toggle Screen Switcher"
        >
          <span className="material-symbols-outlined text-base text-primary-fixed">apps</span>
          <span>Screens ({currentScreen})</span>
        </button>

        {showScreenSwitcher && (
          <div className="absolute bottom-12 right-0 w-72 bg-surface-container-lowest rounded-3xl p-4 shadow-2xl border border-surface-container flex flex-col gap-1.5 animate-in fade-in zoom-in-95 duration-150 z-50 text-xs">
            <div className="flex items-center justify-between pb-2 mb-1 border-b border-surface-container">
              <span className="font-bold text-primary flex items-center gap-1">
                <span className="material-symbols-outlined text-sm">view_carousel</span>
                All 10 App Screens
              </span>
              <button
                onClick={() => setShowScreenSwitcher(false)}
                className="w-6 h-6 rounded-full bg-surface-container flex items-center justify-center text-outline"
                type="button"
              >
                ✕
              </button>
            </div>

            <div className="max-h-80 overflow-y-auto flex flex-col gap-1 pr-1">
              {[
                { id: 'role-selection', label: '1. Role Selection (Landing)' },
                { id: 'patient-unlock', label: '2. Patient Unlock (Face & PIN)' },
                { id: 'companion-home', label: '3. Companion Daily Home' },
                { id: 'mitra-voice', label: '4. Mitra Voice Companion' },
                { id: 'memory-assessment', label: '5. Reminiscence Quiz (Diwali 2022)' },
                { id: 'family-connect', label: '6. Family Voice Connect' },
                { id: 'memory-storybook', label: '7. Memory Storybook (Day Recap)' },
                { id: 'caregiver-login', label: '8. Caregiver Login / Sync' },
                { id: 'caregiver-hub', label: '9. Caregiver Guardian Hub' },
                { id: 'life-story-repository', label: '10. Archival Life Story (1968-)' },
                { id: 'accessibility-settings', label: '11. Accessibility & Audio' },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    playChime('gentle');
                    handleNavigate(item.id as ScreenId);
                    setShowScreenSwitcher(false);
                  }}
                  className={`px-3 py-2 rounded-xl text-left font-medium transition-all ${
                    currentScreen === item.id
                      ? 'bg-primary text-on-primary font-bold shadow-xs'
                      : 'bg-surface-container-low text-on-surface hover:bg-surface-container'
                  }`}
                  type="button"
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
