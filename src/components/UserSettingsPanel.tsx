import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Settings, X, Save, Moon, Sun, Volume2, VolumeX, Palette, Brain, Zap, Eye, Cpu, Bell, Shield } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useUserProfile } from '../hooks/useUserProfile';
import { useAnalytics } from '../hooks/useAnalytics';

interface UserSettings {
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

interface UserSettingsPanelProps {
  isOpen: boolean;
  onToggle: () => void;
  onSettingsChange: (settings: UserSettings) => void;
}

export function UserSettingsPanel({ isOpen, onToggle, onSettingsChange }: UserSettingsPanelProps) {
  const { user } = useAuth();
  const { profile, updateProfile } = useUserProfile();
  const { trackEvent } = useAnalytics();
  
  const [settings, setSettings] = useState<UserSettings>({
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
  });

  const [customTopic, setCustomTopic] = useState('');
  const [activeTab, setActiveTab] = useState<'general' | 'ai' | 'privacy' | 'advanced'>('general');
  const [hasChanges, setHasChanges] = useState(false);
  const [saving, setSaving] = useState(false);

  // Load settings from user profile
  useEffect(() => {
    if (profile?.cognitive_preferences) {
      const prefs = profile.cognitive_preferences;
      setSettings(prev => ({
        ...prev,
        aiVoiceTone: prefs.voiceTone || 'authoritative',
        preferredBrainwaveState: prefs.preferredBrainwaveState || 'beta',
        visualComplexity: prefs.visualComplexity || 'moderate',
        visualMotionIntensity: prefs.visualMotionIntensity || 7,
        insightConfidenceThreshold: prefs.insightConfidenceThreshold || 75,
        cognitiveOptimization: prefs.cognitiveOptimization !== false,
        audioEnabled: prefs.audioEnabled !== false,
        ...prefs
      }));
    }
  }, [profile]);

  const handleSettingChange = (key: keyof UserSettings, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    setHasChanges(true);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      // Update user profile with new settings
      if (user && profile) {
        await updateProfile({
          cognitive_preferences: {
            ...profile.cognitive_preferences,
            ...settings
          }
        });
        
        await trackEvent('settings_updated', {
          settings_changed: Object.keys(settings),
          ai_voice_tone: settings.aiVoiceTone,
          visual_complexity: settings.visualComplexity
        });
      }
      
      // Apply settings to the app
      onSettingsChange(settings);
      setHasChanges(false);
      
      // Apply theme immediately
      if (settings.theme === 'light') {
        document.documentElement.classList.add('light-theme');
      } else {
        document.documentElement.classList.remove('light-theme');
      }
      
    } catch (error) {
      console.error('Error saving settings:', error);
    } finally {
      setSaving(false);
    }
  };

  const addCustomTopic = () => {
    if (customTopic.trim() && !settings.priorityTopics.includes(customTopic.trim())) {
      handleSettingChange('priorityTopics', [...settings.priorityTopics, customTopic.trim()]);
      setCustomTopic('');
    }
  };

  const removeTopic = (topic: string) => {
    handleSettingChange('priorityTopics', settings.priorityTopics.filter(t => t !== topic));
  };

  const predefinedTopics = [
    'Artificial Intelligence', 'Quantum Computing', 'Blockchain', 'Cybersecurity',
    'Climate Technology', 'Biotechnology', 'Space Technology', 'Renewable Energy',
    'Autonomous Vehicles', 'IoT', 'Robotics', 'Fintech', 'Healthtech', 'Edtech',
    'Metaverse', 'Web3', 'Nanotechnology', 'Gene Therapy', 'Nuclear Fusion'
  ];

  const tabs = [
    { id: 'general', label: 'General', icon: Settings },
    { id: 'ai', label: 'AI Behavior', icon: Brain },
    { id: 'privacy', label: 'Privacy', icon: Shield },
    { id: 'advanced', label: 'Advanced', icon: Cpu }
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
              className="fixed left-0 top-0 h-full w-full max-w-2xl bg-gradient-to-br from-gray-900/95 to-black/95 backdrop-blur-xl shadow-2xl overflow-y-auto z-50 border-r border-white/10"
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
                  <div className="flex items-center gap-3">
                    {hasChanges && (
                      <motion.button
                        onClick={handleSave}
                        disabled={saving}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors text-sm font-medium disabled:opacity-50"
                      >
                        <Save className="w-4 h-4" />
                        {saving ? 'Saving...' : 'Save'}
                      </motion.button>
                    )}
                    <button
                      onClick={onToggle}
                      className="p-2 hover:bg-white/10 rounded-full transition-colors text-gray-400 hover:text-white"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {/* Tabs */}
                <div className="flex space-x-1 mb-6 bg-white/5 rounded-lg p-1">
                  {tabs.map((tab) => {
                    const Icon = tab.icon;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as any)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
                          activeTab === tab.id
                            ? 'bg-white/10 text-white'
                            : 'text-gray-400 hover:text-white hover:bg-white/5'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                        {tab.label}
                      </button>
                    );
                  })}
                </div>

                {/* Tab Content */}
                <div className="space-y-6">
                  {activeTab === 'general' && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="space-y-6"
                    >
                      {/* Theme */}
                      <div>
                        <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-3">
                          <Palette className="w-4 h-4" />
                          Theme Preference
                        </label>
                        <div className="grid grid-cols-2 gap-3">
                          <button
                            onClick={() => handleSettingChange('theme', 'dark')}
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
                            onClick={() => handleSettingChange('theme', 'light')}
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

                      {/* Audio Settings */}
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Volume2 className="w-4 h-4 text-gray-400" />
                            <span className="text-sm text-gray-300">Audio Feedback</span>
                          </div>
                          <button
                            onClick={() => handleSettingChange('audioEnabled', !settings.audioEnabled)}
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
                          <div className="flex items-center gap-2">
                            <Bell className="w-4 h-4 text-gray-400" />
                            <span className="text-sm text-gray-300">Proactive Alerts</span>
                          </div>
                          <button
                            onClick={() => handleSettingChange('proactiveAlerts', !settings.proactiveAlerts)}
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
                          <div className="flex items-center gap-2">
                            <Brain className="w-4 h-4 text-gray-400" />
                            <span className="text-sm text-gray-300">Cognitive Optimization</span>
                          </div>
                          <button
                            onClick={() => handleSettingChange('cognitiveOptimization', !settings.cognitiveOptimization)}
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

                      {/* Notification Frequency */}
                      <div>
                        <label className="text-sm font-medium text-gray-300 mb-3 block">
                          Notification Frequency
                        </label>
                        <select
                          value={settings.notificationFrequency}
                          onChange={(e) => handleSettingChange('notificationFrequency', e.target.value)}
                          className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent text-white text-sm"
                        >
                          <option value="realtime">Real-time</option>
                          <option value="hourly">Hourly</option>
                          <option value="daily">Daily</option>
                          <option value="weekly">Weekly</option>
                        </select>
                      </div>
                    </motion.div>
                  )}

                  {activeTab === 'ai' && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="space-y-6"
                    >
                      {/* AI Voice Tone */}
                      <div>
                        <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-3">
                          <Brain className="w-4 h-4" />
                          AI Voice Tone
                        </label>
                        <select
                          value={settings.aiVoiceTone}
                          onChange={(e) => handleSettingChange('aiVoiceTone', e.target.value)}
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
                          onChange={(e) => handleSettingChange('defaultAnalysisType', e.target.value)}
                          className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent text-white text-sm"
                        >
                          <option value="strategic_analysis">Strategic Analysis</option>
                          <option value="innovation_opportunities">Innovation Opportunities</option>
                          <option value="risk_assessment">Risk Assessment</option>
                          <option value="market_disruption">Market Disruption</option>
                        </select>
                      </div>

                      {/* AI Personality Growth Rate */}
                      <div>
                        <label className="text-sm font-medium text-gray-300 mb-3 block">
                          AI Personality Growth Rate
                        </label>
                        <div className="grid grid-cols-3 gap-2">
                          {['slow', 'normal', 'fast'].map((rate) => (
                            <button
                              key={rate}
                              onClick={() => handleSettingChange('aiPersonalityGrowthRate', rate)}
                              className={`p-2 rounded-lg text-sm transition-all capitalize ${
                                settings.aiPersonalityGrowthRate === rate
                                  ? 'bg-gradient-to-r from-purple-600/30 to-blue-600/30 text-purple-300 border border-purple-500/50'
                                  : 'bg-white/5 text-gray-400 hover:text-white border border-white/10'
                              }`}
                            >
                              {rate}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Preferred Brainwave State */}
                      <div>
                        <label className="text-sm font-medium text-gray-300 mb-3 block">
                          Preferred Brainwave State
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                          {[
                            { value: 'alpha', label: 'Alpha (8-13 Hz)', desc: 'Relaxed focus' },
                            { value: 'beta', label: 'Beta (13-30 Hz)', desc: 'Active thinking' },
                            { value: 'gamma', label: 'Gamma (30-100 Hz)', desc: 'Peak performance' },
                            { value: 'theta', label: 'Theta (4-8 Hz)', desc: 'Creative flow' }
                          ].map((state) => (
                            <button
                              key={state.value}
                              onClick={() => handleSettingChange('preferredBrainwaveState', state.value)}
                              className={`p-3 rounded-lg text-left transition-all ${
                                settings.preferredBrainwaveState === state.value
                                  ? 'bg-gradient-to-r from-cyan-600/30 to-blue-600/30 text-cyan-300 border border-cyan-500/50'
                                  : 'bg-white/5 text-gray-400 hover:text-white border border-white/10'
                              }`}
                            >
                              <div className="font-medium text-sm">{state.label}</div>
                              <div className="text-xs opacity-75">{state.desc}</div>
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Insight Confidence Threshold */}
                      <div>
                        <label className="text-sm font-medium text-gray-300 mb-3 block">
                          Insight Confidence Threshold: {settings.insightConfidenceThreshold}%
                        </label>
                        <input
                          type="range"
                          min="50"
                          max="95"
                          value={settings.insightConfidenceThreshold}
                          onChange={(e) => handleSettingChange('insightConfidenceThreshold', Number(e.target.value))}
                          className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                        />
                        <div className="flex justify-between text-xs text-gray-500 mt-1">
                          <span>50% (More insights)</span>
                          <span>95% (Higher quality)</span>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {activeTab === 'privacy' && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="space-y-6"
                    >
                      {/* Privacy Settings */}
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Shield className="w-4 h-4 text-gray-400" />
                            <div>
                              <span className="text-sm text-gray-300">Privacy Mode</span>
                              <div className="text-xs text-gray-500">Minimize data collection</div>
                            </div>
                          </div>
                          <button
                            onClick={() => handleSettingChange('privacyMode', !settings.privacyMode)}
                            className={`relative w-12 h-6 rounded-full transition-colors ${
                              settings.privacyMode ? 'bg-emerald-600' : 'bg-gray-600'
                            }`}
                          >
                            <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                              settings.privacyMode ? 'translate-x-7' : 'translate-x-1'
                            }`} />
                          </button>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Zap className="w-4 h-4 text-gray-400" />
                            <div>
                              <span className="text-sm text-gray-300">Auto-save Interactions</span>
                              <div className="text-xs text-gray-500">Automatically save AI conversations</div>
                            </div>
                          </div>
                          <button
                            onClick={() => handleSettingChange('autoSaveInteractions', !settings.autoSaveInteractions)}
                            className={`relative w-12 h-6 rounded-full transition-colors ${
                              settings.autoSaveInteractions ? 'bg-emerald-600' : 'bg-gray-600'
                            }`}
                          >
                            <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                              settings.autoSaveInteractions ? 'translate-x-7' : 'translate-x-1'
                            }`} />
                          </button>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Eye className="w-4 h-4 text-gray-400" />
                            <div>
                              <span className="text-sm text-gray-300">Analytics Sharing</span>
                              <div className="text-xs text-gray-500">Help improve the platform</div>
                            </div>
                          </div>
                          <button
                            onClick={() => handleSettingChange('analyticsSharing', !settings.analyticsSharing)}
                            className={`relative w-12 h-6 rounded-full transition-colors ${
                              settings.analyticsSharing ? 'bg-emerald-600' : 'bg-gray-600'
                            }`}
                          >
                            <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                              settings.analyticsSharing ? 'translate-x-7' : 'translate-x-1'
                            }`} />
                          </button>
                        </div>
                      </div>

                      {/* Data Retention */}
                      <div>
                        <label className="text-sm font-medium text-gray-300 mb-3 block">
                          Data Retention Period
                        </label>
                        <select
                          value={settings.dataRetentionDays}
                          onChange={(e) => handleSettingChange('dataRetentionDays', Number(e.target.value))}
                          className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent text-white text-sm"
                        >
                          <option value={30}>30 days</option>
                          <option value={90}>90 days</option>
                          <option value={180}>6 months</option>
                          <option value={365}>1 year</option>
                          <option value={-1}>Forever</option>
                        </select>
                      </div>
                    </motion.div>
                  )}

                  {activeTab === 'advanced' && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="space-y-6"
                    >
                      {/* Visual Complexity */}
                      <div>
                        <label className="text-sm font-medium text-gray-300 mb-3 block">
                          Visual Complexity
                        </label>
                        <div className="grid grid-cols-3 gap-2">
                          {['minimal', 'moderate', 'complex'].map((complexity) => (
                            <button
                              key={complexity}
                              onClick={() => handleSettingChange('visualComplexity', complexity)}
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

                      {/* Visual Motion Intensity */}
                      <div>
                        <label className="text-sm font-medium text-gray-300 mb-3 block">
                          Visual Motion Intensity: {settings.visualMotionIntensity}/10
                        </label>
                        <input
                          type="range"
                          min="0"
                          max="10"
                          value={settings.visualMotionIntensity}
                          onChange={(e) => handleSettingChange('visualMotionIntensity', Number(e.target.value))}
                          className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                        />
                        <div className="flex justify-between text-xs text-gray-500 mt-1">
                          <span>Static</span>
                          <span>Dynamic</span>
                        </div>
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
                              onClick={() => handleSettingChange('priorityTopics', [...settings.priorityTopics, topic])}
                              className="px-3 py-2 rounded-lg text-sm transition-all bg-white/5 text-gray-400 hover:text-white border border-white/10 hover:border-white/20 text-left"
                            >
                              {topic}
                            </button>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </div>

                {/* Save Button */}
                {hasChanges && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-8 p-4 bg-emerald-600/20 rounded-lg border border-emerald-500/30"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-emerald-300 font-medium text-sm">Unsaved Changes</div>
                        <div className="text-emerald-400/70 text-xs">Your settings will be applied after saving</div>
                      </div>
                      <motion.button
                        onClick={handleSave}
                        disabled={saving}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-all duration-200 font-space-grotesk font-medium disabled:opacity-50"
                      >
                        <Save className="w-4 h-4" />
                        {saving ? 'Saving...' : 'Save Settings'}
                      </motion.button>
                    </div>
                  </motion.div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}