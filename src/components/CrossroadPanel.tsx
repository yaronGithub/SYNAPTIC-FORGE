import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FutureCrossroad, FuturePath } from '../types';
import { ArrowRight, Clock, Zap, Target, CheckCircle, AlertCircle } from 'lucide-react';

interface CrossroadPanelProps {
  crossroad: FutureCrossroad | null;
  onClose: () => void;
}

export function CrossroadPanel({ crossroad, onClose }: CrossroadPanelProps) {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'text-green-400 bg-green-400/10 border-green-400/30';
      case 'moderate': return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/30';
      case 'challenging': return 'text-red-400 bg-red-400/10 border-red-400/30';
      default: return 'text-gray-400 bg-gray-400/10 border-gray-400/30';
    }
  };

  const getRelevanceColor = (relevance: string) => {
    switch (relevance) {
      case 'high': return 'text-purple-400 bg-purple-400/10 border-purple-400/30';
      case 'medium': return 'text-blue-400 bg-blue-400/10 border-blue-400/30';
      case 'low': return 'text-gray-400 bg-gray-400/10 border-gray-400/30';
      default: return 'text-gray-400 bg-gray-400/10 border-gray-400/30';
    }
  };

  const getDifficultyIcon = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return <CheckCircle className="w-4 h-4" />;
      case 'moderate': return <Clock className="w-4 h-4" />;
      case 'challenging': return <AlertCircle className="w-4 h-4" />;
      default: return <Target className="w-4 h-4" />;
    }
  };

  return (
    <AnimatePresence>
      {crossroad && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="bg-gradient-to-br from-gray-900/80 to-black/80 backdrop-blur-xl rounded-2xl p-8 border border-white/10 shadow-2xl"
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white font-orbitron">{crossroad.title}</h3>
                <p className="text-gray-400">Critical Decision Point</p>
              </div>
            </div>
            
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/10 rounded-full transition-colors text-gray-400 hover:text-white"
            >
              ×
            </button>
          </div>

          {/* Description */}
          <div className="mb-8">
            <p className="text-gray-200 leading-relaxed">{crossroad.description}</p>
          </div>

          {/* Future Paths */}
          {crossroad.futurePaths && crossroad.futurePaths.length > 0 && (
            <div className="space-y-6">
              <h4 className="text-lg font-semibold text-white font-orbitron flex items-center gap-2">
                <ArrowRight className="w-5 h-5 text-cyan-400" />
                Potential Future Paths
              </h4>

              {crossroad.futurePaths.map((path, index) => (
                <motion.div
                  key={path.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-gradient-to-r from-white/5 to-white/10 rounded-xl p-6 border border-white/10 backdrop-blur-sm"
                >
                  {/* Path Header */}
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h5 className="text-xl font-semibold text-white mb-1">{path.name}</h5>
                      <p className="text-gray-400">{path.description}</p>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getRelevanceColor(path.personalRelevance)}`}>
                        {path.personalRelevance} relevance
                      </span>
                      <div className="text-right">
                        <div className="text-lg font-bold text-white">{path.confidenceLevel}%</div>
                        <div className="text-xs text-gray-400">confidence</div>
                      </div>
                    </div>
                  </div>

                  {/* Action Directives */}
                  {path.actionDirectives && path.actionDirectives.length > 0 && (
                    <div>
                      <h6 className="text-sm font-medium text-gray-300 mb-3 flex items-center gap-2">
                        <Target className="w-4 h-4" />
                        Action Directives
                      </h6>
                      
                      <div className="space-y-3">
                        {path.actionDirectives.map((directive, dirIndex) => (
                          <motion.div
                            key={directive.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: (index * 0.1) + (dirIndex * 0.05) }}
                            className="flex items-start gap-3 p-3 bg-black/20 rounded-lg border border-white/5"
                          >
                            <div className={`p-1 rounded border ${getDifficultyColor(directive.difficulty)}`}>
                              {getDifficultyIcon(directive.difficulty)}
                            </div>
                            
                            <div className="flex-1">
                              <p className="text-white font-medium mb-1">{directive.action}</p>
                              <div className="flex items-center gap-4 text-sm">
                                <span className="text-gray-400 flex items-center gap-1">
                                  <Clock className="w-3 h-3" />
                                  {directive.timeframe}
                                </span>
                                <span className={`px-2 py-1 rounded text-xs border ${getDifficultyColor(directive.difficulty)}`}>
                                  {directive.difficulty}
                                </span>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}