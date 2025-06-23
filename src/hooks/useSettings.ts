import { useState, useEffect } from 'react';
import { useUserProfile } from './useUserProfile';
import { useAnalytics } from './useAnalytics';

interface AppSettings {
  theme: 'dark' | 'light';
  aiVoiceTone: 'authoritative' | 'exploratory' | 'urgent' | 'meditative' | 'skeptical';
  defaultAnalysisType: 'strategic_analysis' | 'innovation_opportunities' | 'risk_assessment' | 'market_disruption';
  priorityTopics: string[];
  audioEnabled: boolean;
  proactiveAlerts: boolean;
  visualComplexity: 'minimal' | 'moderate' | 'complex';
  cognitiveOptimization: boolean;
  autoSaveInteractions: boolean;
  dataRetentionDays: number;
  notificationFrequency: 'realtime' | 'hourly' | 'daily' | 'weekly';
  aiPersonalityGrowthRate: 'slow' | 'normal' | 'fast';
  privacyMode: boolean;
  analyticsSharing: boolean;
  preferredBrainwaveState: 'alpha' | 'beta' | 'gamma' | 'theta' | 'delta';
  visualMotionIntensity: number;
  insightConfidenceThreshold: number;
}

const defaultSettings: AppSettings = {
  theme: 'dark',
  aiVoiceTone: 'authoritative',
  defaultAnalysisType: 'strategic_analysis',
  priorityTopics: ['AI/ML', 'Quantum Computing', 'Sustainability'],
  audioEnabled: true,
  proactiveAlerts: true,
  visualComplexity: 'moderate',
  cognitiveOptimization: true,
  autoSaveInteractions: true,
  dataRetentionDays: 365,
  notificationFrequency: 'daily',
  aiPersonalityGrowthRate: 'normal',
  privacyMode: false,
  analyticsSharing: true,
  preferredBrainwaveState: 'beta',
  visualMotionIntensity: 7,
  insightConfidenceThreshold: 75
};

export function useSettings() {
  const { profile, updateProfile } = useUserProfile();
  const { trackEvent } = useAnalytics();
  const [settings, setSettings] = useState<AppSettings>(defaultSettings);
  const [isLoading, setIsLoading] = useState(true);

  // Load settings from user profile
  useEffect(() => {
    if (profile?.cognitive_preferences) {
      const savedSettings = { ...defaultSettings, ...profile.cognitive_preferences };
      setSettings(savedSettings);
      applySettings(savedSettings);
    } else {
      // Apply default settings
      applySettings(defaultSettings);
    }
    setIsLoading(false);
  }, [profile]);

  const applySettings = (newSettings: AppSettings) => {
    // Apply theme
    if (newSettings.theme === 'light') {
      document.documentElement.classList.add('light-theme');
      document.body.style.backgroundColor = '#f8fafc';
    } else {
      document.documentElement.classList.remove('light-theme');
      document.body.style.backgroundColor = '#000000';
    }

    // Apply visual motion intensity to CSS custom properties
    document.documentElement.style.setProperty('--motion-intensity', newSettings.visualMotionIntensity.toString());
    
    // Apply visual complexity
    document.documentElement.setAttribute('data-visual-complexity', newSettings.visualComplexity);
    
    // Apply audio settings to global audio context
    if (typeof window !== 'undefined') {
      (window as any).synapticForgeSettings = {
        audioEnabled: newSettings.audioEnabled,
        preferredBrainwaveState: newSettings.preferredBrainwaveState,
        aiVoiceTone: newSettings.aiVoiceTone,
        cognitiveOptimization: newSettings.cognitiveOptimization
      };
    }

    // Dispatch custom event for other components to listen to
    window.dispatchEvent(new CustomEvent('settingsChanged', { 
      detail: newSettings 
    }));
  };

  const updateSettings = async (newSettings: Partial<AppSettings>) => {
    const updatedSettings = { ...settings, ...newSettings };
    setSettings(updatedSettings);
    applySettings(updatedSettings);

    // Save to user profile if available
    if (profile) {
      try {
        await updateProfile({
          cognitive_preferences: {
            ...profile.cognitive_preferences,
            ...updatedSettings
          }
        });

        await trackEvent('settings_updated', {
          changed_settings: Object.keys(newSettings),
          theme: updatedSettings.theme,
          ai_voice_tone: updatedSettings.aiVoiceTone,
          visual_complexity: updatedSettings.visualComplexity
        });
      } catch (error) {
        console.error('Error saving settings:', error);
      }
    } else {
      // Save to localStorage for non-authenticated users
      localStorage.setItem('synapticForgeSettings', JSON.stringify(updatedSettings));
    }
  };

  const resetSettings = async () => {
    setSettings(defaultSettings);
    applySettings(defaultSettings);
    
    if (profile) {
      await updateProfile({
        cognitive_preferences: defaultSettings
      });
    } else {
      localStorage.removeItem('synapticForgeSettings');
    }

    await trackEvent('settings_reset', {});
  };

  // Load settings from localStorage for non-authenticated users
  useEffect(() => {
    if (!profile && !isLoading) {
      const savedSettings = localStorage.getItem('synapticForgeSettings');
      if (savedSettings) {
        try {
          const parsedSettings = JSON.parse(savedSettings);
          const mergedSettings = { ...defaultSettings, ...parsedSettings };
          setSettings(mergedSettings);
          applySettings(mergedSettings);
        } catch (error) {
          console.error('Error parsing saved settings:', error);
        }
      }
    }
  }, [profile, isLoading]);

  return {
    settings,
    updateSettings,
    resetSettings,
    isLoading
  };
}