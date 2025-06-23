import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CognitiveCanvas } from './components/CognitiveCanvas';
import { AdaptiveAudioEngine } from './components/AdaptiveAudioEngine';
import { QueryForge } from './components/QueryForge';
import { ForesightDisplay } from './components/ForesightDisplay';
import { AIInsightStream } from './components/AIInsightStream';
import { RealTimeAnalytics } from './components/RealTimeAnalytics';
import { AIAgentWorkflow } from './components/AIAgentWorkflow';
import { GenerativeDataVisualization } from './components/GenerativeDataVisualization';
import { AnomalyDetectionAlert } from './components/AnomalyDetectionAlert';
import { SystemHealthMonitor } from './components/SystemHealthMonitor';
import { UserSettingsPanel } from './components/UserSettingsPanel';
import { ExportInsightButton } from './components/ExportInsightButton';
import { AIPersonalityAvatar } from './components/AIPersonalityAvatar';
import { VoiceCommandInterface } from './components/VoiceCommandInterface';
import { AdaptiveSoundscape } from './components/AdaptiveSoundscape';
import { AuthModal } from './components/AuthModal';
import { UserProfileCard } from './components/UserProfileCard';
import { InteractionHistory } from './components/InteractionHistory';
import { FavoriteInsights } from './components/FavoriteInsights';
import { UserDataUpload } from './components/UserDataUpload';
import { synapticForgeAI } from './services/synapticForgeAI';
import { enhancedSynapticForgeAI } from './services/enhancedSynapticForgeAI';
import { useAuth } from './hooks/useAuth';
import { useUserProfile } from './hooks/useUserProfile';
import { useInteractionHistory } from './hooks/useInteractionHistory';
import { useUserDataSources } from './hooks/useUserDataSources';
import { useAnalytics } from './hooks/useAnalytics';
import { UserProfile, ForesightConstruct, QueryContext, CognitiveState, EmergentStrategicVector } from './types';
import { Brain, Zap, Activity, Settings, Sparkles, TrendingUp, LogIn } from 'lucide-react';

function App() {
  // Auth and user state
  const { user, loading: authLoading } = useAuth();
  const { profile, loading: profileLoading } = useUserProfile();
  const { saveInteraction } = useInteractionHistory();
  const { dataSources } = useUserDataSources();
  const { trackEvent } = useAnalytics();

  // Core state
  const [userProfile, setUserProfile] = useState<UserProfile>({
    id: 'user-1',
    learnedBiases: {
      preferredAnalysisDepth: 'detailed',
      industryFocus: ['technology', 'business', 'finance'],
      riskTolerance: 'moderate',
      decisionStyle: 'analytical',
      informationDensity: 'balanced'
    },
    validatedInsightsHistory: [],
    preferredAnalysisModes: ['strategic_analysis', 'innovation_opportunities'],
    aiPersonalityEvolutionStage: profile?.ai_personality_stage || 7.8,
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
  const [aiInsights, setAiInsights] = useState<string[]>([]);
  const [realTimeData, setRealTimeData] = useState<any[]>([]);
  const [authModalOpen, setAuthModalOpen] = useState(false);

  // New enhanced state
  const [workflowActive, setWorkflowActive] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const [generatedVisualization, setGeneratedVisualization] = useState<any>(null);

  // Update user profile when Supabase profile changes
  useEffect(() => {
    if (profile) {
      setUserProfile(prev => ({
        ...prev,
        aiPersonalityEvolutionStage: profile.ai_personality_stage,
        learnedBiases: profile.learned_biases || prev.learnedBiases,
        cognitivePreferences: profile.cognitive_preferences || prev.cognitivePreferences
      }));
    }
  }, [profile]);

  // Initialize SYNAPTIC FORGE with enhanced AI capabilities
  const initializeSystem = async () => {
    setSystemStatus('initializing');
    setIsProcessing(true);

    try {
      // Enhanced AI thinking process
      setAiInsights(['🧠 Initializing quantum neural pathways...', '📡 Establishing secure connection to global consciousness grid...']);
      
      if (user) {
        setAiInsights(prev => [...prev, `👤 Welcome back, ${profile?.preferred_name || profile?.username || 'Strategic Analyst'}`]);
        await trackEvent('system_initialization', { user_type: 'authenticated' });
      } else {
        setAiInsights(prev => [...prev, '🎭 Running in demo mode - sign in for personalized AI evolution']);
        await trackEvent('system_initialization', { user_type: 'anonymous' });
      }
      
      // Fetch and analyze Omni-Data
      const omniData = await synapticForgeAI.fetchOmniData();
      setAiInsights(prev => [...prev, `📊 Processed ${omniData.length} multi-dimensional data points from global intelligence sources`]);
      
      const vectors = await synapticForgeAI.analyzeEmergentVectors(omniData, userProfile);
      setEmergentVectors(vectors);
      setRealTimeData(omniData.slice(0, 10));
      
      setAiInsights(prev => [...prev, 
        `🎯 Identified ${vectors.length} high-probability strategic vectors`, 
        user ? '✨ AI personality matrix calibrated to your personal evolution stage' : '✨ AI personality matrix initialized',
        '🔮 Autonomous agent workflows initialized',
        '📈 Real-time anomaly detection engine activated'
      ]);
      
      setSystemStatus('ready');
      setIsInitialized(true);
      
      // Auto-generate an initial insight to showcase AI capabilities
      setTimeout(() => {
        handleAutoInsight();
      }, 2000);
      
    } catch (error) {
      console.error('Error initializing SYNAPTIC FORGE:', error);
      setSystemStatus('error');
      setAiInsights(prev => [...prev, '⚠️ Switching to offline mode - core AI functions active', '🛡️ Fallback systems engaged']);
    } finally {
      setIsProcessing(false);
    }
  };

  // Auto-generate insights to showcase AI
  const handleAutoInsight = async () => {
    if (emergentVectors.length === 0) return;
    
    const autoQuery: QueryContext = {
      type: 'strategic_analysis',
      query: 'What are the most critical strategic opportunities emerging from current global trends?',
      urgency: 'high',
      scope: 'strategic',
      cognitiveStatePreference: 'Enhance Decision Clarity'
    };
    
    await handleQuerySubmit(autoQuery);
  };

  // Enhanced query handling with AI learning and workflow
  const handleQuerySubmit = async (queryContext: QueryContext) => {
    setIsProcessing(true);
    setSystemStatus('processing');
    setForesightVisible(false);
    setWorkflowActive(true);
    
    // Track user interaction
    if (user) {
      await trackEvent('query_submitted', { 
        query_type: queryContext.type, 
        query_length: queryContext.query.length,
        has_custom_data: dataSources.length > 0
      });
    }
    
    // Show AI thinking process
    const thoughtStream = [
      `🤔 Analyzing complex query: "${queryContext.query}"`, 
      '🔍 Initiating autonomous agent workflow...',
      '🧠 Cross-referencing with global data patterns...'
    ];
    setAiInsights(prev => [...prev, ...thoughtStream]);

    try {
      // Find most relevant strategic vector
      const relevantVector = emergentVectors
        .sort((a, b) => b.relevanceToUser - a.relevanceToUser)[0];

      if (relevantVector) {
        setAiInsights(prev => [...prev, 
          `🎯 Primary focus vector identified: ${relevantVector.title}`, 
          '🔬 Generating prescriptive insights with multi-agent collaboration...',
          '📊 Creating adaptive data visualizations...'
        ]);
        
        // Use enhanced AI service that can incorporate user data
        const { construct, thoughtStream: newThoughts } = await enhancedSynapticForgeAI.generateForesightConstructWithUserData(
          relevantVector,
          queryContext,
          profile || userProfile,
          dataSources,
          thoughtStream
        );
        
        setAiInsights(prev => [...prev, ...newThoughts]);
        setForesightConstruct(construct);
        
        // Save interaction to database if user is logged in
        if (user) {
          try {
            await saveInteraction({
              query_text: queryContext.query,
              query_type: queryContext.type,
              strategic_vector: relevantVector,
              foresight_construct: construct,
              ai_thought_stream: newThoughts
            });
            
            setAiInsights(prev => [...prev, '💾 Interaction saved to your personal knowledge base']);
          } catch (error) {
            console.error('Error saving interaction:', error);
          }
        }
        
        // Generate adaptive visualization
        const visualizationData = [
          { label: 'Current State', value: 65, color: '#6366f1' },
          { label: 'Projected Impact', value: 85, color: '#8b5cf6' },
          { label: 'Confidence Level', value: Math.round(relevantVector.confidenceScore * 100), color: '#10b981' },
          { label: 'Risk Factor', value: 35, color: '#f59e0b' }
        ];

        setGeneratedVisualization({
          data: visualizationData,
          type: 'bar',
          title: 'Strategic Vector Analysis',
          insight: `AI recommends focusing on ${relevantVector.title} with ${Math.round(relevantVector.confidenceScore * 100)}% confidence`
        });
        
        setForesightVisible(true);
        
        // Update cognitive state based on construct
        setCognitiveState(prev => ({
          ...prev,
          currentBrainwaveTarget: `${construct.sensoryDirectives.targetBrainwaveFrequency.type.toUpperCase()} (${construct.sensoryDirectives.targetBrainwaveFrequency.range})`,
          isOptimized: true,
          focusLevel: Math.min(1, prev.focusLevel + 0.1),
          clarityLevel: Math.min(1, prev.clarityLevel + 0.1)
        }));
        
        setAiInsights(prev => [...prev, 
          '✨ Foresight construct successfully generated', 
          '🎵 Cognitive audio optimization activated',
          '🎨 Dynamic visual metaphor rendered',
          user ? '📈 AI personality evolution stage advanced' : '📈 AI analysis complete'
        ]);
      }
      
      setSystemStatus('ready');
    } catch (error) {
      console.error('Error processing query:', error);
      setSystemStatus('error');
      setAiInsights(prev => [...prev, '⚠️ Processing error detected - AI adapting approach...', '🔄 Fallback reasoning protocols engaged']);
    } finally {
      setIsProcessing(false);
      setWorkflowActive(false);
    }
  };

  // Enhanced feedback with AI learning
  const handleFeedback = async (feedback: string) => {
    if (foresightConstruct && user && profile) {
      try {
        setAiInsights(prev => [...prev, 
          `📝 Processing user feedback: ${feedback}`, 
          '🧠 Updating AI personality matrix...',
          '📊 Recalibrating strategic analysis algorithms...'
        ]);
        
        // Track feedback
        await trackEvent('feedback_provided', { 
          feedback_type: feedback,
          interaction_id: foresightConstruct.id
        });
        
        const updatedProfile = await synapticForgeAI.refineLearningProfile(
          userProfile,
          feedback,
          foresightConstruct
        );
        setUserProfile(updatedProfile);
        
        setAiInsights(prev => [...prev, 
          '✅ AI personality successfully evolved', 
          `📈 Evolution stage: ${updatedProfile.aiPersonalityEvolutionStage.toFixed(1)}/10`,
          '🎯 Future insights will be more precisely calibrated'
        ]);
      } catch (error) {
        console.error('Error processing feedback:', error);
      }
    }
  };

  // Voice command handler
  const handleVoiceCommand = (command: string) => {
    if (command === 'open_query_forge') {
      setQueryForgeVisible(true);
    }
  };

  // Settings change handler
  const handleSettingsChange = (settings: any) => {
    setAiInsights(prev => [...prev, 
      '⚙️ User preferences updated', 
      '🎨 Interface adapting to new settings...',
      '🧠 AI personality adjusting to preferences'
    ]);
    
    // Update user profile based on settings
    setUserProfile(prev => ({
      ...prev,
      cognitivePreferences: {
        ...prev.cognitivePreferences,
        voiceTone: settings.aiVoiceTone,
        visualComplexity: settings.visualComplexity
      }
    }));
  };

  // Auto-refresh vectors with AI commentary
  useEffect(() => {
    if (isInitialized) {
      const interval = setInterval(async () => {
        try {
          setAiInsights(prev => [...prev, '🔄 Scanning global consciousness for new strategic vectors...']);
          const omniData = await synapticForgeAI.fetchOmniData();
          const vectors = await synapticForgeAI.analyzeEmergentVectors(omniData, userProfile);
          setEmergentVectors(vectors);
          setRealTimeData(omniData.slice(0, 10));
          setAiInsights(prev => [...prev, 
            '📡 Global data streams refreshed', 
            `🎯 ${vectors.length} strategic vectors currently active`,
            '📊 Real-time analytics updated'
          ]);
        } catch (error) {
          console.error('Error refreshing vectors:', error);
        }
      }, 3 * 60 * 1000); // 3 minutes

      return () => clearInterval(interval);
    }
  }, [isInitialized, userProfile]);

  // Initialize on mount
  useEffect(() => {
    if (!authLoading) {
      initializeSystem();
    }
  }, [authLoading, user]);

  // Show loading screen while auth is loading
  if (authLoading || profileLoading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-emerald-400/30 border-t-emerald-400 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-emerald-400 font-medium">Initializing SYNAPTIC FORGE...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white relative overflow-x-hidden">
      {/* Cognitive Canvas - Full Screen Background */}
      <CognitiveCanvas 
        foresightConstruct={foresightConstruct}
        isProcessing={isProcessing}
        className="fixed inset-0 z-0"
      />

      {/* Enhanced Audio Systems */}
      <AdaptiveAudioEngine
        foresightConstruct={foresightConstruct}
        cognitiveState={cognitiveState}
        enabled={audioEnabled}
        onToggle={() => setAudioEnabled(!audioEnabled)}
      />
      
      <AdaptiveSoundscape
        foresightConstruct={foresightConstruct}
        enabled={audioEnabled}
        insightType={foresightConstruct ? 'opportunity' : 'neutral'}
      />

      {/* Voice Command Interface */}
      <VoiceCommandInterface
        onCommand={handleVoiceCommand}
        isEnabled={voiceEnabled}
        onToggle={() => setVoiceEnabled(!voiceEnabled)}
      />

      {/* User Settings Panel */}
      <UserSettingsPanel
        isOpen={settingsOpen}
        onToggle={() => setSettingsOpen(!settingsOpen)}
        onSettingsChange={handleSettingsChange}
      />

      {/* Auth Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
      />

      {/* Main Content - Now properly scrollable */}
      <div className="relative z-10 w-full">
        <div className="container mx-auto px-6 py-8 max-w-7xl">
          {!isInitialized ? (
            <>
              {/* Enhanced Initialization State */}
              <div className="flex items-center justify-center min-h-screen">
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
                    <div className="w-40 h-40 mx-auto mb-8 bg-gradient-to-r from-emerald-600/20 to-cyan-600/20 rounded-full flex items-center justify-center backdrop-blur-sm border border-emerald-500/30 relative">
                      <AIPersonalityAvatar
                        evolutionStage={userProfile.aiPersonalityEvolutionStage}
                        isProcessing={true}
                        learningRate={0.85}
                      />
                    </div>
                    
                    <h1 className="text-6xl font-bold mb-4 font-space-grotesk bg-gradient-to-r from-white via-emerald-200 to-cyan-200 bg-clip-text text-transparent">
                      SYNAPTIC FORGE
                    </h1>
                    <h2 className="text-2xl font-light mb-6 text-emerald-300 font-space-grotesk">
                      The Adaptive Foresight Engine
                    </h2>
                    <p className="text-xl text-gray-300 mb-8 leading-relaxed max-w-3xl mx-auto">
                      Experience the future of AI-augmented strategic thinking. This revolutionary co-processor 
                      learns your decision patterns and provides prescriptive foresight optimized for your cognitive state.
                    </p>
                    
                    {!user && (
                      <motion.button
                        onClick={() => setAuthModalOpen(true)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="bg-gradient-to-r from-emerald-600 to-cyan-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:from-emerald-700 hover:to-cyan-700 transition-all duration-200 shadow-lg font-space-grotesk flex items-center gap-3 mx-auto mb-6"
                      >
                        <LogIn className="w-6 h-6" />
                        Sign In for Personalized AI Evolution
                      </motion.button>
                    )}
                    
                    {systemStatus === 'initializing' && (
                      <motion.div
                        className="flex flex-col items-center gap-4"
                      >
                        <motion.div
                          className="flex items-center justify-center gap-4"
                          animate={{ opacity: [0.5, 1, 0.5] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        >
                          <div className="w-8 h-8 border-2 border-emerald-400/30 border-t-emerald-400 rounded-full animate-spin" />
                          <span className="text-emerald-400 font-medium font-space-grotesk">
                            Initializing Quantum Neural Networks...
                          </span>
                        </motion.div>
                        
                        {/* AI Insights Stream during initialization */}
                        <div className="mt-6 max-w-md">
                          <AIInsightStream insights={aiInsights} />
                        </div>
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
                        Retry AI Initialization
                      </motion.button>
                    )}
                  </motion.div>
                </motion.div>
              </div>
            </>
          ) : (
            <>
              {/* Enhanced Active State - Now properly scrollable */}
              <div className="space-y-8">
                {/* Enhanced System Status Display */}
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center justify-between"
                >
                  <div className="inline-flex items-center gap-6 bg-black/40 backdrop-blur-xl rounded-2xl px-8 py-4 border border-emerald-500/30">
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
                      AI Evolution: {userProfile.aiPersonalityEvolutionStage.toFixed(1)}/10
                    </div>
                    <div className="w-px h-6 bg-white/20" />
                    <div className="text-white text-sm">
                      {emergentVectors.length} Strategic Vectors
                    </div>
                  </div>

                  {/* User Profile or Sign In Button */}
                  {user ? (
                    <UserProfileCard />
                  ) : (
                    <motion.button
                      onClick={() => setAuthModalOpen(true)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="bg-gradient-to-r from-emerald-600 to-cyan-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-emerald-700 hover:to-cyan-700 transition-all duration-200 shadow-lg font-space-grotesk flex items-center gap-2"
                    >
                      <LogIn className="w-5 h-5" />
                      Sign In
                    </motion.button>
                  )}
                </motion.div>

                {/* User-specific sections (only show if authenticated) */}
                {user && (
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <InteractionHistory />
                    <FavoriteInsights />
                    <UserDataUpload />
                  </div>
                )}

                {/* AI Agent Workflow */}
                <AIAgentWorkflow
                  query={foresightConstruct?.strategicVector.title || ''}
                  isActive={workflowActive}
                  onComplete={(result) => {
                    setAiInsights(prev => [...prev, '🤖 Autonomous workflow completed successfully']);
                  }}
                />

                {/* System Health Monitor */}
                <SystemHealthMonitor />

                {/* Anomaly Detection */}
                <AnomalyDetectionAlert
                  isActive={isInitialized}
                  onDismiss={(anomalyId) => {
                    setAiInsights(prev => [...prev, `🔕 Anomaly ${anomalyId} acknowledged and dismissed`]);
                  }}
                />

                {/* Real-time Analytics Dashboard */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2">
                    <RealTimeAnalytics 
                      data={realTimeData}
                      vectors={emergentVectors}
                      cognitiveState={cognitiveState}
                    />
                  </div>
                  <div>
                    <AIInsightStream insights={aiInsights} />
                  </div>
                </div>

                {/* Generated Data Visualization */}
                {generatedVisualization && (
                  <GenerativeDataVisualization
                    data={generatedVisualization.data}
                    type={generatedVisualization.type}
                    title={generatedVisualization.title}
                    insight={generatedVisualization.insight}
                  />
                )}

                {/* Enhanced Emergent Vectors Display */}
                {emergentVectors.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <div className="flex items-center gap-3 mb-6">
                      <Sparkles className="w-6 h-6 text-emerald-400" />
                      <h3 className="text-2xl font-bold text-white font-space-grotesk">
                        Emergent Strategic Vectors
                      </h3>
                      <div className="text-sm text-gray-400">
                        AI-identified patterns with {Math.round(emergentVectors.reduce((acc, v) => acc + v.confidenceScore, 0) / emergentVectors.length * 100)}% avg confidence
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {emergentVectors.slice(0, 6).map((vector, index) => (
                        <motion.div
                          key={vector.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="bg-gradient-to-br from-gray-900/60 to-black/60 backdrop-blur-xl rounded-2xl p-6 border border-white/10 hover:border-emerald-500/30 transition-all duration-300 cursor-pointer group"
                          whileHover={{ scale: 1.02 }}
                        >
                          <div className="flex items-center justify-between mb-3">
                            <h4 className="text-lg font-bold text-white font-space-grotesk group-hover:text-emerald-300 transition-colors">
                              {vector.title}
                            </h4>
                            <div className="text-right">
                              <div className="text-emerald-400 font-bold">{Math.round(vector.confidenceScore * 100)}%</div>
                              <div className="text-xs text-gray-400">Confidence</div>
                            </div>
                          </div>
                          <p className="text-gray-300 text-sm mb-4">{vector.description}</p>
                          
                          {/* Leading Indicators */}
                          <div className="mb-4">
                            <div className="text-xs text-gray-400 mb-2">Leading Indicators:</div>
                            <div className="flex flex-wrap gap-1">
                              {vector.leadingIndicators.slice(0, 2).map((indicator, idx) => (
                                <span key={idx} className="text-xs bg-emerald-500/20 text-emerald-300 px-2 py-1 rounded">
                                  {indicator}
                                </span>
                              ))}
                            </div>
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-gray-500 capitalize">{vector.impactTimeframe.replace('_', ' ')}</span>
                            <div className="flex items-center gap-1">
                              <TrendingUp className="w-3 h-3 text-emerald-400" />
                              <span className="text-xs text-emerald-400">
                                {Math.round(vector.relevanceToUser * 100)}% Relevant
                              </span>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* Enhanced Instructions */}
                {!foresightConstruct && !isProcessing && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center"
                  >
                    <div className="bg-gradient-to-r from-emerald-600/20 to-cyan-600/20 backdrop-blur-xl rounded-2xl p-8 border border-emerald-500/30">
                      <AIPersonalityAvatar
                        evolutionStage={userProfile.aiPersonalityEvolutionStage}
                        isProcessing={false}
                        learningRate={0.85}
                        className="mb-4"
                      />
                      <h3 className="text-2xl font-bold text-white mb-4 font-space-grotesk">
                        Ready for Strategic Analysis
                      </h3>
                      <p className="text-gray-300 font-space-grotesk text-lg mb-6">
                        Your AI co-processor has analyzed global data streams and identified strategic vectors.
                        Click the Brain icon to forge personalized insights.
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-400">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                          <span>Real-time global data analysis</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-cyan-400 rounded-full"></div>
                          <span>Autonomous AI agent workflows</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                          <span>Proactive anomaly detection</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-amber-400 rounded-full"></div>
                          <span>{user ? 'Personalized AI evolution' : 'Multi-sensory cognitive optimization'}</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>
            </>
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

      {/* Enhanced Foresight Display */}
      <AnimatePresence>
        {foresightVisible && foresightConstruct && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setForesightVisible(false)}
            />

            <div className="flex min-h-full items-start justify-center p-4 pt-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="w-full max-w-2xl"
                onClick={(e) => e.stopPropagation()}
              >
                <ForesightDisplay
                  foresightConstruct={foresightConstruct}
                  onFeedback={handleFeedback}
                  isVisible={true}
                />
                
                {/* Export Button */}
                <div className="mt-4 flex justify-center">
                  <ExportInsightButton foresightConstruct={foresightConstruct} />
                </div>
              </motion.div>
            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;