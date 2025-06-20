export interface NewsEvent {
  id: string;
  title: string;
  description: string;
  url: string;
  publishedAt: string;
  eventSummary: string;
  keyEntities: string[];
  topicTags: string[];
  emotionalSentiment: 'joy' | 'fear' | 'anger' | 'sadness' | 'neutral' | 'excitement';
  geographicImpact: string[];
  impactLevel: 'low' | 'medium' | 'high';
}

export interface GlobalPulseData {
  dominantEmotionalFrequencies: string[];
  prevailingEnergeticState: 'turbulent' | 'harmonious' | 'static' | 'dynamic' | 'fragmented';
  numericalIntensity: number; // 0-10
  emotionalWeights: {
    fear: number;
    joy: number;
    anger: number;
    serenity: number;
    curiosity: number;
    anxiety: number;
    hope: number;
    grief: number;
    excitement: number;
    tension: number;
  };
  subconsciousArchetypes: string[];
  collectiveSymbols: string[];
}

export interface BlendedResonanceProfile {
  emotionalWeights: GlobalPulseData['emotionalWeights'];
  intensity: number;
  abstractThoughtFragment: string;
  targetBinauralFrequency: {
    type: 'Alpha' | 'Theta' | 'Beta' | 'Gamma' | 'Delta';
    range: string; // e.g., "8-13 Hz"
  };
  hapticRhythm: 'slow pulse' | 'rapid thrum' | 'gentle wave' | 'vibration' | 'sharp burst';
}

export interface UserContext {
  location: string;
  role: string;
  interests: string[];
}

export interface NexusState {
  mode: 'idle' | 'processing' | 'analyzing' | 'weaving' | 'conversing';
  emotionalState: 'calm' | 'excited' | 'contemplative' | 'concerned' | 'optimistic';
  intensity: number; // 0-1
  dominantSentiment: 'joy' | 'fear' | 'anger' | 'sadness' | 'neutral' | 'excitement';
}

export interface FutureNarrative {
  id: string;
  summary: string;
  crossroads: FutureCrossroad[];
  overallSentiment: 'positive' | 'negative' | 'neutral' | 'mixed';
  confidenceLevel: number;
}

export interface FutureCrossroad {
  id: string;
  title: string;
  description: string;
  futurePaths?: FuturePath[];
}

export interface FuturePath {
  id: string;
  name: string;
  description: string;
  actionDirectives: ActionDirective[];
  confidenceLevel: number;
  personalRelevance: 'low' | 'medium' | 'high';
}

export interface ActionDirective {
  id: string;
  action: string;
  timeframe: string;
  difficulty: 'easy' | 'moderate' | 'challenging';
}

export interface ConversationalMessage {
  id: string;
  type: 'question' | 'insight' | 'guidance' | 'reflection';
  content: string;
}

export interface PersonalEmotionalState {
  state: 'joyful' | 'calm' | 'focused' | 'curious' | 'pensive' | 'agitated' | 'empathetic' | 'neutral' | 'creative' | 'anxious' | 'energetic' | 'reflective';
  intensity: number; // 0-10
}