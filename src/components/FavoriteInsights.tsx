import React from 'react';
import { motion } from 'framer-motion';
import { Star, Calendar, Brain, Trash2 } from 'lucide-react';
import { useFavorites } from '../hooks/useFavorites';

export function FavoriteInsights() {
  const { favorites, loading, removeFromFavorites } = useFavorites();

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleRemove = async (interactionId: string) => {
    try {
      await removeFromFavorites(interactionId);
    } catch (error) {
      console.error('Error removing favorite:', error);
    }
  };

  if (loading) {
    return (
      <div className="bg-gradient-to-br from-gray-900/80 to-black/80 backdrop-blur-xl rounded-xl p-6 border border-white/10">
        <div className="flex items-center justify-center py-8">
          <div className="w-6 h-6 border-2 border-yellow-400/30 border-t-yellow-400 rounded-full animate-spin" />
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
        <div className="p-2 bg-gradient-to-r from-yellow-600 to-orange-600 rounded-lg">
          <Star className="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-white font-space-grotesk">Favorite Insights</h3>
          <p className="text-gray-400 text-sm">{favorites.length} curated strategic insights</p>
        </div>
      </div>

      {favorites.length === 0 ? (
        <div className="text-center py-8">
          <Star className="w-12 h-12 mx-auto mb-3 text-gray-500 opacity-50" />
          <p className="text-gray-400">No favorite insights yet</p>
          <p className="text-gray-500 text-sm">Star insights to build your curated knowledge base</p>
        </div>
      ) : (
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {favorites.map((favorite) => (
            <motion.div
              key={favorite.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-r from-yellow-600/10 to-orange-600/10 rounded-lg border border-yellow-500/20 p-4"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <h4 className="text-white font-medium text-sm mb-1">
                    {favorite.interaction.query_text}
                  </h4>
                  <div className="flex items-center gap-3 text-xs text-gray-400">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {formatDate(favorite.created_at)}
                    </div>
                    <span className="px-2 py-1 bg-yellow-600/20 text-yellow-300 rounded capitalize">
                      {favorite.interaction.query_type.replace('_', ' ')}
                    </span>
                  </div>
                </div>
                
                <button
                  onClick={() => handleRemove(favorite.interaction_id)}
                  className="p-2 text-gray-400 hover:text-red-400 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              {favorite.interaction.foresight_construct && (
                <div className="mt-3 pt-3 border-t border-yellow-500/20">
                  <h5 className="text-yellow-400 font-medium text-sm mb-1">Strategic Recommendation:</h5>
                  <p className="text-gray-300 text-sm">
                    {(favorite.interaction.foresight_construct as any).conciseActionableRecommendation}
                  </p>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
}