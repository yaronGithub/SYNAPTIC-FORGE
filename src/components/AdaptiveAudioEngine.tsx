import React, { useEffect, useRef, useState } from 'react';
import { ForesightConstruct, CognitiveState } from '../types';
import { Volume2, VolumeX, Brain } from 'lucide-react';

interface AdaptiveAudioEngineProps {
  foresightConstruct: ForesightConstruct | null;
  cognitiveState: CognitiveState;
  enabled: boolean;
  onToggle: () => void;
}

export function AdaptiveAudioEngine({ 
  foresightConstruct, 
  cognitiveState, 
  enabled, 
  onToggle 
}: AdaptiveAudioEngineProps) {
  const audioContextRef = useRef<AudioContext | null>(null);
  const oscillatorsRef = useRef<OscillatorNode[]>([]);
  const gainNodesRef = useRef<GainNode[]>([]);
  const masterGainRef = useRef<GainNode | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentFrequency, setCurrentFrequency] = useState<string>('');

  const initializeAudio = async () => {
    if (!enabled || audioContextRef.current) return;

    try {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      
      // Create master gain
      masterGainRef.current = audioContextRef.current.createGain();
      masterGainRef.current.gain.setValueAtTime(0.1, audioContextRef.current.currentTime);
      masterGainRef.current.connect(audioContextRef.current.destination);

      setIsPlaying(true);
    } catch (error) {
      console.warn('Web Audio API not supported:', error);
    }
  };

  const createBinauralBeats = (frequency: string, type: string) => {
    if (!audioContextRef.current || !enabled) return;

    // Clear existing oscillators
    oscillatorsRef.current.forEach(osc => {
      try {
        osc.stop();
      } catch (e) {
        // Oscillator might already be stopped
      }
    });
    oscillatorsRef.current = [];
    gainNodesRef.current = [];

    const currentTime = audioContextRef.current.currentTime;
    let baseFreq = 200;
    let beatFreq = 10;

    // Parse frequency and set binaural parameters
    switch (type) {
      case 'alpha':
        baseFreq = 200;
        beatFreq = 10; // 10 Hz alpha waves
        break;
      case 'beta':
        baseFreq = 200;
        beatFreq = 20; // 20 Hz beta waves
        break;
      case 'gamma':
        baseFreq = 200;
        beatFreq = 40; // 40 Hz gamma waves
        break;
      case 'theta':
        baseFreq = 200;
        beatFreq = 6; // 6 Hz theta waves
        break;
      case 'delta':
        baseFreq = 200;
        beatFreq = 2; // 2 Hz delta waves
        break;
    }

    // Create stereo binaural beats
    const leftOsc = audioContextRef.current.createOscillator();
    const rightOsc = audioContextRef.current.createOscillator();
    const leftGain = audioContextRef.current.createGain();
    const rightGain = audioContextRef.current.createGain();
    const merger = audioContextRef.current.createChannelMerger(2);

    leftOsc.frequency.setValueAtTime(baseFreq, currentTime);
    rightOsc.frequency.setValueAtTime(baseFreq + beatFreq, currentTime);
    
    leftOsc.type = 'sine';
    rightOsc.type = 'sine';

    leftGain.gain.setValueAtTime(0.03, currentTime);
    rightGain.gain.setValueAtTime(0.03, currentTime);

    leftOsc.connect(leftGain);
    rightOsc.connect(rightGain);
    leftGain.connect(merger, 0, 0);
    rightGain.connect(merger, 0, 1);
    merger.connect(masterGainRef.current!);

    leftOsc.start();
    rightOsc.start();

    oscillatorsRef.current.push(leftOsc, rightOsc);
    gainNodesRef.current.push(leftGain, rightGain);

    setCurrentFrequency(`${type.toUpperCase()} (${beatFreq} Hz)`);
  };

  const speakInsight = async (text: string, voiceTone: string) => {
    if (!('speechSynthesis' in window)) {
      console.warn('Speech synthesis not supported');
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    
    // Configure voice based on tone
    switch (voiceTone) {
      case 'authoritative':
        utterance.rate = 0.9;
        utterance.pitch = 0.8;
        utterance.volume = 0.8;
        break;
      case 'exploratory':
        utterance.rate = 1.1;
        utterance.pitch = 1.1;
        utterance.volume = 0.7;
        break;
      case 'urgent':
        utterance.rate = 1.3;
        utterance.pitch = 1.2;
        utterance.volume = 0.9;
        break;
      case 'meditative':
        utterance.rate = 0.7;
        utterance.pitch = 0.9;
        utterance.volume = 0.6;
        break;
      case 'skeptical':
        utterance.rate = 1.0;
        utterance.pitch = 0.7;
        utterance.volume = 0.7;
        break;
    }

    speechSynthesis.speak(utterance);
  };

  useEffect(() => {
    if (enabled) {
      initializeAudio();
    }
    
    return () => {
      oscillatorsRef.current.forEach(osc => {
        try {
          osc.stop();
        } catch (e) {
          // Oscillator might already be stopped
        }
      });
      
      if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
        audioContextRef.current.close();
      }
      
      audioContextRef.current = null;
      oscillatorsRef.current = [];
      gainNodesRef.current = [];
      masterGainRef.current = null;
      setIsPlaying(false);
    };
  }, [enabled]);

  useEffect(() => {
    if (foresightConstruct && enabled) {
      const { targetBrainwaveFrequency, synthesizedVoiceTone } = foresightConstruct.sensoryDirectives;
      
      // Create binaural beats for cognitive optimization
      createBinauralBeats(targetBrainwaveFrequency.range, targetBrainwaveFrequency.type);
      
      // Speak the insight
      setTimeout(() => {
        speakInsight(foresightConstruct.conciseActionableRecommendation, synthesizedVoiceTone);
      }, 1000);
    }
  }, [foresightConstruct, enabled]);

  // Resume audio context on user interaction
  useEffect(() => {
    const resumeAudio = () => {
      if (audioContextRef.current && audioContextRef.current.state === 'suspended') {
        audioContextRef.current.resume();
      }
    };

    document.addEventListener('click', resumeAudio, { once: true });
    document.addEventListener('keydown', resumeAudio, { once: true });

    return () => {
      document.removeEventListener('click', resumeAudio);
      document.removeEventListener('keydown', resumeAudio);
    };
  }, []);

  return (
    <div className="fixed top-6 right-6 z-50 flex items-center gap-4">
      {/* Cognitive State Monitor */}
      {enabled && currentFrequency && (
        <div className="bg-black/80 backdrop-blur-xl rounded-lg px-4 py-2 border border-emerald-500/30">
          <div className="flex items-center gap-2">
            <Brain className="w-4 h-4 text-emerald-400" />
            <div className="text-xs">
              <div className="text-emerald-400 font-medium">{currentFrequency}</div>
              <div className="text-gray-400">Cognitive Enhancement Active</div>
            </div>
          </div>
        </div>
      )}

      {/* Audio Toggle */}
      <button
        onClick={onToggle}
        className={`p-3 rounded-full backdrop-blur-xl border border-white/20 transition-all duration-200 ${
          enabled 
            ? 'bg-gradient-to-r from-emerald-600/80 to-cyan-600/80 text-white shadow-lg shadow-emerald-500/25' 
            : 'bg-gray-900/80 text-gray-400 hover:text-white'
        }`}
      >
        {enabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
      </button>
    </div>
  );
}