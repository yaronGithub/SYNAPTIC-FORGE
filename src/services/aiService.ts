import OpenAI from 'openai';
import { Event, Scenario, UserContext } from '../types';

// Initialize OpenAI client (will use environment variable or fallback to demo mode)
const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY || 'demo-key',
  dangerouslyAllowBrowser: true
});

// News API service for real-time data
class NewsService {
  private apiKey = import.meta.env.VITE_NEWS_API_KEY;
  private baseUrl = 'https://newsapi.org/v2';

  async fetchRecentNews(query?: string, country?: string): Promise<any[]> {
    if (!this.apiKey) {
      console.warn('News API key not found, using mock data');
      return this.getMockNews();
    }

    try {
      const params = new URLSearchParams({
        apiKey: this.apiKey,
        sortBy: 'publishedAt',
        pageSize: '20',
        language: 'en'
      });

      if (query) params.append('q', query);
      if (country) params.append('country', country);

      const response = await fetch(`${this.baseUrl}/top-headlines?${params}`);
      const data = await response.json();
      
      return data.articles || [];
    } catch (error) {
      console.error('Error fetching news:', error);
      return this.getMockNews();
    }
  }

  private getMockNews() {
    return [
      {
        title: "AI Regulation Framework Passes First Reading",
        description: "New comprehensive AI safety regulations advance through parliament",
        publishedAt: new Date().toISOString(),
        source: { name: "Tech Policy Today" }
      },
      {
        title: "Smart City Initiative Receives $50M Funding",
        description: "Major investment in urban technology infrastructure announced",
        publishedAt: new Date(Date.now() - 86400000).toISOString(),
        source: { name: "Urban Development News" }
      }
    ];
  }
}

class AIService {
  private newsService = new NewsService();

  async generateEventFromNews(article: any, userContext: UserContext): Promise<Event | null> {
    try {
      const prompt = `
        Convert this news article into a structured event for a timeline application.
        
        Article: "${article.title} - ${article.description}"
        User Context: Location: ${userContext.location}, Role: ${userContext.role}, Interests: ${userContext.interests.join(', ')}
        
        Generate a JSON response with:
        - title: Clear, concise event title
        - description: Brief description (max 150 chars)
        - tags: Array of relevant tags
        - locations: Array of relevant locations
        - relevantRoles: Array of professional roles this affects
        - impact: "low", "medium", or "high"
        - predictedImpactDate: Future date when effects might be felt (ISO string)
        
        Only respond with valid JSON, no other text.
      `;

      if (!import.meta.env.VITE_OPENAI_API_KEY) {
        // Fallback to rule-based generation when no API key
        return this.generateEventFallback(article, userContext);
      }

      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 300,
        temperature: 0.7
      });

      const content = response.choices[0]?.message?.content;
      if (!content) return null;

      const eventData = JSON.parse(content);
      
      return {
        id: `ai-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        date: article.publishedAt,
        scenarioId: `scenario-${Date.now()}`,
        ...eventData
      };
    } catch (error) {
      console.error('Error generating event from news:', error);
      return this.generateEventFallback(article, userContext);
    }
  }

  private generateEventFallback(article: any, userContext: UserContext): Event {
    const tags = this.extractTagsFromText(article.title + ' ' + article.description);
    const impact = this.determineImpact(article.title, tags);
    
    return {
      id: `fallback-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      title: article.title,
      date: article.publishedAt,
      predictedImpactDate: new Date(Date.now() + (30 + Math.random() * 180) * 24 * 60 * 60 * 1000).toISOString(),
      description: article.description?.substring(0, 150) || 'No description available',
      tags,
      locations: this.extractLocations(article.title + ' ' + article.description, userContext.location),
      relevantRoles: this.matchRelevantRoles(tags, userContext.role),
      scenarioId: `scenario-fallback-${Date.now()}`,
      impact
    };
  }

  async generateScenario(event: Event, userContext: UserContext): Promise<Scenario> {
    try {
      const prompt = `
        Generate a future scenario analysis for this event:
        
        Event: "${event.title} - ${event.description}"
        User Context: Location: ${userContext.location}, Role: ${userContext.role}, Interests: ${userContext.interests.join(', ')}
        
        Create a JSON response with:
        - title: Scenario title focusing on future implications
        - predictedOutcome: 2-3 sentence prediction of what will happen
        - keyImplications: Array of 3-4 specific implications for the user's context
        - confidence: Number between 60-95 representing prediction confidence
        
        Focus on practical, actionable implications. Only respond with valid JSON.
      `;

      if (!import.meta.env.VITE_OPENAI_API_KEY) {
        return this.generateScenarioFallback(event, userContext);
      }

      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 400,
        temperature: 0.8
      });

      const content = response.choices[0]?.message?.content;
      if (!content) return this.generateScenarioFallback(event, userContext);

      const scenarioData = JSON.parse(content);
      
      return {
        id: event.scenarioId || `scenario-${Date.now()}`,
        ...scenarioData
      };
    } catch (error) {
      console.error('Error generating scenario:', error);
      return this.generateScenarioFallback(event, userContext);
    }
  }

  private generateScenarioFallback(event: Event, userContext: UserContext): Scenario {
    const implications = [
      `Potential impact on ${userContext.role || 'professionals'} in the ${event.tags[0] || 'relevant'} sector`,
      `Changes expected in ${userContext.location || 'your area'} within 3-6 months`,
      `New opportunities may emerge in ${event.tags.slice(0, 2).join(' and ')} domains`,
      `Regulatory or policy adjustments likely to follow this development`
    ];

    return {
      id: event.scenarioId || `scenario-${Date.now()}`,
      title: `Future Impact: ${event.title}`,
      predictedOutcome: `This development is expected to create ripple effects across multiple sectors, particularly affecting ${userContext.role || 'professionals'} and communities in ${userContext.location || 'relevant regions'}.`,
      keyImplications: implications.slice(0, 3),
      confidence: 70 + Math.floor(Math.random() * 20)
    };
  }

  async fetchAndProcessNews(userContext: UserContext): Promise<{ events: Event[], scenarios: Scenario[] }> {
    const query = userContext.interests.length > 0 ? userContext.interests[0] : undefined;
    const country = this.getCountryCode(userContext.location);
    
    const articles = await this.newsService.fetchRecentNews(query, country);
    
    const events: Event[] = [];
    const scenarios: Scenario[] = [];
    
    for (const article of articles.slice(0, 10)) { // Limit to 10 articles
      const event = await this.generateEventFromNews(article, userContext);
      if (event) {
        events.push(event);
        const scenario = await this.generateScenario(event, userContext);
        scenarios.push(scenario);
      }
    }
    
    return { events, scenarios };
  }

  private extractTagsFromText(text: string): string[] {
    const keywords = [
      'technology', 'ai', 'artificial-intelligence', 'climate', 'environment',
      'politics', 'economy', 'finance', 'healthcare', 'education',
      'transportation', 'energy', 'innovation', 'regulation', 'policy'
    ];
    
    const lowerText = text.toLowerCase();
    return keywords.filter(keyword => 
      lowerText.includes(keyword.replace('-', ' ')) || lowerText.includes(keyword)
    );
  }

  private determineImpact(title: string, tags: string[]): 'low' | 'medium' | 'high' {
    const highImpactWords = ['breakthrough', 'major', 'significant', 'revolutionary', 'crisis'];
    const mediumImpactWords = ['new', 'announces', 'launches', 'introduces', 'changes'];
    
    const lowerTitle = title.toLowerCase();
    
    if (highImpactWords.some(word => lowerTitle.includes(word))) return 'high';
    if (mediumImpactWords.some(word => lowerTitle.includes(word))) return 'medium';
    return 'low';
  }

  private extractLocations(text: string, userLocation: string): string[] {
    const locations = ['Global'];
    if (userLocation) {
      locations.push(userLocation);
      // Add country if city is provided
      if (userLocation.includes(',')) {
        const country = userLocation.split(',').pop()?.trim();
        if (country) locations.push(country);
      }
    }
    return locations;
  }

  private matchRelevantRoles(tags: string[], userRole: string): string[] {
    const roles = ['General Public'];
    if (userRole) roles.push(userRole);
    
    // Add role suggestions based on tags
    if (tags.includes('technology') || tags.includes('ai')) {
      roles.push('Software Engineer', 'Data Scientist');
    }
    if (tags.includes('finance') || tags.includes('economy')) {
      roles.push('Financial Analyst', 'Business Owner');
    }
    
    return [...new Set(roles)]; // Remove duplicates
  }

  private getCountryCode(location: string): string | undefined {
    if (!location) return undefined;
    
    const countryMap: { [key: string]: string } = {
      'israel': 'il',
      'united states': 'us',
      'usa': 'us',
      'uk': 'gb',
      'united kingdom': 'gb'
    };
    
    const lowerLocation = location.toLowerCase();
    for (const [country, code] of Object.entries(countryMap)) {
      if (lowerLocation.includes(country)) {
        return code;
      }
    }
    
    return undefined;
  }
}

export const aiService = new AIService();