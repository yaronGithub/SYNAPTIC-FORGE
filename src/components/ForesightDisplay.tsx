import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ForesightConstruct } from '../types';
import { Brain, CheckCircle, X, ThumbsUp, ThumbsDown, AlertCircle, Lightbulb, Zap, Target, Sparkles, Cpu } from 'lucide-react';

interface ForesightDisplayProps {
  foresightConstruct: ForesightConstruct | null;
  onFeedback: (feedback: string) => void;
  isVisible: boolean;
}

export function ForesightDisplay({ foresightConstruct, onFeedback, isVisible }: ForesightDisplayProps) {
  const [showFeedback, setShowFeedback] = useState(false);
  const [expandedSections, setExpandedSections] = useState<{
    evidence: boolean;
    challenges: boolean;
    cognitive: boolean;
  }>({
    evidence: true,
    challenges: true,
    cognitive: false
  });

  const handleFeedback = (feedback: string) => {
    onFeedback(feedback);
    setShowFeedback(false);
  };

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  if (!foresightConstruct || !isVisible) return null;

  const { sensoryDirectives } = foresightConstruct;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/80 backdrop-blur-lg"
          onClick={() => {}} // Prevent closing by clicking backdrop for now
        />

        {/* Scrollable Container */}
        <div className="flex min-h-full items-start justify-center p-4 pt-8">
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -50, scale: 0.9 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="w-full max-w-4xl bg-gradient-to-br backdrop-blur-3xl rounded-3xl border-2 shadow-2xl overflow-hidden"
            style={{
              background: `radial-gradient(circle at center, ${sensoryDirectives.colorGradients[0]}20, ${sensoryDirectives.colorGradients[1]}10, transparent)`,
              borderColor: `${sensoryDirectives.colorGradients[0]}40`
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Animated Background */}
            <div className="absolute inset-0 overflow-hidden">
              {Array.from({ length: 20 }).map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-1 h-1 rounded-full"
                  style={{
                    backgroundColor: sensoryDirectives.colorGradients[i % sensoryDirectives.colorGradients.length],
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                  }}
                  animate={{
                    x: [0, Math.random() * 100 - 50],
                    y: [0, Math.random() * 100 - 50],
                    opacity: [0, 0.8, 0],
                    scale: [0, 1, 0],
                  }}
                  transition={{
                    duration: 3 + Math.random() * 2,
                    repeat: Infinity,
                    delay: Math.random() * 2,
                  }}
                />
              ))}
            </div>

            <div className="relative p-8">
              {/* Enhanced Header with Animated Elements */}
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                  <motion.div 
                    className="relative p-4 rounded-2xl"
                    animate={{
                      boxShadow: [
                        `0 0 20px ${sensoryDirectives.colorGradients[0]}40`,
                        `0 0 40px ${sensoryDirectives.colorGradients[0]}60`,
                        `0 0 20px ${sensoryDirectives.colorGradients[0]}40`
                      ]
                    }}
                    transition={{ duration: 3, repeat: Infinity }}
                    style={{
                      background: `linear-gradient(135deg, ${sensoryDirectives.colorGradients[0]}, ${sensoryDirectives.colorGradients[1]})`
                    }}
                  >
                    <Brain className="w-8 h-8 text-white" />
                    
                    {/* Orbiting Particles */}
                    {[0, 1, 2].map((i) => (
                      <motion.div
                        key={i}
                        className="absolute w-1 h-1 bg-white rounded-full"
                        style={{
                          top: '50%',
                          left: '50%',
                        }}
                        animate={{
                          rotate: 360,
                          x: Math.cos(i * Math.PI * 2 / 3) * 20,
                          y: Math.sin(i * Math.PI * 2 / 3) * 20,
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: "linear",
                        }}
                      />
                    ))}
                  </motion.div>
                  <div>
                    <h3 className="text-3xl font-bold text-white font-space-grotesk">Foresight Construct</h3>
                    <p className="text-xl" style={{ color: sensoryDirectives.colorGradients[0] }}>
                      {sensoryDirectives.cognitiveStateDirective}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <div className="text-sm text-gray-400">Confidence</div>
                    <motion.div 
                      className="text-3xl font-bold"
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      style={{ color: sensoryDirectives.colorGradients[0] }}
                    >
                      {Math.round(foresightConstruct.strategicVector.confidenceScore * 100)}%
                    </motion.div>
                  </div>
                  <motion.button
                    onClick={() => window.location.reload()} // Simple way to close and reset
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                    className="p-3 hover:bg-white/10 rounded-2xl transition-all duration-300 text-gray-400 hover:text-white border border-white/10"
                  >
                    <X className="w-6 h-6" />
                  </motion.button>
                </div>
              </div>

              {/* Strategic Vector */}
              <motion.div 
                className="mb-8 p-6 bg-black/30 rounded-2xl border border-white/10"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <h4 className="text-lg font-medium text-gray-300 mb-3 flex items-center gap-2">
                  <Target className="w-5 h-5" style={{ color: sensoryDirectives.colorGradients[0] }} />
                  Strategic Vector
                </h4>
                <p className="text-2xl font-bold text-white mb-3">{foresightConstruct.strategicVector.title}</p>
                <p className="text-gray-300 text-lg">{foresightConstruct.strategicVector.description}</p>
              </motion.div>

              {/* Actionable Recommendation */}
              <motion.div 
                className="mb-8 p-6 rounded-2xl border-2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                style={{ 
                  background: `linear-gradient(135deg, ${sensoryDirectives.colorGradients[0]}20, ${sensoryDirectives.colorGradients[1]}10)`,
                  borderColor: `${sensoryDirectives.colorGradients[0]}40`
                }}
              >
                <h4 className="text-lg font-medium mb-4 flex items-center gap-3" style={{ color: sensoryDirectives.colorGradients[0] }}>
                  <Lightbulb className="w-6 h-6" />
                  Strategic Recommendation
                </h4>
                <p className="text-white text-xl leading-relaxed font-medium">{foresightConstruct.conciseActionableRecommendation}</p>
              </motion.div>

              {/* Supporting Evidence */}
              <motion.div 
                className="mb-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                <button 
                  onClick={() => toggleSection('evidence')}
                  className="flex items-center justify-between w-full text-left mb-4"
                >
                  <h4 className="text-lg font-medium text-gray-300 flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-emerald-400" />
                    Supporting Evidence
                  </h4>
                  <div className="text-gray-400">
                    {expandedSections.evidence ? '−' : '+'}
                  </div>
                </button>
                
                <AnimatePresence>
                  {expandedSections.evidence && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <ul className="space-y-3">
                        {foresightConstruct.supportingProofPoints.map((point, index) => (
                          <motion.li 
                            key={index} 
                            className="flex items-start gap-3 p-4 bg-white/5 rounded-xl border border-white/10"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.1 * index }}
                          >
                            <CheckCircle className="w-5 h-5 mt-0.5 text-emerald-400 flex-shrink-0" />
                            <p className="text-gray-200 text-lg">{point}</p>
                          </motion.li>
                        ))}
                      </ul>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>

              {/* Potential Challenges */}
              {foresightConstruct.potentialChallenges.length > 0 && (
                <motion.div 
                  className="mb-8"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 }}
                >
                  <button 
                    onClick={() => toggleSection('challenges')}
                    className="flex items-center justify-between w-full text-left mb-4"
                  >
                    <h4 className="text-lg font-medium text-gray-300 flex items-center gap-2">
                      <AlertCircle className="w-5 h-5 text-amber-400" />
                      Potential Challenges
                    </h4>
                    <div className="text-gray-400">
                      {expandedSections.challenges ? '−' : '+'}
                    </div>
                  </button>
                  
                  <AnimatePresence>
                    {expandedSections.challenges && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <ul className="space-y-3">
                          {foresightConstruct.potentialChallenges.map((challenge, index) => (
                            <motion.li 
                              key={index} 
                              className="flex items-start gap-3 p-4 bg-amber-600/10 rounded-xl border border-amber-500/20"
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: 0.1 * index }}
                            >
                              <AlertCircle className="w-5 h-5 mt-0.5 text-amber-400 flex-shrink-0" />
                              <p className="text-gray-200 text-lg">{challenge}</p>
                            </motion.li>
                          ))}
                        </ul>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              )}

              {/* Sensory Directives Info */}
              <motion.div 
                className="mb-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 }}
              >
                <button 
                  onClick={() => toggleSection('cognitive')}
                  className="flex items-center justify-between w-full text-left mb-4"
                >
                  <h4 className="text-lg font-medium text-gray-300 flex items-center gap-2">
                    <Brain className="w-5 h-5" style={{ color: sensoryDirectives.colorGradients[0] }} />
                    Cognitive Optimization
                  </h4>
                  <div className="text-gray-400">
                    {expandedSections.cognitive ? '−' : '+'}
                  </div>
                </button>
                
                <AnimatePresence>
                  {expandedSections.cognitive && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="grid grid-cols-2 gap-6 p-6 bg-black/30 rounded-2xl border border-white/10">
                        <div className="space-y-4">
                          <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg" style={{ backgroundColor: `${sensoryDirectives.colorGradients[0]}30` }}>
                              <Brain className="w-5 h-5" style={{ color: sensoryDirectives.colorGradients[0] }} />
                            </div>
                            <div>
                              <div className="text-gray-400 text-sm">Brainwave Target</div>
                              <div className="text-white font-medium">
                                {sensoryDirectives.targetBrainwaveFrequency.type.toUpperCase()} ({sensoryDirectives.targetBrainwaveFrequency.range})
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg" style={{ backgroundColor: `${sensoryDirectives.colorGradients[1]}30` }}>
                              <Sparkles className="w-5 h-5" style={{ color: sensoryDirectives.colorGradients[1] }} />
                            </div>
                            <div>
                              <div className="text-gray-400 text-sm">Visual Metaphor</div>
                              <div className="text-white font-medium">
                                {sensoryDirectives.dynamicVisualMetaphor}
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="space-y-4">
                          <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg" style={{ backgroundColor: `${sensoryDirectives.colorGradients[0]}30` }}>
                              <Zap className="w-5 h-5" style={{ color: sensoryDirectives.colorGradients[0] }} />
                            </div>
                            <div>
                              <div className="text-gray-400 text-sm">Voice Tone</div>
                              <div className="text-white font-medium capitalize">
                                {sensoryDirectives.synthesizedVoiceTone}
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg" style={{ backgroundColor: `${sensoryDirectives.colorGradients[1]}30` }}>
                              <Cpu className="w-5 h-5" style={{ color: sensoryDirectives.colorGradients[1] }} />
                            </div>
                            <div>
                              <div className="text-gray-400 text-sm">Motion Intensity</div>
                              <div className="text-white font-medium">
                                <div className="w-full bg-gray-700 rounded-full h-2 mt-1">
                                  <motion.div
                                    className="h-2 rounded-full"
                                    style={{ 
                                      width: `${sensoryDirectives.motionIntensity * 10}%`,
                                      background: `linear-gradient(to right, ${sensoryDirectives.colorGradients[0]}, ${sensoryDirectives.colorGradients[1]})` 
                                    }}
                                    initial={{ width: 0 }}
                                    animate={{ width: `${sensoryDirectives.motionIntensity * 10}%` }}
                                    transition={{ duration: 1 }}
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>

              {/* Feedback Interface */}
              <AnimatePresence>
                {!showFeedback ? (
                  <motion.button
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ delay: 1.2 }}
                    onClick={() => setShowFeedback(true)}
                    className="w-full py-4 text-lg text-gray-300 hover:text-white transition-all duration-300 border-2 border-white/20 rounded-2xl hover:border-white/40 font-medium bg-white/5 hover:bg-white/10 backdrop-blur-xl"
                  >
                    Rate this insight to improve AI learning
                  </motion.button>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="space-y-4"
                  >
                    <div className="text-lg font-medium text-white mb-4 text-center">How useful was this insight?</div>
                    <div className="grid grid-cols-2 gap-4">
                      <motion.button
                        onClick={() => handleFeedback('useful')}
                        whileHover={{ scale: 1.05, y: -5 }}
                        whileTap={{ scale: 0.95 }}
                        className="flex items-center justify-center gap-3 py-4 px-6 bg-gradient-to-r from-emerald-600/30 to-emerald-600/10 text-emerald-300 rounded-2xl hover:from-emerald-600/40 hover:to-emerald-600/20 transition-all duration-300 text-lg font-medium border border-emerald-500/30 backdrop-blur-xl"
                      >
                        <ThumbsUp className="w-6 h-6" />
                        Very Useful
                      </motion.button>
                      <motion.button
                        onClick={() => handleFeedback('irrelevant')}
                        whileHover={{ scale: 1.05, y: -5 }}
                        whileTap={{ scale: 0.95 }}
                        className="flex items-center justify-center gap-3 py-4 px-6 bg-gradient-to-r from-red-600/30 to-red-600/10 text-red-300 rounded-2xl hover:from-red-600/40 hover:to-red-600/20 transition-all duration-300 text-lg font-medium border border-red-500/30 backdrop-blur-xl"
                      >
                        <ThumbsDown className="w-6 h-6" />
                        Not Relevant
                      </motion.button>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <motion.button
                        onClick={() => handleFeedback('needs_detail')}
                        whileHover={{ scale: 1.05, y: -5 }}
                        whileTap={{ scale: 0.95 }}
                        className="py-4 px-6 bg-gradient-to-r from-amber-600/30 to-amber-600/10 text-amber-300 rounded-2xl hover:from-amber-600/40 hover:to-amber-600/20 transition-all duration-300 text-lg font-medium border border-amber-500/30 backdrop-blur-xl"
                      >
                        Needs More Detail
                      </motion.button>
                      <motion.button
                        onClick={() => handleFeedback('inaccurate')}
                        whileHover={{ scale: 1.05, y: -5 }}
                        whileTap={{ scale: 0.95 }}
                        className="py-4 px-6 bg-gradient-to-r from-gray-600/30 to-gray-600/10 text-gray-300 rounded-2xl hover:from-gray-600/40 hover:to-gray-600/20 transition-all duration-300 text-lg font-medium border border-gray-500/30 backdrop-blur-xl"
                      >
                        Inaccurate
                      </motion.button>
                    </div>
                    <motion.button
                      onClick={() => setShowFeedback(false)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="w-full py-3 text-gray-500 hover:text-gray-400 transition-colors text-lg"
                    >
                      Cancel
                    </motion.button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </div>
    </AnimatePresence>
  );
}