import OpenAI from 'openai';
import { UserProfile, OmniDataPoint, EmergentStrategicVector, ForesightConstruct, QueryContext } from '../types';

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY || 'demo-key',
  dangerouslyAllowBrowser: true
});

class SynapticForgeAIService {
  private hasApiKey = Boolean(import.meta.env.VITE_OPENAI_API_KEY);

  async fetchOmniData(): Promise<OmniDataPoint[]> {
    const apiKey = import.meta.env.VITE_NEWS_API_KEY;
    if (!apiKey) {
      return this.getMockOmniData();
    }

    try {
      const categories = ['business', 'technology', 'science', 'health'];
      const allData: OmniDataPoint[] = [];

      for (const category of categories) {
        const response = await fetch(
          `https://newsapi.org/v2/top-headlines?category=${category}&pageSize=25&apiKey=${apiKey}`
        );
        const data = await response.json();
        
        if (data.articles) {
          const enrichedData = await Promise.all(
            data.articles.slice(0, 15).map(async (article: any) => {
              return await this.enrichDataPoint(article);
            })
          );
          allData.push(...enrichedData.filter(Boolean));
        }
      }

      return allData.slice(0, 50); // Maintain rolling window
    } catch (error) {
      console.error('Error fetching Omni-Data:', error);
      return this.getMockOmniData();
    }
  }

  async enrichDataPoint(rawData: any): Promise<OmniDataPoint> {
    if (!this.hasApiKey) {
      return this.generateMockDataPoint(rawData);
    }

    try {
      const prompt = `As SYNAPTIC FORGE's data enrichment module, analyze this raw data: "${rawData.title} - ${rawData.description}".

Extract and return ONLY a JSON object with:
- industryRelevance: number 0-1 (how relevant to business/strategic decisions)
- impactPotential: number 0-1 (potential for significant change/disruption)
- noveltyScore: number 0-1 (how new/unexpected this development is)
- geopoliticalContext: array of relevant regions/countries
- enrichedTags: array of 3-5 strategic tags (e.g., "market_disruption", "regulatory_shift", "tech_breakthrough")

Return only valid JSON.`;

      const response = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 300,
        temperature: 0.7
      });

      const content = response.choices[0]?.message?.content;
      if (!content) throw new Error('No response from AI');

      const enrichment = JSON.parse(content);
      
      return {
        id: `omni-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        title: rawData.title,
        description: rawData.description || '',
        source: rawData.source?.name || 'Unknown',
        publishedAt: rawData.publishedAt,
        ...enrichment
      };
    } catch (error) {
      console.error('Error enriching data point:', error);
      return this.generateMockDataPoint(rawData);
    }
  }

  async analyzeEmergentVectors(omniData: OmniDataPoint[], userProfile: UserProfile): Promise<EmergentStrategicVector[]> {
    if (!this.hasApiKey) {
      return this.generateMockVectors();
    }

    try {
      const filteredData = omniData
        .filter(d => d.industryRelevance > 0.3)
        .sort((a, b) => (b.impactPotential + b.noveltyScore) - (a.impactPotential + a.noveltyScore))
        .slice(0, 20);

      const dataContext = filteredData.map(d => 
        `${d.title} (Impact: ${d.impactPotential}, Novelty: ${d.noveltyScore}, Tags: ${d.enrichedTags.join(', ')})`
      ).join('\n');

      const prompt = `As SYNAPTIC FORGE, specifically attuned to user's domain expertise and learned biases: ${JSON.stringify(userProfile.learnedBiases)}, analyze this Omni-Data stream:

${dataContext}

Identify 3-5 high-probability emergent strategic vectors. Each vector should represent a convergent pattern of change with strategic implications.

Return ONLY a JSON array of objects with:
- title: Strategic vector name (max 60 chars)
- description: What this vector represents (max 150 chars)
- confidenceScore: number 0-1 (probability this vector will materialize)
- leadingIndicators: array of 3-4 early warning signs
- impactTimeframe: "immediate", "short_term", "medium_term", or "long_term"
- relevanceToUser: number 0-1 (based on user's learned biases)

Return only valid JSON array.`;

      const response = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 800,
        temperature: 0.8
      });

      const content = response.choices[0]?.message?.content;
      if (!content) throw new Error('No response from AI');

      const vectors = JSON.parse(content);
      
      return vectors.map((vector: any, index: number) => ({
        id: `vector-${Date.now()}-${index}`,
        ...vector
      }));
    } catch (error) {
      console.error('Error analyzing emergent vectors:', error);
      return this.generateMockVectors();
    }
  }

  async generateForesightConstruct(
    strategicVector: EmergentStrategicVector,
    queryContext: QueryContext,
    userProfile: UserProfile
  ): Promise<ForesightConstruct> {
    if (!this.hasApiKey) {
      return this.generateMockForesightConstruct(strategicVector, queryContext);
    }

    try {
      const prompt = `As SYNAPTIC FORGE, generate a Foresight Construct for the emergent strategic vector: "${strategicVector.title} - ${strategicVector.description}" 

User Query Context: ${queryContext.type} - "${queryContext.query}"
User AI Personality Evolution Stage: ${userProfile.aiPersonalityEvolutionStage}/10
User Cognitive Preferences: ${JSON.stringify(userProfile.cognitivePreferences)}

The insight must be prescriptive, actionable, and precisely calibrated to this user's evolved preferences.

Return ONLY a JSON object with:
- conciseActionableRecommendation: 1-2 sentences of direct strategic guidance
- supportingProofPoints: array of 3-5 evidence-based supporting points
- potentialChallenges: array of 2-3 anticipated obstacles or risks
- sensoryDirectives: object with:
  - synthesizedVoiceTone: one of "authoritative", "exploratory", "urgent", "meditative", "skeptical"
  - targetBrainwaveFrequency: object with type ("alpha", "beta", "gamma", "theta"), range (Hz string), purpose (cognitive goal)
  - cognitiveStateDirective: specific cognitive enhancement goal
  - dynamicVisualMetaphor: creative visual concept for the interface
  - colorGradients: array of 2-3 hex colors for the visual theme
  - motionIntensity: number 0-10 for visual dynamism

Return only valid JSON.`;

      const response = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 600,
        temperature: 0.9
      });

      const content = response.choices[0]?.message?.content;
      if (!content) throw new Error('No response from AI');

      const constructData = JSON.parse(content);
      
      return {
        id: `construct-${Date.now()}`,
        strategicVector,
        timestamp: new Date().toISOString(),
        ...constructData
      };
    } catch (error) {
      console.error('Error generating foresight construct:', error);
      return this.generateMockForesightConstruct(strategicVector, queryContext);
    }
  }

  async refineLearningProfile(
    userProfile: UserProfile,
    feedback: string,
    originalInsight: ForesightConstruct
  ): Promise<UserProfile> {
    if (!this.hasApiKey) {
      return this.mockProfileRefinement(userProfile, feedback);
    }

    try {
      const prompt = `User rated insight as '${feedback}' for original insight: "${originalInsight.conciseActionableRecommendation}".

Current user AI profile: ${JSON.stringify(userProfile)}

Update the user's learned biases and refine AI personality evolution stage based on this feedback to improve future foresight accuracy and relevance.

Return ONLY the updated user profile as valid JSON with the same structure.`;

      const response = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 500,
        temperature: 0.7
      });

      const content = response.choices[0]?.message?.content;
      if (!content) throw new Error('No response from AI');

      return JSON.parse(content);
    } catch (error) {
      console.error('Error refining learning profile:', error);
      return this.mockProfileRefinement(userProfile, feedback);
    }
  }

  private getMockOmniData(): OmniDataPoint[] {
    return [
      {
        id: 'mock-1',
        title: 'Quantum Computing Breakthrough Achieves Commercial Viability',
        description: 'Major tech consortium announces first commercially viable quantum processor',
        source: 'TechCrunch',
        publishedAt: new Date().toISOString(),
        industryRelevance: 0.9,
        impactPotential: 0.95,
        noveltyScore: 0.8,
        geopoliticalContext: ['Global', 'US', 'China'],
        enrichedTags: ['quantum_computing', 'tech_breakthrough', 'market_disruption']
      },
      {
        id: 'mock-2',
        title: 'AI Regulation Framework Passes Global Standards Committee',
        description: 'International AI governance standards approved by 50+ nations',
        source: 'Reuters',
        publishedAt: new Date(Date.now() - 3600000).toISOString(),
        industryRelevance: 0.85,
        impactPotential: 0.8,
        noveltyScore: 0.7,
        geopoliticalContext: ['Global', 'EU', 'US'],
        enrichedTags: ['ai_regulation', 'policy_shift', 'compliance_requirements']
      }
    ];
  }

  private generateMockDataPoint(rawData: any): OmniDataPoint {
    return {
      id: `mock-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      title: rawData.title,
      description: rawData.description || '',
      source: rawData.source?.name || 'Unknown',
      publishedAt: rawData.publishedAt,
      industryRelevance: Math.random() * 0.8 + 0.2,
      impactPotential: Math.random() * 0.9 + 0.1,
      noveltyScore: Math.random() * 0.7 + 0.3,
      geopoliticalContext: ['Global'],
      enrichedTags: ['strategic_shift', 'market_evolution', 'innovation']
    };
  }

  private generateMockVectors(): EmergentStrategicVector[] {
    return [
      {
        id: 'vector-1',
        title: 'Quantum-AI Convergence Acceleration',
        description: 'Rapid convergence of quantum computing and AI creating unprecedented computational capabilities',
        confidenceScore: 0.85,
        leadingIndicators: ['Quantum processor commercialization', 'AI model complexity scaling', 'Cross-industry adoption'],
        impactTimeframe: 'medium_term',
        relevanceToUser: 0.9
      },
      {
        id: 'vector-2',
        title: 'Regulatory Harmonization Wave',
        description: 'Global alignment on AI and tech governance creating new compliance landscapes',
        confidenceScore: 0.75,
        leadingIndicators: ['International standards adoption', 'Cross-border policy alignment', 'Industry self-regulation'],
        impactTimeframe: 'short_term',
        relevanceToUser: 0.8
      }
    ];
  }

  private generateMockForesightConstruct(
    strategicVector: EmergentStrategicVector,
    queryContext: QueryContext
  ): ForesightConstruct {
    return {
      id: `mock-construct-${Date.now()}`,
      strategicVector,
      conciseActionableRecommendation: 'Establish quantum-AI research partnerships and begin compliance framework development to position for the convergence wave.',
      supportingProofPoints: [
        'Quantum computing investments increased 300% in the last 18 months',
        'Major tech companies are forming quantum-AI hybrid teams',
        'Early adopters are seeing 10x performance improvements in specific use cases'
      ],
      potentialChallenges: [
        'Technical complexity requires specialized talent acquisition',
        'Regulatory uncertainty may delay implementation timelines'
      ],
      sensoryDirectives: {
        synthesizedVoiceTone: 'authoritative',
        targetBrainwaveFrequency: {
          type: 'beta',
          range: '18-25 Hz',
          purpose: 'Enhanced analytical focus and decision clarity'
        },
        cognitiveStateDirective: 'Enhance Strategic Decision Clarity',
        dynamicVisualMetaphor: 'Interconnected Quantum Neural Web',
        colorGradients: ['#00FF88', '#0088FF', '#8800FF'],
        motionIntensity: 7
      },
      timestamp: new Date().toISOString()
    };
  }

  private mockProfileRefinement(userProfile: UserProfile, feedback: string): UserProfile {
    const updatedProfile = { ...userProfile };
    
    // Simple mock refinement logic
    if (feedback === 'useful') {
      updatedProfile.aiPersonalityEvolutionStage = Math.min(10, updatedProfile.aiPersonalityEvolutionStage + 0.1);
    } else if (feedback === 'irrelevant') {
      updatedProfile.learnedBiases.preferredAnalysisDepth = 'detailed';
    }
    
    return updatedProfile;
  }
}

export const synapticForgeAI = new SynapticForgeAIService();