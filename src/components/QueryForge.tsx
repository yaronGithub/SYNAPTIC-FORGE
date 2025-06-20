import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { QueryContext } from '../types';
import { Zap, Brain, Target, AlertTriangle, Lightbulb, X } from 'lucide-react';

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
    description: 'Deep strategic implications and competitive positioning'
  },
  { 
    value: 'innovation_opportunities', 
    label: 'Innovation Opportunities', 
    icon: Lightbulb,
    description: 'Emerging innovation vectors and breakthrough potential'
  },
  { 
    value: 'risk_assessment', 
    label: 'Risk Assessment', 
    icon: AlertTriangle,
    description: 'Threat analysis and vulnerability identification'
  },
  { 
    value: 'market_disruption', 
    label: 'Market Disruption', 
    icon: Zap,
    description: 'Disruptive forces and paradigm shifts'
  }
] as const;

const COGNITIVE_STATES = [
  { value: 'Enhance Decision Clarity', label: 'Decision Clarity', description: 'Optimize for clear, decisive thinking' },
  { value: 'Stimulate Creative Association', label: 'Creative Flow', description: 'Enhance innovative and lateral thinking' },
  { value: 'Reduce Ambiguity', label: 'Analytical Focus', description: 'Sharpen logical analysis and precision' },
  { value: 'Expand Strategic Vision', label: 'Visionary Thinking', description: 'Broaden perspective and long-term insight' }
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

  return (
    <>
      {/* Toggle Button */}
      <AnimatePresence>
        {!isVisible && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={onToggle}
            disabled={isProcessing}
            className="fixed bottom-8 right-8 z-40 bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-700 hover:to-cyan-700 disabled:opacity-50 disabled:cursor-not-allowed text-white p-4 rounded-full shadow-lg transition-all duration-200 hover:scale-105 backdrop-blur-sm border border-white/20"
          >
            <Brain className="w-6 h-6" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Query Interface */}
      <AnimatePresence>
        {isVisible && (
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
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="fixed bottom-8 right-8 z-50 w-full max-w-lg"
            >
              <div className="bg-gradient-to-br from-gray-900/95 to-black/95 backdrop-blur-xl rounded-2xl p-6 border border-white/10 shadow-2xl">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-gradient-to-r from-emerald-600 to-cyan-600 rounded-lg">
                      <Brain className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white font-space-grotesk">Query Forge</h3>
                      <p className="text-gray-400 text-sm">Initiate strategic foresight analysis</p>
                    </div>
                  </div>
                  <button
                    onClick={onToggle}
                    className="p-2 hover:bg-white/10 rounded-full transition-colors text-gray-400 hover:text-white"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Query Type Selection */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-3">
                      Analysis Type
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      {QUERY_TYPES.map((type) => {
                        const Icon = type.icon;
                        return (
                          <button
                            key={type.value}
                            type="button"
                            onClick={() => setQueryType(type.value)}
                            className={`p-3 rounded-lg text-left transition-all backdrop-blur-sm border ${
                              queryType === type.value
                                ? 'bg-gradient-to-r from-emerald-600/30 to-cyan-600/30 text-emerald-300 border-emerald-500/50'
                                : 'bg-white/5 text-gray-400 hover:text-white border-white/10 hover:border-white/20'
                            }`}
                          >
                            <div className="flex items-center gap-2 mb-1">
                              <Icon className="w-4 h-4" />
                              <span className="font-medium text-sm">{type.label}</span>
                            </div>
                            <p className="text-xs opacity-75">{type.description}</p>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Query Input */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-3">
                      Strategic Query
                    </label>
                    <textarea
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      placeholder={`e.g., "What are the strategic implications of quantum computing breakthroughs for financial services?"`}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all text-white placeholder-gray-500 backdrop-blur-sm resize-none"
                      rows={3}
                      required
                    />
                  </div>

                  {/* Analysis Parameters */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Urgency
                      </label>
                      <select
                        value={urgency}
                        onChange={(e) => setUrgency(e.target.value as QueryContext['urgency'])}
                        className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-white text-sm backdrop-blur-sm"
                      >
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Scope
                      </label>
                      <select
                        value={scope}
                        onChange={(e) => setScope(e.target.value as QueryContext['scope'])}
                        className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-white text-sm backdrop-blur-sm"
                      >
                        <option value="tactical">Tactical</option>
                        <option value="strategic">Strategic</option>
                        <option value="visionary">Visionary</option>
                      </select>
                    </div>
                  </div>

                  {/* Cognitive State Preference */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-3">
                      Cognitive Optimization
                    </label>
                    <div className="space-y-2">
                      {COGNITIVE_STATES.map((state) => (
                        <button
                          key={state.value}
                          type="button"
                          onClick={() => setCognitiveState(state.value)}
                          className={`w-full p-3 rounded-lg text-left transition-all backdrop-blur-sm border ${
                            cognitiveState === state.value
                              ? 'bg-gradient-to-r from-cyan-600/30 to-blue-600/30 text-cyan-300 border-cyan-500/50'
                              : 'bg-white/5 text-gray-400 hover:text-white border-white/10 hover:border-white/20'
                          }`}
                        >
                          <div className="font-medium text-sm mb-1">{state.label}</div>
                          <div className="text-xs opacity-75">{state.description}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Submit Button */}
                  <motion.button
                    type="submit"
                    disabled={!query.trim() || isProcessing}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full bg-gradient-to-r from-emerald-600 to-cyan-600 text-white py-4 rounded-lg font-medium hover:from-emerald-700 hover:to-cyan-700 transition-all duration-200 font-space-grotesk text-lg shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                  >
                    {isProcessing ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Forging Insight...
                      </>
                    ) : (
                      <>
                        <Zap className="w-5 h-5" />
                        Forge Insight
                      </>
                    )}
                  </motion.button>
                </form>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}