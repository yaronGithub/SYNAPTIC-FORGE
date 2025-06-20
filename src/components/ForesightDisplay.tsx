import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ForesightConstruct } from '../types';
import { Brain, CheckCircle, X, ThumbsUp, ThumbsDown, AlertCircle, Lightbulb } from 'lucide-react';

interface ForesightDisplayProps {
  foresightConstruct: ForesightConstruct | null;
  onFeedback: (feedback: string) => void;
  isVisible: boolean;
}

export function ForesightDisplay({ foresightConstruct, onFeedback, isVisible }: ForesightDisplayProps) {
  const [showFeedback, setShowFeedback] = useState(false);

  const handleFeedback = (feedback: string) => {
    onFeedback(feedback);
    setShowFeedback(false);
  };

  if (!foresightConstruct || !isVisible) return null;

  const { sensoryDirectives } = foresightConstruct;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="fixed bottom-8 left-8 z-40 w-full max-w-md"
      >
        <div 
          className="backdrop-blur-xl rounded-2xl p-6 border shadow-2xl"
          style={{
            background: `linear-gradient(135deg, ${sensoryDirectives.colorGradients[0]}20, ${sensoryDirectives.colorGradients[1]}20)`,
            borderColor: `${sensoryDirectives.colorGradients[0]}40`
          }}
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div 
                className="p-2 rounded-lg"
                style={{
                  background: `linear-gradient(135deg, ${sensoryDirectives.colorGradients[0]}, ${sensoryDirectives.colorGradients[1]})`
                }}
              >
                <Brain className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white font-space-grotesk">Foresight Construct</h3>
                <p className="text-gray-400 text-sm">{sensoryDirectives.cognitiveStateDirective}</p>
              </div>
            </div>
            
            <div className="text-right">
              <div className="text-sm text-gray-400">Confidence</div>
              <div className="text-lg font-bold text-white">
                {Math.round(foresightConstruct.strategicVector.confidenceScore * 100)}%
              </div>
            </div>
          </div>

          {/* Strategic Vector */}
          <div className="mb-4">
            <h4 className="text-sm font-medium text-gray-300 mb-2">Strategic Vector</h4>
            <p className="text-white font-medium">{foresightConstruct.strategicVector.title}</p>
            <p className="text-gray-300 text-sm mt-1">{foresightConstruct.strategicVector.description}</p>
          </div>

          {/* Actionable Recommendation */}
          <div className="mb-4">
            <h4 className="text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
              <Lightbulb className="w-4 h-4" />
              Strategic Recommendation
            </h4>
            <p className="text-white leading-relaxed">{foresightConstruct.conciseActionableRecommendation}</p>
          </div>

          {/* Supporting Evidence */}
          <div className="mb-4">
            <h4 className="text-sm font-medium text-gray-300 mb-2">Supporting Evidence</h4>
            <ul className="space-y-1">
              {foresightConstruct.supportingProofPoints.map((point, index) => (
                <li key={index} className="flex items-start gap-2 text-sm text-gray-300">
                  <CheckCircle className="w-3 h-3 mt-0.5 text-emerald-400 flex-shrink-0" />
                  {point}
                </li>
              ))}
            </ul>
          </div>

          {/* Potential Challenges */}
          {foresightConstruct.potentialChallenges.length > 0 && (
            <div className="mb-6">
              <h4 className="text-sm font-medium text-gray-300 mb-2">Potential Challenges</h4>
              <ul className="space-y-1">
                {foresightConstruct.potentialChallenges.map((challenge, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm text-gray-300">
                    <AlertCircle className="w-3 h-3 mt-0.5 text-amber-400 flex-shrink-0" />
                    {challenge}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Feedback Interface */}
          <AnimatePresence>
            {!showFeedback ? (
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowFeedback(true)}
                className="w-full py-2 text-sm text-gray-400 hover:text-white transition-colors border border-white/20 rounded-lg hover:border-white/40"
              >
                Rate this insight
              </motion.button>
            ) : (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-3"
              >
                <div className="text-sm font-medium text-gray-300 mb-2">How useful was this insight?</div>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => handleFeedback('useful')}
                    className="flex items-center justify-center gap-2 py-2 px-3 bg-emerald-600/20 text-emerald-300 rounded-lg hover:bg-emerald-600/30 transition-colors text-sm"
                  >
                    <ThumbsUp className="w-4 h-4" />
                    Useful
                  </button>
                  <button
                    onClick={() => handleFeedback('irrelevant')}
                    className="flex items-center justify-center gap-2 py-2 px-3 bg-red-600/20 text-red-300 rounded-lg hover:bg-red-600/30 transition-colors text-sm"
                  >
                    <ThumbsDown className="w-4 h-4" />
                    Irrelevant
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => handleFeedback('needs_detail')}
                    className="py-2 px-3 bg-amber-600/20 text-amber-300 rounded-lg hover:bg-amber-600/30 transition-colors text-sm"
                  >
                    Needs Detail
                  </button>
                  <button
                    onClick={() => handleFeedback('inaccurate')}
                    className="py-2 px-3 bg-gray-600/20 text-gray-300 rounded-lg hover:bg-gray-600/30 transition-colors text-sm"
                  >
                    Inaccurate
                  </button>
                </div>
                <button
                  onClick={() => setShowFeedback(false)}
                  className="w-full py-1 text-xs text-gray-500 hover:text-gray-400 transition-colors"
                >
                  Cancel
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}