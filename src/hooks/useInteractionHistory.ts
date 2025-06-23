import { useState, useEffect } from 'react';
import { supabase, AIInteraction } from '../lib/supabase';
import { useAuth } from './useAuth';

export function useInteractionHistory() {
  const { user } = useAuth();
  const [interactions, setInteractions] = useState<AIInteraction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchInteractions();
    } else {
      setInteractions([]);
      setLoading(false);
    }
  }, [user]);

  const fetchInteractions = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('ai_interactions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;
      setInteractions(data || []);
    } catch (error) {
      console.error('Error fetching interactions:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveInteraction = async (interaction: {
    query_text: string;
    query_type: string;
    strategic_vector?: any;
    foresight_construct?: any;
    ai_thought_stream: string[];
  }) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('ai_interactions')
        .insert({
          user_id: user.id,
          ...interaction,
        })
        .select()
        .single();

      if (error) throw error;
      
      // Add to local state
      setInteractions(prev => [data, ...prev]);
      return data;
    } catch (error) {
      console.error('Error saving interaction:', error);
      throw error;
    }
  };

  return {
    interactions,
    loading,
    saveInteraction,
    refetch: fetchInteractions,
  };
}