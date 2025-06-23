/*
  # SYNAPTIC FORGE - Initial Database Schema

  1. New Tables
    - `user_profiles`
      - `id` (uuid, references auth.users)
      - `username` (text, unique)
      - `preferred_name` (text)
      - `ai_personality_stage` (numeric)
      - `learned_biases` (jsonb)
      - `cognitive_preferences` (jsonb)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `ai_interactions`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references user_profiles)
      - `query_text` (text)
      - `query_type` (text)
      - `strategic_vector` (jsonb)
      - `foresight_construct` (jsonb)
      - `ai_thought_stream` (text[])
      - `created_at` (timestamp)
    
    - `user_data_sources`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references user_profiles)
      - `name` (text)
      - `data_content` (text)
      - `data_type` (text)
      - `created_at` (timestamp)
    
    - `favorite_insights`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references user_profiles)
      - `interaction_id` (uuid, references ai_interactions)
      - `created_at` (timestamp)
    
    - `user_analytics`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references user_profiles)
      - `event_type` (text)
      - `event_data` (jsonb)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to access only their own data
*/

-- Create user_profiles table
CREATE TABLE IF NOT EXISTS user_profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username text UNIQUE NOT NULL,
  preferred_name text,
  ai_personality_stage numeric DEFAULT 1.0,
  learned_biases jsonb DEFAULT '{}',
  cognitive_preferences jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own profile"
  ON user_profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON user_profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON user_profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Create ai_interactions table
CREATE TABLE IF NOT EXISTS ai_interactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES user_profiles(id) ON DELETE CASCADE NOT NULL,
  query_text text NOT NULL,
  query_type text NOT NULL,
  strategic_vector jsonb,
  foresight_construct jsonb,
  ai_thought_stream text[],
  created_at timestamptz DEFAULT now()
);

ALTER TABLE ai_interactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own interactions"
  ON ai_interactions
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert own interactions"
  ON ai_interactions
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

-- Create user_data_sources table
CREATE TABLE IF NOT EXISTS user_data_sources (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES user_profiles(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  data_content text NOT NULL,
  data_type text DEFAULT 'text',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE user_data_sources ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own data sources"
  ON user_data_sources
  FOR ALL
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Create favorite_insights table
CREATE TABLE IF NOT EXISTS favorite_insights (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES user_profiles(id) ON DELETE CASCADE NOT NULL,
  interaction_id uuid REFERENCES ai_interactions(id) ON DELETE CASCADE NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, interaction_id)
);

ALTER TABLE favorite_insights ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own favorites"
  ON favorite_insights
  FOR ALL
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Create user_analytics table
CREATE TABLE IF NOT EXISTS user_analytics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES user_profiles(id) ON DELETE CASCADE,
  event_type text NOT NULL,
  event_data jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE user_analytics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can insert own analytics"
  ON user_analytics
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_ai_interactions_user_id ON ai_interactions(user_id);
CREATE INDEX IF NOT EXISTS idx_ai_interactions_created_at ON ai_interactions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_user_data_sources_user_id ON user_data_sources(user_id);
CREATE INDEX IF NOT EXISTS idx_favorite_insights_user_id ON favorite_insights(user_id);
CREATE INDEX IF NOT EXISTS idx_user_analytics_user_id ON user_analytics(user_id);
CREATE INDEX IF NOT EXISTS idx_user_analytics_event_type ON user_analytics(event_type);

-- Create updated_at trigger for user_profiles
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_user_profiles_updated_at
  BEFORE UPDATE ON user_profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();