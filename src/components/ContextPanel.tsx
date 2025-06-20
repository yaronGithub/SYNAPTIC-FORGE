import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UserContext } from '../types';
import { MapPin, Briefcase, Heart, X, Settings, Sparkles } from 'lucide-react';

interface ContextPanelProps {
  userContext: UserContext;
  onUpdateContext: (context: UserContext) => void;
  isOpen: boolean;
  onToggle: () => void;
}

const PREDEFINED_INTERESTS = [
  'Artificial Intelligence', 'Climate Change', 'Technology', 'Innovation',
  'Healthcare', 'Finance', 'Education', 'Space Exploration',
  'Renewable Energy', 'Biotechnology', 'Quantum Computing', 'Robotics',
  'Cybersecurity', 'Blockchain', 'Virtual Reality', 'Sustainability'
];

export function ContextPanel({ userContext, onUpdateContext, isOpen, onToggle }: ContextPanelProps) {
  const [location, setLocation] = useState(userContext.location);
  const [role, setRole] = useState(userContext.role);
  const [interests, setInterests] = useState<string[]>(userContext.interests);
  const [customInterest, setCustomInterest] = useState('');

  const handleApplyContext = () => {
    onUpdateContext({ location, role, interests });
    onToggle();
  };

  const toggleInterest = (interest: string) => {
    setInterests(prev =>
      prev.includes(interest)
        ? prev.filter(i => i !== interest)
        : [...prev, interest]
    );
  };

  const addCustomInterest = () => {
    if (customInterest.trim() && !interests.includes(customInterest.trim())) {
      setInterests(prev => [...prev, customInterest.trim()]);
      setCustomInterest('');
    }
  };

  const removeInterest = (interest: string) => {
    setInterests(prev => prev.filter(i => i !== interest));
  };

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
            className="fixed top-6 right-6 z-40 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white p-4 rounded-full shadow-lg transition-all duration-200 hover:scale-105 backdrop-blur-sm border border-white/20"
          >
            <Settings className="w-6 h-6" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Panel Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
            onClick={onToggle}
          />
        )}
      </AnimatePresence>

      {/* Panel Content */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-full max-w-lg bg-gradient-to-br from-gray-900/95 to-black/95 backdrop-blur-xl shadow-2xl overflow-y-auto z-50 border-l border-white/10"
          >
            <div className="p-8">
              {/* Header */}
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg">
                    <Sparkles className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white font-orbitron">Neural Context</h2>
                    <p className="text-gray-400 text-sm">Define your reality parameters</p>
                  </div>
                </div>
                <button
                  onClick={onToggle}
                  className="p-2 hover:bg-white/10 rounded-full transition-colors text-gray-400 hover:text-white"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-8">
                {/* Location */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-3">
                    <MapPin className="w-4 h-4 text-blue-400" />
                    Geographic Anchor
                  </label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g., San Francisco, CA"
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all text-white placeholder-gray-500 backdrop-blur-sm"
                  />
                </div>

                {/* Role */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-3">
                    <Briefcase className="w-4 h-4 text-green-400" />
                    Professional Identity
                  </label>
                  <input
                    type="text"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    placeholder="e.g., AI Research Scientist"
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all text-white placeholder-gray-500 backdrop-blur-sm"
                  />
                </div>

                {/* Interests */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-4">
                    <Heart className="w-4 h-4 text-pink-400" />
                    Cognitive Interests
                  </label>

                  {/* Selected Interests */}
                  {interests.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {interests.map((interest) => (
                        <motion.span
                          key={interest}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="inline-flex items-center gap-1 px-3 py-1 bg-gradient-to-r from-purple-600/20 to-blue-600/20 text-purple-300 rounded-full text-sm border border-purple-500/30 backdrop-blur-sm"
                        >
                          {interest}
                          <button
                            onClick={() => removeInterest(interest)}
                            className="hover:bg-purple-500/20 rounded-full p-0.5 transition-colors"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </motion.span>
                      ))}
                    </div>
                  )}

                  {/* Add Custom Interest */}
                  <div className="flex gap-2 mb-4">
                    <input
                      type="text"
                      value={customInterest}
                      onChange={(e) => setCustomInterest(e.target.value)}
                      placeholder="Add custom interest..."
                      className="flex-1 px-3 py-2 bg-white/5 border border-white/10 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm text-white placeholder-gray-500 backdrop-blur-sm"
                      onKeyPress={(e) => e.key === 'Enter' && addCustomInterest()}
                    />
                    <button
                      onClick={addCustomInterest}
                      className="px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all text-sm font-medium"
                    >
                      Add
                    </button>
                  </div>

                  {/* Predefined Interests */}
                  <div className="grid grid-cols-2 gap-2">
                    {PREDEFINED_INTERESTS.map((interest) => (
                      <button
                        key={interest}
                        onClick={() => toggleInterest(interest)}
                        className={`px-3 py-2 rounded-lg text-sm transition-all backdrop-blur-sm border ${
                          interests.includes(interest)
                            ? 'bg-gradient-to-r from-purple-600/30 to-blue-600/30 text-purple-300 border-purple-500/50'
                            : 'bg-white/5 text-gray-400 hover:text-white border-white/10 hover:border-white/20'
                        }`}
                      >
                        {interest}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Apply Button */}
              <motion.button
                onClick={handleApplyContext}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full mt-8 bg-gradient-to-r from-purple-600 to-blue-600 text-white py-4 rounded-lg font-medium hover:from-purple-700 hover:to-blue-700 transition-all duration-200 font-orbitron text-lg shadow-lg"
              >
                Initiate Mind-Meld
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}