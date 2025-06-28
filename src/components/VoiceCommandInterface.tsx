import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, MicOff, Volume2, Brain, AlertCircle, Settings } from 'lucide-react';

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
    <div className="fixed bottom-6 left-6 z-40">
      <AnimatePresence>
        {/* Permission Error Display */}
        {permissionError && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="mb-4 bg-gradient-to-r from-red-600/20 to-orange-600/20 backdrop-blur-xl rounded-lg p-4 border border-red-500/30 max-w-sm"
          >
            <div className="flex items-center gap-2 mb-2">
              <AlertCircle className="w-4 h-4 text-red-400" />
              <span className="text-red-300 text-sm font-medium">Permission Required</span>
            </div>
            <p className="text-white text-sm mb-3">{permissionError}</p>
            <div className="flex gap-2">
              <button
                onClick={requestMicrophonePermission}
                className="px-3 py-1 bg-red-600/80 hover:bg-red-700/80 text-white text-xs rounded-md transition-colors"
              >
                Grant Access
              </button>
              <button
                onClick={openBrowserSettings}
                className="px-3 py-1 bg-gray-600/80 hover:bg-gray-700/80 text-white text-xs rounded-md transition-colors flex items-center gap-1"
              >
                <Settings className="w-3 h-3" />
                Settings
              </button>
            </div>
          </motion.div>
        )}

        {/* Listening Display */}
        {isListening && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="mb-4 bg-gradient-to-r from-purple-600/20 to-blue-600/20 backdrop-blur-xl rounded-lg p-4 border border-purple-500/30 max-w-xs"
          >
            <div className="flex items-center gap-2 mb-2">
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
                className="w-2 h-2 bg-purple-400 rounded-full"
              />
              <span className="text-purple-300 text-sm font-medium">Listening...</span>
            </div>
            {transcript && (
              <p className="text-white text-sm">{transcript}</p>
            )}
            <p className="text-gray-400 text-xs mt-2">
              Try: "Synaptic, analyze this" or "Help"
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex items-center gap-3">
        {/* Voice Command Toggle */}
        <motion.button
          onClick={onToggle}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={`p-3 rounded-full backdrop-blur-xl border transition-all ${
            isEnabled
              ? 'bg-gradient-to-r from-purple-600/80 to-blue-600/80 text-white border-white/20 shadow-lg'
              : 'bg-gray-900/80 text-gray-400 border-gray-600/20 hover:text-white'
          }`}
        >
          <Volume2 className="w-5 h-5" />
        </motion.button>

        {/* Microphone Button */}
        {isEnabled && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={isListening ? stopListening : startListening}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`p-4 rounded-full backdrop-blur-xl border transition-all ${
              isListening
                ? 'bg-gradient-to-r from-red-600/80 to-orange-600/80 text-white border-red-400/30 shadow-lg animate-pulse'
                : hasPermission === false
                ? 'bg-gradient-to-r from-red-600/80 to-orange-600/80 text-white border-red-400/30 shadow-lg'
                : 'bg-gradient-to-r from-purple-600/80 to-blue-600/80 text-white border-white/20 shadow-lg hover:from-purple-700/80 hover:to-blue-700/80'
            }`}
          >
            {isListening ? (
              <MicOff className="w-6 h-6" />
            ) : hasPermission === false ? (
              <AlertCircle className="w-6 h-6" />
            ) : (
              <Mic className="w-6 h-6" />
            )}
          </motion.button>
        )}
      </div>

      {/* Command Hints */}
      {isEnabled && !isListening && !permissionError && hasPermission !== false && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute bottom-full left-0 mb-2 bg-black/80 backdrop-blur-xl rounded-lg p-3 border border-white/10 max-w-xs"
        >
          <div className="flex items-center gap-2 mb-2">
            <Brain className="w-4 h-4 text-purple-400" />
            <span className="text-purple-300 text-sm font-medium">Voice Commands</span>
          </div>
          <div className="text-xs text-gray-300 space-y-1">
            <div>"Synaptic, analyze this" - Open Query Forge</div>
            <div>"Help" - Show available commands</div>
            <div>"Status" - System status check</div>
          </div>
        </motion.div>
      )}
    </div>
  );
}