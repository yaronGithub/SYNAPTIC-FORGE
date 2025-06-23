import { useState, useEffect } from 'react';
import { supabase, UserProfile } from '../lib/supabase';
import { useAuth } from './useAuth';

export function useUserProfile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchOrCreateProfile();
    } else {
      setProfile(null);
      setLoading(false);
    }
  }, [user]);

  const fetchOrCreateProfile = async () => {
    if (!user) return;

    try {
      // First, try to fetch the existing profile
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) {
        // If error code is PGRST116, it means no rows were returned
        if (error.code === 'PGRST116') {
          // Create a new profile for the user
          await createDefaultProfile();
        } else {
          throw error;
        }
      } else {
        setProfile(data);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const createDefaultProfile = async () => {
    if (!user) return;

    try {
      // Create a default username from email or user ID
      const defaultUsername = user.email?.split('@')[0] || `user_${user.id.slice(0, 8)}`;
      
      const newProfile = {
        id: user.id,
        username: defaultUsername,
        preferred_name: null,
        ai_personality_stage: 1.0,
        learned_biases: {},
        cognitive_preferences: {},
      };

      const { data, error } = await supabase
        .from('user_profiles')
        .insert(newProfile)
        .select()
        .single();

      if (error) throw error;
      setProfile(data);
    } catch (error) {
      console.error('Error creating default profile:', error);
      throw error;
    }
  };

  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .update(updates)
        .eq('id', user.id)
        .select()
        .single();

      if (error) throw error;
      setProfile(data);
      return data;
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  };

  return {
    profile,
    loading,
    updateProfile,
    refetch: fetchOrCreateProfile,
  };
}