import React from 'react';
import { motion } from 'framer-motion';
import { Shield, TrendingUp, AlertTriangle } from 'lucide-react';

interface ResilienceScoreProps {
  score: number;
  className?: string;
}

export function ResilienceScore({ score, className = '' }: ResilienceScoreProps) {
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'from-emerald-500 to-green-400';
    if (score >= 60) return 'from-yellow-500 to-amber-400';
    return 'from-red-500 to-orange-400';
  };

  const getScoreIcon = (score: number) => {
    if (score >= 80) return <Shield className="w-8 h-8 text-emerald-400" />;
    if (score >= 60) return <TrendingUp className="w-8 h-8 text-yellow-400" />;
    return <AlertTriangle className="w-8 h-8 text-red-400" />;
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return 'Future-Ready';
    if (score >= 60) return 'Adapting';
    return 'Needs Focus';
  };

  const circumference = 2 * Math.PI * 45; // radius = 45
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-gradient-to-br from-gray-900/80 to-black/80 backdrop-blur-xl rounded-2xl p-6 border border-white/10 text-center ${className}`}
    >
      <div className="flex items-center justify-center mb-4">
        {getScoreIcon(score)}
        <div className="ml-3">
          <h3 className="text-lg font-bold text-white font-orbitron">Future Resilience</h3>
          <p className="text-gray-400 text-sm">{getScoreLabel(score)}</p>
        </div>
      </div>

      {/* Circular Progress */}
      <div className="relative w-32 h-32 mx-auto mb-4">
        <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 100 100">
          {/* Background circle */}
          <circle
            cx="50"
            cy="50"
            r="45"
            stroke="rgba(255, 255, 255, 0.1)"
            strokeWidth="8"
            fill="none"
          />
          
          {/* Progress circle */}
          <motion.circle
            cx="50"
            cy="50"
            r="45"
            stroke="url(#scoreGradient)"
            strokeWidth="8"
            fill="none"
            strokeLinecap="round"
            strokeDasharray={strokeDasharray}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 2, ease: "easeOut" }}
          />
          
          {/* Gradient definition */}
          <defs>
            <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" className={`stop-color-${score >= 80 ? 'emerald' : score >= 60 ? 'yellow' : 'red'}-500`} />
              <stop offset="100%" className={`stop-color-${score >= 80 ? 'green' : score >= 60 ? 'amber' : 'orange'}-400`} />
            </linearGradient>
          </defs>
        </svg>
        
        {/* Score text */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 1, duration: 0.5 }}
              className="text-3xl font-bold text-white font-orbitron"
            >
              {score}
            </motion.div>
            <div className="text-xs text-gray-400">/ 100</div>
          </div>
        </div>
      </div>

      {/* Score interpretation */}
      <div className="text-sm text-gray-300">
        {score >= 80 && "Excellent! You're well-prepared for future challenges."}
        {score >= 60 && score < 80 && "Good progress! Focus on key skill gaps."}
        {score < 60 && "Opportunity ahead! Prioritize critical skills."}
      </div>
    </motion.div>
  );
}