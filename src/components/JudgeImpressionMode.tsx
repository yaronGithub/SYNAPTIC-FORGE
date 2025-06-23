import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, RotateCcw, Sparkles, Brain, Zap, Star, TrendingUp, Database, Users } from 'lucide-react';

interface JudgeImpressionModeProps {
  onComplete: () => void;
}

interface ShowcaseStep {
  id: string;
  title: string;
  description: string;
  duration: number;
  visual: React.ReactNode;
  highlight: string;
}

export function JudgeImpressionMode({ onComplete }: JudgeImpressionModeProps) {
  const [isActive, setIsActive] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);

  const showcaseSteps: ShowcaseStep[] = [
    {
      id: 'startup',
      title: 'SYNAPTIC FORGE Initialization',
      description: 'AI-powered strategic intelligence platform with adaptive personality evolution',
      duration: 3000,
      highlight: 'Real-time global data processing',
      visual: (
        <div className="relative">
          <motion.div
            className="w-32 h-32 mx-auto mb-6 bg-gradient-to-r from-emerald-600/20 to-cyan-600/20 rounded-full flex items-center justify-center backdrop-blur-sm border border-emerald-500/30"
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 180, 360],
              boxShadow: [
                '0 0 20px rgba(16, 185, 129, 0.3)',
                '0 0 60px rgba(16, 185, 129, 0.8)',
                '0 0 20px rgba(16, 185, 129, 0.3)'
              ]
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Brain className="w-16 h-16 text-emerald-400" />
          </motion.div>
          
          {/* Floating data particles */}
          {Array.from({ length: 12 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-cyan-400 rounded-full"
              style={{
                left: '50%',
                top: '50%'
              }}
              animate={{
                x: [0, Math.cos(i * 30 * Math.PI / 180) * 100],
                y: [0, Math.sin(i * 30 * Math.PI / 180) * 100],
                opacity: [0, 1, 0],
                scale: [0, 1, 0]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: i * 0.1,
                ease: "easeInOut"
              }}
            />
          ))}
        </div>
      )
    },
    {
      id: 'ai-evolution',
      title: 'Adaptive AI Personality Evolution',
      description: 'Each user gets a personalized AI that evolves from Stage 1.0 to 10.0 based on interactions',
      duration: 4000,
      highlight: 'Unique AI personality per user',
      visual: (
        <div className="text-center">
          <motion.div
            className="inline-flex items-center gap-4 mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="text-right">
              <motion.div
                className="text-4xl font-bold text-purple-400"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                1.0
              </motion.div>
              <div className="text-sm text-gray-400">Initial Stage</div>
            </div>
            
            <motion.div
              className="w-16 h-1 bg-gradient-to-r from-purple-600 to-emerald-600 rounded-full"
              animate={{ scaleX: [0, 1] }}
              transition={{ duration: 2, delay: 0.5 }}
            />
            
            <div className="text-left">
              <motion.div
                className="text-4xl font-bold text-emerald-400"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 1, repeat: Infinity, delay: 2 }}
              >
                8.7
              </motion.div>
              <div className="text-sm text-gray-400">Evolved Stage</div>
            </div>
          </motion.div>
          
          <motion.div
            className="grid grid-cols-3 gap-4 max-w-md mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
          >
            <div className="bg-purple-600/20 p-3 rounded-lg border border-purple-500/30">
              <div className="text-purple-300 text-sm font-medium">Learning</div>
              <div className="text-xs text-gray-400">Basic patterns</div>
            </div>
            <div className="bg-blue-600/20 p-3 rounded-lg border border-blue-500/30">
              <div className="text-blue-300 text-sm font-medium">Adapting</div>
              <div className="text-xs text-gray-400">User preferences</div>
            </div>
            <div className="bg-emerald-600/20 p-3 rounded-lg border border-emerald-500/30">
              <div className="text-emerald-300 text-sm font-medium">Transcendent</div>
              <div className="text-xs text-gray-400">Strategic mastery</div>
            </div>
          </motion.div>
        </div>
      )
    },
    {
      id: 'multi-modal',
      title: 'Multi-Modal Sensory Integration',
      description: '3D visualizations, binaural beats, and AI voice synthesis for cognitive optimization',
      duration: 4000,
      highlight: 'Revolutionary human-AI interface',
      visual: (
        <div className="relative">
          <div className="grid grid-cols-3 gap-6">
            {/* Visual */}
            <motion.div
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="w-16 h-16 mx-auto mb-3 bg-gradient-to-r from-cyan-600 to-blue-600 rounded-lg flex items-center justify-center">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
              <div className="text-cyan-300 font-medium text-sm">3D Visual</div>
              <div className="text-xs text-gray-400">Quantum neural webs</div>
            </motion.div>
            
            {/* Audio */}
            <motion.div
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <div className="w-16 h-16 mx-auto mb-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg flex items-center justify-center">
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                >
                  🎵
                </motion.div>
              </div>
              <div className="text-purple-300 font-medium text-sm">Binaural Beats</div>
              <div className="text-xs text-gray-400">Beta waves 18-25Hz</div>
            </motion.div>
            
            {/* Voice */}
            <motion.div
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <div className="w-16 h-16 mx-auto mb-3 bg-gradient-to-r from-emerald-600 to-green-600 rounded-lg flex items-center justify-center">
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 0.8, repeat: Infinity }}
                >
                  🗣️
                </motion.div>
              </div>
              <div className="text-emerald-300 font-medium text-sm">AI Voice</div>
              <div className="text-xs text-gray-400">Authoritative tone</div>
            </motion.div>
          </div>
          
          {/* Connecting lines */}
          <motion.div
            className="absolute inset-0 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
          >
            <svg className="w-full h-full">
              <motion.path
                d="M 33% 50% Q 50% 30% 67% 50%"
                stroke="rgba(16, 185, 129, 0.5)"
                strokeWidth="2"
                fill="none"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1, delay: 1 }}
              />
            </svg>
          </motion.div>
        </div>
      )
    },
    {
      id: 'supabase-persistence',
      title: 'Enterprise-Grade Data Persistence',
      description: 'Secure user profiles, interaction history, custom data sources, and real-time analytics',
      duration: 4000,
      highlight: 'Production-ready with Supabase',
      visual: (
        <div className="grid grid-cols-2 gap-6">
          <motion.div
            className="space-y-3"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex items-center gap-3 p-3 bg-blue-600/20 rounded-lg border border-blue-500/30">
              <Users className="w-5 h-5 text-blue-400" />
              <div>
                <div className="text-blue-300 font-medium text-sm">User Profiles</div>
                <div className="text-xs text-gray-400">Secure authentication</div>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-3 bg-purple-600/20 rounded-lg border border-purple-500/30">
              <Brain className="w-5 h-5 text-purple-400" />
              <div>
                <div className="text-purple-300 font-medium text-sm">AI Interactions</div>
                <div className="text-xs text-gray-400">Complete history</div>
              </div>
            </div>
          </motion.div>
          
          <motion.div
            className="space-y-3"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div className="flex items-center gap-3 p-3 bg-emerald-600/20 rounded-lg border border-emerald-500/30">
              <Database className="w-5 h-5 text-emerald-400" />
              <div>
                <div className="text-emerald-300 font-medium text-sm">Custom Data</div>
                <div className="text-xs text-gray-400">Private uploads</div>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-3 bg-yellow-600/20 rounded-lg border border-yellow-500/30">
              <Star className="w-5 h-5 text-yellow-400" />
              <div>
                <div className="text-yellow-300 font-medium text-sm">Favorites</div>
                <div className="text-xs text-gray-400">Curated insights</div>
              </div>
            </div>
          </motion.div>
        </div>
      )
    },
    {
      id: 'insight-generation',
      title: 'Strategic Insight Generation',
      description: 'AI analyzes global trends and generates prescriptive strategic recommendations',
      duration: 5000,
      highlight: 'Actionable business intelligence',
      visual: (
        <div className="space-y-6">
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="text-lg font-bold text-white mb-2">
              "What are the strategic implications of quantum computing for financial services?"
            </div>
            <div className="text-sm text-gray-400">Sample strategic query</div>
          </motion.div>
          
          <motion.div
            className="flex items-center justify-center gap-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
          >
            <div className="w-8 h-8 border-2 border-emerald-400/30 border-t-emerald-400 rounded-full animate-spin" />
            <div className="text-emerald-400 font-medium">AI Processing Global Data...</div>
          </motion.div>
          
          <motion.div
            className="bg-gradient-to-r from-emerald-600/20 to-cyan-600/20 p-4 rounded-lg border border-emerald-500/30"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 2 }}
          >
            <div className="flex items-center gap-2 mb-2">
              <Zap className="w-4 h-4 text-emerald-400" />
              <div className="text-emerald-300 font-medium text-sm">Strategic Recommendation</div>
              <div className="ml-auto text-emerald-400 font-bold">87% Confidence</div>
            </div>
            <div className="text-white text-sm">
              Establish quantum-classical hybrid infrastructure partnerships while developing quantum-resistant security protocols to maintain competitive advantage in the emerging quantum finance landscape.
            </div>
          </motion.div>
          
          <motion.div
            className="grid grid-cols-3 gap-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 3 }}
          >
            <div className="text-center">
              <div className="text-2xl font-bold text-cyan-400">5</div>
              <div className="text-xs text-gray-400">Proof Points</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-400">3</div>
              <div className="text-xs text-gray-400">Challenges</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-400">2-3</div>
              <div className="text-xs text-gray-400">Year Impact</div>
            </div>
          </motion.div>
        </div>
      )
    }
  ];

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isPlaying && isActive) {
      const currentStepData = showcaseSteps[currentStep];
      const stepDuration = currentStepData.duration;
      
      interval = setInterval(() => {
        setProgress(prev => {
          const newProgress = prev + (100 / (stepDuration / 100));
          
          if (newProgress >= 100) {
            if (currentStep < showcaseSteps.length - 1) {
              setCurrentStep(prev => prev + 1);
              return 0;
            } else {
              // Showcase complete
              setIsPlaying(false);
              setTimeout(() => {
                setIsActive(false);
                onComplete();
              }, 1000);
              return 100;
            }
          }
          
          return newProgress;
        });
      }, 100);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying, isActive, currentStep, showcaseSteps, onComplete]);

  const startShowcase = () => {
    setIsActive(true);
    setIsPlaying(true);
    setCurrentStep(0);
    setProgress(0);
  };

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const resetShowcase = () => {
    setIsPlaying(false);
    setCurrentStep(0);
    setProgress(0);
  };

  const currentStepData = showcaseSteps[currentStep];

  return (
    <div className="fixed inset-0 z-50">
      {!isActive ? (
        // Launch Screen
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-center justify-center min-h-screen bg-gradient-to-br from-black via-gray-900 to-black"
        >
          <div className="text-center max-w-2xl mx-auto px-8">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="mb-8"
            >
              <div className="w-32 h-32 mx-auto mb-6 bg-gradient-to-r from-emerald-600/20 to-cyan-600/20 rounded-full flex items-center justify-center backdrop-blur-sm border border-emerald-500/30">
                <Brain className="w-16 h-16 text-emerald-400" />
              </div>
              
              <h1 className="text-5xl font-bold mb-4 font-space-grotesk bg-gradient-to-r from-white via-emerald-200 to-cyan-200 bg-clip-text text-transparent">
                SYNAPTIC FORGE
              </h1>
              <h2 className="text-2xl font-light mb-6 text-emerald-300 font-space-grotesk">
                Judge Impression Mode
              </h2>
              <p className="text-xl text-gray-300 mb-8 leading-relaxed">
                Experience a cinematic showcase of the world's first adaptive AI strategic intelligence platform
              </p>
            </motion.div>
            
            <motion.button
              onClick={startShowcase}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="bg-gradient-to-r from-emerald-600 to-cyan-600 text-white px-12 py-6 rounded-xl font-semibold text-xl hover:from-emerald-700 hover:to-cyan-700 transition-all duration-200 shadow-lg font-space-grotesk flex items-center gap-4 mx-auto"
            >
              <Play className="w-8 h-8" />
              Start Showcase
            </motion.button>
            
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className="mt-8 text-sm text-gray-500"
            >
              Optimized for hackathon judge demonstration • 25 seconds
            </motion.div>
          </div>
        </motion.div>
      ) : (
        // Showcase Screen
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black relative overflow-hidden"
        >
          {/* Background Effects */}
          <div className="absolute inset-0 opacity-30">
            {Array.from({ length: 20 }).map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-emerald-400 rounded-full"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`
                }}
                animate={{
                  opacity: [0, 1, 0],
                  scale: [0, 1, 0]
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  delay: Math.random() * 3,
                  ease: "easeInOut"
                }}
              />
            ))}
          </div>

          {/* Progress Bar */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gray-800">
            <motion.div
              className="h-full bg-gradient-to-r from-emerald-500 to-cyan-500"
              style={{ width: `${progress}%` }}
              transition={{ duration: 0.1 }}
            />
          </div>

          {/* Controls */}
          <div className="absolute top-6 right-6 flex items-center gap-3 z-10">
            <button
              onClick={togglePlayPause}
              className="p-3 bg-black/50 backdrop-blur-xl rounded-full border border-white/20 text-white hover:bg-black/70 transition-colors"
            >
              {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
            </button>
            <button
              onClick={resetShowcase}
              className="p-3 bg-black/50 backdrop-blur-xl rounded-full border border-white/20 text-white hover:bg-black/70 transition-colors"
            >
              <RotateCcw className="w-5 h-5" />
            </button>
          </div>

          {/* Step Indicator */}
          <div className="absolute top-6 left-6 flex items-center gap-2 z-10">
            {showcaseSteps.map((_, index) => (
              <div
                key={index}
                className={`w-3 h-3 rounded-full transition-colors ${
                  index === currentStep
                    ? 'bg-emerald-400'
                    : index < currentStep
                    ? 'bg-emerald-600'
                    : 'bg-gray-600'
                }`}
              />
            ))}
          </div>

          {/* Main Content */}
          <div className="flex items-center justify-center min-h-screen px-8">
            <div className="max-w-4xl mx-auto text-center">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentStep}
                  initial={{ opacity: 0, y: 50, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -50, scale: 0.9 }}
                  transition={{ duration: 0.5 }}
                  className="space-y-8"
                >
                  {/* Step Visual */}
                  <div className="mb-8">
                    {currentStepData.visual}
                  </div>

                  {/* Step Content */}
                  <div className="space-y-4">
                    <motion.h2
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                      className="text-4xl font-bold text-white font-space-grotesk"
                    >
                      {currentStepData.title}
                    </motion.h2>
                    
                    <motion.p
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                      className="text-xl text-gray-300 leading-relaxed max-w-3xl mx-auto"
                    >
                      {currentStepData.description}
                    </motion.p>
                    
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6 }}
                      className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-600/20 to-cyan-600/20 rounded-full border border-emerald-500/30"
                    >
                      <TrendingUp className="w-5 h-5 text-emerald-400" />
                      <span className="text-emerald-300 font-medium">{currentStepData.highlight}</span>
                    </motion.div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* Branding Footer */}
          <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className="text-center"
            >
              <div className="text-emerald-400 font-bold text-lg font-space-grotesk">SYNAPTIC FORGE</div>
              <div className="text-gray-500 text-sm">The Adaptive Foresight Engine</div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </div>
  );
}