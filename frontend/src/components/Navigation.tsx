import React from 'react';
import { ScreenId } from '../types';
import { ASSETS } from '../data/mockData';
import { playChime } from '../utils/audio';

interface NavigationProps {
  currentScreen: ScreenId;
  onNavigate: (screen: ScreenId) => void;
  subTitle?: string;
  showBackButton?: boolean;
  onBack?: () => void;
  userRole?: 'patient' | 'caregiver';
}

export const Header: React.FC<NavigationProps> = ({
  subTitle = 'Companion Home',
  showBackButton,
  onBack,
  onNavigate,
}) => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 pt-safe bg-surface/85 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)] border-b border-surface-container">
      <div className="max-w-2xl mx-auto h-16 px-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {showBackButton ? (
            <button
              aria-label="Go Back"
              className="w-10 h-10 rounded-full flex items-center justify-center text-primary bg-surface-container hover:bg-surface-container-high transition-colors active:scale-95"
              onClick={() => {
                playChime('gentle');
                if (onBack) onBack();
              }}
              type="button"
            >
              <span className="material-symbols-outlined text-[24px]">arrow_back</span>
            </button>
          ) : null}

          <div
            className="flex items-center gap-2.5 cursor-pointer"
            onClick={() => {
              playChime('gentle');
              onNavigate('role-selection');
            }}
          >
            <img
              alt="MemoryCare Logo"
              className="h-8 w-auto object-contain"
              src={ASSETS.logo}
            />
            <div className="flex flex-col min-w-0">
              <span className="font-headline-sm text-base sm:text-lg text-primary tracking-tight leading-snug">
                Sanjeevani
              </span>
              <span className="font-label-sm text-xs text-on-surface-variant flex items-center gap-1 leading-snug truncate max-w-[130px] sm:max-w-none">
                <span className="w-1.5 h-1.5 rounded-full bg-primary inline-block shrink-0"></span>
                <span className="truncate">{subTitle}</span>
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            aria-label="Companion Status"
            className="h-9 px-2.5 sm:px-3 rounded-full bg-surface-container flex items-center gap-1.5 active:scale-95 transition-all text-on-surface-variant hover:text-on-surface"
            onClick={() => {
              playChime('gentle');
              onNavigate('accessibility-settings');
            }}
            type="button"
          >
            <span className="material-symbols-outlined text-primary text-[18px]">nature_people</span>
            <span className="font-label-sm text-xs hidden sm:inline pr-0.5">Tulsi Guard</span>
          </button>

          <button
            aria-label="User Profile"
            className="relative flex items-center justify-center p-0.5 rounded-full hover:ring-2 hover:ring-primary/20 transition-all"
            onClick={() => {
              playChime('gentle');
              onNavigate('accessibility-settings');
            }}
            type="button"
          >
            <img
              alt="Profile"
              className="w-8 h-8 rounded-full object-cover ring-1 ring-surface-container-high"
              src={ASSETS.dadajiAvatar}
            />
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-primary rounded-full ring-2 ring-surface"></span>
          </button>
        </div>
      </div>
    </header>
  );
};

export const BottomNav: React.FC<NavigationProps> = ({ currentScreen, onNavigate }) => {
  const tabs: { id: ScreenId; label: string; icon: string }[] = [
    { id: 'companion-home', label: 'Routine', icon: 'spa' },
    { id: 'memory-storybook', label: 'Memories', icon: 'photo_album' },
    { id: 'family-connect', label: 'Family', icon: 'diversity_1' },
    { id: 'caregiver-hub', label: 'Guardian', icon: 'monitoring' },
    { id: 'accessibility-settings', label: 'Wellness', icon: 'medication' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 pb-safe bg-surface/90 backdrop-blur-xl shadow-[0_-2px_16px_rgba(30,38,36,0.06)] border-t border-surface-container">
      <div className="max-w-2xl mx-auto flex justify-around items-center h-20 px-1 sm:px-2">
        {tabs.map((tab) => {
          const isActive =
            currentScreen === tab.id ||
            (tab.id === 'companion-home' && currentScreen === 'mitra-voice') ||
            (tab.id === 'memory-storybook' && currentScreen === 'memory-assessment') ||
            (tab.id === 'caregiver-hub' && currentScreen === 'life-story-repository');

          return (
            <button
              key={tab.id}
              className={`flex flex-col items-center justify-center gap-1 min-w-[56px] sm:min-w-[64px] min-h-[52px] py-1.5 px-1 rounded-xl transition-all ${
                isActive
                  ? 'text-primary bg-surface-container font-bold shadow-xs'
                  : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low'
              }`}
              onClick={() => {
                playChime('gentle');
                onNavigate(tab.id);
              }}
              type="button"
            >
              <span className="material-symbols-outlined text-[22px] sm:text-[24px]" style={{ fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}>
                {tab.icon}
              </span>
              <span className="font-label-sm text-[10px] sm:text-[11px] leading-tight whitespace-nowrap">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
