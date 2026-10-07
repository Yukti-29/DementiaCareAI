export type ScreenId =
  | 'role-selection'
  | 'patient-unlock'
  | 'companion-home'
  | 'mitra-voice'
  | 'memory-assessment'
  | 'family-connect'
  | 'memory-storybook'
  | 'caregiver-login'
  | 'caregiver-hub'
  | 'life-story-repository'
  | 'accessibility-settings';

export type LanguageCode = 'en' | 'hi' | 'ta' | 'bn' | 'mr';
export type TextSize = 'large' | 'extra' | 'giant';
export type VoiceTone = 'daughter' | 'monk';

export interface FamilyMember {
  id: string;
  name: string;
  nameHindi: string;
  relation: string;
  relationHindi: string;
  status: string;
  photoUrl: string;
  snippet: string;
  audioVoiceText: string;
  callLabel: string;
  themeColor: 'primary' | 'secondary' | 'tertiary';
}

export interface MemoryMilestone {
  id: string;
  year: string;
  category: string;
  title: string;
  location: string;
  photoUrl: string;
  description: string;
  mediaTags: string[];
  recallRate?: string;
  audioNote?: {
    title: string;
    duration: string;
    speaker: string;
  };
}
