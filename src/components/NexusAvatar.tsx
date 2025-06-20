import React from 'react';
import { motion } from 'framer-motion';
import { BlendedResonanceProfile } from '../types';
import { Brain, Zap, Eye, Heart, Cpu } from 'lucide-react';

interface NexusAvatarProps {
  resonanceProfile: BlendedResonanceProfile | null;
  isProcessing: boolean;
  className?: string;
}

export function NexusAvatar({ resonanceProfile, isProcessing, className = '' }: NexusAvatarProps) {
  const getDominantEmotion = () => {
    if (!resonanceProfile) return 'neutral';
    
    const weights = resonanceProfile.emotionalWeights;
    let maxWeight = 0;
    let dominantEmotion = 'neutral';
    
    Object.entries(weights).forEach(([emotion, weight]) => {
      if (weight > maxWeight) {
        maxWeight = weight;
        dominantEmotion = emotion;
      }
    });
    
    return dominantEmotion;
  };

  const getEmotionColor = (emotion: string) => {
    switch (emotion) {
      case 'joy': return '#fbbf24'; // Yellow
      case 'serenity': return '#06b6d4'; // Cyan
      case 'hope': return '#10b981'; // Green
      case 'curiosity': return '#8b5cf6'; // Purple
      case 'excitement': return '#f59e0b'; // Orange
      case 'fear': return '#ef4444'; // Red
      case 'anger': return '#dc2626'; // Dark Red
      case 'anxiety': return '#f97316'; // Orange-Red
      case 'grief': return '#6b7280'; // Gray
      case 'tension': return '#7c2d12'; // Brown
      default: return '#6366f1'; // Default Purple
    }
  };

  const getModeIcon = () => {
    if (isProcessing) return <Cpu className="w-8 h-8" />;
    return <Brain className="w-8 h-8" />;
  };

  const dominantEmotion = getDominantEmotion();
  const emotionColor = getEmotionColor(dominantEmotion);
  const intensity = resonanceProfile?.intensity || 5;

  const pulseVariants = {
    idle: {
      scale: [1, 1.05, 1],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut"
      }
    },
    processing: {
      scale: [1, 1.2, 1],
      rotate: [0, 360],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "linear"
      }
    },
    resonating: {
      scale: [1, 1.1 + intensity * 0.05, 1],
      opacity: [1, 0.8, 1],
      transition: {
        duration: 2 + intensity * 0.2,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  const glowVariants = {
    animate: {
      boxShadow: [
        `0 0 20px ${emotionColor}40`,
        `0 0 ${40 + intensity * 10}px ${emotionColor}60`,
        `0 0 20px ${emotionColor}40`
      ],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  return (
    <div className={`flex flex-col items-center ${className}`}>
      {/* Main Avatar */}
      <motion.div
        className="relative"
        variants={pulseVariants}
        animate={isProcessing ? 'processing' : resonanceProfile ? 'resonating' : 'idle'}
      >
        {/* Outer Consciousness Ring */}
        <motion.div
          className="absolute inset-0 rounded-full"
          style={{
            background: `radial-gradient(circle, ${emotionColor}20 0%, transparent 70%)`
          }}
          variants={glowVariants}
          animate="animate"
        />
        
        {/* Main Consciousness Orb */}
        <motion.div
          className="relative w-32 h-32 rounded-full flex items-center justify-center backdrop-blur-sm border-2"
          style={{
            backgroundColor: `${emotionColor}10`,
            borderColor: emotionColor,
            boxShadow: `inset 0 0 20px ${emotionColor}30`
          }}
        >
          {/* Inner Icon */}
          <motion.div
            style={{ color: emotionColor }}
            animate={{
              opacity: [0.7, 1, 0.7],
              scale: [1, 1.1, 1]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            {getModeIcon()}
          </motion.div>

          {/* Intensity Indicator */}
          <div className="absolute inset-2 rounded-full border opacity-30"
               style={{ borderColor: emotionColor }}>
            <motion.div
              className="absolute inset-0 rounded-full"
              style={{
                background: `conic-gradient(${emotionColor} ${intensity * 36}deg, transparent 0deg)`
              }}
              animate={{ rotate: isProcessing ? 360 : 0 }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            />
          </div>
        </motion.div>

        {/* Floating Consciousness Particles */}
        {Array.from({ length: 8 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 rounded-full"
            style={{
              backgroundColor: emotionColor,
              left: '50%',
              top: '50%'
            }}
            animate={{
              x: [0, Math.cos(i * 45 * Math.PI / 180) * (60 + intensity * 10)],
              y: [0, Math.sin(i * 45 * Math.PI / 180) * (60 + intensity * 10)],
              opacity: [0, intensity * 0.1, 0],
              scale: [0, 1, 0]
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              delay: i * 0.3,
              ease: "easeInOut"
            }}
          />
        ))}
      </motion.div>

      {/* Status Text */}
      <motion.div
        className="mt-6 text-center"
        animate={{ opacity: [0.7, 1, 0.7] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <p className="text-lg font-medium text-white/90 capitalize font-orbitron">
          {isProcessing ? 'Processing Global Pulse' : 
           resonanceProfile ? 'Consciousness Linked' : 'Nexus Ready'}
        </p>
        <p className="text-sm text-white/60 capitalize mt-1">
          {resonanceProfile ? `${dominantEmotion} • ${Math.round(intensity)}0% Intensity` : 'Awaiting Psychic Link'}
        </p>
        {resonanceProfile && (
          <p className="text-xs text-white/40 mt-2 font-orbitron">
            {resonanceProfile.targetBinauralFrequency.type} Waves • {resonanceProfile.targetBinauralFrequency.range}
          </p>
        )}
      </motion.div>
    </div>
  );
}