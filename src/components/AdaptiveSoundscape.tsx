import React, { useEffect, useRef } from 'react';
import { ForesightConstruct } from '../types';

interface AdaptiveSoundscapeProps {
  foresightConstruct: ForesightConstruct | null;
  enabled: boolean;
  insightType?: 'risk' | 'opportunity' | 'neutral';
}

export function AdaptiveSoundscape({ foresightConstruct, enabled, insightType = 'neutral' }: AdaptiveSoundscapeProps) {
  const audioContextRef = useRef<AudioContext | null>(null);
  const oscillatorsRef = useRef<OscillatorNode[]>([]);
  const gainNodesRef = useRef<GainNode[]>([]);
  const masterGainRef = useRef<GainNode | null>(null);

  const initializeAudio = () => {
    if (!enabled || audioContextRef.current) return;

    try {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      
      // Create master gain
      masterGainRef.current = audioContextRef.current.createGain();
      masterGainRef.current.gain.setValueAtTime(0.05, audioContextRef.current.currentTime);
      masterGainRef.current.connect(audioContextRef.current.destination);

    } catch (error) {
      console.warn('Web Audio API not supported:', error);
    }
  };

  const createSoundscape = (type: string) => {
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
    let frequencies: number[] = [];
    let waveType: OscillatorType = 'sine';

    switch (type) {
      case 'risk':
        frequencies = [55, 110, 165]; // Lower, more tense frequencies
        waveType = 'sawtooth';
        break;
      case 'opportunity':
        frequencies = [220, 330, 440]; // Brighter, more uplifting frequencies
        waveType = 'sine';
        break;
      case 'neutral':
      default:
        frequencies = [110, 220, 330]; // Balanced frequencies
        waveType = 'triangle';
        break;
    }

    frequencies.forEach((freq, index) => {
      const oscillator = audioContextRef.current!.createOscillator();
      const gainNode = audioContextRef.current!.createGain();
      
      oscillator.type = waveType;
      oscillator.frequency.setValueAtTime(freq, currentTime);
      
      // Set initial gain based on type
      const baseGain = type === 'risk' ? 0.02 : type === 'opportunity' ? 0.015 : 0.01;
      gainNode.gain.setValueAtTime(baseGain * (1 - index * 0.3), currentTime);
      
      oscillator.connect(gainNode);
      gainNode.connect(masterGainRef.current!);
      
      oscillator.start();
      
      oscillatorsRef.current.push(oscillator);
      gainNodesRef.current.push(gainNode);

      // Add subtle frequency modulation
      const lfo = audioContextRef.current!.createOscillator();
      const lfoGain = audioContextRef.current!.createGain();
      
      lfo.frequency.setValueAtTime(0.1 + index * 0.05, currentTime);
      lfoGain.gain.setValueAtTime(freq * 0.01, currentTime);
      
      lfo.connect(lfoGain);
      lfoGain.connect(oscillator.frequency);
      lfo.start();
    });
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
    };
  }, [enabled]);

  useEffect(() => {
    if (foresightConstruct && enabled) {
      // Determine soundscape type based on insight content
      const recommendation = foresightConstruct.conciseActionableRecommendation.toLowerCase();
      let soundscapeType = insightType;
      
      if (recommendation.includes('risk') || recommendation.includes('challenge') || recommendation.includes('threat')) {
        soundscapeType = 'risk';
      } else if (recommendation.includes('opportunity') || recommendation.includes('advantage') || recommendation.includes('growth')) {
        soundscapeType = 'opportunity';
      }
      
      createSoundscape(soundscapeType);
    }
  }, [foresightConstruct, enabled, insightType]);

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

  return null; // This component doesn't render anything visual
}