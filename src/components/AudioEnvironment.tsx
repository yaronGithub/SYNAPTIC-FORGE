import React, { useEffect, useRef } from 'react';
import { NexusState } from '../types';

interface AudioEnvironmentProps {
  nexusState: NexusState;
  enabled: boolean;
}

export function AudioEnvironment({ nexusState, enabled }: AudioEnvironmentProps) {
  const audioContextRef = useRef<AudioContext | null>(null);
  const oscillatorsRef = useRef<OscillatorNode[]>([]);
  const gainNodesRef = useRef<GainNode[]>([]);
  const filterRef = useRef<BiquadFilterNode | null>(null);
  const masterGainRef = useRef<GainNode | null>(null);

  const initializeAudio = () => {
    if (!enabled || audioContextRef.current) return;

    try {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      
      // Create master gain node
      masterGainRef.current = audioContextRef.current.createGain();
      masterGainRef.current.gain.setValueAtTime(0.1, audioContextRef.current.currentTime);
      masterGainRef.current.connect(audioContextRef.current.destination);

      // Create filter for mood shaping
      filterRef.current = audioContextRef.current.createBiquadFilter();
      filterRef.current.type = 'lowpass';
      filterRef.current.frequency.setValueAtTime(800, audioContextRef.current.currentTime);
      filterRef.current.connect(masterGainRef.current);

      // Create ambient oscillators
      const frequencies = [60, 80, 120, 160]; // Deep ambient tones
      
      frequencies.forEach((freq, index) => {
        const oscillator = audioContextRef.current!.createOscillator();
        const gainNode = audioContextRef.current!.createGain();
        
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(freq, audioContextRef.current!.currentTime);
        
        gainNode.gain.setValueAtTime(0, audioContextRef.current!.currentTime);
        
        oscillator.connect(gainNode);
        gainNode.connect(filterRef.current!);
        
        oscillator.start();
        
        oscillatorsRef.current.push(oscillator);
        gainNodesRef.current.push(gainNode);
      });

    } catch (error) {
      console.warn('Web Audio API not supported:', error);
    }
  };

  const updateAudioParameters = () => {
    if (!audioContextRef.current || !enabled) return;

    const currentTime = audioContextRef.current.currentTime;
    const { dominantSentiment, intensity, mode } = nexusState;

    // Update filter frequency based on sentiment
    if (filterRef.current) {
      let targetFreq = 800;
      switch (dominantSentiment) {
        case 'joy':
        case 'excitement':
          targetFreq = 1200 + intensity * 800;
          break;
        case 'fear':
        case 'anger':
          targetFreq = 400 + intensity * 400;
          break;
        case 'sadness':
          targetFreq = 300 + intensity * 200;
          break;
        default:
          targetFreq = 600 + intensity * 400;
      }
      filterRef.current.frequency.exponentialRampToValueAtTime(targetFreq, currentTime + 0.5);
    }

    // Update oscillator volumes based on mode and intensity
    gainNodesRef.current.forEach((gainNode, index) => {
      let targetGain = 0;
      
      switch (mode) {
        case 'processing':
          targetGain = (0.02 + intensity * 0.03) * (index % 2 === 0 ? 1 : 0.7);
          break;
        case 'analyzing':
          targetGain = (0.015 + intensity * 0.025) * (index === 1 || index === 2 ? 1 : 0.5);
          break;
        case 'weaving':
          targetGain = (0.025 + intensity * 0.035) * Math.sin(index * Math.PI / 4);
          break;
        case 'conversing':
          targetGain = (0.01 + intensity * 0.02) * (index < 2 ? 1 : 0.3);
          break;
        default:
          targetGain = 0.005 + intensity * 0.01;
      }

      gainNode.gain.exponentialRampToValueAtTime(Math.max(0.001, targetGain), currentTime + 1);
    });

    // Add subtle frequency modulation for more organic feel
    oscillatorsRef.current.forEach((oscillator, index) => {
      const baseFreq = [60, 80, 120, 160][index];
      const modulation = Math.sin(Date.now() * 0.001 + index) * intensity * 5;
      oscillator.frequency.setValueAtTime(baseFreq + modulation, currentTime);
    });
  };

  useEffect(() => {
    if (enabled) {
      initializeAudio();
    }
    
    return () => {
      // Cleanup audio context
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
      filterRef.current = null;
      masterGainRef.current = null;
    };
  }, [enabled]);

  useEffect(() => {
    updateAudioParameters();
  }, [nexusState, enabled]);

  // Resume audio context on user interaction (required by browsers)
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