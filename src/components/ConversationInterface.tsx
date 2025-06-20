import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ConversationalMessage } from '../types';
import { MessageCircle, Send, Brain } from 'lucide-react';

interface ConversationInterfaceProps {
  message: ConversationalMessage | null;
  onRespond: (response: string) => void;
  isVisible: boolean;
}

export function ConversationInterface({ message, onRespond, isVisible }: ConversationInterfaceProps) {
  const [response, setResponse] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (response.trim()) {
      onRespond(response.trim());
      setResponse('');
      setIsExpanded(false);
    }
  };

  const getMessageTypeColor = (type: string) => {
    switch (type) {
      case 'question': return 'from-blue-600 to-cyan-600';
      case 'insight': return 'from-purple-600 to-pink-600';
      case 'guidance': return 'from-green-600 to-emerald-600';
      case 'reflection': return 'from-orange-600 to-yellow-600';
      default: return 'from-gray-600 to-gray-700';
    }
  };

  return (
    <AnimatePresence>
      {isVisible && message && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 50, scale: 0.9 }}
          className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-30 w-full max-w-md px-4"
        >
          <div className="bg-gradient-to-br from-gray-900/95 to-black/95 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl overflow-hidden">
            {/* Message Display */}
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className={`p-2 bg-gradient-to-r ${getMessageTypeColor(message.type)} rounded-lg`}>
                  <Brain className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h4 className="text-white font-semibold capitalize font-orbitron">{message.type}</h4>
                  <p className="text-gray-400 text-sm">Nexus Communication</p>
                </div>
              </div>
              
              <p className="text-gray-200 leading-relaxed mb-4">{message.content}</p>
              
              {!isExpanded && (
                <button
                  onClick={() => setIsExpanded(true)}
                  className="flex items-center gap-2 text-purple-400 hover:text-purple-300 transition-colors text-sm font-medium"
                >
                  <MessageCircle className="w-4 h-4" />
                  Respond to Nexus
                </button>
              )}
            </div>

            {/* Response Interface */}
            <AnimatePresence>
              {isExpanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="border-t border-white/10 bg-black/20"
                >
                  <form onSubmit={handleSubmit} className="p-4">
                    <div className="flex gap-3">
                      <input
                        type="text"
                        value={response}
                        onChange={(e) => setResponse(e.target.value)}
                        placeholder="Share your thoughts with the Nexus..."
                        className="flex-1 px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all text-white placeholder-gray-500 text-sm backdrop-blur-sm"
                        autoFocus
                      />
                      <button
                        type="submit"
                        disabled={!response.trim()}
                        className="px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Send className="w-4 h-4" />
                      </button>
                    </div>
                    
                    <div className="flex justify-between items-center mt-3">
                      <button
                        type="button"
                        onClick={() => setIsExpanded(false)}
                        className="text-gray-400 hover:text-gray-300 text-sm transition-colors"
                      >
                        Dismiss
                      </button>
                      <p className="text-xs text-gray-500">Press Enter to send</p>
                    </div>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}