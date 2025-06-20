import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BlendedResonanceProfile } from '../types';

interface SharedConsciousnessStreamProps {
  resonanceProfile: BlendedResonanceProfile | null;
  className?: string;
}

export function SharedConsciousnessStream({ resonanceProfile, className = '' }: SharedConsciousnessStreamProps) {
  if (!resonanceProfile) return null;

  return (
    <div className={`fixed inset-0 pointer-events-none flex items-center justify-center ${className}`}>
      <AnimatePresence mode="wait">
        <motion.div
          key={resonanceProfile.abstractThoughtFragment}
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: -20 }}
          transition={{ duration: 2, ease: "easeInOut" }}
          className="text-center max-w-2xl mx-auto px-8"
        >
          <motion.p
            className="text-2xl md:text-3xl font-light text-white/90 leading-relaxed font-orbitron"
            style={{
              textShadow: '0 0 20px rgba(255, 255, 255, 0.3), 0 0 40px rgba(147, 51, 234, 0.2)',
              filter: 'drop-shadow(0 0 10px rgba(255, 255, 255, 0.1))'
            }}
            animate={{
              opacity: [0.7, 1, 0.7],
              scale: [1, 1.02, 1]
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            {resonanceProfile.abstractThoughtFragment}
          </motion.p>
          
          <motion.div
            className="mt-4 text-sm text-white/50 font-light"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 1 }}
          >
            ~ Collective Consciousness Stream ~
          </motion.div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}