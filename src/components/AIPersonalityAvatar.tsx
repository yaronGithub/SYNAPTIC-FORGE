import React from 'react';
import { motion } from 'framer-motion';
import { Brain, Zap, Activity, Sparkles, Orbit, Cpu } from 'lucide-react';

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
    if (stage < 3) return ['#6366f1', '#818cf8']; // Purple - Early stage
    if (stage < 6) return ['#8b5cf6', '#a78bfa']; // Violet - Developing
    if (stage < 8) return ['#a855f7', '#d8b4fe']; // Purple-pink - Advanced
    return ['#ec4899', '#f472b6']; // Pink - Highly evolved
  };

  const getComplexity = (stage: number) => {
    return Math.min(stage / 10, 1);
  };

  const evolutionColors = getEvolutionColor(evolutionStage);
  const complexity = getComplexity(evolutionStage);

  return (
    <div className={`relative ${className}`}>
      {/* Main Avatar Container */}
      <motion.div
        className="relative w-32 h-32 mx-auto"
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
          className="absolute inset-0 rounded-full border-4 opacity-80"
          style={{ borderColor: evolutionColors[0] }}
          animate={{
            rotate: [0, 360],
            scale: [1, 1.1, 1],
            boxShadow: [
              `0 0 20px ${evolutionColors[0]}40`,
              `0 0 40px ${evolutionColors[0]}60`,
              `0 0 20px ${evolutionColors[0]}40`
            ]
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "linear"
          }}
        />

        {/* Middle Evolution Ring */}
        <motion.div
          className="absolute inset-4 rounded-full border-2 opacity-60"
          style={{ borderColor: evolutionColors[1] }}
          animate={{
            rotate: [360, 0],
            scale: [1, 1.15, 1]
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "linear"
          }}
        />

        {/* Inner Consciousness Core */}
        <motion.div
          className="absolute inset-8 rounded-full flex items-center justify-center"
          style={{
            background: `radial-gradient(circle, ${evolutionColors[0]}30 0%, ${evolutionColors[0]}20 50%, transparent 100%)`,
            boxShadow: `0 0 30px ${evolutionColors[0]}40`
          }}
          animate={{
            boxShadow: [
              `0 0 30px ${evolutionColors[0]}40`,
              `0 0 60px ${evolutionColors[0]}60`,
              `0 0 30px ${evolutionColors[0]}40`
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
            style={{ color: evolutionColors[0] }}
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.8, 1, 0.8],
              rotate: isProcessing ? 360 : 0
            }}
            transition={{
              duration: isProcessing ? 3 : 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            {isProcessing ? (
              <Activity className="w-10 h-10" />
            ) : evolutionStage >= 8 ? (
              <Orbit className="w-10 h-10" />
            ) : evolutionStage >= 5 ? (
              <Sparkles className="w-10 h-10" />
            ) : (
              <Brain className="w-10 h-10" />
            )}
          </motion.div>
        </motion.div>

        {/* Complexity Particles */}
        {Array.from({ length: Math.floor(complexity * 12) }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 rounded-full"
            style={{
              backgroundColor: i % 2 === 0 ? evolutionColors[0] : evolutionColors[1],
              left: '50%',
              top: '50%',
              filter: `blur(${Math.random() * 2}px)`
            }}
            animate={{
              x: [0, Math.cos(i * 30 * Math.PI / 180) * (30 + complexity * 20)],
              y: [0, Math.sin(i * 30 * Math.PI / 180) * (30 + complexity * 20)],
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
          className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-16 h-2 rounded-full bg-gray-800/80 backdrop-blur-sm border border-white/10"
        >
          <motion.div
            className="h-full rounded-full"
            style={{ 
              background: `linear-gradient(to right, ${evolutionColors[0]}, ${evolutionColors[1]})` 
            }}
            animate={{ width: `${learningRate * 100}%` }}
            transition={{ duration: 1 }}
          />
        </motion.div>
      </motion.div>

      {/* Evolution Stage Display */}
      <motion.div
        className="text-center mt-8"
        animate={{ opacity: [0.7, 1, 0.7] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <div className="text-xl font-bold" style={{ color: evolutionColors[0] }}>
          Stage {evolutionStage.toFixed(1)}
        </div>
        <div className="text-lg text-gray-300">
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
          className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 text-center"
          style={{ color: evolutionColors[0] }}
        >
          <motion.div
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1, repeat: Infinity }}
            className="flex items-center gap-2"
          >
            <Cpu className="w-5 h-5" />
            <span className="text-lg font-medium">Processing...</span>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}