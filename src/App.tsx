import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CognitiveCanvas } from './components/CognitiveCanvas';
import { AdaptiveAudioEngine } from './components/AdaptiveAudioEngine';
import { QueryForge } from './components/QueryForge';
import { ForesightDisplay } from './components/ForesightDisplay';
import { synapticForgeAI } from './services/synapticForgeAI';
import { UserProfile, ForesightConstruct, QueryContext, CognitiveState, EmergentStrategicVector } from './types';
import { Brain, Zap, Activity, Settings } from 'lucide-react';

function App() {
  // Core state
  const [userProfile, setUserProfile] = useState<UserProfile>({
    id: 'user-1',
    learnedBiases: {
      preferredAnalysisDepth: 'detailed',
      industryFocus: ['technology', 'business'],
      riskTolerance: 'moderate',
      decisionStyle: 'analytical',
      informationDensity: 'balanced'
    },
    validatedInsightsHistory: [],
    preferredAnalysisModes: ['strategic_analysis', 'innovation_opportunities'],
    aiPersonalityEvolutionStage: 5,
    cognitivePreferences: {
      preferredBrainwaveState: 'beta',
      voiceTone: 'authoritative',
      visualComplexity: 'moderate'
    }
  });

  const [foresightConstruct, setForesightConstruct] = useState<ForesightConstruct | null>(null);
  const [emergentVectors, setEmergentVectors] = useState<EmergentStrategicVector[]>([]);
  const [cognitiveState, setCognitiveState] = useState<CognitiveState>({
    currentBrainwaveTarget: 'Beta (18-25 Hz)',
    focusLevel: 0.7,
    creativityLevel: 0.5,
    clarityLevel: 0.8,
    isOptimized: true
  });

  // UI state
  const [isProcessing, setIsProcessing] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(false);
  const [queryForgeVisible, setQueryForgeVisible] = useState(false);
  const [foresightVisible, setForesightVisible] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [systemStatus, setSystemStatus] = useState<'initializing' | 'ready' | 'processing' | 'error'>('initializing');

  // Initialize SYNAPTIC FORGE
  const initializeSystem = async () => {
    setSystemStatus('initializing');
    setIsProcessing(true);

    try {
      // Fetch and analyze Omni-Data
      const omniData = await synapticForgeAI.fetchOmniData();
      const vectors = await synapticForgeAI.analyzeEmergentVectors(omniData, userProfile);
      
      setEmergentVectors(vectors);
      setSystemStatus('ready');
      setIsInitialized(true);
    } catch (error) {
      console.error('Error initializing SYNAPTIC FORGE:', error);
      setSystemStatus('error');
    } finally {
      setIsProcessing(false);
    }
  };

  // Handle query submission
  const handleQuerySubmit = async (queryContext: QueryContext) => {
    setIsProcessing(true);
    setSystemStatus('processing');
    setForesightVisible(false);

    try {
      // Find most relevant strategic vector
      const relevantVector = emergentVectors
        .sort((a, b) => b.relevanceToUser - a.relevanceToUser)[0];

      if (relevantVector) {
        const construct = await synapticForgeAI.generateForesightConstruct(
          relevantVector,
          queryContext,
          userProfile
        );
        
        setForesightConstruct(construct);
        setForesightVisible(true);
        
        // Update cognitive state based on construct
        setCognitiveState(prev => ({
          ...prev,
          currentBrainwaveTarget: `${construct.sensoryDirectives.targetBrainwaveFrequency.type.toUpperCase()} (${construct.sensoryDirectives.targetBrainwaveFrequency.range})`,
          isOptimized: true
        }));
      }
      
      setSystemStatus('ready');
    } catch (error) {
      console.error('Error processing query:', error);
      setSystemStatus('error');
    } finally {
      setIsProcessing(false);
    }
  };

  // Handle feedback
  const handleFeedback = async (feedback: string) => {
    if (foresightConstruct) {
      try {
        const updatedProfile = await synapticForgeAI.refineLearningProfile(
          userProfile,
          feedback,
          foresightConstruct
        );
        setUserProfile(updatedProfile);
        
        // Add to validation history
        const validation = {
          insightId: foresightConstruct.id,
          rating: feedback === 'useful' ? 5 : feedback === 'needs_detail' ? 3 : 1,
          feedback: feedback as any,
          timestamp: new Date().toISOString()
        };
        
        setUserProfile(prev => ({
          ...prev,
          validatedInsightsHistory: [...prev.validatedInsightsHistory, validation]
        }));
      } catch (error) {
        console.error('Error processing feedback:', error);
      }
    }
  };

  // Auto-refresh vectors every 5 minutes
  useEffect(() => {
    if (isInitialized) {
      const interval = setInterval(async () => {
        try {
          const omniData = await synapticForgeAI.fetchOmniData();
          const vectors = await synapticForgeAI.analyzeEmergentVectors(omniData, userProfile);
          setEmergentVectors(vectors);
        } catch (error) {
          console.error('Error refreshing vectors:', error);
        }
      }, 5 * 60 * 1000); // 5 minutes

      return () => clearInterval(interval);
    }
  }, [isInitialized, userProfile]);

  // Initialize on mount
  useEffect(() => {
    initializeSystem();
  }, []);

  return (
    <div className="min-h-screen bg-black text-white relative">
      {/* Cognitive Canvas - Full Screen Background */}
      <CognitiveCanvas 
        foresightConstruct={foresightConstruct}
        isProcessing={isProcessing}
        className="fixed inset-0 z-0"
      />

      {/* Adaptive Audio Engine */}
      <AdaptiveAudioEngine
        foresightConstruct={foresightConstruct}
        cognitiveState={cognitiveState}
        enabled={audioEnabled}
        onToggle={() => setAudioEnabled(!audioEnabled)}
      />

      {/* Scrollable Main Content */}
      <div className="relative z-10 min-h-screen overflow-y-auto">
        <div className="flex flex-col items-center justify-center p-6 min-h-screen">
          {!isInitialized ? (
            /* Initialization State */
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center max-w-4xl mx-auto"
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="mb-8"
              >
                <div className="w-40 h-40 mx-auto mb-8 bg-gradient-to-r from-emerald-600/20 to-cyan-600/20 rounded-full flex items-center justify-center backdrop-blur-sm border border-emerald-500/30">
                  <Brain className="w-20 h-20 text-emerald-400" />
                </div>
                
                <h1 className="text-6xl font-bold mb-4 font-space-grotesk bg-gradient-to-r from-white via-emerald-200 to-cyan-200 bg-clip-text text-transparent">
                  SYNAPTIC FORGE
                </h1>
                <h2 className="text-2xl font-light mb-6 text-emerald-300 font-space-grotesk">
                  The Adaptive Foresight Engine
                </h2>
                <p className="text-xl text-gray-300 mb-8 leading-relaxed max-w-3xl mx-auto">
                  A revolutionary AI co-processor that learns your strategic thinking patterns and provides 
                  prescriptive foresight constructs optimized for your cognitive state. Experience the future 
                  of augmented intelligence.
                </p>
                
                {systemStatus === 'initializing' && (
                  <motion.div
                    className="flex items-center justify-center gap-4"
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <div className="w-8 h-8 border-2 border-emerald-400/30 border-t-emerald-400 rounded-full animate-spin" />
                    <span className="text-emerald-400 font-medium font-space-grotesk">
                      Initializing Cognitive Nexus...
                    </span>
                  </motion.div>
                )}

                {systemStatus === 'error' && (
                  <motion.button
                    onClick={initializeSystem}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-gradient-to-r from-emerald-600 to-cyan-600 text-white px-12 py-6 rounded-xl font-semibold text-xl hover:from-emerald-700 hover:to-cyan-700 transition-all duration-200 shadow-lg font-space-grotesk flex items-center gap-4 mx-auto"
                  >
                    <Zap className="w-8 h-8" />
                    Retry Initialization
                  </motion.button>
                )}
              </motion.div>
            </motion.div>
          ) : (
            /* Active State */
            <div className="w-full max-w-6xl mx-auto">
              {/* System Status Display */}
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center mb-12"
              >
                <div className="inline-flex items-center gap-4 bg-black/40 backdrop-blur-xl rounded-2xl px-8 py-4 border border-emerald-500/30">
                  <div className="flex items-center gap-2">
                    <Activity className="w-5 h-5 text-emerald-400" />
                    <span className="text-emerald-400 font-medium">SYNAPTIC FORGE</span>
                  </div>
                  <div className="w-px h-6 bg-white/20" />
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${
                      systemStatus === 'ready' ? 'bg-emerald-400' :
                      systemStatus === 'processing' ? 'bg-amber-400 animate-pulse' :
                      'bg-red-400'
                    }`} />
                    <span className="text-white text-sm capitalize">{systemStatus}</span>
                  </div>
                  <div className="w-px h-6 bg-white/20" />
                  <div className="text-white text-sm">
                    {emergentVectors.length} Strategic Vectors Active
                  </div>
                </div>
              </motion.div>

              {/* Emergent Vectors Display */}
              {emergentVectors.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8"
                >
                  {emergentVectors.slice(0, 6).map((vector, index) => (
                    <motion.div
                      key={vector.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-gradient-to-br from-gray-900/60 to-black/60 backdrop-blur-xl rounded-2xl p-6 border border-white/10"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-lg font-bold text-white font-space-grotesk">{vector.title}</h3>
                        <div className="text-right">
                          <div className="text-emerald-400 font-bold">{Math.round(vector.confidenceScore * 100)}%</div>
                          <div className="text-xs text-gray-400">Confidence</div>
                        </div>
                      </div>
                      <p className="text-gray-300 text-sm mb-4">{vector.description}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500 capitalize">{vector.impactTimeframe.replace('_', ' ')}</span>
                        <div className="flex items-center gap-1">
                          <div className="w-2 h-2 bg-emerald-400 rounded-full" />
                          <span className="text-xs text-emerald-400">
                            {Math.round(vector.relevanceToUser * 100)}% Relevant
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              )}

              {/* Instructions */}
              {!foresightConstruct && !isProcessing && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center"
                >
                  <p className="text-gray-400 font-space-grotesk text-lg">
                    Click the Brain icon to forge strategic insights
                  </p>
                  <p className="text-sm text-gray-500 mt-2">
                    Your AI co-processor is ready to analyze emergent strategic vectors
                  </p>
                </motion.div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Query Forge Interface */}
      <QueryForge
        onQuerySubmit={handleQuerySubmit}
        isProcessing={isProcessing}
        isVisible={queryForgeVisible}
        onToggle={() => setQueryForgeVisible(!queryForgeVisible)}
      />

      {/* Foresight Display */}
      <ForesightDisplay
        foresightConstruct={foresightConstruct}
        onFeedback={handleFeedback}
        isVisible={foresightVisible}
      />
    </div>
  );
}

export default App;