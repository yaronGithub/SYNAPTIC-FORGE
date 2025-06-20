import React, { useEffect, useRef } from 'react';
import { BlendedResonanceProfile } from '../types';

interface PsycheAudioscapeProps {
  resonanceProfile: BlendedResonanceProfile | null;
  enabled: boolean;
}

export function PsycheAudioscape({ resonanceProfile, enabled }: PsycheAudioscapeProps) {
  const audioContextRef = useRef<AudioContext | null>(null);
  const oscillatorsRef = useRef<OscillatorNode[]>([]);
  const gainNodesRef = useRef<GainNode[]>([]);
  const binauralOscRef = useRef<{ left: OscillatorNode; right: OscillatorNode } | null>(null);
  const masterGainRef = useRef<GainNode | null>(null);
  const filterRef = useRef<BiquadFilterNode | null>(null);

  const initializeAudio = () => {
    if (!enabled || audioContextRef.current) return;

    try {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      
      // Create master gain
      masterGainRef.current = audioContextRef.current.createGain();
      masterGainRef.current.gain.setValueAtTime(0.1, audioContextRef.current.currentTime);
      masterGainRef.current.connect(audioContextRef.current.destination);

      // Create filter for consciousness shaping
      filterRef.current = audioContextRef.current.createBiquadFilter();
      filterRef.current.type = 'lowpass';
      filterRef.current.frequency.setValueAtTime(800, audioContextRef.current.currentTime);
      filterRef.current.connect(masterGainRef.current);

      // Create ambient consciousness drones
      const frequencies = [40, 60, 80, 120, 160]; // Deep consciousness frequencies
      
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

  const createBinauralBeats = (frequency: string, type: string) => {
    if (!audioContextRef.current || !enabled) return;

    // Remove existing binaural oscillators
    if (binauralOscRef.current) {
      binauralOscRef.current.left.stop();
      binauralOscRef.current.right.stop();
    }

    const currentTime = audioContextRef.current.currentTime;
    let baseFreq = 200; // Default base frequency
    let beatFreq = 10; // Default beat frequency

    // Parse frequency range and set binaural beat parameters
    switch (type) {
      case 'Alpha':
        baseFreq = 200;
        beatFreq = 10; // 10 Hz alpha waves
        break;
      case 'Theta':
        baseFreq = 200;
        beatFreq = 6; // 6 Hz theta waves
        break;
      case 'Beta':
        baseFreq = 200;
        beatFreq = 20; // 20 Hz beta waves
        break;
      case 'Gamma':
        baseFreq = 200;
        beatFreq = 40; // 40 Hz gamma waves
        break;
      case 'Delta':
        baseFreq = 200;
        beatFreq = 2; // 2 Hz delta waves
        break;
    }

    // Create left and right oscillators for binaural effect
    const leftOsc = audioContextRef.current.createOscillator();
    const rightOsc = audioContextRef.current.createOscillator();
    const leftGain = audioContextRef.current.createGain();
    const rightGain = audioContextRef.current.createGain();
    const merger = audioContextRef.current.createChannelMerger(2);

    leftOsc.frequency.setValueAtTime(baseFreq, currentTime);
    rightOsc.frequency.setValueAtTime(baseFreq + beatFreq, currentTime);
    
    leftOsc.type = 'sine';
    rightOsc.type = 'sine';

    leftGain.gain.setValueAtTime(0.05, currentTime);
    rightGain.gain.setValueAtTime(0.05, currentTime);

    leftOsc.connect(leftGain);
    rightOsc.connect(rightGain);
    leftGain.connect(merger, 0, 0);
    rightGain.connect(merger, 0, 1);
    merger.connect(masterGainRef.current!);

    leftOsc.start();
    rightOsc.start();

    binauralOscRef.current = { left: leftOsc, right: rightOsc };
  };

  const updateAudioParameters = () => {
    if (!audioContextRef.current || !enabled || !resonanceProfile) return;

    const currentTime = audioContextRef.current.currentTime;
    const { emotionalWeights, intensity, targetBinauralFrequency } = resonanceProfile;

    // Update filter frequency based on emotional state
    if (filterRef.current) {
      let targetFreq = 800;
      
      if (emotionalWeights.serenity > 0.5) {
        targetFreq = 400 + intensity * 200; // Lower, calmer frequencies
      } else if (emotionalWeights.excitement > 0.5) {
        targetFreq = 1200 + intensity * 800; // Higher, more energetic frequencies
      } else if (emotionalWeights.anxiety > 0.5) {
        targetFreq = 600 + intensity * 400; // Mid-range, tense frequencies
      } else {
        targetFreq = 500 + intensity * 600; // Adaptive range
      }
      
      filterRef.current.frequency.exponentialRampToValueAtTime(targetFreq, currentTime + 1);
    }

    // Update consciousness drone volumes based on emotional weights
    gainNodesRef.current.forEach((gainNode, index) => {
      let targetGain = 0;
      
      // Map different oscillators to different emotional states
      switch (index) {
        case 0: // Deep bass - grounding emotions
          targetGain = (emotionalWeights.serenity + emotionalWeights.hope) * 0.02;
          break;
        case 1: // Low mid - core emotions
          targetGain = (emotionalWeights.joy + emotionalWeights.curiosity) * 0.015;
          break;
        case 2: // Mid - active emotions
          targetGain = (emotionalWeights.excitement + emotionalWeights.anxiety) * 0.02;
          break;
        case 3: // High mid - mental activity
          targetGain = (emotionalWeights.curiosity + emotionalWeights.tension) * 0.01;
          break;
        case 4: // High - ethereal emotions
          targetGain = (emotionalWeights.hope + emotionalWeights.joy) * 0.008;
          break;
      }

      targetGain *= intensity * 0.1;
      gainNode.gain.exponentialRampToValueAtTime(Math.max(0.001, targetGain), currentTime + 2);
    });

    // Create binaural beats based on AI recommendation
    if (targetBinauralFrequency) {
      createBinauralBeats(targetBinauralFrequency.range, targetBinauralFrequency.type);
    }
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

      if (binauralOscRef.current) {
        try {
          binauralOscRef.current.left.stop();
          binauralOscRef.current.right.stop();
        } catch (e) {
          // Oscillators might already be stopped
        }
      }
      
      if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
        audioContextRef.current.close();
      }
      
      audioContextRef.current = null;
      oscillatorsRef.current = [];
      gainNodesRef.current = [];
      binauralOscRef.current = null;
      filterRef.current = null;
      masterGainRef.current = null;
    };
  }, [enabled]);

  useEffect(() => {
    updateAudioParameters();
  }, [resonanceProfile, enabled]);

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