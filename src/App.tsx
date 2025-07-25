import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CognitiveCanvas } from './components/CognitiveCanvas';
import { SettingsAwareAudioEngine } from './components/SettingsAwareAudioEngine';
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
import { InsightManager } from './components/InsightManager';
import { DataSourceManager } from './components/DataSourceManager';
import { CollaborationHub } from './components/CollaborationHub';
import { EnhancedNavigation } from './components/EnhancedNavigation';
import { AccessibilityFeatures } from './components/AccessibilityFeatures';
import { synapticForgeAI } from './services/synapticForgeAI';
import { enhancedSynapticForgeAI } from './services/enhancedSynapticForgeAI';
import { useAuth } from './hooks/useAuth';
import { useUserProfile } from './hooks/useUserProfile';
import { useInteractionHistory } from './hooks/useInteractionHistory';
import { useUserDataSources } from './hooks/useUserDataSources';
import { useAnalytics } from './hooks/useAnalytics';
import { useSettings } from './hooks/useSettings';
import { UserProfile, ForesightConstruct, QueryContext, CognitiveState, EmergentStrategicVector } from './types';
import { Brain, Zap, Activity, Settings, Sparkles, TrendingUp, LogIn, Accessibility, Cpu, Layers, Orbit } from 'lucide-react';

function App() {
  // ALL HOOKS MUST BE CALLED FIRST - BEFORE ANY CONDITIONAL RETURNS
  
  // Auth and user state
  const { user, loading: authLoading } = useAuth();
  const { profile, loading: profileLoading } = useUserProfile();
  const { saveInteraction } = useInteractionHistory();
  const { dataSources } = useUserDataSources();
  const { trackEvent } = useAnalytics();
  const { settings, updateSettings } = useSettings();

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
      preferredBrainwaveState: settings.preferredBrainwaveState,
      voiceTone: settings.aiVoiceTone,
      visualComplexity: settings.visualComplexity
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
  const [audioEnabled, setAudioEnabled] = useState(settings.audioEnabled);
  const [queryForgeVisible, setQueryForgeVisible] = useState(false);
  const [foresightVisible, setForesightVisible] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [systemStatus, setSystemStatus] = useState<'initializing' | 'ready' | 'processing' | 'error'>('initializing');
  const [aiInsights, setAiInsights] = useState<string[]>([]);
  const [realTimeData, setRealTimeData] = useState<any[]>([]);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);

  // New enhanced state
  const [workflowActive, setWorkflowActive] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const [generatedVisualization, setGeneratedVisualization] = useState<any>(null);

  // New modal states
  const [insightManagerOpen, setInsightManagerOpen] = useState(false);
  const [dataSourceManagerOpen, setDataSourceManagerOpen] = useState(false);
  const [collaborationHubOpen, setCollaborationHubOpen] = useState(false);
  const [accessibilityOpen, setAccessibilityOpen] = useState(false);

  // Update user profile when Supabase profile changes
  useEffect(() => {
    if (profile) {
      setUserProfile(prev => ({
        ...prev,
        aiPersonalityEvolutionStage: profile.ai_personality_stage,
        learnedBiases: profile.learned_biases || prev.learnedBiases,
        cognitivePreferences: {
          ...prev.cognitivePreferences,
          ...profile.cognitive_preferences
        }
      }));
    }
  }, [profile]);

  // Update audio enabled state when settings change
  useEffect(() => {
    setAudioEnabled(settings.audioEnabled);
  }, [settings.audioEnabled]);

  // Initialize on mount
  useEffect(() => {
    if (!authLoading) {
      initializeSystem();
    }
  }, [authLoading, user]);

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

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey || event.metaKey) {
        switch (event.key) {
          case 'n':
            event.preventDefault();
            setQueryForgeVisible(true);
            break;
          case 'u':
            event.preventDefault();
            setDataSourceManagerOpen(true);
            break;
          case 's':
            event.preventDefault();
            setCollaborationHubOpen(true);
            break;
          case ',':
            event.preventDefault();
            setSettingsOpen(true);
            break;
          case 'k':
            event.preventDefault();
            // Focus search if available
            break;
        }
      }
      
      if (event.key === 'F1') {
        event.preventDefault();
        setAccessibilityOpen(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

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
      type: settings.defaultAnalysisType,
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
        
        // Save interaction to database if user is logged in and auto-save is enabled
        if (user && settings.autoSaveInteractions) {
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
        
        // Update cognitive state based on construct and settings
        setCognitiveState(prev => ({
          ...prev,
          currentBrainwaveTarget: `${construct.sensoryDirectives.targetBrainwaveFrequency.type.toUpperCase()} (${construct.sensoryDirectives.targetBrainwaveFrequency.range})`,
          isOptimized: settings.cognitiveOptimization,
          focusLevel: Math.min(1, prev.focusLevel + (settings.cognitiveOptimization ? 0.15 : 0.1)),
          clarityLevel: Math.min(1, prev.clarityLevel + (settings.cognitiveOptimization ? 0.15 : 0.1))
        }));
        
        setAiInsights(prev => [...prev, 
          '✨ Foresight construct successfully generated', 
          settings.audioEnabled ? '🎵 Cognitive audio optimization activated' : '🔇 Audio optimization disabled in settings',
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
  const handleSettingsChange = (newSettings: any) => {
    setAiInsights(prev => [...prev, 
      '⚙️ User preferences updated', 
      '🎨 Interface adapting to new settings...',
      '🧠 AI personality adjusting to preferences'
    ]);
    
    updateSettings(newSettings);
    
    // Update user profile based on settings
    setUserProfile(prev => ({
      ...prev,
      cognitivePreferences: {
        ...prev.cognitivePreferences,
        voiceTone: newSettings.aiVoiceTone,
        visualComplexity: newSettings.visualComplexity,
        preferredBrainwaveState: newSettings.preferredBrainwaveState
      }
    }));
  };

  // NOW HANDLE CONDITIONAL RENDERING AFTER ALL HOOKS ARE CALLED
  
  // Show loading screen while auth is loading
  if (authLoading || profileLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white flex items-center justify-center relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 via-cyan-500/10 to-purple-500/10 animate-pulse" />
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl animate-pulse" />
        </div>
        
        <div className="text-center relative z-10">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="mb-8"
          >
            <div className="relative">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                className="w-32 h-32 border-4 border-emerald-400/30 border-t-emerald-400 rounded-full mx-auto mb-6"
              />
              <motion.div
                animate={{ rotate: -360 }}
                transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
                className="absolute inset-4 border-2 border-cyan-400/30 border-b-cyan-400 rounded-full"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <Brain className="w-12 h-12 text-emerald-400" />
              </div>
            </div>
          </motion.div>
          
          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="text-4xl font-bold mb-4 font-space-grotesk bg-gradient-to-r from-emerald-400 via-cyan-400 to-purple-400 bg-clip-text text-transparent"
          >
            SYNAPTIC FORGE
          </motion.h1>
          
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.8 }}
            className="text-emerald-400 font-medium text-lg"
          >
            Initializing Quantum Neural Networks...
          </motion.p>
          
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 1, duration: 0.8 }}
            className="mt-8 flex justify-center space-x-2"
          >
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2 }}
                className="w-3 h-3 bg-emerald-400 rounded-full"
              />
            ))}
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white relative overflow-x-hidden">
      {/* Enhanced Animated Background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-cyan-500/5 to-purple-500/5" />
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '3s' }} />
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl animate-pulse" />
        </div>
        
        {/* Floating Particles */}
        {Array.from({ length: 20 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-emerald-400/30 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -100, 0],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      {/* Accessibility Quick Access - Enhanced Design */}
      <motion.button
        onClick={() => setAccessibilityOpen(true)}
        whileHover={{ scale: 1.1, rotate: 5 }}
        whileTap={{ scale: 0.9 }}
        className="fixed bottom-6 left-6 z-40 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white p-4 rounded-2xl shadow-2xl hover:shadow-blue-500/25 transition-all duration-300 border border-white/20 backdrop-blur-xl"
        aria-label="Open accessibility settings"
      >
        <Accessibility className="w-6 h-6" />
        <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full animate-pulse" />
      </motion.button>

      {/* Enhanced Navigation */}
      <EnhancedNavigation
        onOpenInsightManager={() => setInsightManagerOpen(true)}
        onOpenDataSourceManager={() => setDataSourceManagerOpen(true)}
        onOpenCollaborationHub={() => setCollaborationHubOpen(true)}
        onOpenSettings={() => setSettingsOpen(true)}
        onOpenQueryForge={() => setQueryForgeVisible(true)}
      />

      {/* Cognitive Canvas - Enhanced with Particles */}
      <CognitiveCanvas 
        foresightConstruct={foresightConstruct}
        isProcessing={isProcessing}
        className="fixed inset-0 z-0"
      />

      {/* Enhanced Audio Systems */}
      <SettingsAwareAudioEngine
        foresightConstruct={foresightConstruct}
        cognitiveState={cognitiveState}
        enabled={audioEnabled}
        onToggle={() => setAudioEnabled(!audioEnabled)}
      />
      
      <AdaptiveSoundscape
        foresightConstruct={foresightConstruct}
        enabled={audioEnabled && settings.audioEnabled}
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

      {/* Enhanced Modal Components */}
      <InsightManager
        isOpen={insightManagerOpen}
        onClose={() => setInsightManagerOpen(false)}
      />

      <DataSourceManager
        isOpen={dataSourceManagerOpen}
        onClose={() => setDataSourceManagerOpen(false)}
      />

      <CollaborationHub
        isOpen={collaborationHubOpen}
        onClose={() => setCollaborationHubOpen(false)}
      />

      <AccessibilityFeatures
        isOpen={accessibilityOpen}
        onClose={() => setAccessibilityOpen(false)}
      />

      {/* Main Content - Enhanced with Glass Morphism */}
      <div className="relative z-10 w-full">
        <div className="container mx-auto px-6 py-8 max-w-7xl">
          {!isInitialized ? (
            <>
              {/* Spectacular Initialization State */}
              <div className="flex items-center justify-center min-h-screen">
                <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className="text-center max-w-6xl mx-auto"
                >
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3, duration: 1 }}
                    className="mb-12"
                  >
                    <div className="relative w-64 h-64 mx-auto mb-12">
                      {/* Multi-layered Rotating Rings */}
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                        className="absolute inset-0 border-4 border-emerald-500/30 border-t-emerald-500 rounded-full"
                      />
                      <motion.div
                        animate={{ rotate: -360 }}
                        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                        className="absolute inset-8 border-2 border-cyan-500/30 border-r-cyan-500 rounded-full"
                      />
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                        className="absolute inset-16 border-2 border-purple-500/30 border-b-purple-500 rounded-full"
                      />
                      
                      {/* Central AI Avatar */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <motion.div
                          animate={{ 
                            scale: [1, 1.1, 1],
                            boxShadow: [
                              '0 0 20px rgba(16, 185, 129, 0.5)',
                              '0 0 40px rgba(16, 185, 129, 0.8)',
                              '0 0 20px rgba(16, 185, 129, 0.5)'
                            ]
                          }}
                          transition={{ duration: 3, repeat: Infinity }}
                          className="w-24 h-24 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-full flex items-center justify-center backdrop-blur-xl border border-white/20"
                        >
                          <Brain className="w-12 h-12 text-white" />
                        </motion.div>
                      </div>

                      {/* Orbiting Elements */}
                      {[0, 1, 2, 3].map((i) => (
                        <motion.div
                          key={i}
                          className="absolute w-4 h-4 bg-gradient-to-r from-emerald-400 to-cyan-400 rounded-full"
                          style={{
                            top: '50%',
                            left: '50%',
                            transformOrigin: '0 0',
                          }}
                          animate={{
                            rotate: 360,
                            x: Math.cos(i * Math.PI / 2) * 100,
                            y: Math.sin(i * Math.PI / 2) * 100,
                          }}
                          transition={{
                            duration: 8,
                            repeat: Infinity,
                            ease: "linear",
                            delay: i * 0.5,
                          }}
                        />
                      ))}
                    </div>
                    
                    <motion.h1
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.8, duration: 1 }}
                      className="text-8xl font-bold mb-6 font-space-grotesk"
                    >
                      <span className="bg-gradient-to-r from-emerald-400 via-cyan-400 to-purple-400 bg-clip-text text-transparent">
                        SYNAPTIC
                      </span>
                      <br />
                      <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-emerald-400 bg-clip-text text-transparent">
                        FORGE
                      </span>
                    </motion.h1>
                    
                    <motion.h2
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 1.2, duration: 0.8 }}
                      className="text-3xl font-light mb-8 text-emerald-300 font-space-grotesk"
                    >
                      The Adaptive Foresight Engine
                    </motion.h2>
                    
                    <motion.p
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 1.6, duration: 0.8 }}
                      className="text-xl text-gray-300 mb-12 leading-relaxed max-w-4xl mx-auto"
                    >
                      Experience the future of AI-augmented strategic thinking. This revolutionary co-processor 
                      learns your decision patterns and provides prescriptive foresight optimized for your cognitive state.
                    </motion.p>
                    
                    {!user && (
                      <motion.button
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 2, duration: 0.8 }}
                        onClick={() => setAuthModalOpen(true)}
                        whileHover={{ scale: 1.05, boxShadow: '0 20px 40px rgba(16, 185, 129, 0.3)' }}
                        whileTap={{ scale: 0.95 }}
                        className="bg-gradient-to-r from-emerald-600 via-cyan-600 to-purple-600 text-white px-12 py-6 rounded-2xl font-semibold text-xl hover:from-emerald-700 hover:to-purple-700 transition-all duration-300 shadow-2xl font-space-grotesk flex items-center gap-4 mx-auto mb-8 border border-white/20 backdrop-blur-xl"
                      >
                        <LogIn className="w-8 h-8" />
                        Sign In for Personalized AI Evolution
                      </motion.button>
                    )}
                    
                    {systemStatus === 'initializing' && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 2.5 }}
                        className="flex flex-col items-center gap-6"
                      >
                        <motion.div
                          className="flex items-center justify-center gap-6"
                          animate={{ opacity: [0.5, 1, 0.5] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        >
                          <div className="flex space-x-2">
                            {[0, 1, 2, 3, 4].map((i) => (
                              <motion.div
                                key={i}
                                className="w-3 h-3 bg-emerald-400 rounded-full"
                                animate={{
                                  scale: [1, 1.5, 1],
                                  opacity: [0.5, 1, 0.5],
                                }}
                                transition={{
                                  duration: 1.5,
                                  repeat: Infinity,
                                  delay: i * 0.2,
                                }}
                              />
                            ))}
                          </div>
                          <span className="text-emerald-400 font-medium font-space-grotesk text-lg">
                            Initializing Quantum Neural Networks...
                          </span>
                        </motion.div>
                        
                        {/* AI Insights Stream during initialization */}
                        <div className="mt-8 max-w-md">
                          <AIInsightStream insights={aiInsights} />
                        </div>
                      </motion.div>
                    )}

                    {systemStatus === 'error' && (
                      <motion.button
                        onClick={initializeSystem}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="bg-gradient-to-r from-emerald-600 to-cyan-600 text-white px-16 py-8 rounded-2xl font-semibold text-2xl hover:from-emerald-700 hover:to-cyan-700 transition-all duration-200 shadow-2xl font-space-grotesk flex items-center gap-6 mx-auto border border-white/20 backdrop-blur-xl"
                      >
                        <Zap className="w-10 h-10" />
                        Retry AI Initialization
                      </motion.button>
                    )}
                  </motion.div>
                </motion.div>
              </div>
            </>
          ) : (
            <>
              {/* Enhanced Active State */}
              <div className="space-y-8">
                {/* Spectacular System Status Display */}
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center justify-between"
                >
                  <div className="inline-flex items-center gap-8 bg-black/20 backdrop-blur-2xl rounded-3xl px-10 py-6 border border-emerald-500/30 shadow-2xl">
                    <div className="flex items-center gap-3">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                        className="p-3 bg-gradient-to-r from-emerald-600 to-cyan-600 rounded-2xl"
                      >
                        <Activity className="w-6 h-6 text-white" />
                      </motion.div>
                      <div>
                        <span className="text-emerald-400 font-bold text-xl font-space-grotesk">SYNAPTIC FORGE</span>
                        <div className="text-xs text-gray-400">Quantum Neural Engine</div>
                      </div>
                    </div>
                    <div className="w-px h-8 bg-white/20" />
                    <div className="flex items-center gap-3">
                      <motion.div 
                        className={`w-4 h-4 rounded-full ${
                          systemStatus === 'ready' ? 'bg-emerald-400' :
                          systemStatus === 'processing' ? 'bg-amber-400' :
                          'bg-red-400'
                        }`}
                        animate={systemStatus === 'processing' ? { scale: [1, 1.2, 1] } : {}}
                        transition={{ duration: 1, repeat: Infinity }}
                      />
                      <span className="text-white font-medium capitalize">{systemStatus}</span>
                    </div>
                    <div className="w-px h-8 bg-white/20" />
                    <div className="text-white">
                      <div className="text-sm font-medium">AI Evolution</div>
                      <div className="text-emerald-400 font-bold">{userProfile.aiPersonalityEvolutionStage.toFixed(1)}/10</div>
                    </div>
                    <div className="w-px h-8 bg-white/20" />
                    <div className="text-white">
                      <div className="text-sm font-medium">Strategic Vectors</div>
                      <div className="text-cyan-400 font-bold">{emergentVectors.length}</div>
                    </div>
                  </div>

                  {/* Enhanced User Profile or Sign In Button */}
                  {user ? (
                    <UserProfileCard />
                  ) : (
                    <motion.button
                      onClick={() => setAuthModalOpen(true)}
                      whileHover={{ scale: 1.05, boxShadow: '0 10px 30px rgba(16, 185, 129, 0.3)' }}
                      whileTap={{ scale: 0.95 }}
                      className="bg-gradient-to-r from-emerald-600 via-cyan-600 to-purple-600 text-white px-8 py-4 rounded-2xl font-semibold hover:from-emerald-700 hover:to-purple-700 transition-all duration-300 shadow-xl font-space-grotesk flex items-center gap-3 border border-white/20 backdrop-blur-xl"
                    >
                      <LogIn className="w-6 h-6" />
                      Sign In
                    </motion.button>
                  )}
                </motion.div>

                {/* User-specific sections with enhanced glass morphism */}
                {user && (
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 }}
                    >
                      <InteractionHistory />
                    </motion.div>
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                    >
                      <FavoriteInsights />
                    </motion.div>
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 }}
                    >
                      <UserDataUpload />
                    </motion.div>
                  </div>
                )}

                {/* Enhanced AI Agent Workflow */}
                <AIAgentWorkflow
                  query={foresightConstruct?.strategicVector.title || ''}
                  isActive={workflowActive}
                  onComplete={(result) => {
                    setAiInsights(prev => [...prev, '🤖 Autonomous workflow completed successfully']);
                  }}
                />

                {/* Enhanced System Health Monitor */}
                <SystemHealthMonitor />

                {/* Enhanced Anomaly Detection */}
                <AnomalyDetectionAlert
                  isActive={isInitialized && settings.proactiveAlerts}
                  onDismiss={(anomalyId) => {
                    setAiInsights(prev => [...prev, `🔕 Anomaly ${anomalyId} acknowledged and dismissed`]);
                  }}
                />

                {/* Enhanced Real-time Analytics Dashboard */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <motion.div 
                    className="lg:col-span-2"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    <RealTimeAnalytics 
                      data={realTimeData}
                      vectors={emergentVectors}
                      cognitiveState={cognitiveState}
                    />
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 }}
                  >
                    <AIInsightStream insights={aiInsights} />
                  </motion.div>
                </div>

                {/* Enhanced Generated Data Visualization */}
                {generatedVisualization && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                  >
                    <GenerativeDataVisualization
                      data={generatedVisualization.data}
                      type={generatedVisualization.type}
                      title={generatedVisualization.title}
                      insight={generatedVisualization.insight}
                    />
                  </motion.div>
                )}

                {/* Spectacular Emergent Vectors Display */}
                {emergentVectors.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 }}
                  >
                    <div className="flex items-center gap-4 mb-8">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                        className="p-3 bg-gradient-to-r from-emerald-600 to-cyan-600 rounded-2xl"
                      >
                        <Sparkles className="w-8 h-8 text-white" />
                      </motion.div>
                      <div>
                        <h3 className="text-3xl font-bold text-white font-space-grotesk">
                          Emergent Strategic Vectors
                        </h3>
                        <div className="text-emerald-400 font-medium">
                          AI-identified patterns with {Math.round(emergentVectors.reduce((acc, v) => acc + v.confidenceScore, 0) / emergentVectors.length * 100)}% avg confidence
                        </div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                      {emergentVectors.slice(0, 6).map((vector, index) => (
                        <motion.div
                          key={vector.id}
                          initial={{ opacity: 0, y: 30 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="group bg-gradient-to-br from-gray-900/60 via-black/60 to-gray-900/60 backdrop-blur-2xl rounded-3xl p-8 border border-white/10 hover:border-emerald-500/50 transition-all duration-500 cursor-pointer shadow-2xl hover:shadow-emerald-500/20"
                          whileHover={{ scale: 1.02, y: -5 }}
                        >
                          <div className="flex items-center justify-between mb-4">
                            <h4 className="text-xl font-bold text-white font-space-grotesk group-hover:text-emerald-300 transition-colors">
                              {vector.title}
                            </h4>
                            <div className="text-right">
                              <motion.div 
                                className="text-2xl font-bold text-emerald-400"
                                animate={{ scale: [1, 1.1, 1] }}
                                transition={{ duration: 2, repeat: Infinity }}
                              >
                                {Math.round(vector.confidenceScore * 100)}%
                              </motion.div>
                              <div className="text-xs text-gray-400">Confidence</div>
                            </div>
                          </div>
                          
                          <p className="text-gray-300 mb-6 leading-relaxed">{vector.description}</p>
                          
                          {/* Enhanced Leading Indicators */}
                          <div className="mb-6">
                            <div className="text-sm text-emerald-400 mb-3 font-medium">Leading Indicators:</div>
                            <div className="flex flex-wrap gap-2">
                              {vector.leadingIndicators.slice(0, 2).map((indicator, idx) => (
                                <span key={idx} className="text-xs bg-emerald-500/20 text-emerald-300 px-3 py-2 rounded-full border border-emerald-500/30 backdrop-blur-sm">
                                  {indicator}
                                </span>
                              ))}
                            </div>
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-500 capitalize bg-gray-800/50 px-3 py-1 rounded-full">
                              {vector.impactTimeframe.replace('_', ' ')}
                            </span>
                            <div className="flex items-center gap-2">
                              <TrendingUp className="w-4 h-4 text-emerald-400" />
                              <span className="text-sm text-emerald-400 font-medium">
                                {Math.round(vector.relevanceToUser * 100)}% Relevant
                              </span>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* Enhanced Ready State Instructions */}
                {!foresightConstruct && !isProcessing && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 }}
                    className="text-center"
                  >
                    <div className="bg-gradient-to-br from-emerald-600/10 via-cyan-600/10 to-purple-600/10 backdrop-blur-2xl rounded-3xl p-12 border border-emerald-500/30 shadow-2xl">
                      <motion.div
                        animate={{ scale: [1, 1.05, 1] }}
                        transition={{ duration: 3, repeat: Infinity }}
                        className="mb-8"
                      >
                        <AIPersonalityAvatar
                          evolutionStage={userProfile.aiPersonalityEvolutionStage}
                          isProcessing={false}
                          learningRate={0.85}
                          className="mb-6"
                        />
                      </motion.div>
                      
                      <h3 className="text-4xl font-bold text-white mb-6 font-space-grotesk">
                        Ready for Strategic Analysis
                      </h3>
                      <p className="text-gray-300 font-space-grotesk text-xl mb-10 leading-relaxed max-w-4xl mx-auto">
                        Your AI co-processor has analyzed global data streams and identified strategic vectors.
                        Use the navigation menu or click the Brain icon to forge personalized insights.
                      </p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                        {[
                          { icon: Activity, text: 'Real-time global data analysis', color: 'emerald' },
                          { icon: Cpu, text: 'Autonomous AI agent workflows', color: 'cyan' },
                          { icon: Layers, text: 'Proactive anomaly detection', color: 'purple' },
                          { icon: Orbit, text: user ? 'Personalized AI evolution' : 'Multi-sensory cognitive optimization', color: 'amber' }
                        ].map((item, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 1 + index * 0.1 }}
                            className={`flex items-center gap-4 p-4 bg-${item.color}-600/10 rounded-2xl border border-${item.color}-500/30 backdrop-blur-sm`}
                          >
                            <div className={`w-3 h-3 bg-${item.color}-400 rounded-full animate-pulse`} />
                            <item.icon className={`w-6 h-6 text-${item.color}-400`} />
                            <span className="text-gray-300 font-medium">{item.text}</span>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Enhanced Query Forge Interface */}
      <QueryForge
        onQuerySubmit={handleQuerySubmit}
        isProcessing={isProcessing}
        isVisible={queryForgeVisible}
        onToggle={() => setQueryForgeVisible(!queryForgeVisible)}
      />

      {/* Spectacular Foresight Display */}
      <AnimatePresence>
        {foresightVisible && foresightConstruct && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/70 backdrop-blur-lg"
              onClick={() => setForesightVisible(false)}
            />

            <div className="flex min-h-full items-start justify-center p-4 pt-8">
              <motion.div
                initial={{ opacity: 0, y: 50, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -50, scale: 0.9 }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                className="w-full max-w-4xl"
                onClick={(e) => e.stopPropagation()}
              >
                <ForesightDisplay
                  foresightConstruct={foresightConstruct}
                  onFeedback={handleFeedback}
                  isVisible={true}
                />
                
                {/* Enhanced Export Button */}
                <div className="mt-6 flex justify-center">
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