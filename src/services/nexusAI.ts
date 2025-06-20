import OpenAI from 'openai';
import { NewsEvent, UserContext, FutureNarrative, FutureCrossroad, ConversationalMessage, GlobalPulseData, BlendedResonanceProfile, PersonalEmotionalState } from '../types';

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY || 'demo-key',
  dangerouslyAllowBrowser: true
});

class NexusAIService {
  private hasApiKey = Boolean(import.meta.env.VITE_OPENAI_API_KEY);

  async fetchNews(): Promise<any[]> {
    const apiKey = import.meta.env.VITE_NEWS_API_KEY;
    if (!apiKey) {
      return this.getMockNews();
    }

    try {
      const categories = ['general', 'business', 'technology', 'science', 'health'];
      const allArticles: any[] = [];

      for (const category of categories) {
        const response = await fetch(`https://newsapi.org/v2/top-headlines?category=${category}&pageSize=20&apiKey=${apiKey}`);
        const data = await response.json();
        
        if (data.articles) {
          allArticles.push(...data.articles);
        }
      }

      return allArticles.slice(0, 100); // Maintain rolling window of 100 articles
    } catch (error) {
      console.error('Error fetching news:', error);
      return this.getMockNews();
    }
  }

  async analyzeGlobalPulse(articles: any[]): Promise<GlobalPulseData> {
    if (!this.hasApiKey) {
      return this.generateMockGlobalPulse();
    }

    try {
      const headlines = articles.map(a => `${a.title} - ${a.description}`).join('\n');
      
      const prompt = `As the PSYCHE-LINK AI, your role is to interpret the dominant_emotional_frequencies (e.g., 'Anxiety', 'Excitement', 'Grief', 'Hope', 'Tension', 'Serenity', 'Innovation') and prevailing_energetic_state (e.g., 'Turbulent', 'Harmonious', 'Static', 'Dynamic', 'Fragmented') of the global consciousness based on these recent headlines:

${headlines}

Do NOT summarize facts. Assign a numerical_intensity (0-10, 0 being neutral, 10 being overwhelming) and output detailed emotional_weights for core emotions. Also, identify 3-5 subconscious_archetypes or collective_symbols (e.g., 'The Storm', 'The Seed', 'The Divide').

Return ONLY a JSON object with:
- dominantEmotionalFrequencies: array of 3-5 emotional frequencies
- prevailingEnergeticState: one of 'turbulent', 'harmonious', 'static', 'dynamic', 'fragmented'
- numericalIntensity: number 0-10
- emotionalWeights: object with fear, joy, anger, serenity, curiosity, anxiety, hope, grief, excitement, tension (all 0-1)
- subconsciousArchetypes: array of 3-5 archetypal symbols
- collectiveSymbols: array of 3-5 collective symbols

Return only valid JSON.`;

      const response = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 600,
        temperature: 0.8
      });

      const content = response.choices[0]?.message?.content;
      if (!content) throw new Error('No response from AI');

      return JSON.parse(content);
    } catch (error) {
      console.error('Error analyzing global pulse:', error);
      return this.generateMockGlobalPulse();
    }
  }

  async blendPersonalResonance(globalPulse: GlobalPulseData, personalState: PersonalEmotionalState): Promise<BlendedResonanceProfile> {
    if (!this.hasApiKey) {
      return this.generateMockBlendedResonance(globalPulse, personalState);
    }

    try {
      const prompt = `Given the global_pulse_data: ${JSON.stringify(globalPulse)}, and the user's Personal Emotional State: '${personalState.state}' with intensity: ${personalState.intensity}, how do these resonate? 

Synthesize a blended_resonance_profile by modifying the global emotional weights and intensity to reflect this interaction. Generate a concise, 10-15 word abstract_thought_fragment that embodies this blended consciousness. 

Crucially, suggest a target_binaural_frequency (provide specific Hz range like '8-13 Hz' for Alpha) and its amplitude_modulation, and a haptic_rhythm based on the blended state.

Return ONLY a JSON object with:
- emotionalWeights: updated emotional weights object
- intensity: blended intensity 0-10
- abstractThoughtFragment: 10-15 word poetic fragment
- targetBinauralFrequency: object with type ('Alpha', 'Theta', 'Beta', 'Gamma', 'Delta') and range (Hz string)
- hapticRhythm: one of 'slow pulse', 'rapid thrum', 'gentle wave', 'vibration', 'sharp burst'

Return only valid JSON.`;

      const response = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 400,
        temperature: 0.9
      });

      const content = response.choices[0]?.message?.content;
      if (!content) throw new Error('No response from AI');

      return JSON.parse(content);
    } catch (error) {
      console.error('Error blending resonance:', error);
      return this.generateMockBlendedResonance(globalPulse, personalState);
    }
  }

  async analyzeNewsEvent(article: any): Promise<NewsEvent> {
    if (!this.hasApiKey) {
      return this.generateMockEvent(article);
    }

    try {
      const prompt = `As a symbiotic AI analyzing global events for consciousness weaving, process this news: "${article.title} - ${article.description}".

Extract and return ONLY a JSON object with:
- eventSummary: 2-3 sentence summary
- keyEntities: array of 3-5 key entities/people/organizations
- topicTags: array of 3-5 topic tags
- emotionalSentiment: one of 'joy', 'fear', 'anger', 'sadness', 'neutral', 'excitement'
- geographicImpact: array of affected regions
- impactLevel: 'low', 'medium', or 'high'

Return only valid JSON, no other text.`;

      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 300,
        temperature: 0.7
      });

      const content = response.choices[0]?.message?.content;
      if (!content) throw new Error('No response from AI');

      const analysis = JSON.parse(content);
      
      return {
        id: `event-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        title: article.title,
        description: article.description || '',
        url: article.url || '',
        publishedAt: article.publishedAt,
        ...analysis
      };
    } catch (error) {
      console.error('Error analyzing news event:', error);
      return this.generateMockEvent(article);
    }
  }

  private getMockNews() {
    return [
      {
        title: "Global Climate Summit Reaches Breakthrough Agreement",
        description: "World leaders unite on unprecedented environmental action plan",
        publishedAt: new Date().toISOString(),
        url: "https://example.com/climate"
      },
      {
        title: "AI Revolution Transforms Healthcare Diagnostics",
        description: "Machine learning algorithms achieve 99% accuracy in early disease detection",
        publishedAt: new Date(Date.now() - 3600000).toISOString(),
        url: "https://example.com/ai-health"
      },
      {
        title: "Economic Markets Show Signs of Recovery",
        description: "Global indices rise as investor confidence returns",
        publishedAt: new Date(Date.now() - 7200000).toISOString(),
        url: "https://example.com/economy"
      }
    ];
  }

  private generateMockGlobalPulse(): GlobalPulseData {
    return {
      dominantEmotionalFrequencies: ['Hope', 'Anxiety', 'Innovation', 'Uncertainty'],
      prevailingEnergeticState: 'dynamic',
      numericalIntensity: 6.5,
      emotionalWeights: {
        fear: 0.4,
        joy: 0.3,
        anger: 0.2,
        serenity: 0.1,
        curiosity: 0.6,
        anxiety: 0.5,
        hope: 0.7,
        grief: 0.1,
        excitement: 0.4,
        tension: 0.3
      },
      subconsciousArchetypes: ['The Phoenix', 'The Bridge', 'The Awakening'],
      collectiveSymbols: ['Rising Sun', 'Flowing River', 'Growing Seed']
    };
  }

  private generateMockBlendedResonance(globalPulse: GlobalPulseData, personalState: PersonalEmotionalState): BlendedResonanceProfile {
    const blendedWeights = { ...globalPulse.emotionalWeights };
    
    // Blend personal state with global pulse
    switch (personalState.state) {
      case 'calm':
        blendedWeights.serenity += personalState.intensity * 0.1;
        blendedWeights.anxiety -= personalState.intensity * 0.05;
        break;
      case 'focused':
        blendedWeights.curiosity += personalState.intensity * 0.1;
        break;
      case 'joyful':
        blendedWeights.joy += personalState.intensity * 0.1;
        break;
    }

    return {
      emotionalWeights: blendedWeights,
      intensity: (globalPulse.numericalIntensity + personalState.intensity) / 2,
      abstractThoughtFragment: "Consciousness flows like rivers merging into infinite ocean of shared being",
      targetBinauralFrequency: {
        type: 'Alpha',
        range: '8-13 Hz'
      },
      hapticRhythm: 'gentle wave'
    };
  }

  private generateMockEvent(article: any): NewsEvent {
    const sentiments: NewsEvent['emotionalSentiment'][] = ['joy', 'fear', 'anger', 'sadness', 'neutral', 'excitement'];
    const impacts: NewsEvent['impactLevel'][] = ['low', 'medium', 'high'];
    
    return {
      id: `mock-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      title: article.title,
      description: article.description || '',
      url: article.url || '',
      publishedAt: article.publishedAt,
      eventSummary: `${article.title} represents a significant development in the collective consciousness stream.`,
      keyEntities: ['Global Community', 'Innovation', 'Change'],
      topicTags: ['consciousness', 'transformation', 'collective'],
      emotionalSentiment: sentiments[Math.floor(Math.random() * sentiments.length)],
      geographicImpact: ['Global', 'Collective Unconscious'],
      impactLevel: impacts[Math.floor(Math.random() * impacts.length)]
    };
  }
}

export const nexusAI = new NexusAIService();