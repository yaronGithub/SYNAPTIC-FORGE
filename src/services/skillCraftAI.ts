import OpenAI from 'openai';
import { GlobalTrend, PersonalizedSkill, UserProfile, NewsArticle, TrendAnalysis, SkillRoadmap } from '../types';

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY || 'demo-key',
  dangerouslyAllowBrowser: true
});

class SkillCraftAIService {
  private hasApiKey = Boolean(import.meta.env.VITE_OPENAI_API_KEY);

  async fetchGlobalNews(): Promise<NewsArticle[]> {
    const apiKey = import.meta.env.VITE_NEWS_API_KEY;
    if (!apiKey) {
      return this.getMockNews();
    }

    try {
      const categories = ['business', 'technology', 'science', 'health'];
      const allArticles: NewsArticle[] = [];

      for (const category of categories) {
        const response = await fetch(
          `https://newsapi.org/v2/top-headlines?category=${category}&pageSize=15&apiKey=${apiKey}`
        );
        const data = await response.json();
        
        if (data.articles) {
          allArticles.push(...data.articles.map((article: any) => ({
            ...article,
            category
          })));
        }
      }

      return allArticles.slice(0, 50); // Limit to 50 articles
    } catch (error) {
      console.error('Error fetching news:', error);
      return this.getMockNews();
    }
  }

  async analyzeTrendFromArticle(article: NewsArticle): Promise<GlobalTrend | null> {
    if (!this.hasApiKey) {
      return this.generateMockTrend(article);
    }

    try {
      const prompt = `As an expert in future-of-work and global trends, analyze this article: "${article.title} - ${article.description}".

Identify the primary global trend(s) discussed (e.g., 'AI Automation', 'Green Economy Shift', 'Remote Work Culture'). Determine how this trend impacts future skill demands across various industries. 

Return ONLY a JSON object with:
- title: Clear trend name (max 60 chars)
- description: Brief trend description (max 150 chars)
- category: One of 'technology', 'economy', 'society', 'environment', 'policy'
- urgencyScore: Number 1-5 (5 = most urgent to adapt)
- impactedSkillDomains: Array of 3-5 skill domains (e.g., 'Data Science', 'Cybersecurity', 'Sustainable Engineering', 'Soft Skills')
- futureImpact: 2-sentence prediction of long-term effects

Return only valid JSON, no other text.`;

      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 400,
        temperature: 0.7
      });

      const content = response.choices[0]?.message?.content;
      if (!content) return null;

      const trendData = JSON.parse(content);
      
      return {
        id: `trend-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        sourceArticles: [article.url],
        publishedAt: article.publishedAt,
        ...trendData
      };
    } catch (error) {
      console.error('Error analyzing trend:', error);
      return this.generateMockTrend(article);
    }
  }

  async generatePersonalizedRoadmap(trends: GlobalTrend[], userProfile: UserProfile): Promise<SkillRoadmap> {
    if (!this.hasApiKey) {
      return this.generateMockRoadmap(trends, userProfile);
    }

    try {
      const trendsContext = trends.map(t => 
        `${t.title} (Urgency: ${t.urgencyScore}, Skills: ${t.impactedSkillDomains.join(', ')})`
      ).join('\n');

      const prompt = `Based on these global trends and skill impacts:
${trendsContext}

And given that the user is a ${userProfile.currentRole} interested in ${userProfile.interests.join(', ')} living in ${userProfile.location}, generate a highly personalized, actionable skill development roadmap.

Return ONLY a JSON object with:
- personalizedSkills: Array of 4-6 objects with:
  - name: Skill name (e.g., "Prompt Engineering for Business")
  - description: Why this skill matters (max 100 chars)
  - strategicValue: Number 1-10 (10 = highest strategic value)
  - timeToProficiency: String (e.g., "3-6 months", "1 year+")
  - currentGap: Number 1-10 (10 = biggest skill gap)
  - careerImpact: How this skill advances their career (max 80 chars)
  - learningDirectives: Array of 2-3 objects with:
    - action: Specific learning step
    - timeframe: When to complete
    - difficulty: "beginner", "intermediate", or "advanced"
    - cost: "free", "low", "medium", or "high"
    - priority: Number 1-10
- futureResilienceScore: Number 0-100 based on current vs future needs

Return only valid JSON.`;

      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 1000,
        temperature: 0.8
      });

      const content = response.choices[0]?.message?.content;
      if (!content) throw new Error('No response from AI');

      const roadmapData = JSON.parse(content);
      
      return {
        id: `roadmap-${Date.now()}`,
        userId: 'current-user',
        lastUpdated: new Date().toISOString(),
        nextReviewDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        personalizedSkills: roadmapData.personalizedSkills.map((skill: any, index: number) => ({
          id: `skill-${index}`,
          relatedTrends: trends.slice(0, 2).map(t => t.id),
          ...skill,
          learningDirectives: skill.learningDirectives.map((directive: any, dirIndex: number) => ({
            id: `directive-${index}-${dirIndex}`,
            ...directive
          }))
        })),
        futureResilienceScore: roadmapData.futureResilienceScore
      };
    } catch (error) {
      console.error('Error generating roadmap:', error);
      return this.generateMockRoadmap(trends, userProfile);
    }
  }

  async processGlobalTrends(userProfile: UserProfile): Promise<{ trends: GlobalTrend[], roadmap: SkillRoadmap }> {
    const articles = await this.fetchGlobalNews();
    const trends: GlobalTrend[] = [];

    // Process articles in batches to avoid rate limits
    for (const article of articles.slice(0, 20)) {
      const trend = await this.analyzeTrendFromArticle(article);
      if (trend) {
        trends.push(trend);
      }
      // Small delay to respect rate limits
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    // Generate personalized roadmap
    const roadmap = await this.generatePersonalizedRoadmap(trends, userProfile);

    return { trends, roadmap };
  }

  private getMockNews(): NewsArticle[] {
    return [
      {
        title: "AI Transforms Software Development with Autonomous Coding",
        description: "New AI systems can write, test, and deploy code independently, reshaping developer roles",
        url: "https://example.com/ai-coding",
        publishedAt: new Date().toISOString(),
        source: { name: "Tech Innovation Daily" },
        category: "technology"
      },
      {
        title: "Green Energy Jobs Surge as Climate Policies Accelerate",
        description: "Renewable energy sector creates millions of new positions requiring specialized skills",
        url: "https://example.com/green-jobs",
        publishedAt: new Date(Date.now() - 3600000).toISOString(),
        source: { name: "Sustainability Report" },
        category: "business"
      },
      {
        title: "Quantum Computing Breakthrough Promises Industry Revolution",
        description: "Major tech companies achieve quantum advantage in practical applications",
        url: "https://example.com/quantum",
        publishedAt: new Date(Date.now() - 7200000).toISOString(),
        source: { name: "Science Today" },
        category: "science"
      }
    ];
  }

  private generateMockTrend(article: NewsArticle): GlobalTrend {
    const mockTrends = [
      {
        title: "AI-Driven Automation Revolution",
        description: "Artificial intelligence reshaping traditional job roles across industries",
        category: "technology",
        urgencyScore: 5,
        impactedSkillDomains: ["AI/ML", "Data Science", "Process Automation", "Human-AI Collaboration"],
        futureImpact: "Organizations will require hybrid human-AI teams. Workers must develop AI literacy and collaboration skills."
      },
      {
        title: "Sustainable Technology Transition",
        description: "Green technology adoption accelerating across all sectors",
        category: "environment",
        urgencyScore: 4,
        impactedSkillDomains: ["Renewable Energy", "Sustainable Engineering", "ESG Reporting", "Green Finance"],
        futureImpact: "Every industry will need sustainability expertise. Green skills become essential for career advancement."
      }
    ];

    const trend = mockTrends[Math.floor(Math.random() * mockTrends.length)];
    
    return {
      id: `mock-trend-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      sourceArticles: [article.url],
      publishedAt: article.publishedAt,
      ...trend
    };
  }

  private generateMockRoadmap(trends: GlobalTrend[], userProfile: UserProfile): SkillRoadmap {
    const mockSkills: PersonalizedSkill[] = [
      {
        id: 'skill-1',
        name: 'AI Prompt Engineering',
        description: 'Master AI interaction for business applications and productivity enhancement',
        strategicValue: 9,
        timeToProficiency: '2-4 months',
        currentGap: 8,
        careerImpact: 'Become an AI productivity expert in your organization',
        relatedTrends: trends.slice(0, 1).map(t => t.id),
        learningDirectives: [
          {
            id: 'dir-1',
            action: 'Complete "Prompt Engineering for Professionals" course on Coursera',
            timeframe: 'Next 4 weeks',
            difficulty: 'beginner',
            cost: 'low',
            priority: 9
          },
          {
            id: 'dir-2',
            action: 'Build 3 AI-powered tools for your current role',
            timeframe: 'Next 8 weeks',
            difficulty: 'intermediate',
            cost: 'free',
            priority: 8
          }
        ]
      },
      {
        id: 'skill-2',
        name: 'Data Storytelling',
        description: 'Transform complex data into compelling narratives for decision-making',
        strategicValue: 8,
        timeToProficiency: '3-6 months',
        currentGap: 6,
        careerImpact: 'Lead data-driven initiatives and influence strategic decisions',
        relatedTrends: trends.slice(0, 1).map(t => t.id),
        learningDirectives: [
          {
            id: 'dir-3',
            action: 'Master Tableau or Power BI for advanced visualizations',
            timeframe: 'Next 6 weeks',
            difficulty: 'intermediate',
            cost: 'medium',
            priority: 7
          }
        ]
      }
    ];

    return {
      id: `mock-roadmap-${Date.now()}`,
      userId: 'current-user',
      personalizedSkills: mockSkills,
      futureResilienceScore: 72,
      lastUpdated: new Date().toISOString(),
      nextReviewDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
    };
  }
}

export const skillCraftAI = new SkillCraftAIService();