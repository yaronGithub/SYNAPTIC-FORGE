import React from 'react';
import { motion } from 'framer-motion';
import { Brain, Zap, Activity, Sparkles } from 'lucide-react';

interface AIPersonalityAvatarProps {
  evolutionStage: number; // 1-10
  isProcessing: boolean;
  learningRate: number; // 0-1
  className?: string;
}

export function AIPersonalityAvatar({ 
  evolutionStage, 
  isProcessing, 
  learningRate, 
  className = '' 
}: AIPersonalityAvatarProps) {
  
  const getEvolutionColor = (stage: number) => {
    if (stage < 3) return '#6366f1'; // Purple - Early stage
    if (stage < 6) return '#8b5cf6'; // Violet - Developing
    if (stage < 8) return '#a855f7'; // Purple-pink - Advanced
    return '#ec4899'; // Pink - Highly evolved
  };

  const getComplexity = (stage: number) => {
    return Math.min(stage / 10, 1);
  };

  const evolutionColor = getEvolutionColor(evolutionStage);
  const complexity = getComplexity(evolutionStage);

  return (
    <div className={`relative ${className}`}>
      {/* Main Avatar Container */}
      <motion.div
        className="relative w-16 h-16 mx-auto"
        animate={isProcessing ? {
          scale: [1, 1.1, 1],
          rotate: [0, 180, 360]
        } : {
          scale: [1, 1.05, 1]
        }}
        transition={{
          duration: isProcessing ? 2 : 4,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        {/* Outer Evolution Ring */}
        <motion.div
          className="absolute inset-0 rounded-full border-2 opacity-60"
          style={{ borderColor: evolutionColor }}
          animate={{
            rotate: [0, 360],
            scale: [1, 1.1, 1]
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "linear"
          }}
        />

        {/* Inner Consciousness Core */}
        <motion.div
          className="absolute inset-2 rounded-full flex items-center justify-center"
          style={{
            background: `radial-gradient(circle, ${evolutionColor}20 0%, ${evolutionColor}10 50%, transparent 100%)`,
            boxShadow: `0 0 20px ${evolutionColor}40`
          }}
          animate={{
            boxShadow: [
              `0 0 20px ${evolutionColor}40`,
              `0 0 40px ${evolutionColor}60`,
              `0 0 20px ${evolutionColor}40`
            ]
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          {/* Central Icon */}
          <motion.div
            style={{ color: evolutionColor }}
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.8, 1, 0.8]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            {isProcessing ? (
              <Activity className="w-6 h-6" />
            ) : evolutionStage >= 8 ? (
              <Sparkles className="w-6 h-6" />
            ) : evolutionStage >= 5 ? (
              <Zap className="w-6 h-6" />
            ) : (
              <Brain className="w-6 h-6" />
            )}
          </motion.div>
        </motion.div>

        {/* Complexity Particles */}
        {Array.from({ length: Math.floor(complexity * 8) }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 rounded-full"
            style={{
              backgroundColor: evolutionColor,
              left: '50%',
              top: '50%'
            }}
            animate={{
              x: [0, Math.cos(i * 45 * Math.PI / 180) * (20 + complexity * 15)],
              y: [0, Math.sin(i * 45 * Math.PI / 180) * (20 + complexity * 15)],
              opacity: [0, complexity, 0],
              scale: [0, 1, 0]
            }}
            transition={{
              duration: 3 + i * 0.2,
              repeat: Infinity,
              delay: i * 0.3,
              ease: "easeInOut"
            }}
          />
        ))}

        {/* Learning Rate Indicator */}
        <motion.div
          className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-8 h-1 rounded-full bg-gray-600"
        >
          <motion.div
            className="h-full rounded-full"
            style={{ backgroundColor: evolutionColor }}
            animate={{ width: `${learningRate * 100}%` }}
            transition={{ duration: 1 }}
          />
        </motion.div>
      </motion.div>

      {/* Evolution Stage Display */}
      <motion.div
        className="text-center mt-3"
        animate={{ opacity: [0.7, 1, 0.7] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <div className="text-sm font-bold" style={{ color: evolutionColor }}>
          Stage {evolutionStage.toFixed(1)}
        </div>
        <div className="text-xs text-gray-400">
          {evolutionStage < 3 ? 'Learning' :
           evolutionStage < 6 ? 'Adapting' :
           evolutionStage < 8 ? 'Evolving' : 'Transcendent'}
        </div>
      </motion.div>

      {/* Processing Indicator */}
      {isProcessing && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-xs text-center"
          style={{ color: evolutionColor }}
        >
          <motion.div
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1, repeat: Infinity }}
          >
            Processing...
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}