import { useState, useEffect } from 'react';
import { supabase, FavoriteInsight, AIInteraction } from '../lib/supabase';
import { useAuth } from './useAuth';

export function useFavorites() {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState<(FavoriteInsight & { interaction: AIInteraction })[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchFavorites();
    } else {
      setFavorites([]);
      setLoading(false);
    }
  }, [user]);

  const fetchFavorites = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('favorite_insights')
        .select(`
          *,
          interaction:ai_interactions(*)
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setFavorites(data || []);
    } catch (error) {
      console.error('Error fetching favorites:', error);
    } finally {
      setLoading(false);
    }
  };

  const addToFavorites = async (interactionId: string) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('favorite_insights')
        .insert({
          user_id: user.id,
          interaction_id: interactionId,
        })
        .select(`
          *,
          interaction:ai_interactions(*)
        `)
        .single();

      if (error) throw error;
      
      setFavorites(prev => [data, ...prev]);
      return data;
    } catch (error) {
      console.error('Error adding to favorites:', error);
      throw error;
    }
  };

  const removeFromFavorites = async (interactionId: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('favorite_insights')
        .delete()
        .eq('user_id', user.id)
        .eq('interaction_id', interactionId);

      if (error) throw error;
      
      setFavorites(prev => prev.filter(fav => fav.interaction_id !== interactionId));
    } catch (error) {
      console.error('Error removing from favorites:', error);
      throw error;
    }
  };

  const isFavorite = (interactionId: string) => {
    return favorites.some(fav => fav.interaction_id === interactionId);
  };

  return {
    favorites,
    loading,
    addToFavorites,
    removeFromFavorites,
    isFavorite,
    refetch: fetchFavorites,
  };
}