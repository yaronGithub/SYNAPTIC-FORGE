import { useState, useEffect } from 'react';
import { NexusState, NewsEvent } from '../types';

export function useNexusState(events: NewsEvent[]) {
  const [nexusState, setNexusState] = useState<NexusState>({
    mode: 'idle',
    emotionalState: 'calm',
    intensity: 0.3,
    dominantSentiment: 'neutral'
  });

  // Calculate dominant sentiment from events
  const calculateDominantSentiment = (events: NewsEvent[]) => {
    if (events.length === 0) return 'neutral';
    
    const sentimentCounts = events.reduce((acc, event) => {
      acc[event.emotionalSentiment] = (acc[event.emotionalSentiment] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(sentimentCounts)
      .sort(([,a], [,b]) => b - a)[0][0] as NexusState['dominantSentiment'];
  };

  // Calculate intensity based on events impact
  const calculateIntensity = (events: NewsEvent[]) => {
    if (events.length === 0) return 0.2;
    
    const highImpactCount = events.filter(e => e.impactLevel === 'high').length;
    const mediumImpactCount = events.filter(e => e.impactLevel === 'medium').length;
    
    const baseIntensity = 0.3;
    const impactBoost = (highImpactCount * 0.3 + mediumImpactCount * 0.15) / events.length;
    
    return Math.min(1, baseIntensity + impactBoost);
  };

  // Determine emotional state based on sentiment and intensity
  const calculateEmotionalState = (sentiment: string, intensity: number): NexusState['emotionalState'] => {
    if (intensity > 0.7) {
      return sentiment === 'joy' || sentiment === 'excitement' ? 'excited' : 'concerned';
    } else if (intensity > 0.4) {
      return sentiment === 'joy' || sentiment === 'excitement' ? 'optimistic' : 'contemplative';
    } else {
      return 'calm';
    }
  };

  // Update nexus state when events change
  useEffect(() => {
    const dominantSentiment = calculateDominantSentiment(events);
    const intensity = calculateIntensity(events);
    const emotionalState = calculateEmotionalState(dominantSentiment, intensity);

    setNexusState(prev => ({
      ...prev,
      dominantSentiment,
      intensity,
      emotionalState
    }));
  }, [events]);

  // Method to update mode (for external control)
  const updateMode = (mode: NexusState['mode']) => {
    setNexusState(prev => ({ ...prev, mode }));
  };

  return { nexusState, updateMode };
}