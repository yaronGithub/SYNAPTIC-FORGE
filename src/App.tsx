import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { PersonalEmotionalState, BlendedResonanceProfile, GlobalPulseData } from './types';
import { nexusAI } from './services/nexusAI';
import { PsycheVisualizer } from './components/PsycheVisualizer';
import { PsycheAudioscape } from './components/PsycheAudioscape';
import { PersonalEmotionalNexus } from './components/PersonalEmotionalNexus';
import { SharedConsciousnessStream } from './components/SharedConsciousnessStream';
import { NexusAvatar } from './components/NexusAvatar';
import { Brain, Volume2, VolumeX, Power, Loader2 } from 'lucide-react';

function App() {
  // Core state
  const [globalPulse, setGlobalPulse] = useState<GlobalPulseData | null>(null);
  const [resonanceProfile, setResonanceProfile] = useState<BlendedResonanceProfile | null>(null);
  const [personalState, setPersonalState] = useState<PersonalEmotionalState | null>(null);
  
  // UI state
  const [isActive, setIsActive] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  // Initialize PSYCHE-LINK
  const initializePsycheLink = async () => {
    setIsActive(true);
    setIsProcessing(true);

    try {
      // Fetch and analyze global news
      const articles = await nexusAI.fetchNews();
      const pulse = await nexusAI.analyzeGlobalPulse(articles);
      
      setGlobalPulse(pulse);
      setLastUpdate(new Date());

      // If user has set personal state, blend immediately
      if (personalState) {
        const blended = await nexusAI.blendPersonalResonance(pulse, personalState);
        setResonanceProfile(blended);
      }

    } catch (error) {
      console.error('Error initializing PSYCHE-LINK:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  // Handle personal emotional state change
  const handlePersonalStateChange = async (newState: PersonalEmotionalState) => {
    setPersonalState(newState);
    
    if (globalPulse) {
      setIsProcessing(true);
      try {
        const blended = await nexusAI.blendPersonalResonance(globalPulse, newState);
        setResonanceProfile(blended);
      } catch (error) {
        console.error('Error blending resonance:', error);
      } finally {
        setIsProcessing(false);
      }
    }
  };

  // Auto-refresh global pulse every 60 seconds
  useEffect(() => {
    if (!isActive) return;

    const interval = setInterval(async () => {
      try {
        const articles = await nexusAI.fetchNews();
        const pulse = await nexusAI.analyzeGlobalPulse(articles);
        setGlobalPulse(pulse);
        setLastUpdate(new Date());

        // Re-blend if personal state exists
        if (personalState) {
          const blended = await nexusAI.blendPersonalResonance(pulse, personalState);
          setResonanceProfile(blended);
        }
      } catch (error) {
        console.error('Error refreshing global pulse:', error);
      }
    }, 60000); // 60 seconds

    return () => clearInterval(interval);
  }, [isActive, personalState]);

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden relative">
      {/* Psyche Visualizer - Full Screen Background */}
      <PsycheVisualizer resonanceProfile={resonanceProfile} />

      {/* Psyche Audioscape */}
      <PsycheAudioscape resonanceProfile={resonanceProfile} enabled={audioEnabled} />

      {/* Header Controls */}
      <div className="fixed top-6 right-6 z-40 flex items-center gap-4">
        {/* Audio Toggle */}
        <button
          onClick={() => setAudioEnabled(!audioEnabled)}
          className={`p-3 rounded-full backdrop-blur-xl border border-white/20 transition-all duration-200 ${
            audioEnabled 
              ? 'bg-gradient-to-r from-green-600/80 to-emerald-600/80 text-white' 
              : 'bg-gray-900/80 text-gray-400 hover:text-white'
          }`}
        >
          {audioEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
        </button>

        {/* Status Indicator */}
        {lastUpdate && (
          <div className="text-right text-xs text-white/60 backdrop-blur-xl bg-black/20 px-3 py-2 rounded-lg border border-white/10">
            <div>Global Pulse</div>
            <div>{lastUpdate.toLocaleTimeString()}</div>
          </div>
        )}
      </div>

      {/* Personal Emotional Nexus */}
      <PersonalEmotionalNexus
        onStateChange={handlePersonalStateChange}
        isActive={isActive}
        onToggle={() => setIsActive(!isActive)}
      />

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center p-6">
        {!isActive ? (
          /* Welcome State */
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
              <div className="w-40 h-40 mx-auto mb-8 bg-gradient-to-r from-purple-600/20 to-blue-600/20 rounded-full flex items-center justify-center backdrop-blur-sm border border-white/10">
                <Brain className="w-20 h-20 text-purple-400" />
              </div>
              
              <h1 className="text-5xl font-bold mb-4 font-orbitron bg-gradient-to-r from-white via-purple-200 to-blue-200 bg-clip-text text-transparent">
                PSYCHE-LINK
              </h1>
              <h2 className="text-2xl font-light mb-6 text-purple-300 font-orbitron">
                The Collective Conscious Weaver
              </h2>
              <p className="text-xl text-gray-300 mb-8 leading-relaxed max-w-3xl mx-auto">
                Establish a neural-sensory link between your personal psycho-emotional state 
                and the real-time collective consciousness of the world. Experience the global pulse 
                through immersive visuals, binaural soundscapes, and shared consciousness streams.
              </p>
              
              <motion.button
                onClick={initializePsycheLink}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-12 py-6 rounded-xl font-semibold text-xl hover:from-purple-700 hover:to-blue-700 transition-all duration-200 shadow-lg font-orbitron flex items-center gap-4 mx-auto"
              >
                <Power className="w-8 h-8" />
                Activate PSYCHE-LINK
              </motion.button>
            </motion.div>
          </motion.div>
        ) : (
          /* Active State */
          <div className="w-full max-w-6xl mx-auto">
            {/* Central Nexus Avatar */}
            <div className="text-center mb-12">
              <NexusAvatar 
                resonanceProfile={resonanceProfile}
                isProcessing={isProcessing}
              />
            </div>

            {isProcessing && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center mb-8"
              >
                <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-purple-400" />
                <div className="text-purple-400 font-medium font-orbitron">Weaving Consciousness...</div>
                <div className="text-sm text-gray-500 mt-1">Processing global emotional frequencies</div>
              </motion.div>
            )}

            {/* Global Pulse Data Display */}
            {globalPulse && !isProcessing && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
              >
                {/* Dominant Frequencies */}
                <div className="bg-gradient-to-br from-gray-900/60 to-black/60 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
                  <h3 className="text-lg font-bold text-white mb-4 font-orbitron">Emotional Frequencies</h3>
                  <div className="space-y-2">
                    {globalPulse.dominantEmotionalFrequencies.map((freq, index) => (
                      <div key={index} className="text-purple-300 text-sm">{freq}</div>
                    ))}
                  </div>
                </div>

                {/* Energetic State */}
                <div className="bg-gradient-to-br from-gray-900/60 to-black/60 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
                  <h3 className="text-lg font-bold text-white mb-4 font-orbitron">Energetic State</h3>
                  <div className="text-cyan-300 text-lg capitalize">{globalPulse.prevailingEnergeticState}</div>
                  <div className="text-gray-400 text-sm mt-2">Intensity: {globalPulse.numericalIntensity}/10</div>
                </div>

                {/* Collective Symbols */}
                <div className="bg-gradient-to-br from-gray-900/60 to-black/60 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
                  <h3 className="text-lg font-bold text-white mb-4 font-orbitron">Collective Symbols</h3>
                  <div className="space-y-2">
                    {globalPulse.collectiveSymbols.map((symbol, index) => (
                      <div key={index} className="text-emerald-300 text-sm">{symbol}</div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Instructions */}
            {!personalState && !isProcessing && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center"
              >
                <p className="text-gray-400 font-orbitron">
                  Click the Brain icon to calibrate your personal emotional state
                </p>
                <p className="text-sm text-gray-500 mt-2">
                  Your psyche will blend with the global consciousness
                </p>
              </motion.div>
            )}
          </div>
        )}
      </div>

      {/* Shared Consciousness Stream */}
      <SharedConsciousnessStream resonanceProfile={resonanceProfile} />
    </div>
  );
}

export default App;