import React from 'react';
import { motion } from 'framer-motion';
import { FutureNarrative, FutureCrossroad } from '../types';
import { BookOpen, TrendingUp, Zap, Target } from 'lucide-react';

interface NarrativeDisplayProps {
  narrative: FutureNarrative | null;
  onCrossroadSelect: (crossroad: FutureCrossroad) => void;
  selectedCrossroadId?: string;
}

export function NarrativeDisplay({ narrative, onCrossroadSelect, selectedCrossroadId }: NarrativeDisplayProps) {
  if (!narrative) {
    return (
      <div className="bg-gradient-to-br from-gray-900/40 to-black/40 backdrop-blur-xl rounded-2xl p-8 text-center border border-white/10">
        <BookOpen className="w-16 h-16 mx-auto mb-4 text-gray-500 opacity-50" />
        <h3 className="text-xl font-bold text-gray-400 mb-2 font-orbitron">Narrative Weaving</h3>
        <p className="text-gray-500">Set your context to begin the symbiotic future weaving process</p>
      </div>
    );
  }

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return 'from-green-500 to-emerald-500';
      case 'negative': return 'from-red-500 to-orange-500';
      case 'mixed': return 'from-purple-500 to-pink-500';
      default: return 'from-blue-500 to-cyan-500';
    }
  };

  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return <TrendingUp className="w-5 h-5" />;
      case 'negative': return <Target className="w-5 h-5" />;
      case 'mixed': return <Zap className="w-5 h-5" />;
      default: return <BookOpen className="w-5 h-5" />;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-gray-900/60 to-black/60 backdrop-blur-xl rounded-2xl p-8 border border-white/10 shadow-2xl"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className={`p-3 bg-gradient-to-r ${getSentimentColor(narrative.overallSentiment)} rounded-lg`}>
            {getSentimentIcon(narrative.overallSentiment)}
          </div>
          <div>
            <h3 className="text-2xl font-bold text-white font-orbitron">Future Narrative</h3>
            <p className="text-gray-400 capitalize">{narrative.overallSentiment} trajectory</p>
          </div>
        </div>
        
        <div className="text-right">
          <div className="text-2xl font-bold text-white">{narrative.confidenceLevel}%</div>
          <div className="text-sm text-gray-400">Nexus Confidence</div>
        </div>
      </div>

      {/* Narrative Summary */}
      <div className="mb-8">
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-lg text-gray-200 leading-relaxed font-light"
        >
          {narrative.summary}
        </motion.p>
      </div>

      {/* Crossroads */}
      {narrative.crossroads.length > 0 && (
        <div>
          <h4 className="text-lg font-semibold text-white mb-4 font-orbitron flex items-center gap-2">
            <Zap className="w-5 h-5 text-yellow-400" />
            Future Crossroads
          </h4>
          
          <div className="space-y-3">
            {narrative.crossroads.map((crossroad, index) => (
              <motion.button
                key={crossroad.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + index * 0.1 }}
                onClick={() => onCrossroadSelect(crossroad)}
                className={`w-full text-left p-4 rounded-xl transition-all duration-200 border backdrop-blur-sm ${
                  selectedCrossroadId === crossroad.id
                    ? 'bg-gradient-to-r from-purple-600/30 to-blue-600/30 border-purple-500/50 shadow-lg'
                    : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h5 className="font-semibold text-white mb-1">{crossroad.title}</h5>
                    <p className="text-gray-400 text-sm">{crossroad.description}</p>
                  </div>
                  <div className="text-purple-400">
                    <Target className="w-5 h-5" />
                  </div>
                </div>
              </motion.button>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
}