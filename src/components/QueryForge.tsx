import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { QueryContext } from '../types';
import { Zap, Brain, Target, AlertTriangle, Lightbulb, X, Sparkles, Cpu, Layers, Orbit } from 'lucide-react';

interface QueryForgeProps {
  onQuerySubmit: (queryContext: QueryContext) => void;
  isProcessing: boolean;
  isVisible: boolean;
  onToggle: () => void;
}

const QUERY_TYPES = [
  { 
    value: 'strategic_analysis', 
    label: 'Strategic Analysis', 
    icon: Target,
    description: 'Deep strategic implications and competitive positioning',
    gradient: 'from-emerald-600 to-cyan-600'
  },
  { 
    value: 'innovation_opportunities', 
    label: 'Innovation Opportunities', 
    icon: Lightbulb,
    description: 'Emerging innovation vectors and breakthrough potential',
    gradient: 'from-cyan-600 to-purple-600'
  },
  { 
    value: 'risk_assessment', 
    label: 'Risk Assessment', 
    icon: AlertTriangle,
    description: 'Threat analysis and vulnerability identification',
    gradient: 'from-purple-600 to-pink-600'
  },
  { 
    value: 'market_disruption', 
    label: 'Market Disruption', 
    icon: Zap,
    description: 'Disruptive forces and paradigm shifts',
    gradient: 'from-pink-600 to-orange-600'
  }
] as const;

const COGNITIVE_STATES = [
  { 
    value: 'Enhance Decision Clarity', 
    label: 'Decision Clarity', 
    description: 'Optimize for clear, decisive thinking',
    icon: Target,
    gradient: 'from-emerald-500 to-teal-500'
  },
  { 
    value: 'Stimulate Creative Association', 
    label: 'Creative Flow', 
    description: 'Enhance innovative and lateral thinking',
    icon: Sparkles,
    gradient: 'from-purple-500 to-pink-500'
  },
  { 
    value: 'Reduce Ambiguity', 
    label: 'Analytical Focus', 
    description: 'Sharpen logical analysis and precision',
    icon: Cpu,
    gradient: 'from-blue-500 to-cyan-500'
  },
  { 
    value: 'Expand Strategic Vision', 
    label: 'Visionary Thinking', 
    description: 'Broaden perspective and long-term insight',
    icon: Orbit,
    gradient: 'from-indigo-500 to-purple-500'
  }
];

export function QueryForge({ onQuerySubmit, isProcessing, isVisible, onToggle }: QueryForgeProps) {
  const [queryType, setQueryType] = useState<QueryContext['type']>('strategic_analysis');
  const [query, setQuery] = useState('');
  const [urgency, setUrgency] = useState<QueryContext['urgency']>('medium');
  const [scope, setScope] = useState<QueryContext['scope']>('strategic');
  const [cognitiveState, setCognitiveState] = useState('Enhance Decision Clarity');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onQuerySubmit({
        type: queryType,
        query: query.trim(),
        urgency,
        scope,
        cognitiveStatePreference: cognitiveState
      });
      setQuery('');
      onToggle();
    }
  };

  const selectedQueryType = QUERY_TYPES.find(t => t.value === queryType);
  const selectedCognitiveState = COGNITIVE_STATES.find(c => c.value === cognitiveState);

  return (
    <>
      {/* Enhanced Toggle Button - Brain Icon */}
      <AnimatePresence>
        {!isVisible && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            onClick={onToggle}
            disabled={isProcessing}
            whileHover={{ scale: 1.1, rotate: 5 }}
            whileTap={{ scale: 0.9 }}
            className="fixed bottom-20 right-6 z-40 bg-gradient-to-r from-emerald-600 via-cyan-600 to-purple-600 hover:from-emerald-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white p-6 rounded-3xl shadow-2xl transition-all duration-300 backdrop-blur-xl border border-white/20 hover:shadow-emerald-500/25"
          >
            <motion.div
              animate={{ rotate: isProcessing ? 360 : 0 }}
              transition={{ duration: 2, repeat: isProcessing ? Infinity : 0, ease: "linear" }}
            >
              <Brain className="w-8 h-8" />
            </motion.div>
            
            {/* Pulsing Ring */}
            <motion.div
              className="absolute inset-0 rounded-3xl border-2 border-emerald-400/50"
              animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            
            {/* Floating Particles */}
            {Array.from({ length: 3 }).map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-emerald-400 rounded-full"
                style={{
                  top: '50%',
                  left: '50%',
                }}
                animate={{
                  x: [0, Math.cos(i * 120 * Math.PI / 180) * 30],
                  y: [0, Math.sin(i * 120 * Math.PI / 180) * 30],
                  opacity: [0, 1, 0],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: i * 0.3,
                }}
              />
            ))}
          </motion.button>
        )}
      </AnimatePresence>

      {/* Enhanced Modal Overlay */}
      <AnimatePresence>
        {isVisible && (
          <>
            {/* Spectacular Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/70 backdrop-blur-lg"
              onClick={onToggle}
            />

            {/* Scrollable Modal Container */}
            <div className="fixed inset-0 z-50 overflow-y-auto">
              <div className="flex min-h-full items-center justify-center p-4">
                <motion.div
                  initial={{ opacity: 0, scale: 0.8, y: 50 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.8, y: 50 }}
                  transition={{ type: "spring", damping: 25, stiffness: 300 }}
                  className="w-full max-w-4xl bg-gradient-to-br from-gray-900/95 via-black/95 to-gray-900/95 backdrop-blur-3xl rounded-3xl border border-white/20 shadow-2xl overflow-hidden"
                  onClick={(e) => e.stopPropagation()}
                >
                  {/* Enhanced Header */}
                  <div className="relative p-8 bg-gradient-to-r from-emerald-600/20 via-cyan-600/20 to-purple-600/20 border-b border-white/10">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                          className="p-3 bg-gradient-to-r from-emerald-600 to-cyan-600 rounded-2xl shadow-lg"
                        >
                          <Brain className="w-8 h-8 text-white" />
                        </motion.div>
                        <div>
                          <h3 className="text-3xl font-bold text-white font-space-grotesk">Query Forge</h3>
                          <p className="text-emerald-300 text-lg">Initiate strategic foresight analysis</p>
                        </div>
                      </div>
                      <motion.button
                        onClick={onToggle}
                        whileHover={{ scale: 1.1, rotate: 90 }}
                        whileTap={{ scale: 0.9 }}
                        className="p-3 hover:bg-white/10 rounded-2xl transition-all duration-300 text-gray-400 hover:text-white border border-white/10"
                      >
                        <X className="w-6 h-6" />
                      </motion.button>
                    </div>
                    
                    {/* Floating Orbs */}
                    <div className="absolute top-4 right-20 w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                    <div className="absolute bottom-4 left-20 w-1 h-1 bg-cyan-400 rounded-full animate-bounce" />
                  </div>

                  <form onSubmit={handleSubmit} className="p-8 space-y-8">
                    {/* Enhanced Query Type Selection */}
                    <div>
                      <label className="block text-lg font-medium text-gray-300 mb-6">
                        Analysis Type
                      </label>
                      <div className="grid grid-cols-2 gap-4">
                        {QUERY_TYPES.map((type) => {
                          const Icon = type.icon;
                          const isSelected = queryType === type.value;
                          return (
                            <motion.button
                              key={type.value}
                              type="button"
                              onClick={() => setQueryType(type.value)}
                              whileHover={{ scale: 1.02, y: -2 }}
                              whileTap={{ scale: 0.98 }}
                              className={`p-6 rounded-2xl text-left transition-all duration-300 backdrop-blur-sm border-2 ${
                                isSelected
                                  ? `bg-gradient-to-r ${type.gradient}/30 text-white border-white/30 shadow-2xl`
                                  : 'bg-white/5 text-gray-400 hover:text-white border-white/10 hover:border-white/20'
                              }`}
                            >
                              <div className="flex items-center gap-3 mb-3">
                                <div className={`p-3 rounded-xl bg-gradient-to-r ${type.gradient} shadow-lg`}>
                                  <Icon className="w-6 h-6 text-white" />
                                </div>
                                <span className="font-bold text-lg">{type.label}</span>
                              </div>
                              <p className="text-sm opacity-90 leading-relaxed">{type.description}</p>
                              
                              {/* Selection Indicator */}
                              {isSelected && (
                                <motion.div 
                                  className="absolute top-3 right-3 w-3 h-3 bg-white rounded-full"
                                  animate={{ scale: [1, 1.5, 1] }}
                                  transition={{ duration: 2, repeat: Infinity }}
                                />
                              )}
                            </motion.button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Enhanced Query Input */}
                    <div>
                      <label className="block text-lg font-medium text-gray-300 mb-4">
                        Strategic Query
                      </label>
                      <div className="relative">
                        <textarea
                          value={query}
                          onChange={(e) => setQuery(e.target.value)}
                          placeholder={`e.g., "What are the strategic implications of quantum computing breakthroughs for financial services?"`}
                          className="w-full px-6 py-4 bg-white/5 border-2 border-white/10 rounded-2xl focus:ring-4 focus:ring-emerald-500/30 focus:border-emerald-500/50 transition-all duration-300 text-white placeholder-gray-500 backdrop-blur-sm resize-none text-lg"
                          rows={4}
                          required
                        />
                        <div className="absolute bottom-4 right-4 text-gray-500 text-sm">
                          {query.length > 0 ? `${query.length} characters` : 'Enter your query'}
                        </div>
                      </div>
                    </div>

                    {/* Enhanced Analysis Parameters */}
                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <label className="block text-lg font-medium text-gray-300 mb-4">
                          Urgency
                        </label>
                        <div className="grid grid-cols-3 gap-3">
                          {['low', 'medium', 'high'].map((level) => (
                            <motion.button
                              key={level}
                              type="button"
                              onClick={() => setUrgency(level as QueryContext['urgency'])}
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              className={`py-3 px-4 rounded-xl text-center transition-all duration-300 ${
                                urgency === level
                                  ? level === 'high' 
                                    ? 'bg-gradient-to-r from-red-600/30 to-orange-600/30 text-red-300 border-2 border-red-500/30'
                                    : level === 'medium'
                                    ? 'bg-gradient-to-r from-amber-600/30 to-yellow-600/30 text-amber-300 border-2 border-amber-500/30'
                                    : 'bg-gradient-to-r from-blue-600/30 to-cyan-600/30 text-blue-300 border-2 border-blue-500/30'
                                  : 'bg-white/5 text-gray-400 hover:text-white border border-white/10'
                              }`}
                            >
                              <span className="font-medium capitalize">{level}</span>
                            </motion.button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className="block text-lg font-medium text-gray-300 mb-4">
                          Scope
                        </label>
                        <div className="grid grid-cols-3 gap-3">
                          {['tactical', 'strategic', 'visionary'].map((level) => (
                            <motion.button
                              key={level}
                              type="button"
                              onClick={() => setScope(level as QueryContext['scope'])}
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              className={`py-3 px-4 rounded-xl text-center transition-all duration-300 ${
                                scope === level
                                  ? level === 'visionary' 
                                    ? 'bg-gradient-to-r from-purple-600/30 to-indigo-600/30 text-purple-300 border-2 border-purple-500/30'
                                    : level === 'strategic'
                                    ? 'bg-gradient-to-r from-emerald-600/30 to-cyan-600/30 text-emerald-300 border-2 border-emerald-500/30'
                                    : 'bg-gradient-to-r from-gray-600/30 to-slate-600/30 text-gray-300 border-2 border-gray-500/30'
                                  : 'bg-white/5 text-gray-400 hover:text-white border border-white/10'
                              }`}
                            >
                              <span className="font-medium capitalize">{level}</span>
                            </motion.button>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Enhanced Cognitive State Preference */}
                    <div>
                      <label className="block text-lg font-medium text-gray-300 mb-4">
                        Cognitive Optimization
                      </label>
                      <div className="grid grid-cols-2 gap-4">
                        {COGNITIVE_STATES.map((state) => {
                          const Icon = state.icon;
                          const isSelected = cognitiveState === state.value;
                          return (
                            <motion.button
                              key={state.value}
                              type="button"
                              onClick={() => setCognitiveState(state.value)}
                              whileHover={{ scale: 1.02, y: -2 }}
                              whileTap={{ scale: 0.98 }}
                              className={`p-5 rounded-2xl text-left transition-all duration-300 border-2 ${
                                isSelected
                                  ? `bg-gradient-to-r ${state.gradient}/20 text-white border-white/30 shadow-lg`
                                  : 'bg-white/5 text-gray-400 hover:text-white border-white/10 hover:border-white/20'
                              }`}
                            >
                              <div className="flex items-center gap-3 mb-2">
                                <div className={`p-2 rounded-xl bg-gradient-to-r ${state.gradient} shadow-lg`}>
                                  <Icon className="w-5 h-5 text-white" />
                                </div>
                                <span className="font-bold">{state.label}</span>
                              </div>
                              <div className="text-sm opacity-80">{state.description}</div>
                              
                              {/* Selection Indicator */}
                              {isSelected && (
                                <motion.div 
                                  className="absolute top-3 right-3 w-2 h-2 bg-white rounded-full"
                                  animate={{ scale: [1, 1.5, 1] }}
                                  transition={{ duration: 2, repeat: Infinity }}
                                />
                              )}
                            </motion.button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Spectacular Submit Button */}
                    <motion.button
                      type="submit"
                      disabled={!query.trim() || isProcessing}
                      whileHover={{ scale: 1.03, boxShadow: '0 20px 40px rgba(16, 185, 129, 0.3)' }}
                      whileTap={{ scale: 0.97 }}
                      className="w-full bg-gradient-to-r from-emerald-600 via-cyan-600 to-purple-600 text-white py-6 rounded-2xl font-bold text-xl hover:from-emerald-700 hover:to-purple-700 transition-all duration-300 shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-4 border border-white/20 backdrop-blur-xl mt-8"
                    >
                      {isProcessing ? (
                        <>
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                            className="w-8 h-8 border-4 border-white/30 border-t-white rounded-full"
                          />
                          <span className="text-gradient-primary">Forging Insight...</span>
                        </>
                      ) : (
                        <>
                          <motion.div
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{ duration: 2, repeat: Infinity }}
                          >
                            <Zap className="w-8 h-8" />
                          </motion.div>
                          <span>Forge Insight</span>
                        </>
                      )}
                      
                      {/* Particle Effects */}
                      {!isProcessing && (
                        <>
                          {Array.from({ length: 5 }).map((_, i) => (
                            <motion.div
                              key={i}
                              className="absolute w-1 h-1 bg-white rounded-full"
                              style={{
                                top: '50%',
                                left: `${20 + i * 15}%`,
                              }}
                              animate={{
                                y: [0, -20, 0],
                                opacity: [0, 1, 0],
                              }}
                              transition={{
                                duration: 1.5,
                                repeat: Infinity,
                                delay: i * 0.2,
                              }}
                            />
                          ))}
                        </>
                      )}
                    </motion.button>
                  </form>
                </motion.div>
              </div>
            </div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}