import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff, Type, Contrast, Volume2, VolumeX, Keyboard, MousePointer, Accessibility } from 'lucide-react';

interface AccessibilityFeaturesProps {
  isOpen: boolean;
  onClose: () => void;
}

interface AccessibilitySettings {
  highContrast: boolean;
  largeText: boolean;
  reducedMotion: boolean;
  screenReaderMode: boolean;
  keyboardNavigation: boolean;
  audioDescriptions: boolean;
  focusIndicators: boolean;
  colorBlindMode: 'none' | 'protanopia' | 'deuteranopia' | 'tritanopia';
}

export function AccessibilityFeatures({ isOpen, onClose }: AccessibilityFeaturesProps) {
  const [settings, setSettings] = useState<AccessibilitySettings>({
    highContrast: false,
    largeText: false,
    reducedMotion: false,
    screenReaderMode: false,
    keyboardNavigation: true,
    audioDescriptions: false,
    focusIndicators: true,
    colorBlindMode: 'none'
  });

  const [announcement, setAnnouncement] = useState('');

  useEffect(() => {
    // Load accessibility settings from localStorage
    const saved = localStorage.getItem('synaptic-forge-accessibility');
    if (saved) {
      try {
        const parsedSettings = JSON.parse(saved);
        setSettings(parsedSettings);
        applyAccessibilitySettings(parsedSettings);
      } catch (error) {
        console.error('Error loading accessibility settings:', error);
      }
    }
  }, []);

  const applyAccessibilitySettings = (newSettings: AccessibilitySettings) => {
    const root = document.documentElement;
    
    // High contrast mode
    if (newSettings.highContrast) {
      root.classList.add('high-contrast');
    } else {
      root.classList.remove('high-contrast');
    }

    // Large text
    if (newSettings.largeText) {
      root.classList.add('large-text');
    } else {
      root.classList.remove('large-text');
    }

    // Reduced motion
    if (newSettings.reducedMotion) {
      root.classList.add('reduced-motion');
    } else {
      root.classList.remove('reduced-motion');
    }

    // Screen reader mode
    if (newSettings.screenReaderMode) {
      root.classList.add('screen-reader-mode');
    } else {
      root.classList.remove('screen-reader-mode');
    }

    // Focus indicators
    if (newSettings.focusIndicators) {
      root.classList.add('enhanced-focus');
    } else {
      root.classList.remove('enhanced-focus');
    }

    // Color blind mode
    root.className = root.className.replace(/colorblind-\w+/g, '');
    if (newSettings.colorBlindMode !== 'none') {
      root.classList.add(`colorblind-${newSettings.colorBlindMode}`);
    }

    // Save to localStorage
    localStorage.setItem('synaptic-forge-accessibility', JSON.stringify(newSettings));
  };

  const updateSetting = (key: keyof AccessibilitySettings, value: any) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    applyAccessibilitySettings(newSettings);
    
    // Announce change for screen readers
    setAnnouncement(`${key.replace(/([A-Z])/g, ' $1').toLowerCase()} ${value ? 'enabled' : 'disabled'}`);
  };

  const announceToScreenReader = (message: string) => {
    setAnnouncement(message);
    setTimeout(() => setAnnouncement(''), 1000);
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Screen reader announcements */}
      <div
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
      >
        {announcement}
      </div>

      <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm">
        <div className="fixed inset-4 bg-gradient-to-br from-gray-900/95 to-black/95 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl overflow-hidden">
          <div className="flex flex-col h-full">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg">
                  <Accessibility className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white font-space-grotesk">Accessibility Settings</h2>
                  <p className="text-gray-400 text-sm">Customize the interface for your needs</p>
                </div>
              </div>
              
              <button
                onClick={onClose}
                aria-label="Close accessibility settings"
                className="p-2 hover:bg-white/10 rounded-full transition-colors text-gray-400 hover:text-white"
              >
                ×
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-auto p-6">
              <div className="space-y-8">
                {/* Visual Settings */}
                <section>
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <Eye className="w-5 h-5" />
                    Visual Settings
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10">
                      <div>
                        <label className="text-white font-medium">High Contrast Mode</label>
                        <p className="text-gray-400 text-sm">Increase contrast for better visibility</p>
                      </div>
                      <button
                        onClick={() => updateSetting('highContrast', !settings.highContrast)}
                        aria-pressed={settings.highContrast}
                        className={`relative w-12 h-6 rounded-full transition-colors ${
                          settings.highContrast ? 'bg-blue-600' : 'bg-gray-600'
                        }`}
                      >
                        <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                          settings.highContrast ? 'translate-x-7' : 'translate-x-1'
                        }`} />
                      </button>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10">
                      <div>
                        <label className="text-white font-medium">Large Text</label>
                        <p className="text-gray-400 text-sm">Increase text size throughout the interface</p>
                      </div>
                      <button
                        onClick={() => updateSetting('largeText', !settings.largeText)}
                        aria-pressed={settings.largeText}
                        className={`relative w-12 h-6 rounded-full transition-colors ${
                          settings.largeText ? 'bg-blue-600' : 'bg-gray-600'
                        }`}
                      >
                        <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                          settings.largeText ? 'translate-x-7' : 'translate-x-1'
                        }`} />
                      </button>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10">
                      <div>
                        <label className="text-white font-medium">Reduced Motion</label>
                        <p className="text-gray-400 text-sm">Minimize animations and transitions</p>
                      </div>
                      <button
                        onClick={() => updateSetting('reducedMotion', !settings.reducedMotion)}
                        aria-pressed={settings.reducedMotion}
                        className={`relative w-12 h-6 rounded-full transition-colors ${
                          settings.reducedMotion ? 'bg-blue-600' : 'bg-gray-600'
                        }`}
                      >
                        <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                          settings.reducedMotion ? 'translate-x-7' : 'translate-x-1'
                        }`} />
                      </button>
                    </div>

                    <div className="p-4 bg-white/5 rounded-lg border border-white/10">
                      <label className="text-white font-medium mb-3 block">Color Blind Support</label>
                      <select
                        value={settings.colorBlindMode}
                        onChange={(e) => updateSetting('colorBlindMode', e.target.value)}
                        className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white text-sm"
                      >
                        <option value="none">No color blind support</option>
                        <option value="protanopia">Protanopia (Red-blind)</option>
                        <option value="deuteranopia">Deuteranopia (Green-blind)</option>
                        <option value="tritanopia">Tritanopia (Blue-blind)</option>
                      </select>
                    </div>
                  </div>
                </section>

                {/* Navigation Settings */}
                <section>
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <Keyboard className="w-5 h-5" />
                    Navigation Settings
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10">
                      <div>
                        <label className="text-white font-medium">Enhanced Focus Indicators</label>
                        <p className="text-gray-400 text-sm">Show clear focus outlines for keyboard navigation</p>
                      </div>
                      <button
                        onClick={() => updateSetting('focusIndicators', !settings.focusIndicators)}
                        aria-pressed={settings.focusIndicators}
                        className={`relative w-12 h-6 rounded-full transition-colors ${
                          settings.focusIndicators ? 'bg-blue-600' : 'bg-gray-600'
                        }`}
                      >
                        <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                          settings.focusIndicators ? 'translate-x-7' : 'translate-x-1'
                        }`} />
                      </button>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10">
                      <div>
                        <label className="text-white font-medium">Keyboard Navigation</label>
                        <p className="text-gray-400 text-sm">Enable full keyboard navigation support</p>
                      </div>
                      <button
                        onClick={() => updateSetting('keyboardNavigation', !settings.keyboardNavigation)}
                        aria-pressed={settings.keyboardNavigation}
                        className={`relative w-12 h-6 rounded-full transition-colors ${
                          settings.keyboardNavigation ? 'bg-blue-600' : 'bg-gray-600'
                        }`}
                      >
                        <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                          settings.keyboardNavigation ? 'translate-x-7' : 'translate-x-1'
                        }`} />
                      </button>
                    </div>
                  </div>
                </section>

                {/* Screen Reader Settings */}
                <section>
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <Volume2 className="w-5 h-5" />
                    Screen Reader Settings
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10">
                      <div>
                        <label className="text-white font-medium">Screen Reader Mode</label>
                        <p className="text-gray-400 text-sm">Optimize interface for screen readers</p>
                      </div>
                      <button
                        onClick={() => updateSetting('screenReaderMode', !settings.screenReaderMode)}
                        aria-pressed={settings.screenReaderMode}
                        className={`relative w-12 h-6 rounded-full transition-colors ${
                          settings.screenReaderMode ? 'bg-blue-600' : 'bg-gray-600'
                        }`}
                      >
                        <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                          settings.screenReaderMode ? 'translate-x-7' : 'translate-x-1'
                        }`} />
                      </button>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10">
                      <div>
                        <label className="text-white font-medium">Audio Descriptions</label>
                        <p className="text-gray-400 text-sm">Provide audio descriptions for visual content</p>
                      </div>
                      <button
                        onClick={() => updateSetting('audioDescriptions', !settings.audioDescriptions)}
                        aria-pressed={settings.audioDescriptions}
                        className={`relative w-12 h-6 rounded-full transition-colors ${
                          settings.audioDescriptions ? 'bg-blue-600' : 'bg-gray-600'
                        }`}
                      >
                        <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                          settings.audioDescriptions ? 'translate-x-7' : 'translate-x-1'
                        }`} />
                      </button>
                    </div>
                  </div>
                </section>

                {/* Keyboard Shortcuts Reference */}
                <section>
                  <h3 className="text-lg font-semibold text-white mb-4">Keyboard Shortcuts</h3>
                  <div className="bg-white/5 rounded-lg border border-white/10 p-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-gray-300">Open Query Forge</span>
                          <kbd className="px-2 py-1 bg-gray-700 rounded text-xs">Ctrl+N</kbd>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-300">Upload Data</span>
                          <kbd className="px-2 py-1 bg-gray-700 rounded text-xs">Ctrl+U</kbd>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-300">Share Insight</span>
                          <kbd className="px-2 py-1 bg-gray-700 rounded text-xs">Ctrl+S</kbd>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-gray-300">Open Settings</span>
                          <kbd className="px-2 py-1 bg-gray-700 rounded text-xs">Ctrl+,</kbd>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-300">Search</span>
                          <kbd className="px-2 py-1 bg-gray-700 rounded text-xs">Ctrl+K</kbd>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-300">Help</span>
                          <kbd className="px-2 py-1 bg-gray-700 rounded text-xs">F1</kbd>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>
              </div>
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-white/10">
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-400">
                  Settings are automatically saved and applied
                </p>
                <motion.button
                  onClick={() => {
                    const defaultSettings: AccessibilitySettings = {
                      highContrast: false,
                      largeText: false,
                      reducedMotion: false,
                      screenReaderMode: false,
                      keyboardNavigation: true,
                      audioDescriptions: false,
                      focusIndicators: true,
                      colorBlindMode: 'none'
                    };
                    setSettings(defaultSettings);
                    applyAccessibilitySettings(defaultSettings);
                    announceToScreenReader('Accessibility settings reset to defaults');
                  }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium"
                >
                  Reset to Defaults
                </motion.button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}