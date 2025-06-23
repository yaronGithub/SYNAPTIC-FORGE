import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please check your .env file.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types
export interface UserProfile {
  id: string;
  username: string;
  preferred_name?: string;
  ai_personality_stage: number;
  learned_biases: Record<string, any>;
  cognitive_preferences: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface AIInteraction {
  id: string;
  user_id: string;
  query_text: string;
  query_type: string;
  strategic_vector?: Record<string, any>;
  foresight_construct?: Record<string, any>;
  ai_thought_stream: string[];
  created_at: string;
}

export interface UserDataSource {
  id: string;
  user_id: string;
  name: string;
  data_content: string;
  data_type: string;
  created_at: string;
}

export interface FavoriteInsight {
  id: string;
  user_id: string;
  interaction_id: string;
  created_at: string;
}

export interface UserAnalytics {
  id: string;
  user_id: string;
  event_type: string;
  event_data: Record<string, any>;
  created_at: string;
}