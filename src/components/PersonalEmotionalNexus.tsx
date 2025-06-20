import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PersonalEmotionalState } from '../types';
import { Brain, Zap, Settings, X } from 'lucide-react';

interface PersonalEmotionalNexusProps {
  onStateChange: (state: PersonalEmotionalState) => void;
  isActive: boolean;
  onToggle: () => void;
}

const EMOTIONAL_STATES = [
  { value: 'joyful', label: 'Joyful', color: 'from-yellow-400 to-orange-400' },
  { value: 'calm', label: 'Calm', color: 'from-blue-400 to-cyan-400' },
  { value: 'focused', label: 'Focused', color: 'from-purple-400 to-indigo-400' },
  { value: 'curious', label: 'Curious', color: 'from-green-400 to-emerald-400' },
  { value: 'pensive', label: 'Pensive', color: 'from-gray-400 to-slate-400' },
  { value: 'agitated', label: 'Agitated', color: 'from-red-400 to-pink-400' },
  { value: 'empathetic', label: 'Empathetic', color: 'from-pink-400 to-rose-400' },
  { value: 'neutral', label: 'Neutral', color: 'from-gray-500 to-gray-600' },
  { value: 'creative', label: 'Creative', color: 'from-violet-400 to-purple-400' },
  { value: 'anxious', label: 'Anxious', color: 'from-orange-400 to-red-400' },
  { value: 'energetic', label: 'Energetic', color: 'from-lime-400 to-green-400' },
  { value: 'reflective', label: 'Reflective', color: 'from-indigo-400 to-blue-400' }
] as const;

export function PersonalEmotionalNexus({ onStateChange, isActive, onToggle }: PersonalEmotionalNexusProps) {
  const [selectedState, setSelectedState] = useState<PersonalEmotionalState['state']>('neutral');
  const [intensity, setIntensity] = useState(5);
  const [isExpanded, setIsExpanded] = useState(false);

  const handleLinkPsyche = () => {
    onStateChange({ state: selectedState, intensity });
    setIsExpanded(false);
  };

  const selectedStateData = EMOTIONAL_STATES.find(s => s.value === selectedState);

  return (
    <>
      {/* Toggle Button */}
      <AnimatePresence>
        {!isExpanded && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={() => setIsExpanded(true)}
            className="fixed top-6 left-6 z-40 bg-gradient-to-r from-purple-600/80 to-blue-600/80 backdrop-blur-xl hover:from-purple-700/80 hover:to-blue-700/80 text-white p-4 rounded-full shadow-lg transition-all duration-200 hover:scale-105 border border-white/20"
          >
            <Brain className="w-6 h-6" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Nexus Panel */}
      <AnimatePresence>
        {isExpanded && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
              onClick={() => setIsExpanded(false)}
            />

            {/* Panel */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: -20 }}
              className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md mx-4"
            >
              <div className="bg-gradient-to-br from-gray-900/95 to-black/95 backdrop-blur-xl rounded-2xl p-8 border border-white/10 shadow-2xl">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 bg-gradient-to-r ${selectedStateData?.color || 'from-gray-500 to-gray-600'} rounded-lg`}>
                      <Brain className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white font-orbitron">Personal Emotional Nexus</h3>
                      <p className="text-gray-400 text-sm">Calibrate your psychic resonance</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsExpanded(false)}
                    className="p-2 hover:bg-white/10 rounded-full transition-colors text-gray-400 hover:text-white"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Emotional State Selection */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-300 mb-3">
                    Current Emotional State
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {EMOTIONAL_STATES.map((state) => (
                      <button
                        key={state.value}
                        onClick={() => setSelectedState(state.value)}
                        className={`px-3 py-2 rounded-lg text-sm transition-all backdrop-blur-sm border ${
                          selectedState === state.value
                            ? `bg-gradient-to-r ${state.color} text-white border-white/30 shadow-lg`
                            : 'bg-white/5 text-gray-400 hover:text-white border-white/10 hover:border-white/20'
                        }`}
                      >
                        {state.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Intensity Slider */}
                <div className="mb-8">
                  <label className="block text-sm font-medium text-gray-300 mb-3">
                    Emotional Intensity: {intensity}/10
                  </label>
                  <div className="relative">
                    <input
                      type="range"
                      min="0"
                      max="10"
                      value={intensity}
                      onChange={(e) => setIntensity(Number(e.target.value))}
                      className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                      style={{
                        background: `linear-gradient(to right, ${selectedStateData?.color.replace('from-', '').replace('to-', ', ')}) 0%, ${selectedStateData?.color.replace('from-', '').replace('to-', ', ')} ${intensity * 10}%, #374151 ${intensity * 10}%, #374151 100%)`
                      }}
                    />
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>Neutral</span>
                      <span>Overwhelming</span>
                    </div>
                  </div>
                </div>

                {/* Link Button */}
                <motion.button
                  onClick={handleLinkPsyche}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`w-full bg-gradient-to-r ${selectedStateData?.color || 'from-gray-500 to-gray-600'} text-white py-4 rounded-lg font-medium transition-all duration-200 font-orbitron text-lg shadow-lg flex items-center justify-center gap-3`}
                >
                  <Zap className="w-5 h-5" />
                  Link Psyche
                </motion.button>

                <p className="text-xs text-gray-500 text-center mt-3">
                  Your emotional state will blend with the global consciousness
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}