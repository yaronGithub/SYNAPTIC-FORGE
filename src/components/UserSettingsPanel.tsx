import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Settings, X, Save, Moon, Sun, Volume2, VolumeX, Palette, Brain } from 'lucide-react';

interface UserSettings {
  theme: 'dark' | 'light';
  aiVoiceTone: 'authoritative' | 'exploratory' | 'urgent' | 'meditative' | 'skeptical';
  defaultAnalysisType: 'strategic_analysis' | 'innovation_opportunities' | 'risk_assessment' | 'market_disruption';
  priorityTopics: string[];
  audioEnabled: boolean;
  proactiveAlerts: boolean;
  visualComplexity: 'minimal' | 'moderate' | 'complex';
  cognitiveOptimization: boolean;
}

interface UserSettingsPanelProps {
  isOpen: boolean;
  onToggle: () => void;
  onSettingsChange: (settings: UserSettings) => void;
}

export function UserSettingsPanel({ isOpen, onToggle, onSettingsChange }: UserSettingsPanelProps) {
  const [settings, setSettings] = useState<UserSettings>({
    theme: 'dark',
    aiVoiceTone: 'authoritative',
    defaultAnalysisType: 'strategic_analysis',
    priorityTopics: ['AI/ML', 'Quantum Computing', 'Sustainability'],
    audioEnabled: true,
    proactiveAlerts: true,
    visualComplexity: 'moderate',
    cognitiveOptimization: true
  });

  const [customTopic, setCustomTopic] = useState('');

  const handleSave = () => {
    onSettingsChange(settings);
    onToggle();
  };

  const addCustomTopic = () => {
    if (customTopic.trim() && !settings.priorityTopics.includes(customTopic.trim())) {
      setSettings(prev => ({
        ...prev,
        priorityTopics: [...prev.priorityTopics, customTopic.trim()]
      }));
      setCustomTopic('');
    }
  };

  const removeTopic = (topic: string) => {
    setSettings(prev => ({
      ...prev,
      priorityTopics: prev.priorityTopics.filter(t => t !== topic)
    }));
  };

  const predefinedTopics = [
    'Artificial Intelligence', 'Quantum Computing', 'Blockchain', 'Cybersecurity',
    'Climate Technology', 'Biotechnology', 'Space Technology', 'Renewable Energy',
    'Autonomous Vehicles', 'IoT', 'Robotics', 'Fintech', 'Healthtech', 'Edtech'
  ];

  return (
    <>
      {/* Toggle Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={onToggle}
            className="fixed top-6 left-6 z-40 bg-gradient-to-r from-gray-600/80 to-gray-700/80 hover:from-gray-700/80 hover:to-gray-800/80 text-white p-3 rounded-full shadow-lg transition-all duration-200 hover:scale-105 backdrop-blur-sm border border-white/20"
          >
            <Settings className="w-5 h-5" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Settings Panel */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
              onClick={onToggle}
            />

            {/* Panel */}
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed left-0 top-0 h-full w-full max-w-md bg-gradient-to-br from-gray-900/95 to-black/95 backdrop-blur-xl shadow-2xl overflow-y-auto z-50 border-r border-white/10"
            >
              <div className="p-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-gradient-to-r from-gray-600 to-gray-700 rounded-lg">
                      <Settings className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-white font-space-grotesk">System Settings</h2>
                      <p className="text-gray-400 text-sm">Customize your SYNAPTIC FORGE experience</p>
                    </div>
                  </div>
                  <button
                    onClick={onToggle}
                    className="p-2 hover:bg-white/10 rounded-full transition-colors text-gray-400 hover:text-white"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-6">
                  {/* Theme */}
                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-3">
                      <Palette className="w-4 h-4" />
                      Theme Preference
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        onClick={() => setSettings(prev => ({ ...prev, theme: 'dark' }))}
                        className={`flex items-center gap-2 p-3 rounded-lg transition-all ${
                          settings.theme === 'dark'
                            ? 'bg-gradient-to-r from-gray-600/30 to-gray-700/30 text-gray-300 border border-gray-500/50'
                            : 'bg-white/5 text-gray-400 hover:text-white border border-white/10'
                        }`}
                      >
                        <Moon className="w-4 h-4" />
                        Dark
                      </button>
                      <button
                        onClick={() => setSettings(prev => ({ ...prev, theme: 'light' }))}
                        className={`flex items-center gap-2 p-3 rounded-lg transition-all ${
                          settings.theme === 'light'
                            ? 'bg-gradient-to-r from-gray-600/30 to-gray-700/30 text-gray-300 border border-gray-500/50'
                            : 'bg-white/5 text-gray-400 hover:text-white border border-white/10'
                        }`}
                      >
                        <Sun className="w-4 h-4" />
                        Light
                      </button>
                    </div>
                  </div>

                  {/* AI Voice Tone */}
                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-3">
                      <Brain className="w-4 h-4" />
                      AI Voice Tone
                    </label>
                    <select
                      value={settings.aiVoiceTone}
                      onChange={(e) => setSettings(prev => ({ ...prev, aiVoiceTone: e.target.value as any }))}
                      className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent text-white text-sm"
                    >
                      <option value="authoritative">Authoritative</option>
                      <option value="exploratory">Exploratory</option>
                      <option value="urgent">Urgent</option>
                      <option value="meditative">Meditative</option>
                      <option value="skeptical">Skeptical</option>
                    </select>
                  </div>

                  {/* Default Analysis Type */}
                  <div>
                    <label className="text-sm font-medium text-gray-300 mb-3 block">
                      Default Analysis Type
                    </label>
                    <select
                      value={settings.defaultAnalysisType}
                      onChange={(e) => setSettings(prev => ({ ...prev, defaultAnalysisType: e.target.value as any }))}
                      className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent text-white text-sm"
                    >
                      <option value="strategic_analysis">Strategic Analysis</option>
                      <option value="innovation_opportunities">Innovation Opportunities</option>
                      <option value="risk_assessment">Risk Assessment</option>
                      <option value="market_disruption">Market Disruption</option>
                    </select>
                  </div>

                  {/* Priority Topics */}
                  <div>
                    <label className="text-sm font-medium text-gray-300 mb-3 block">
                      Priority Topics for Alerts
                    </label>

                    {/* Selected Topics */}
                    {settings.priorityTopics.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-3">
                        {settings.priorityTopics.map((topic) => (
                          <span
                            key={topic}
                            className="inline-flex items-center gap-1 px-3 py-1 bg-gradient-to-r from-gray-600/20 to-gray-700/20 text-gray-300 rounded-full text-sm border border-gray-500/30"
                          >
                            {topic}
                            <button
                              onClick={() => removeTopic(topic)}
                              className="hover:bg-gray-500/20 rounded-full p-0.5 transition-colors"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Add Custom Topic */}
                    <div className="flex gap-2 mb-3">
                      <input
                        type="text"
                        value={customTopic}
                        onChange={(e) => setCustomTopic(e.target.value)}
                        placeholder="Add custom topic..."
                        className="flex-1 px-3 py-2 bg-white/5 border border-white/10 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent text-sm text-white placeholder-gray-500"
                        onKeyPress={(e) => e.key === 'Enter' && addCustomTopic()}
                      />
                      <button
                        onClick={addCustomTopic}
                        className="px-3 py-2 bg-gradient-to-r from-gray-600 to-gray-700 text-white rounded-lg hover:from-gray-700 hover:to-gray-800 transition-all text-sm font-medium"
                      >
                        Add
                      </button>
                    </div>

                    {/* Predefined Topics */}
                    <div className="grid grid-cols-2 gap-2 max-h-32 overflow-y-auto">
                      {predefinedTopics.filter(topic => !settings.priorityTopics.includes(topic)).map((topic) => (
                        <button
                          key={topic}
                          onClick={() => setSettings(prev => ({ ...prev, priorityTopics: [...prev.priorityTopics, topic] }))}
                          className="px-3 py-2 rounded-lg text-sm transition-all bg-white/5 text-gray-400 hover:text-white border border-white/10 hover:border-white/20"
                        >
                          {topic}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Toggle Settings */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Volume2 className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-300">Audio Feedback</span>
                      </div>
                      <button
                        onClick={() => setSettings(prev => ({ ...prev, audioEnabled: !prev.audioEnabled }))}
                        className={`relative w-12 h-6 rounded-full transition-colors ${
                          settings.audioEnabled ? 'bg-emerald-600' : 'bg-gray-600'
                        }`}
                      >
                        <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                          settings.audioEnabled ? 'translate-x-7' : 'translate-x-1'
                        }`} />
                      </button>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-300">Proactive Alerts</span>
                      <button
                        onClick={() => setSettings(prev => ({ ...prev, proactiveAlerts: !prev.proactiveAlerts }))}
                        className={`relative w-12 h-6 rounded-full transition-colors ${
                          settings.proactiveAlerts ? 'bg-emerald-600' : 'bg-gray-600'
                        }`}
                      >
                        <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                          settings.proactiveAlerts ? 'translate-x-7' : 'translate-x-1'
                        }`} />
                      </button>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-300">Cognitive Optimization</span>
                      <button
                        onClick={() => setSettings(prev => ({ ...prev, cognitiveOptimization: !prev.cognitiveOptimization }))}
                        className={`relative w-12 h-6 rounded-full transition-colors ${
                          settings.cognitiveOptimization ? 'bg-emerald-600' : 'bg-gray-600'
                        }`}
                      >
                        <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                          settings.cognitiveOptimization ? 'translate-x-7' : 'translate-x-1'
                        }`} />
                      </button>
                    </div>
                  </div>

                  {/* Visual Complexity */}
                  <div>
                    <label className="text-sm font-medium text-gray-300 mb-3 block">
                      Visual Complexity
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {['minimal', 'moderate', 'complex'].map((complexity) => (
                        <button
                          key={complexity}
                          onClick={() => setSettings(prev => ({ ...prev, visualComplexity: complexity as any }))}
                          className={`p-2 rounded-lg text-sm transition-all capitalize ${
                            settings.visualComplexity === complexity
                              ? 'bg-gradient-to-r from-gray-600/30 to-gray-700/30 text-gray-300 border border-gray-500/50'
                              : 'bg-white/5 text-gray-400 hover:text-white border border-white/10'
                          }`}
                        >
                          {complexity}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Save Button */}
                <motion.button
                  onClick={handleSave}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full mt-8 bg-gradient-to-r from-gray-600 to-gray-700 text-white py-3 rounded-lg font-medium hover:from-gray-700 hover:to-gray-800 transition-all duration-200 font-space-grotesk flex items-center justify-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  Save Settings
                </motion.button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}