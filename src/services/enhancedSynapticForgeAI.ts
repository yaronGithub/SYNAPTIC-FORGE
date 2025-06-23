import OpenAI from 'openai';
import { UserProfile, OmniDataPoint, EmergentStrategicVector, ForesightConstruct, QueryContext } from '../types';
import { UserDataSource } from '../lib/supabase';

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY || 'demo-key',
  dangerouslyAllowBrowser: true
});

class EnhancedSynapticForgeAIService {
  private hasApiKey = Boolean(import.meta.env.VITE_OPENAI_API_KEY && import.meta.env.VITE_OPENAI_API_KEY !== 'demo-key');

  async generateForesightConstructWithUserData(
    strategicVector: EmergentStrategicVector,
    queryContext: QueryContext,
    userProfile: any,
    userDataSources: UserDataSource[] = [],
    aiThoughtStream: string[] = []
  ): Promise<{ construct: ForesightConstruct; thoughtStream: string[] }> {
    const thoughtStream = [...aiThoughtStream];
    
    // Check if user mentioned custom data
    const mentionsCustomData = queryContext.query.toLowerCase().includes('my data') || 
                              queryContext.query.toLowerCase().includes('custom data') ||
                              queryContext.query.toLowerCase().includes('uploaded data');

    let customDataContext = '';
    if (mentionsCustomData && userDataSources.length > 0) {
      thoughtStream.push('🔍 Detecting reference to user\'s custom data sources...');
      thoughtStream.push(`📊 Found ${userDataSources.length} custom data source(s) - integrating into analysis`);
      
      customDataContext = `\n\nUser's Custom Data Sources:\n${userDataSources.map(ds => 
        `${ds.name}: ${ds.data_content.substring(0, 500)}...`
      ).join('\n\n')}`;
      
      thoughtStream.push('🧠 Synthesizing global trends with user\'s proprietary data...');
    }

    if (!this.hasApiKey) {
      thoughtStream.push('⚡ Generating enhanced mock foresight construct with user context...');
      return {
        construct: this.generateEnhancedMockForesightConstruct(strategicVector, queryContext, mentionsCustomData),
        thoughtStream
      };
    }

    try {
      thoughtStream.push('🤖 Initiating advanced AI reasoning with personalized context...');
      
      const prompt = `As SYNAPTIC FORGE, generate a Foresight Construct for the emergent strategic vector: "${strategicVector.title} - ${strategicVector.description}" 

User Query Context: ${queryContext.type} - "${queryContext.query}"
User AI Personality Evolution Stage: ${userProfile.ai_personality_stage}/10
User Cognitive Preferences: ${JSON.stringify(userProfile.cognitive_preferences)}
${customDataContext}

${mentionsCustomData ? 'CRITICAL: The user has referenced their custom data. You MUST incorporate insights from their uploaded data sources into your analysis and explicitly mention how their data influences the strategic recommendations.' : ''}

The insight must be prescriptive, actionable, and precisely calibrated to this user's evolved preferences and data.

Return ONLY a JSON object with:
- conciseActionableRecommendation: 1-2 sentences of direct strategic guidance ${mentionsCustomData ? '(must reference user\'s custom data)' : ''}
- supportingProofPoints: array of 3-5 evidence-based supporting points ${mentionsCustomData ? '(include insights from user data)' : ''}
- potentialChallenges: array of 2-3 anticipated obstacles or risks
- sensoryDirectives: object with:
  - synthesizedVoiceTone: one of "authoritative", "exploratory", "urgent", "meditative", "skeptical"
  - targetBrainwaveFrequency: object with type ("alpha", "beta", "gamma", "theta"), range (Hz string), purpose (cognitive goal)
  - cognitiveStateDirective: specific cognitive enhancement goal
  - dynamicVisualMetaphor: creative visual concept for the interface
  - colorGradients: array of 2-3 hex colors for the visual theme
  - motionIntensity: number 0-10 for visual dynamism

Return only valid JSON.`;

      thoughtStream.push('🔮 Processing multi-dimensional strategic analysis...');
      
      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 800,
        temperature: 0.9
      });

      const content = response.choices[0]?.message?.content;
      if (!content) throw new Error('No response from AI');

      thoughtStream.push('✨ Foresight construct successfully generated with personalized insights');
      
      const constructData = JSON.parse(content);
      
      return {
        construct: {
          id: `construct-${Date.now()}`,
          strategicVector,
          timestamp: new Date().toISOString(),
          ...constructData
        },
        thoughtStream
      };
    } catch (error) {
      console.warn('OpenAI API unavailable, using enhanced mock foresight construct:', error.message);
      thoughtStream.push('⚠️ Switching to offline mode - generating enhanced strategic analysis...');
      
      return {
        construct: this.generateEnhancedMockForesightConstruct(strategicVector, queryContext, mentionsCustomData),
        thoughtStream
      };
    }
  }

  private generateEnhancedMockForesightConstruct(
    strategicVector: EmergentStrategicVector,
    queryContext: QueryContext,
    includesCustomData: boolean = false
  ): ForesightConstruct {
    const mockConstructs = {
      'strategic_analysis': {
        recommendation: includesCustomData 
          ? 'Based on your uploaded data patterns and global quantum-AI trends, establish strategic partnerships in quantum computing while leveraging your existing data insights for competitive advantage.'
          : 'Establish quantum-AI research partnerships and begin compliance framework development to position for the convergence wave while building competitive moats.',
        proofPoints: includesCustomData 
          ? [
              'Your custom data shows 40% growth potential in quantum-adjacent markets',
              'Global quantum computing investments increased 400% in the last 18 months',
              'Your data patterns align with early quantum-AI adoption indicators',
              'Regulatory frameworks emerging in EU and US creating first-mover advantages',
              'Your uploaded metrics suggest optimal timing for quantum technology integration'
            ]
          : [
              'Quantum computing investments increased 400% in the last 18 months across major tech companies',
              'Early quantum-AI hybrid implementations showing 15x performance improvements',
              'Regulatory frameworks emerging creating first-mover advantages',
              'Venture capital flowing toward quantum-AI startups at unprecedented rates',
              'Major consulting firms building quantum-AI practice areas'
            ],
        challenges: [
          'Technical complexity requires specialized talent acquisition and significant R&D investment',
          'Regulatory uncertainty may delay implementation timelines and increase compliance costs',
          includesCustomData ? 'Your data suggests potential integration challenges with existing systems' : 'Market timing risk if quantum-AI convergence takes longer than anticipated'
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
        dynamicVisualMetaphor: includesCustomData ? 'Personalized Data Constellation Network' : 'Interconnected Quantum Neural Web',
        colorGradients: includesCustomData ? ['#00FF88', '#FF8800', '#8800FF'] : ['#00FF88', '#0088FF', '#8800FF'],
        motionIntensity: includesCustomData ? 9 : 8
      },
      timestamp: new Date().toISOString()
    };
  }
}

export const enhancedSynapticForgeAI = new EnhancedSynapticForgeAIService();