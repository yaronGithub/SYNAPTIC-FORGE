import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, MicOff, Volume2, Brain, AlertCircle, Settings, Sparkles, Zap } from 'lucide-react';

interface VoiceCommandInterfaceProps {
  onCommand: (command: string) => void;
  isEnabled: boolean;
  onToggle: () => void;
}

export function VoiceCommandInterface({ onCommand, isEnabled, onToggle }: VoiceCommandInterfaceProps) {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(null);
  const [isSupported, setIsSupported] = useState(false);
  const [permissionError, setPermissionError] = useState<string | null>(null);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);

  useEffect(() => {
    // Check if speech recognition is supported
    const SpeechRecognition = window.SpeechRecognition || (window as any).webkitSpeechRecognition;
    
    if (SpeechRecognition) {
      setIsSupported(true);
      checkMicrophonePermission();
      
      const recognitionInstance = new SpeechRecognition();
      
      recognitionInstance.continuous = false;
      recognitionInstance.interimResults = true;
      recognitionInstance.lang = 'en-US';

      recognitionInstance.onstart = () => {
        setIsListening(true);
        setTranscript('');
        setPermissionError(null);
      };

      recognitionInstance.onresult = (event) => {
        let finalTranscript = '';
        let interimTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript;
          } else {
            interimTranscript += transcript;
          }
        }

        setTranscript(finalTranscript || interimTranscript);

        if (finalTranscript) {
          processCommand(finalTranscript.toLowerCase().trim());
        }
      };

      recognitionInstance.onend = () => {
        setIsListening(false);
      };

      recognitionInstance.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
        
        switch (event.error) {
          case 'not-allowed':
            setPermissionError('Microphone access denied. Please allow microphone access in your browser settings.');
            setHasPermission(false);
            break;
          case 'no-speech':
            setPermissionError('No speech detected. Please try again.');
            break;
          case 'audio-capture':
            setPermissionError('No microphone found. Please check your audio devices.');
            break;
          case 'network':
            setPermissionError('Network error occurred. Please check your connection.');
            break;
          default:
            setPermissionError(`Speech recognition error: ${event.error}`);
        }
      };

      setRecognition(recognitionInstance);
    }
  }, []);

  const checkMicrophonePermission = async () => {
    try {
      if (navigator.permissions) {
        const permission = await navigator.permissions.query({ name: 'microphone' as PermissionName });
        setHasPermission(permission.state === 'granted');
        
        permission.onchange = () => {
          setHasPermission(permission.state === 'granted');
          if (permission.state === 'granted') {
            setPermissionError(null);
          }
        };
      }
    } catch (error) {
      console.log('Permission API not supported');
    }
  };

  const requestMicrophonePermission = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach(track => track.stop());
      setHasPermission(true);
      setPermissionError(null);
    } catch (error) {
      setHasPermission(false);
      setPermissionError('Microphone access denied. Please allow microphone access in your browser settings.');
    }
  };

  const processCommand = (command: string) => {
    // Process voice commands
    if (command.includes('synaptic') || command.includes('analyze')) {
      onCommand('open_query_forge');
      speak('Opening Query Forge interface');
    } else if (command.includes('help') || command.includes('commands')) {
      speak('Available commands: Say "Synaptic analyze this" to open Query Forge, or "Synaptic help" for assistance');
    } else if (command.includes('status')) {
      speak('SYNAPTIC FORGE is online and ready for strategic analysis');
    } else {
      // Pass through any other command
      onCommand(command);
    }
  };

  const speak = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      utterance.pitch = 0.8;
      utterance.volume = 0.7;
      speechSynthesis.speak(utterance);
    }
  };

  const startListening = async () => {
    if (!hasPermission) {
      await requestMicrophonePermission();
      return;
    }
    
    if (recognition && isEnabled) {
      try {
        recognition.start();
      } catch (error) {
        console.error('Failed to start recognition:', error);
        setPermissionError('Failed to start voice recognition. Please try again.');
      }
    }
  };

  const stopListening = () => {
    if (recognition) {
      recognition.stop();
    }
  };

  const openBrowserSettings = () => {
    speak('Please check your browser settings to allow microphone access for this site');
  };

  if (!isSupported) {
    return null; // Don't render if not supported
  }

  return (
    <div className="fixed bottom-24 right-6 z-40">
      <AnimatePresence>
        {/* Permission Error Display */}
        {permissionError && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="mb-6 bg-gradient-to-r from-red-600/20 via-red-600/10 to-orange-600/20 backdrop-blur-3xl rounded-2xl p-6 border-2 border-red-500/30 max-w-sm shadow-2xl"
          >
            <div className="flex items-center gap-3 mb-4">
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 1, repeat: Infinity }}
                className="p-3 bg-gradient-to-r from-red-600 to-orange-600 rounded-xl shadow-lg"
              >
                <AlertCircle className="w-6 h-6 text-white" />
              </motion.div>
              <span className="text-red-300 text-xl font-bold">Permission Required</span>
            </div>
            <p className="text-white text-lg mb-6">{permissionError}</p>
            <div className="flex gap-4">
              <motion.button
                onClick={requestMicrophonePermission}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="flex-1 px-4 py-3 bg-gradient-to-r from-red-600 to-orange-600 text-white text-lg font-medium rounded-xl transition-all duration-300 shadow-lg hover:shadow-red-500/25 flex items-center justify-center gap-2"
              >
                <Mic className="w-5 h-5" />
                Grant Access
              </motion.button>
              <motion.button
                onClick={openBrowserSettings}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="flex-1 px-4 py-3 bg-gray-600/80 hover:bg-gray-700/80 text-white text-lg font-medium rounded-xl transition-all duration-300 shadow-lg flex items-center justify-center gap-2"
              >
                <Settings className="w-5 h-5" />
                Settings
              </motion.button>
            </div>
          </motion.div>
        )}

        {/* Listening Display */}
        {isListening && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="mb-6 bg-gradient-to-r from-purple-600/20 via-indigo-600/20 to-blue-600/20 backdrop-blur-3xl rounded-2xl p-6 border-2 border-purple-500/30 max-w-sm shadow-2xl"
          >
            <div className="flex items-center gap-3 mb-4">
              <motion.div
                animate={{ 
                  scale: [1, 1.2, 1],
                  boxShadow: [
                    '0 0 0 rgba(139, 92, 246, 0.4)',
                    '0 0 20px rgba(139, 92, 246, 0.6)',
                    '0 0 0 rgba(139, 92, 246, 0.4)'
                  ]
                }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="p-3 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl shadow-lg"
              >
                <Mic className="w-6 h-6 text-white" />
              </motion.div>
              <span className="text-purple-300 text-xl font-bold">Listening...</span>
            </div>
            
            {/* Audio Visualization */}
            <div className="flex items-center justify-center h-8 mb-4">
              {Array.from({ length: 12 }).map((_, i) => (
                <motion.div
                  key={i}
                  className="w-1 mx-0.5 bg-gradient-to-t from-purple-600 to-blue-600 rounded-full"
                  animate={{ 
                    height: transcript 
                      ? [10, 20 + Math.random() * 20, 10] 
                      : [5, 10 + Math.random() * 10, 5] 
                  }}
                  transition={{ 
                    duration: 0.5 + Math.random() * 0.5, 
                    repeat: Infinity,
                    delay: i * 0.05
                  }}
                />
              ))}
            </div>
            
            {transcript && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white/10 rounded-xl p-4 border border-white/20 mb-4"
              >
                <p className="text-white text-lg">{transcript}</p>
              </motion.div>
            )}
            
            <div className="flex items-center gap-2 text-gray-300 text-lg">
              <Sparkles className="w-5 h-5 text-purple-400" />
              <p>Try: "Synaptic, analyze this" or "Help"</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex items-center gap-4">
        {/* Voice Command Toggle */}
        <motion.button
          onClick={onToggle}
          whileHover={{ scale: 1.1, rotate: 5 }}
          whileTap={{ scale: 0.9 }}
          className={`p-4 rounded-2xl backdrop-blur-3xl border-2 transition-all duration-300 shadow-xl ${
            isEnabled
              ? 'bg-gradient-to-r from-purple-600/80 via-indigo-600/80 to-blue-600/80 text-white border-white/20 hover:shadow-purple-500/25'
              : 'bg-gray-900/80 text-gray-400 border-gray-600/20 hover:text-white hover:border-gray-400/30'
          }`}
        >
          <Volume2 className="w-6 h-6" />
          
          {/* Pulsing Ring */}
          {isEnabled && (
            <motion.div
              className="absolute inset-0 rounded-2xl border-2 border-purple-400/50"
              animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          )}
        </motion.button>

        {/* Microphone Button */}
        {isEnabled && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            exit={{ opacity: 0, scale: 0.8, rotate: 10 }}
            onClick={isListening ? stopListening : startListening}
            whileHover={{ scale: 1.1, rotate: 5 }}
            whileTap={{ scale: 0.9 }}
            className={`p-6 rounded-2xl backdrop-blur-3xl border-2 transition-all duration-300 shadow-2xl ${
              isListening
                ? 'bg-gradient-to-r from-red-600/80 via-orange-600/80 to-amber-600/80 text-white border-red-400/30 animate-pulse'
                : hasPermission === false
                ? 'bg-gradient-to-r from-red-600/80 via-orange-600/80 to-amber-600/80 text-white border-red-400/30'
                : 'bg-gradient-to-r from-purple-600/80 via-indigo-600/80 to-blue-600/80 text-white border-white/20 hover:shadow-purple-500/25'
            }`}
          >
            {isListening ? (
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 0.5, repeat: Infinity }}
              >
                <MicOff className="w-8 h-8" />
              </motion.div>
            ) : hasPermission === false ? (
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <AlertCircle className="w-8 h-8" />
              </motion.div>
            ) : (
              <motion.div
                animate={{ 
                  scale: [1, 1.1, 1],
                  boxShadow: [
                    '0 0 0 rgba(139, 92, 246, 0.4)',
                    '0 0 20px rgba(139, 92, 246, 0.6)',
                    '0 0 0 rgba(139, 92, 246, 0.4)'
                  ]
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Mic className="w-8 h-8" />
              </motion.div>
            )}
            
            {/* Orbiting Particles */}
            {!isListening && hasPermission !== false && (
              <>
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    className="absolute w-1 h-1 bg-white rounded-full"
                    style={{
                      top: '50%',
                      left: '50%',
                    }}
                    animate={{
                      rotate: 360,
                      x: Math.cos(i * Math.PI * 2 / 3) * 25,
                      y: Math.sin(i * Math.PI * 2 / 3) * 25,
                      opacity: [0, 1, 0],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      delay: i * 0.3,
                      ease: "linear",
                    }}
                  />
                ))}
              </>
            )}
          </motion.button>
        )}
      </div>

      {/* Command Hints */}
      {isEnabled && !isListening && !permissionError && hasPermission !== false && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="absolute bottom-full right-0 mb-4 bg-gradient-to-r from-gray-900/90 via-black/90 to-gray-900/90 backdrop-blur-3xl rounded-2xl p-5 border border-white/10 max-w-xs shadow-2xl"
        >
          <div className="flex items-center gap-3 mb-3">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
              className="p-2 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl shadow-lg"
            >
              <Brain className="w-5 h-5 text-white" />
            </motion.div>
            <span className="text-purple-300 text-lg font-bold">Voice Commands</span>
          </div>
          <div className="space-y-3 text-gray-300">
            <div className="flex items-center gap-2 p-2 bg-white/5 rounded-lg border border-white/10">
              <Zap className="w-4 h-4 text-purple-400" />
              <span>"Synaptic, analyze this" - Open Query Forge</span>
            </div>
            <div className="flex items-center gap-2 p-2 bg-white/5 rounded-lg border border-white/10">
              <Sparkles className="w-4 h-4 text-blue-400" />
              <span>"Help" - Show available commands</span>
            </div>
            <div className="flex items-center gap-2 p-2 bg-white/5 rounded-lg border border-white/10">
              <Brain className="w-4 h-4 text-cyan-400" />
              <span>"Status" - System status check</span>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}