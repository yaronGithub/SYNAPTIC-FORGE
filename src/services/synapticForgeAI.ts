import OpenAI from 'openai';
import { UserProfile, OmniDataPoint, EmergentStrategicVector, ForesightConstruct, QueryContext } from '../types';

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY || 'demo-key',
  dangerouslyAllowBrowser: true
});

class SynapticForgeAIService {
  private hasApiKey = Boolean(import.meta.env.VITE_OPENAI_API_KEY && import.meta.env.VITE_OPENAI_API_KEY !== 'demo-key');

  async fetchOmniData(): Promise<OmniDataPoint[]> {
    const apiKey = import.meta.env.VITE_NEWS_API_KEY;
    if (!apiKey) {
      console.log('Using enhanced mock data - News API key not configured');
      return this.getEnhancedMockOmniData();
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
      return this.getEnhancedMockOmniData();
    }
  }

  async enrichDataPoint(rawData: any): Promise<OmniDataPoint> {
    if (!this.hasApiKey) {
      return this.generateEnhancedMockDataPoint(rawData);
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
        model: "gpt-3.5-turbo",
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
      return this.generateEnhancedMockDataPoint(rawData);
    }
  }

  async analyzeEmergentVectors(omniData: OmniDataPoint[], userProfile: UserProfile): Promise<EmergentStrategicVector[]> {
    if (!this.hasApiKey) {
      console.log('Using enhanced mock vectors - OpenAI API key not configured');
      return this.generateEnhancedMockVectors();
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

Identify 5-7 high-probability emergent strategic vectors. Each vector should represent a convergent pattern of change with strategic implications.

Return ONLY a JSON array of objects with:
- title: Strategic vector name (max 60 chars)
- description: What this vector represents (max 150 chars)
- confidenceScore: number 0-1 (probability this vector will materialize)
- leadingIndicators: array of 3-4 early warning signs
- impactTimeframe: "immediate", "short_term", "medium_term", or "long_term"
- relevanceToUser: number 0-1 (based on user's learned biases)

Return only valid JSON array.`;

      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 1000,
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
      console.warn('OpenAI API unavailable, using enhanced mock vectors:', error.message);
      return this.generateEnhancedMockVectors();
    }
  }

  async generateForesightConstruct(
    strategicVector: EmergentStrategicVector,
    queryContext: QueryContext,
    userProfile: UserProfile
  ): Promise<ForesightConstruct> {
    if (!this.hasApiKey) {
      console.log('Using enhanced mock foresight construct - OpenAI API key not configured');
      return this.generateEnhancedMockForesightConstruct(strategicVector, queryContext);
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
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 800,
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
      console.warn('OpenAI API unavailable, using enhanced mock foresight construct:', error.message);
      return this.generateEnhancedMockForesightConstruct(strategicVector, queryContext);
    }
  }

  async refineLearningProfile(
    userProfile: UserProfile,
    feedback: string,
    originalInsight: ForesightConstruct
  ): Promise<UserProfile> {
    if (!this.hasApiKey) {
      console.log('Using enhanced mock profile refinement - OpenAI API key not configured');
      return this.enhancedMockProfileRefinement(userProfile, feedback);
    }

    try {
      const prompt = `User rated insight as '${feedback}' for original insight: "${originalInsight.conciseActionableRecommendation}".

Current user AI profile: ${JSON.stringify(userProfile)}

Update the user's learned biases and refine AI personality evolution stage based on this feedback to improve future foresight accuracy and relevance.

Return ONLY the updated user profile as valid JSON with the same structure.`;

      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 600,
        temperature: 0.7
      });

      const content = response.choices[0]?.message?.content;
      if (!content) throw new Error('No response from AI');

      return JSON.parse(content);
    } catch (error) {
      console.warn('OpenAI API unavailable, using enhanced mock profile refinement:', error.message);
      return this.enhancedMockProfileRefinement(userProfile, feedback);
    }
  }

  private getEnhancedMockOmniData(): OmniDataPoint[] {
    return [
      {
        id: 'mock-1',
        title: 'Quantum Computing Breakthrough Achieves Commercial Viability',
        description: 'Major tech consortium announces first commercially viable quantum processor for enterprise applications',
        source: 'TechCrunch',
        publishedAt: new Date().toISOString(),
        industryRelevance: 0.95,
        impactPotential: 0.98,
        noveltyScore: 0.9,
        geopoliticalContext: ['Global', 'US', 'China', 'EU'],
        enrichedTags: ['quantum_computing', 'tech_breakthrough', 'market_disruption', 'enterprise_adoption']
      },
      {
        id: 'mock-2',
        title: 'AI Regulation Framework Passes Global Standards Committee',
        description: 'International AI governance standards approved by 50+ nations, setting new compliance requirements',
        source: 'Reuters',
        publishedAt: new Date(Date.now() - 3600000).toISOString(),
        industryRelevance: 0.88,
        impactPotential: 0.85,
        noveltyScore: 0.75,
        geopoliticalContext: ['Global', 'EU', 'US', 'Asia-Pacific'],
        enrichedTags: ['ai_regulation', 'policy_shift', 'compliance_requirements', 'global_governance']
      },
      {
        id: 'mock-3',
        title: 'Sustainable Energy Storage Revolution Accelerates',
        description: 'New battery technology promises 10x energy density, transforming renewable energy viability',
        source: 'Nature Energy',
        publishedAt: new Date(Date.now() - 7200000).toISOString(),
        industryRelevance: 0.92,
        impactPotential: 0.94,
        noveltyScore: 0.88,
        geopoliticalContext: ['Global', 'Nordic', 'California'],
        enrichedTags: ['energy_storage', 'sustainability', 'tech_breakthrough', 'climate_solution']
      },
      {
        id: 'mock-4',
        title: 'Autonomous Supply Chain Networks Emerge',
        description: 'AI-driven supply chains demonstrate self-optimization and predictive risk management',
        source: 'Supply Chain Quarterly',
        publishedAt: new Date(Date.now() - 10800000).toISOString(),
        industryRelevance: 0.85,
        impactPotential: 0.82,
        noveltyScore: 0.78,
        geopoliticalContext: ['Global', 'Asia', 'North America'],
        enrichedTags: ['supply_chain', 'automation', 'ai_optimization', 'risk_management']
      },
      {
        id: 'mock-5',
        title: 'Decentralized Finance Reaches Institutional Adoption Tipping Point',
        description: 'Major banks announce DeFi integration strategies, signaling mainstream financial transformation',
        source: 'Financial Times',
        publishedAt: new Date(Date.now() - 14400000).toISOString(),
        industryRelevance: 0.90,
        impactPotential: 0.87,
        noveltyScore: 0.72,
        geopoliticalContext: ['Global', 'Switzerland', 'Singapore', 'US'],
        enrichedTags: ['defi', 'financial_transformation', 'institutional_adoption', 'blockchain']
      }
    ];
  }

  private generateEnhancedMockDataPoint(rawData: any): OmniDataPoint {
    const mockEnrichments = [
      {
        industryRelevance: 0.85,
        impactPotential: 0.78,
        noveltyScore: 0.82,
        geopoliticalContext: ['Global', 'US', 'EU'],
        enrichedTags: ['tech_innovation', 'market_shift', 'strategic_opportunity']
      },
      {
        industryRelevance: 0.72,
        impactPotential: 0.88,
        noveltyScore: 0.65,
        geopoliticalContext: ['Asia-Pacific', 'Global'],
        enrichedTags: ['regulatory_change', 'compliance_shift', 'policy_impact']
      }
    ];

    const enrichment = mockEnrichments[Math.floor(Math.random() * mockEnrichments.length)];

    return {
      id: `mock-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      title: rawData.title,
      description: rawData.description || '',
      source: rawData.source?.name || 'Unknown',
      publishedAt: rawData.publishedAt,
      ...enrichment
    };
  }

  private generateEnhancedMockVectors(): EmergentStrategicVector[] {
    return [
      {
        id: 'vector-1',
        title: 'Quantum-AI Convergence Acceleration',
        description: 'Rapid convergence of quantum computing and AI creating unprecedented computational capabilities for strategic advantage',
        confidenceScore: 0.87,
        leadingIndicators: ['Quantum processor commercialization', 'AI model complexity scaling', 'Cross-industry quantum adoption', 'Venture capital quantum investments'],
        impactTimeframe: 'medium_term',
        relevanceToUser: 0.92
      },
      {
        id: 'vector-2',
        title: 'Regulatory Harmonization Wave',
        description: 'Global alignment on AI and tech governance creating new compliance landscapes and competitive dynamics',
        confidenceScore: 0.78,
        leadingIndicators: ['International standards adoption', 'Cross-border policy alignment', 'Industry self-regulation initiatives', 'Compliance technology emergence'],
        impactTimeframe: 'short_term',
        relevanceToUser: 0.85
      },
      {
        id: 'vector-3',
        title: 'Sustainable Technology Imperative',
        description: 'Climate-driven technology transformation becoming primary competitive differentiator across industries',
        confidenceScore: 0.91,
        leadingIndicators: ['Carbon pricing expansion', 'Green technology breakthroughs', 'ESG investment flows', 'Regulatory climate mandates'],
        impactTimeframe: 'immediate',
        relevanceToUser: 0.88
      },
      {
        id: 'vector-4',
        title: 'Autonomous Economic Networks',
        description: 'AI-driven autonomous systems creating self-optimizing economic networks and supply chains',
        confidenceScore: 0.82,
        leadingIndicators: ['Supply chain AI adoption', 'Autonomous logistics growth', 'Smart contract proliferation', 'Economic algorithm sophistication'],
        impactTimeframe: 'medium_term',
        relevanceToUser: 0.79
      },
      {
        id: 'vector-5',
        title: 'Decentralized Financial Infrastructure',
        description: 'Traditional finance integration with decentralized systems creating hybrid financial architectures',
        confidenceScore: 0.75,
        leadingIndicators: ['Bank DeFi partnerships', 'CBDC development', 'Institutional crypto adoption', 'Regulatory clarity emergence'],
        impactTimeframe: 'short_term',
        relevanceToUser: 0.83
      },
      {
        id: 'vector-6',
        title: 'Human-AI Collaborative Intelligence',
        description: 'Evolution of human-AI partnerships creating new forms of augmented decision-making and creativity',
        confidenceScore: 0.89,
        leadingIndicators: ['AI assistant sophistication', 'Human-AI interface innovation', 'Collaborative AI tools', 'Cognitive augmentation research'],
        impactTimeframe: 'immediate',
        relevanceToUser: 0.95
      }
    ];
  }

  private generateEnhancedMockForesightConstruct(
    strategicVector: EmergentStrategicVector,
    queryContext: QueryContext
  ): ForesightConstruct {
    const mockConstructs = {
      'strategic_analysis': {
        recommendation: 'Establish quantum-AI research partnerships and begin compliance framework development to position for the convergence wave while building competitive moats.',
        proofPoints: [
          'Quantum computing investments increased 400% in the last 18 months across major tech companies',
          'Early quantum-AI hybrid implementations showing 15x performance improvements in optimization problems',
          'Regulatory frameworks emerging in EU and US creating first-mover advantages for compliant organizations',
          'Venture capital flowing toward quantum-AI startups at unprecedented rates ($2.3B in Q4 2024)',
          'Major consulting firms building quantum-AI practice areas to serve enterprise demand'
        ],
        challenges: [
          'Technical complexity requires specialized talent acquisition and significant R&D investment',
          'Regulatory uncertainty may delay implementation timelines and increase compliance costs',
          'Market timing risk if quantum-AI convergence takes longer than anticipated'
        ]
      },
      'innovation_opportunities': {
        recommendation: 'Develop quantum-enhanced AI products targeting financial modeling and drug discovery markets where computational advantages translate directly to revenue.',
        proofPoints: [
          'Financial institutions reporting 25% improvement in risk modeling with quantum-classical hybrid systems',
          'Pharmaceutical companies achieving 60% reduction in drug discovery timelines using quantum-AI approaches',
          'Early quantum-AI patents showing strong licensing potential and defensive value',
          'Government contracts increasingly specifying quantum-AI capabilities for national security applications'
        ],
        challenges: [
          'High capital requirements for quantum infrastructure development',
          'Limited quantum talent pool creating recruitment and retention challenges'
        ]
      }
    };

    const construct = mockConstructs[queryContext.type] || mockConstructs['strategic_analysis'];

    return {
      id: `mock-construct-${Date.now()}`,
      strategicVector,
      conciseActionableRecommendation: construct.recommendation,
      supportingProofPoints: construct.proofPoints,
      potentialChallenges: construct.challenges,
      sensoryDirectives: {
        synthesizedVoiceTone: 'authoritative',
        targetBrainwaveFrequency: {
          type: 'beta',
          range: '18-25 Hz',
          purpose: 'Enhanced analytical focus and strategic decision clarity'
        },
        cognitiveStateDirective: 'Enhance Strategic Decision Clarity',
        dynamicVisualMetaphor: 'Interconnected Quantum Neural Web',
        colorGradients: ['#00FF88', '#0088FF', '#8800FF'],
        motionIntensity: 8
      },
      timestamp: new Date().toISOString()
    };
  }

  private enhancedMockProfileRefinement(userProfile: UserProfile, feedback: string): UserProfile {
    const updatedProfile = { ...userProfile };
    
    // Enhanced learning logic
    if (feedback === 'useful') {
      updatedProfile.aiPersonalityEvolutionStage = Math.min(10, updatedProfile.aiPersonalityEvolutionStage + 0.2);
      updatedProfile.learnedBiases.preferredAnalysisDepth = 'detailed';
    } else if (feedback === 'irrelevant') {
      updatedProfile.learnedBiases.industryFocus = [...updatedProfile.learnedBiases.industryFocus, 'emerging_tech'];
    } else if (feedback === 'needs_detail') {
      updatedProfile.learnedBiases.preferredAnalysisDepth = 'comprehensive';
      updatedProfile.learnedBiases.informationDensity = 'verbose';
    }
    
    return updatedProfile;
  }
}

export const synapticForgeAI = new SynapticForgeAIService();