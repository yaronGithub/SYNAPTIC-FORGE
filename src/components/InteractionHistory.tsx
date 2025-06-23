import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { History, Star, StarOff, Calendar, Brain, ChevronDown, ChevronUp } from 'lucide-react';
import { useInteractionHistory } from '../hooks/useInteractionHistory';
import { useFavorites } from '../hooks/useFavorites';
import { AIInteraction } from '../lib/supabase';

export function InteractionHistory() {
  const { interactions, loading } = useInteractionHistory();
  const { addToFavorites, removeFromFavorites, isFavorite } = useFavorites();
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const handleToggleFavorite = async (interactionId: string) => {
    try {
      if (isFavorite(interactionId)) {
        await removeFromFavorites(interactionId);
      } else {
        await addToFavorites(interactionId);
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="bg-gradient-to-br from-gray-900/80 to-black/80 backdrop-blur-xl rounded-xl p-6 border border-white/10">
        <div className="flex items-center justify-center py-8">
          <div className="w-6 h-6 border-2 border-emerald-400/30 border-t-emerald-400 rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-gray-900/80 to-black/80 backdrop-blur-xl rounded-xl p-6 border border-white/10"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg">
          <History className="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-white font-space-grotesk">Interaction History</h3>
          <p className="text-gray-400 text-sm">{interactions.length} strategic insights generated</p>
        </div>
      </div>

      {interactions.length === 0 ? (
        <div className="text-center py-8">
          <Brain className="w-12 h-12 mx-auto mb-3 text-gray-500 opacity-50" />
          <p className="text-gray-400">No interactions yet</p>
          <p className="text-gray-500 text-sm">Start by asking the AI for strategic insights</p>
        </div>
      ) : (
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {interactions.map((interaction) => (
            <motion.div
              key={interaction.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/5 rounded-lg border border-white/10 overflow-hidden"
            >
              <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <h4 className="text-white font-medium text-sm mb-1">
                      {interaction.query_text}
                    </h4>
                    <div className="flex items-center gap-3 text-xs text-gray-400">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {formatDate(interaction.created_at)}
                      </div>
                      <span className="px-2 py-1 bg-blue-600/20 text-blue-300 rounded capitalize">
                        {interaction.query_type.replace('_', ' ')}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleToggleFavorite(interaction.id)}
                      className={`p-2 rounded-full transition-colors ${
                        isFavorite(interaction.id)
                          ? 'text-yellow-400 hover:text-yellow-300'
                          : 'text-gray-400 hover:text-yellow-400'
                      }`}
                    >
                      {isFavorite(interaction.id) ? (
                        <Star className="w-4 h-4 fill-current" />
                      ) : (
                        <StarOff className="w-4 h-4" />
                      )}
                    </button>
                    
                    <button
                      onClick={() => setExpandedId(expandedId === interaction.id ? null : interaction.id)}
                      className="p-2 text-gray-400 hover:text-white transition-colors"
                    >
                      {expandedId === interaction.id ? (
                        <ChevronUp className="w-4 h-4" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                <AnimatePresence>
                  {expandedId === interaction.id && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-3 pt-3 border-t border-white/10"
                    >
                      {interaction.foresight_construct && (
                        <div className="space-y-2">
                          <div>
                            <h5 className="text-emerald-400 font-medium text-sm mb-1">Strategic Recommendation:</h5>
                            <p className="text-gray-300 text-sm">
                              {(interaction.foresight_construct as any).conciseActionableRecommendation}
                            </p>
                          </div>
                          
                          {interaction.ai_thought_stream && interaction.ai_thought_stream.length > 0 && (
                            <div>
                              <h5 className="text-purple-400 font-medium text-sm mb-1">AI Thought Process:</h5>
                              <div className="space-y-1">
                                {interaction.ai_thought_stream.slice(-3).map((thought, index) => (
                                  <p key={index} className="text-gray-400 text-xs">
                                    {thought}
                                  </p>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
}