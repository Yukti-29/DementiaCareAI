import React, { useState, useEffect, useRef } from 'react';
import { ScreenId } from '../../types';
import { ASSETS } from '../../data/mockData';
import {
  playChime,
  playTanpuraDrone,
  stopTanpuraDrone,
  speakMessage,
  stopSpeech,
  isSpeechRecognitionSupported,
} from '../../utils/audio';

interface MitraVoiceScreenProps {
  onNavigate: (screen: ScreenId) => void;
}

interface MessageTurn {
  id: string;
  sender: 'user' | 'mitra';
  text: string;
  hindiText?: string;
  timestamp: string;
  isTyped?: boolean;
}

export const MitraVoiceScreen: React.FC<MitraVoiceScreenProps> = ({ onNavigate }) => {
  // Mode: 'voice' (tactile orb + spoken assistant) vs 'type' (dedicated typing area & conversational messenger)
  const [activeTab, setActiveTab] = useState<'voice' | 'type'>('voice');

  // Voice & Assistant State Lifecycle
  const [status, setStatus] = useState<'idle' | 'listening' | 'thinking' | 'speaking'>('idle');
  const [isSlow, setIsSlow] = useState<boolean>(false);
  const [handsFree, setHandsFree] = useState<boolean>(true); // Auto-listen after Mitra speaks in voice mode
  const [speakTypedReplies, setSpeakTypedReplies] = useState<boolean>(true); // Read aloud replies when typing
  const [isPlayingBhajan, setIsPlayingBhajan] = useState<boolean>(false);

  // Active dialogue and live transcripts
  const [activeDialogue, setActiveDialogue] = useState<string>(
    '“Namaste Ramesh ji! I am Mitra, your companion. How did you sleep? Would you like your morning Bhajan, or shall we chat about Aarav?”'
  );
  const [activeDialogueHindi, setActiveDialogueHindi] = useState<string>(
    'नमस्ते रमेश जी! मैं मित्र हूँ, आपका साथी। क्या आप सुबह का भजन सुनना चाहेंगे, या आरव के बारे में बात करें?'
  );
  const [liveUserTranscript, setLiveUserTranscript] = useState<string>('');
  const [activeAction, setActiveAction] = useState<string | null>(null);

  // Dialogue History
  const [conversation, setConversation] = useState<MessageTurn[]>([
    {
      id: 'init-1',
      sender: 'mitra',
      text: 'Namaste Ramesh ji! I am Mitra, your companion. How did you sleep? Would you like your morning Bhajan, or shall we chat about Aarav?',
      hindiText: 'नमस्ते रमेश जी! मैं मित्र हूँ। क्या आप सुबह का भजन सुनना चाहेंगे, या आरव की बात करें?',
      timestamp: 'Just now',
    },
  ]);

  // Typing Input State
  const [textInputValue, setTextInputValue] = useState<string>('');
  const [micPermissionDenied, setMicPermissionDenied] = useState<boolean>(false);
  const [micVolume, setMicVolume] = useState<number>(0);

  // References
  const recognitionRef = useRef<any>(null);
  const isListeningRef = useRef<boolean>(false);
  const handsFreeRef = useRef<boolean>(handsFree);
  const isSlowRef = useRef<boolean>(isSlow);
  const speakTypedRef = useRef<boolean>(speakTypedReplies);
  const activeTabRef = useRef<'voice' | 'type'>(activeTab);
  const chatBottomRef = useRef<HTMLDivElement>(null);
  const textInputRef = useRef<HTMLTextAreaElement | HTMLInputElement>(null);

  const mediaStreamRef = useRef<MediaStream | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const liveUserTranscriptRef = useRef<string>('');

  handsFreeRef.current = handsFree;
  isSlowRef.current = isSlow;
  speakTypedRef.current = speakTypedReplies;
  activeTabRef.current = activeTab;

  // Auto-scroll chat in type mode
  useEffect(() => {
    if (activeTab === 'type' && chatBottomRef.current) {
      chatBottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [conversation, activeTab, status]);

  // Clean up media streams and audio context
  const stopListeningAndCleanMedia = () => {
    isListeningRef.current = false;

    if (recognitionRef.current) {
      try {
        recognitionRef.current.onend = null;
        recognitionRef.current.onerror = null;
        recognitionRef.current.onresult = null;
        recognitionRef.current.stop();
      } catch {
        // ignore
      }
      recognitionRef.current = null;
    }

    if (mediaStreamRef.current) {
      try {
        mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      } catch {
        // ignore
      }
      mediaStreamRef.current = null;
    }

    if (audioCtxRef.current) {
      try {
        audioCtxRef.current.close();
      } catch {
        // ignore
      }
      audioCtxRef.current = null;
    }

    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = null;
    }

    setMicVolume(0);
  };

  // Clean up speech and audio on unmount
  useEffect(() => {
    return () => {
      stopSpeech();
      stopTanpuraDrone();
      stopListeningAndCleanMedia();
    };
  }, []);

  // Initialize Speech Recognition & Real-Time Audio Capture
  const startListening = async () => {
    stopSpeech();
    stopTanpuraDrone();
    setIsPlayingBhajan(false);

    // Provide IMMEDIATE state feedback so the elder and user see the button respond
    setStatus('listening');
    isListeningRef.current = true;
    setLiveUserTranscript('');
    liveUserTranscriptRef.current = '';
    playChime('gentle');

    // 1. Request microphone stream for visual volume feedback
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        mediaStreamRef.current = stream;

        const AudioCtxClass = window.AudioContext || (window as any).webkitAudioContext;
        if (AudioCtxClass) {
          const ctx = new AudioCtxClass();
          audioCtxRef.current = ctx;
          const src = ctx.createMediaStreamSource(stream);
          const analyser = ctx.createAnalyser();
          analyser.fftSize = 64;
          src.connect(analyser);
          analyserRef.current = analyser;

          const dataArray = new Uint8Array(analyser.frequencyBinCount);
          const updateVolume = () => {
            if (!isListeningRef.current) return;
            analyser.getByteFrequencyData(dataArray);
            let sum = 0;
            for (let i = 0; i < dataArray.length; i++) {
              sum += dataArray[i];
            }
            const avg = sum / dataArray.length;
            setMicVolume(Math.min(1, avg / 45));
            animFrameRef.current = requestAnimationFrame(updateVolume);
          };
          updateVolume();
        }
      } catch {
        // Microphone access denied or blocked by iframe
        setMicPermissionDenied(true);
      }
    }

    // 2. Initialize Speech Recognition
    const SpeechRecognitionClass =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognitionClass) {
      setMicPermissionDenied(true);
      return;
    }

    try {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch {
          // ignore
        }
      }

      const recognition = new SpeechRecognitionClass();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-IN';
      recognition.maxAlternatives = 1;

      recognition.onstart = () => {
        isListeningRef.current = true;
        setStatus('listening');
      };

      recognition.onresult = (event: any) => {
        let interim = '';
        let final = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            final += event.results[i][0].transcript;
          } else {
            interim += event.results[i][0].transcript;
          }
        }

        const currentText = (final || interim || '').trim();
        if (currentText) {
          setLiveUserTranscript(currentText);
          liveUserTranscriptRef.current = currentText;
        }
      };

      recognition.onerror = (event: any) => {
        if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
          setMicPermissionDenied(true);
        }
        // Do not abruptly drop the listening status to avoid confusing Dadaji
      };

      recognition.onend = () => {
        // If still listening and recognition ended on pause, stay ready
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch {
      // Speech recognition start error caught
    }
  };

  const stopListening = () => {
    stopListeningAndCleanMedia();
    setStatus('idle');
  };

  // Central submission handler for both Spoken Voice and Typed Messages
  const handleUserSubmit = async (queryText: string, source: 'voice' | 'type') => {
    if (!queryText || !queryText.trim()) return;

    stopListeningAndCleanMedia();
    setStatus('thinking');
    playChime('confirm');

    // Add user turn to conversation history
    const userTurn: MessageTurn = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: queryText.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isTyped: source === 'type',
    };
    setConversation((prev) => [...prev, userTurn]);

    try {
      const historyPayload = conversation.slice(-6).map((turn) => ({
        role: turn.sender === 'user' ? 'user' : 'model',
        parts: [{ text: turn.text }],
      }));

      const response = await fetch('/api/mitra/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: queryText.trim(),
          history: historyPayload,
          language: 'en',
        }),
      });

      if (!response.ok) {
        throw new Error(`Server returned ${response.status}`);
      }

      const data = await response.json();
      const reply = data.reply || 'Namaste Ramesh ji. I am listening with love. Tell me more.';
      const hindi = data.hindiTranslation || 'नमस्ते रमेश जी। मैं स्नेह से सुन रहा हूँ।';
      const action = data.suggestedAction || 'none';

      setActiveDialogue(reply);
      setActiveDialogueHindi(hindi);
      setActiveAction(action);

      const mitraTurn: MessageTurn = {
        id: `mitra-${Date.now()}`,
        sender: 'mitra',
        text: reply,
        hindiText: hindi,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setConversation((prev) => [...prev, mitraTurn]);

      if (action === 'play_bhajan') {
        setIsPlayingBhajan(true);
        playTanpuraDrone(18, () => setIsPlayingBhajan(false));
      }

      // Determine whether to speak aloud based on source and settings
      const shouldSpeak = source === 'voice' || speakTypedRef.current;

      if (shouldSpeak) {
        setStatus('speaking');
        speakMessage(
          reply,
          'en-IN',
          isSlowRef.current ? 0.72 : 0.85,
          () => setStatus('speaking'),
          () => {
            setStatus('idle');
            // Auto-listen only in voice mode when hands-free is enabled
            if (handsFreeRef.current && activeTabRef.current === 'voice') {
              setTimeout(() => {
                startListening();
              }, 600);
            }
          },
          () => setStatus('idle')
        );
      } else {
        setStatus('idle');
      }
    } catch {
      const fallbackReply =
        'Ramesh ji, you are safe at home and everything is peaceful. I am right here beside you.';
      const fallbackHindi = 'रमेश जी, आप घर पर सुरक्षित हैं और सब शांत है। मैं आपके साथ हूँ।';

      setActiveDialogue(fallbackReply);
      setActiveDialogueHindi(fallbackHindi);

      setStatus('speaking');
      speakMessage(
        fallbackReply,
        'en-IN',
        isSlowRef.current ? 0.72 : 0.85,
        () => setStatus('speaking'),
        () => setStatus('idle'),
        () => setStatus('idle')
      );
    }
  };

  // Main Mic Toggle Button Handler
  const handleMainMicClick = () => {
    if (status === 'speaking') {
      // Interrupt Mitra and start listening to user immediately!
      playChime('gentle');
      stopSpeech();
      stopTanpuraDrone();
      setIsPlayingBhajan(false);
      startListening();
    } else if (status === 'listening') {
      // User tapped "Tap to Send" or is done speaking
      const transcript = (liveUserTranscriptRef.current || liveUserTranscript || '').trim();
      stopListeningAndCleanMedia();

      if (transcript) {
        handleUserSubmit(transcript, 'voice');
      } else {
        // If microphone didn't capture speech, send a respectful greeting check-in
        handleUserSubmit('Namaste Mitra, I am here listening to you.', 'voice');
      }
    } else if (status === 'thinking') {
      // Mitra is processing
    } else {
      // Start listening directly
      startListening();
    }
  };

  // Repeat dialogue aloud
  const handleRepeat = (textToRepeat?: string) => {
    playChime('gentle');
    stopSpeech();
    setStatus('speaking');
    const text = textToRepeat || activeDialogue;
    speakMessage(
      text,
      'en-IN',
      isSlow ? 0.72 : 0.85,
      () => setStatus('speaking'),
      () => setStatus('idle'),
      () => setStatus('idle')
    );
  };

  // Toggle speed
  const toggleSpeed = () => {
    playChime('gentle');
    const nextSlow = !isSlow;
    setIsSlow(nextSlow);
    speakMessage(
      nextSlow ? 'Speaking gently and slower, Dadaji.' : 'Speaking at regular pace.',
      'en-IN',
      nextSlow ? 0.72 : 0.85
    );
  };

  // Handle Quick Prompt click
  const handleQuickPrompt = (promptText: string) => {
    stopListeningAndCleanMedia();
    stopSpeech();
    stopTanpuraDrone();
    setIsPlayingBhajan(false);
    setLiveUserTranscript(promptText);
    liveUserTranscriptRef.current = promptText;
    handleUserSubmit(promptText, 'voice');
  };

  // Handle typing form submission
  const handleTypeSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!textInputValue.trim()) return;
    const toSend = textInputValue.trim();
    setTextInputValue('');
    handleUserSubmit(toSend, 'type');
  };

  // Quick suggested speech/type prompts
  const quickPrompts = [
    { label: 'Morning Bhajan', hindi: 'सुबह का भजन', text: 'Mitra, please play my morning bhajan.' },
    { label: 'About Aarav', hindi: 'आरव के बारे में', text: 'Tell me what my grandson Aarav is doing.' },
    { label: 'Where am I?', hindi: 'मैं कहाँ हूँ?', text: 'Where am I? I feel a little confused.' },
    { label: "Today's Date", hindi: 'आज की तारीख', text: 'What day and date is it today?' },
    { label: 'Call Priya', hindi: 'प्रिया से बात', text: 'Has my daughter Dr. Priya called today?' },
    { label: 'IIT Roorkee 1968', hindi: 'रुड़की की यादें', text: 'Tell me about when I built bridges in Roorkee.' },
  ];

  return (
    <div className="w-full min-h-screen bg-surface px-4 pt-20 pb-32 flex flex-col max-w-lg mx-auto select-none">
      {/* Top Mode Segmented Switcher: Voice vs Type */}
      <div className="w-full bg-surface-container p-1 rounded-2xl flex items-center mb-3 shadow-xs border border-surface-container-high">
        <button
          onClick={() => {
            playChime('gentle');
            setActiveTab('voice');
          }}
          type="button"
          className={`flex-1 py-2 px-3 rounded-xl text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 transition-all ${
            activeTab === 'voice'
              ? 'bg-surface-container-lowest text-primary shadow-xs font-bold'
              : 'text-on-surface-variant hover:text-on-surface'
          }`}
        >
          <span className="material-symbols-outlined text-[18px]">mic</span>
          <span>Voice Companion</span>
        </button>

        <button
          onClick={() => {
            playChime('gentle');
            setActiveTab('type');
            setTimeout(() => {
              textInputRef.current?.focus();
            }, 100);
          }}
          type="button"
          className={`flex-1 py-2 px-3 rounded-xl text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 transition-all ${
            activeTab === 'type'
              ? 'bg-surface-container-lowest text-primary shadow-xs font-bold'
              : 'text-on-surface-variant hover:text-on-surface'
          }`}
        >
          <span className="material-symbols-outlined text-[18px]">keyboard</span>
          <span>Type & Chat Area</span>
          {conversation.length > 1 && (
            <span className="w-4 h-4 rounded-full bg-primary/20 text-primary text-[10px] flex items-center justify-center font-bold">
              {conversation.length - 1}
            </span>
          )}
        </button>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: VOICE MODE VIEW */}
      {/* ========================================================================= */}
      {activeTab === 'voice' && (
        <div className="flex flex-col items-center justify-between gap-3.5 w-full animate-in fade-in duration-200">
          {/* Top Status & Hands-Free Pill */}
          <div className="w-full flex items-center justify-between">
            <div className="flex items-center gap-2 bg-surface-container-low px-3.5 py-1.5 rounded-full shadow-xs border border-surface-container">
              <span className="relative flex h-2.5 w-2.5">
                {status === 'listening' && (
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                )}
                {status === 'thinking' && (
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-tertiary opacity-75"></span>
                )}
                <span
                  className={`relative inline-flex rounded-full h-2.5 w-2.5 ${
                    status === 'listening'
                      ? 'bg-primary'
                      : status === 'thinking'
                      ? 'bg-tertiary'
                      : status === 'speaking'
                      ? 'bg-primary-container'
                      : 'bg-outline'
                  }`}
                ></span>
              </span>

              <span className="font-patient-label text-xs sm:text-sm text-primary font-semibold tracking-wide">
                {status === 'listening'
                  ? 'Listening gently... (मित्र सुन रहे हैं)'
                  : status === 'thinking'
                  ? 'Mitra is thinking... (सोच रहे हैं)'
                  : status === 'speaking'
                  ? 'Mitra is speaking... (बोल रहे हैं)'
                  : 'Mitra is ready (तैयार हैं)'}
              </span>
            </div>

            {/* Hands-Free Auto-Reply Toggle */}
            <button
              onClick={() => {
                playChime('gentle');
                setHandsFree(!handsFree);
              }}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 border transition-all ${
                handsFree
                  ? 'bg-primary-fixed text-on-primary-fixed border-primary/30'
                  : 'bg-surface-container text-on-surface-variant border-surface-container-high'
              }`}
              type="button"
              title="When active, Mitra automatically listens after replying like a real voice assistant"
            >
              <span className="material-symbols-outlined text-[16px]">
                {handsFree ? 'record_voice_over' : 'touch_app'}
              </span>
              <span>{handsFree ? 'Hands-Free On' : 'Tap to Talk'}</span>
            </button>
          </div>

          {/* Live User Spoken Hearing Feedback Banner (When user speaks) */}
          {status === 'listening' && (
            <div className="w-full bg-primary-fixed/40 border-2 border-primary/30 rounded-3xl p-4 flex flex-col gap-3 shadow-md animate-in fade-in duration-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
                  </span>
                  <span className="font-label-sm text-xs text-primary font-bold uppercase tracking-wider">
                    Dadaji is speaking • आपकी आवाज़
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    stopListeningAndCleanMedia();
                    setStatus('idle');
                  }}
                  className="text-xs text-on-surface-variant hover:text-error px-2.5 py-1 rounded-full bg-surface-container font-semibold transition-colors cursor-pointer"
                >
                  Cancel (रद्द करें)
                </button>
              </div>

              <div className="bg-surface-container-lowest/90 rounded-2xl p-3 border border-primary/20 min-h-[50px] flex items-center">
                <p className="font-patient-body-lg text-lg text-on-surface font-semibold leading-relaxed">
                  {liveUserTranscript || 'Listening gently... Speak in Hindi or English, Dadaji.'}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleMainMicClick}
                  className="flex-1 py-3 px-4 rounded-2xl bg-primary text-on-primary font-bold text-sm flex items-center justify-center gap-2 shadow-xs active:scale-95 transition-all cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[20px]">send</span>
                  <span>{liveUserTranscript ? 'Send to Mitra (भेजें)' : "I'm Done Speaking (पूरा हुआ)"}</span>
                </button>
              </div>
            </div>
          )}

          {/* Sacred Radiant Orb & Interactive Avatar Core */}
          <div className="relative flex items-center justify-center w-full py-2 my-1">
            <div
              className={`absolute w-64 h-64 rounded-full transition-all duration-700 pointer-events-none ${
                status === 'listening'
                  ? 'bg-primary-fixed opacity-60 scale-125 animate-pulse blur-3xl'
                  : status === 'speaking'
                  ? 'bg-tertiary-fixed opacity-50 scale-115 animate-pulse blur-2xl'
                  : status === 'thinking'
                  ? 'bg-secondary-fixed opacity-50 scale-110 blur-2xl'
                  : 'bg-surface-container opacity-30 scale-90 blur-xl'
              }`}
            ></div>

            <button
              onClick={handleMainMicClick}
              type="button"
              aria-label="Mitra Voice Interactive Avatar"
              className="relative z-10 w-44 h-44 rounded-full bg-surface-container-lowest shadow-lg flex items-center justify-center p-3 border-2 border-primary/20 hover:scale-105 active:scale-95 transition-transform cursor-pointer"
            >
              <div
                className={`w-full h-full rounded-full flex flex-col items-center justify-center shadow-inner text-center overflow-hidden transition-all duration-500 ${
                  status === 'listening'
                    ? 'bg-gradient-to-tr from-primary-fixed to-primary/20 ring-4 ring-primary/40'
                    : status === 'speaking'
                    ? 'bg-gradient-to-tr from-tertiary-fixed to-primary-fixed ring-4 ring-tertiary/40'
                    : status === 'thinking'
                    ? 'bg-gradient-to-tr from-secondary-fixed to-surface-container ring-4 ring-secondary/30'
                    : 'bg-gradient-to-tr from-surface-container to-primary-fixed/40'
                }`}
              >
                {status === 'thinking' ? (
                  <div className="flex flex-col items-center justify-center gap-1">
                    <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                    <span className="font-label-sm text-xs text-primary font-bold mt-1">
                      Thinking...
                    </span>
                  </div>
                ) : status === 'speaking' ? (
                  <div className="flex flex-col items-center justify-center">
                    <span
                      className="material-symbols-outlined text-tertiary text-5xl animate-bounce"
                      style={{ fontVariationSettings: "'FILL' 1" }}
                    >
                      volume_up
                    </span>
                    <span className="font-patient-label text-sm text-primary font-bold tracking-wider mt-1">
                      Mitra Speaking
                    </span>
                  </div>
                ) : status === 'listening' ? (
                  <div className="flex flex-col items-center justify-center">
                    <span
                      className="material-symbols-outlined text-primary text-5xl animate-pulse"
                      style={{ fontVariationSettings: "'FILL' 1" }}
                    >
                      mic
                    </span>
                    <span className="font-patient-label text-sm text-primary font-bold tracking-wider mt-1">
                      Listening...
                    </span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center">
                    <svg
                      className="w-16 h-16 text-tertiary transform transition-transform"
                      fill="currentColor"
                      viewBox="0 0 100 100"
                    >
                      <path
                        d="M50 18 C53 28, 62 38, 62 48 C62 58, 55 64, 50 66 C45 64, 38 58, 38 48 C38 38, 47 28, 50 18 Z"
                        fill="#975000"
                        opacity="0.95"
                      ></path>
                      <path
                        d="M50 30 C58 35, 72 45, 68 58 C65 67, 56 68, 50 67 C44 68, 35 67, 32 58 C28 45, 42 35, 50 30 Z"
                        fill="#743c00"
                        opacity="0.75"
                      ></path>
                      <path
                        d="M50 42 C64 45, 80 54, 73 68 C68 76, 58 75, 50 72 C42 75, 32 76, 27 68 C20 54, 36 45, 50 42 Z"
                        fill="#3f6b5c"
                        opacity="0.6"
                      ></path>
                      <path
                        d="M22 68 C28 82, 42 84, 50 84 C58 84, 72 82, 78 68 C84 82, 68 90, 50 90 C32 90, 16 82, 22 68 Z"
                        fill="#265345"
                        opacity="0.85"
                      ></path>
                    </svg>
                    <span className="font-patient-label text-sm text-primary font-bold tracking-wider mt-1">
                      Mitra • मित्र
                    </span>
                  </div>
                )}
              </div>
            </button>
          </div>

          {/* Dynamic Calming Speech Waveform */}
          <div className="w-full max-w-xs flex items-center justify-center gap-2 h-10 px-4 bg-surface-container-low rounded-full border border-surface-container">
            <span
              className="w-1.5 bg-primary rounded-full transition-all duration-75"
              style={{
                height:
                  status === 'listening'
                    ? `${Math.max(8, micVolume * 32)}px`
                    : status === 'speaking'
                    ? '24px'
                    : '8px',
              }}
            ></span>
            <span
              className="w-1.5 bg-tertiary rounded-full transition-all duration-75"
              style={{
                height:
                  status === 'listening'
                    ? `${Math.max(12, micVolume * 40)}px`
                    : status === 'speaking'
                    ? '32px'
                    : '10px',
              }}
            ></span>
            <span
              className="w-1.5 bg-primary rounded-full transition-all duration-75"
              style={{
                height:
                  status === 'listening'
                    ? `${Math.max(10, micVolume * 36)}px`
                    : status === 'speaking'
                    ? '20px'
                    : '8px',
              }}
            ></span>
            <span
              className="w-1.5 bg-primary-container rounded-full transition-all duration-75"
              style={{
                height:
                  status === 'listening'
                    ? `${Math.max(14, micVolume * 44)}px`
                    : status === 'speaking'
                    ? '28px'
                    : '12px',
              }}
            ></span>
            <span
              className="w-1.5 bg-tertiary-container rounded-full transition-all duration-75"
              style={{
                height:
                  status === 'listening'
                    ? `${Math.max(8, micVolume * 28)}px`
                    : status === 'speaking'
                    ? '16px'
                    : '8px',
              }}
            ></span>
          </div>

          {/* Ambient Bhajan Playing Card Banner */}
          {isPlayingBhajan && (
            <div className="w-full bg-tertiary-fixed/30 border border-tertiary/20 rounded-2xl p-3 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="material-symbols-outlined text-tertiary text-2xl animate-spin">
                  music_note
                </span>
                <div>
                  <span className="font-label-sm text-xs text-tertiary font-bold block">
                    Morning Bhajan Playing • सुप्रभातम भजन
                  </span>
                  <span className="font-patient-label text-xs text-on-surface">
                    Sacred Tanpura & Solfeggio 528Hz Peace
                  </span>
                </div>
              </div>
              <button
                onClick={() => {
                  stopTanpuraDrone();
                  setIsPlayingBhajan(false);
                }}
                className="px-3 py-1 bg-tertiary text-on-tertiary rounded-full text-xs font-semibold"
                type="button"
              >
                Pause
              </button>
            </div>
          )}

          {/* High Contrast Elder-Friendly Speech Dialogue Card */}
          <div className="w-full bg-surface-container-lowest rounded-3xl p-5 shadow-sm border border-surface-container flex flex-col gap-3 relative">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span
                  className="material-symbols-outlined text-primary text-[24px]"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  forum
                </span>
                <span className="font-label-md text-xs text-on-surface-variant uppercase tracking-wider">
                  Mitra speaks to Dadaji
                </span>
              </div>

              <div className="flex items-center gap-1.5">
                {status === 'speaking' && (
                  <span className="flex items-center gap-1 font-label-sm text-xs text-primary bg-primary-fixed px-2.5 py-1 rounded-full font-semibold animate-pulse">
                    <span className="material-symbols-outlined text-[14px]">volume_up</span>
                    Speaking
                  </span>
                )}
                <button
                  onClick={() => setActiveTab('type')}
                  className="text-xs text-on-surface-variant hover:text-primary flex items-center gap-0.5 px-2.5 py-1 rounded-lg bg-surface-container transition-colors"
                  type="button"
                  title="Switch to typing area"
                >
                  <span className="material-symbols-outlined text-[14px]">edit_note</span>
                  <span>Type Reply</span>
                </button>
              </div>
            </div>

            {/* Spoken Dialogue Text */}
            <p className="font-patient-body-lg text-lg sm:text-xl text-on-surface leading-relaxed text-left font-medium">
              {activeDialogue}
            </p>

            {/* Hindi Script Translation for Elder Comfort */}
            <div className="pt-2 flex items-start justify-between border-t border-surface-container-high/60 gap-2">
              <span className="font-patient-label text-sm sm:text-base text-on-surface-variant leading-relaxed">
                {activeDialogueHindi}
              </span>
              <button
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold shrink-0 flex items-center gap-1 transition-colors ${
                  isSlow ? 'bg-primary text-on-primary' : 'bg-surface-container text-on-surface-variant'
                }`}
                onClick={toggleSpeed}
                type="button"
              >
                <span className="material-symbols-outlined text-sm">speed</span>
                {isSlow ? 'Standard' : 'Speak Slower'}
              </button>
            </div>

            {/* Actionable Preview Card (Aarav, Priya, Storybook) */}
            {activeAction === 'view_family' && (
              <div className="mt-1 bg-surface-container-low rounded-2xl p-3 border border-surface-container flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <img
                    src={ASSETS.aaravGrandson}
                    alt="Aarav"
                    className="w-12 h-12 rounded-full object-cover ring-2 ring-primary/20"
                  />
                  <div>
                    <span className="font-patient-label text-sm text-on-surface font-bold block">
                      Aarav (Grandson • पोता)
                    </span>
                    <span className="font-label-sm text-xs text-on-surface-variant block">
                      Age 8 • Loves your stories
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => onNavigate('family-connect')}
                  className="px-3 py-1.5 bg-primary text-on-primary rounded-xl text-xs font-semibold"
                  type="button"
                >
                  Open Family
                </button>
              </div>
            )}

            {activeAction === 'storybook' && (
              <div className="mt-1 bg-surface-container-low rounded-2xl p-3 border border-surface-container flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <img
                    src={ASSETS.iitRoorkee1968}
                    alt="IIT Roorkee"
                    className="w-12 h-12 rounded-xl object-cover ring-1 ring-surface-container-highest"
                  />
                  <div>
                    <span className="font-patient-label text-sm text-on-surface font-bold block">
                      IIT Roorkee 1968
                    </span>
                    <span className="font-label-sm text-xs text-on-surface-variant block">
                      Yamuna Bridges archive
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => onNavigate('memory-storybook')}
                  className="px-3 py-1.5 bg-secondary text-on-secondary rounded-xl text-xs font-semibold"
                  type="button"
                >
                  View Story
                </button>
              </div>
            )}
          </div>

          {/* Quick Spoken Prompts Carousel */}
          <div className="w-full flex flex-col gap-1.5">
            <span className="font-label-sm text-xs text-on-surface-variant flex items-center gap-1 px-1">
              <span className="material-symbols-outlined text-[14px]">tips_and_updates</span>
              <span>Tap to speak or ask directly • सीधे पूछें</span>
            </span>

            <div className="w-full flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
              {quickPrompts.map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => handleQuickPrompt(item.text)}
                  className="px-3.5 py-2 bg-surface-container-lowest hover:bg-primary-fixed/30 border border-surface-container rounded-2xl shrink-0 flex flex-col items-start text-left active:scale-95 transition-all"
                  type="button"
                >
                  <span className="font-patient-label text-xs font-semibold text-primary whitespace-nowrap leading-snug">
                    {item.label}
                  </span>
                  <span className="font-label-sm text-[11px] text-on-surface-variant whitespace-nowrap leading-normal mt-0.5">
                    {item.hindi}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Oversized Tactile Microphone Controls */}
          <div className="w-full flex flex-col gap-3 pt-1">
            <button
              className={`w-full min-h-[86px] py-3 px-4 rounded-3xl shadow-lg flex items-center justify-center gap-3.5 active:scale-[0.98] transition-all select-none cursor-pointer ${
                status === 'listening'
                  ? 'bg-emerald-700 text-white ring-4 ring-emerald-400/50 animate-pulse'
                  : status === 'speaking'
                  ? 'bg-tertiary text-on-tertiary hover:opacity-95'
                  : status === 'thinking'
                  ? 'bg-surface-container-high text-on-surface opacity-80 cursor-wait'
                  : 'bg-primary text-on-primary hover:bg-primary/90'
              }`}
              onClick={handleMainMicClick}
              type="button"
            >
              <div className="w-13 h-13 sm:w-14 sm:h-14 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                <span
                  className="material-symbols-outlined text-[30px] sm:text-[34px]"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  {status === 'listening'
                    ? 'send'
                    : status === 'speaking'
                    ? 'record_voice_over'
                    : status === 'thinking'
                    ? 'hourglass_empty'
                    : 'mic'}
                </span>
              </div>
              <div className="flex flex-col items-start text-left min-w-0 flex-1">
                <span className="font-patient-title text-lg sm:text-xl tracking-normal leading-snug font-bold break-words">
                  {status === 'listening'
                    ? 'Listening... Tap to Send'
                    : status === 'speaking'
                    ? 'Mitra Speaking... Tap to Talk'
                    : status === 'thinking'
                    ? 'Mitra is Thinking...'
                    : 'Tap to Speak to Mitra'}
                </span>
                <span className="font-label-md text-xs opacity-90 leading-normal break-words mt-0.5">
                  {status === 'listening'
                    ? 'बोलिए दादाजी • भेजने के लिए यहाँ दबाएं (Tap to send)'
                    : status === 'speaking'
                    ? 'अपनी बात कहने के लिए दबाएं (Tap to speak)'
                    : status === 'thinking'
                    ? 'कृपया प्रतीक्षा करें (Please wait a moment)'
                    : 'बोलने के लिए यहाँ दबाएं (Speak your heart)'}
                </span>
              </div>
            </button>

            {/* Secondary Dual Action Buttons */}
            <div className="grid grid-cols-2 gap-3 w-full">
              <button
                className="min-h-[56px] py-2 px-3 bg-surface-container-lowest text-on-surface rounded-2xl shadow-xs border border-surface-container flex items-center justify-center gap-2.5 active:bg-surface-container transition-colors cursor-pointer"
                onClick={() => handleRepeat()}
                type="button"
              >
                <span className="material-symbols-outlined text-primary text-2xl shrink-0">replay</span>
                <div className="flex flex-col items-start text-left min-w-0">
                  <span className="font-headline-sm text-xs sm:text-sm font-semibold leading-snug truncate">Repeat Voice</span>
                  <span className="font-label-sm text-[11px] text-on-surface-variant leading-normal">दोबारा सुनें</span>
                </div>
              </button>

              <button
                className="min-h-[56px] py-2 px-3 bg-surface-container-lowest text-on-surface rounded-2xl shadow-xs border border-surface-container flex items-center justify-center gap-2.5 hover:bg-surface-container transition-colors cursor-pointer"
                onClick={() => {
                  setActiveTab('type');
                  setTimeout(() => textInputRef.current?.focus(), 150);
                }}
                type="button"
              >
                <span className="material-symbols-outlined text-secondary text-2xl shrink-0">keyboard</span>
                <div className="flex flex-col items-start text-left min-w-0">
                  <span className="font-headline-sm text-xs sm:text-sm font-semibold leading-snug truncate">Open Typing</span>
                  <span className="font-label-sm text-[11px] text-on-surface-variant leading-normal">लिखकर पूछें</span>
                </div>
              </button>
            </div>
          </div>

          {/* Inline Quick-Type Dock in Voice Mode */}
          <div className="w-full bg-surface-container-lowest p-2 rounded-2xl border border-surface-container mt-1 shadow-xs flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-xl pl-1">chat</span>
            <input
              type="text"
              value={textInputValue}
              onChange={(e) => setTextInputValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleTypeSubmit();
                }
              }}
              placeholder="Or type here for Mitra (या यहाँ लिखें)..."
              className="flex-1 px-2 py-1.5 text-sm bg-transparent outline-none text-on-surface placeholder:text-outline"
            />
            {textInputValue.trim() && (
              <button
                type="button"
                onClick={() => handleTypeSubmit()}
                className="px-3 py-1.5 bg-primary text-on-primary text-xs font-semibold rounded-xl flex items-center gap-1 active:scale-95"
              >
                <span>Send</span>
                <span className="material-symbols-outlined text-[14px]">send</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: DEDICATED TYPING AREA & CHAT CONVERSATION VIEW */}
      {/* ========================================================================= */}
      {activeTab === 'type' && (
        <div className="w-full flex flex-col gap-3 animate-in fade-in duration-200">
          {/* Top Bar for Type Mode: Audio Speakback toggle + Switch to Voice */}
          <div className="w-full flex items-center justify-between bg-surface-container-low px-4 py-2.5 rounded-2xl border border-surface-container">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-xl">smart_toy</span>
              <span className="font-patient-label text-sm text-primary font-bold">
                Mitra AI Typing Area
              </span>
            </div>

            <div className="flex items-center gap-2">
              {/* Speak Aloud Toggle */}
              <button
                onClick={() => {
                  playChime('gentle');
                  setSpeakTypedReplies(!speakTypedReplies);
                }}
                className={`px-2.5 py-1 rounded-full text-xs font-medium flex items-center gap-1 border transition-colors ${
                  speakTypedReplies
                    ? 'bg-primary-fixed text-on-primary-fixed border-primary/30 font-semibold'
                    : 'bg-surface-container text-on-surface-variant border-surface-container-high'
                }`}
                type="button"
                title="When on, Mitra will read the typed response aloud"
              >
                <span className="material-symbols-outlined text-[14px]">
                  {speakTypedReplies ? 'volume_up' : 'volume_off'}
                </span>
                <span>{speakTypedReplies ? 'Read Aloud On' : 'Silent'}</span>
              </button>
            </div>
          </div>

          {/* Chat Messages Stream Area */}
          <div className="w-full bg-surface-container-lowest rounded-3xl p-4 border border-surface-container shadow-xs min-h-[280px] max-h-[380px] overflow-y-auto flex flex-col gap-3.5">
            {conversation.map((turn) => {
              const isUser = turn.sender === 'user';
              return (
                <div
                  key={turn.id}
                  className={`flex flex-col gap-1 max-w-[88%] ${
                    isUser ? 'self-end items-end' : 'self-start items-start'
                  }`}
                >
                  <div className="flex items-center gap-1.5 px-1 text-[11px] font-semibold text-on-surface-variant">
                    <span>{isUser ? 'Dadaji Ramesh (आप)' : 'Mitra AI (मित्र)'}</span>
                    <span className="text-[10px] opacity-60">• {turn.timestamp}</span>
                    {isUser && turn.isTyped && (
                      <span className="text-[10px] bg-surface-container px-1 rounded text-outline">
                        Typed
                      </span>
                    )}
                  </div>

                  <div
                    className={`p-3.5 rounded-2xl text-sm sm:text-base leading-relaxed ${
                      isUser
                        ? 'bg-primary text-on-primary rounded-tr-xs shadow-xs font-medium'
                        : 'bg-surface-container-low text-on-surface rounded-tl-xs border border-surface-container shadow-xs'
                    }`}
                  >
                    <p>{turn.text}</p>
                    {turn.hindiText && (
                      <p className="mt-1.5 pt-1.5 border-t border-surface-container-high/60 text-xs sm:text-sm text-on-surface-variant font-normal">
                        {turn.hindiText}
                      </p>
                    )}
                  </div>

                  {!isUser && (
                    <button
                      onClick={() => handleRepeat(turn.text)}
                      className="text-[11px] text-primary flex items-center gap-1 hover:underline px-1 mt-0.5"
                      type="button"
                    >
                      <span className="material-symbols-outlined text-[14px]">volume_up</span>
                      <span>Listen aloud (सुनें)</span>
                    </button>
                  )}
                </div>
              );
            })}

            {/* Thinking Indicator in Chat */}
            {status === 'thinking' && (
              <div className="self-start flex items-center gap-2 bg-surface-container-low p-3 rounded-2xl border border-surface-container text-xs text-primary animate-pulse">
                <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                <span>Mitra is typing a loving reply... (मित्र लिख रहे हैं)</span>
              </div>
            )}

            <div ref={chatBottomRef} />
          </div>

          {/* Quick Prompts Chips for Typing */}
          <div className="w-full flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {quickPrompts.map((item, idx) => (
              <button
                key={idx}
                onClick={() => handleQuickPrompt(item.text)}
                className="px-3 py-1.5 bg-surface-container-lowest hover:bg-primary-fixed/30 border border-surface-container rounded-full shrink-0 text-xs text-primary font-medium active:scale-95 transition-all flex items-center gap-1"
                type="button"
              >
                <span>{item.label}</span>
                <span className="text-[10px] text-on-surface-variant font-normal">({item.hindi})</span>
              </button>
            ))}
          </div>

          {/* Dedicated Typing Area & Input Card */}
          <div className="w-full bg-surface-container-lowest rounded-3xl p-3 border-2 border-primary/30 shadow-md flex flex-col gap-2.5">
            <div className="flex items-center justify-between px-1">
              <label htmlFor="mitra-typing-input" className="font-patient-label text-xs font-bold text-primary flex items-center gap-1.5">
                <span className="material-symbols-outlined text-base">edit</span>
                <span>Type your message for Mitra AI • यहाँ लिखें</span>
              </label>

              {textInputValue && (
                <button
                  type="button"
                  onClick={() => setTextInputValue('')}
                  className="text-xs text-outline hover:text-error flex items-center gap-0.5"
                >
                  <span className="material-symbols-outlined text-[14px]">backspace</span>
                  <span>Clear</span>
                </button>
              )}
            </div>

            {/* Multi-line Elder-Accessible Textarea */}
            <textarea
              id="mitra-typing-input"
              ref={textInputRef as any}
              rows={3}
              value={textInputValue}
              onChange={(e) => setTextInputValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleTypeSubmit();
                }
              }}
              placeholder="Ask anything (e.g. 'How is Aarav today?', 'Where is my morning tea?', or 'Play a bhajan')..."
              className="w-full p-3 text-base text-on-surface bg-surface-container-low/60 rounded-2xl border border-surface-container focus:border-primary focus:bg-surface-container-lowest outline-none resize-none leading-relaxed transition-all placeholder:text-outline"
            />

            {/* Bottom Actions of Typing Area */}
            <div className="flex items-center justify-between pt-1">
              {/* Dictate into Typing Area using Voice */}
              <button
                onClick={() => {
                  startListening();
                  setActiveTab('voice');
                }}
                type="button"
                className="px-3 py-2 bg-surface-container text-on-surface-variant hover:text-primary rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
                title="Switch back to full spoken voice mode"
              >
                <span className="material-symbols-outlined text-base text-primary">mic</span>
                <span>Or Speak</span>
              </button>

              {/* Big Send Button */}
              <button
                type="button"
                onClick={() => handleTypeSubmit()}
                disabled={!textInputValue.trim() || status === 'thinking'}
                className="px-5 py-2.5 rounded-2xl bg-primary text-on-primary font-bold text-sm flex items-center gap-2 shadow-xs hover:bg-primary-container active:scale-95 transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              >
                <span>Send to Mitra</span>
                <span
                  className="material-symbols-outlined text-[18px]"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  send
                </span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Microphone Permission Notice */}
      {micPermissionDenied && (
        <div className="w-full bg-secondary-fixed/40 border border-secondary/30 rounded-2xl p-3.5 text-xs text-on-surface flex items-start gap-3 mt-3">
          <span className="material-symbols-outlined text-secondary text-xl mt-0.5">info</span>
          <div className="flex-1">
            <span className="font-bold text-secondary block text-sm">Microphone Notice</span>
            <p className="mt-0.5 text-on-surface-variant leading-relaxed">
              If prompted by your browser, click <strong>Allow</strong> for microphone. You can also tap any quick speech option or use the typing area!
            </p>
            <button
              onClick={() => {
                setMicPermissionDenied(false);
                startListening();
              }}
              className="mt-2.5 px-3.5 py-1.5 bg-secondary text-on-secondary rounded-xl font-semibold flex items-center gap-1.5 text-xs active:scale-95 transition-transform cursor-pointer"
              type="button"
            >
              <span className="material-symbols-outlined text-sm">mic</span>
              <span>Try Microphone Again</span>
            </button>
          </div>
        </div>
      )}

      {/* Reassurance Footer */}
      <div className="flex items-center justify-center gap-2 py-3 text-on-surface-variant font-label-md text-xs">
        <span className="material-symbols-outlined text-primary text-base">verified_user</span>
        <span>Sanjeevani Mitra: Responsive via voice speech and direct typing</span>
      </div>
    </div>
  );
};
