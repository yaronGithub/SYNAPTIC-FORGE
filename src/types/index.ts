export interface UserProfile {
  id: string;
  learnedBiases: {
    preferredAnalysisDepth: 'surface' | 'detailed' | 'comprehensive';
    industryFocus: string[];
    riskTolerance: 'conservative' | 'moderate' | 'aggressive';
    decisionStyle: 'analytical' | 'intuitive' | 'collaborative';
    informationDensity: 'concise' | 'balanced' | 'verbose';
  };
  validatedInsightsHistory: InsightValidation[];
  preferredAnalysisModes: string[];
  aiPersonalityEvolutionStage: number; // 1-10, evolves based on feedback
  cognitivePreferences: {
    preferredBrainwaveState: 'alpha' | 'beta' | 'gamma' | 'theta';
    voiceTone: 'authoritative' | 'exploratory' | 'urgent' | 'meditative' | 'skeptical';
    visualComplexity: 'minimal' | 'moderate' | 'complex';
  };
}

export interface InsightValidation {
  insightId: string;
  rating: number; // 1-5
  feedback: 'useful' | 'irrelevant' | 'inaccurate' | 'needs_detail';
  timestamp: string;
}

export interface OmniDataPoint {
  id: string;
  title: string;
  description: string;
  source: string;
  publishedAt: string;
  industryRelevance: number; // 0-1
  impactPotential: number; // 0-1
  noveltyScore: number; // 0-1
  geopoliticalContext: string[];
  enrichedTags: string[];
}

export interface EmergentStrategicVector {
  id: string;
  title: string;
  description: string;
  confidenceScore: number; // 0-1
  leadingIndicators: string[];
  impactTimeframe: 'immediate' | 'short_term' | 'medium_term' | 'long_term';
  relevanceToUser: number; // 0-1
}

export interface ForesightConstruct {
  id: string;
  strategicVector: EmergentStrategicVector;
  conciseActionableRecommendation: string;
  supportingProofPoints: string[];
  potentialChallenges: string[];
  sensoryDirectives: {
    synthesizedVoiceTone: 'authoritative' | 'exploratory' | 'urgent' | 'meditative' | 'skeptical';
    targetBrainwaveFrequency: {
      type: 'alpha' | 'beta' | 'gamma' | 'theta' | 'delta';
      range: string;
      purpose: string;
    };
    cognitiveStateDirective: string;
    dynamicVisualMetaphor: string;
    colorGradients: string[];
    motionIntensity: number; // 0-10
  };
  timestamp: string;
}

export interface CognitiveState {
  currentBrainwaveTarget: string;
  focusLevel: number; // 0-1
  creativityLevel: number; // 0-1
  clarityLevel: number; // 0-1
  isOptimized: boolean;
}

export interface QueryContext {
  type: 'strategic_analysis' | 'innovation_opportunities' | 'risk_assessment' | 'market_disruption';
  query: string;
  urgency: 'low' | 'medium' | 'high';
  scope: 'tactical' | 'strategic' | 'visionary';
  cognitiveStatePreference: string;
}