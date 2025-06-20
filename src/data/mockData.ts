import { Event, Scenario } from '../types';

export const events: Event[] = [
  {
    id: '1',
    title: 'New Smart City Initiative Launched',
    date: '2025-06-15',
    predictedImpactDate: '2026-03-01',
    description: 'Local government announces comprehensive smart city transformation plan',
    tags: ['technology', 'urban-planning', 'local-politics', 'infrastructure'],
    locations: ['Israel', 'Hod Hasharon', 'Tel Aviv'],
    relevantRoles: ['Software Engineer', 'Urban Planner', 'Local Business Owner'],
    scenarioId: 'scenario-1',
    impact: 'high'
  },
  {
    id: '2',
    title: 'AI Regulation Framework Proposed',
    date: '2025-06-10',
    predictedImpactDate: '2025-12-01',
    description: 'New comprehensive AI regulation framework introduced in parliament',
    tags: ['artificial-intelligence', 'regulation', 'tech-policy', 'legislation'],
    locations: ['Israel', 'Global'],
    relevantRoles: ['Software Engineer', 'Data Scientist', 'Product Manager'],
    scenarioId: 'scenario-2',
    impact: 'high'
  },
  {
    id: '3',
    title: 'Climate Action Tax Incentives',
    date: '2025-06-05',
    predictedImpactDate: '2026-01-01',
    description: 'Government introduces tax incentives for green technology adoption',
    tags: ['climate-change', 'tax-policy', 'green-tech', 'environment'],
    locations: ['Israel'],
    relevantRoles: ['Business Owner', 'Environmental Consultant', 'Finance Manager'],
    scenarioId: 'scenario-3',
    impact: 'medium'
  },
  {
    id: '4',
    title: 'Remote Work Policy Changes',
    date: '2025-06-01',
    predictedImpactDate: '2025-09-01',
    description: 'Major tech companies announce new hybrid work policies',
    tags: ['remote-work', 'tech-trends', 'workplace-culture', 'productivity'],
    locations: ['Global', 'Israel'],
    relevantRoles: ['Software Engineer', 'HR Manager', 'Team Lead'],
    scenarioId: 'scenario-4',
    impact: 'medium'
  },
  {
    id: '5',
    title: 'Cryptocurrency Exchange Regulation',
    date: '2025-05-28',
    predictedImpactDate: '2026-02-15',
    description: 'New regulations for cryptocurrency exchanges and trading platforms',
    tags: ['cryptocurrency', 'fintech', 'regulation', 'digital-finance'],
    locations: ['Israel', 'EU'],
    relevantRoles: ['Financial Analyst', 'Blockchain Developer', 'Compliance Officer'],
    scenarioId: 'scenario-5',
    impact: 'medium'
  },
  {
    id: '6',
    title: 'Education Technology Investment',
    date: '2025-05-20',
    predictedImpactDate: '2025-11-01',
    description: 'Major investment in AI-powered educational tools for schools',
    tags: ['education', 'artificial-intelligence', 'edtech', 'investment'],
    locations: ['Israel', 'Hod Hasharon'],
    relevantRoles: ['Teacher', 'Software Engineer', 'Education Administrator'],
    scenarioId: 'scenario-6',
    impact: 'high'
  }
];

export const scenarios: Scenario[] = [
  {
    id: 'scenario-1',
    title: 'Smart City Transformation Impact',
    predictedOutcome: 'Significant improvement in urban efficiency and quality of life through IoT integration and data-driven city services.',
    keyImplications: [
      'New job opportunities in smart city technology development',
      'Improved traffic management and reduced commute times',
      'Enhanced digital services for residents and businesses',
      'Potential privacy concerns with increased data collection'
    ],
    confidence: 85
  },
  {
    id: 'scenario-2',
    title: 'AI Regulation Impact on Tech Industry',
    predictedOutcome: 'Standardization of AI development practices with increased compliance requirements but clearer guidelines for innovation.',
    keyImplications: [
      'Need for AI compliance specialists in tech companies',
      'Potential slowdown in AI product releases during adaptation',
      'Increased trust in AI systems among consumers',
      'Competitive advantage for companies that adapt quickly'
    ],
    confidence: 78
  },
  {
    id: 'scenario-3',
    title: 'Green Technology Market Expansion',
    predictedOutcome: 'Accelerated adoption of renewable energy and sustainable technologies driven by financial incentives.',
    keyImplications: [
      'Growth in green tech startups and job market',
      'Reduced operational costs for businesses adopting green solutions',
      'Improved environmental indicators and air quality',
      'Potential increase in property values in eco-friendly areas'
    ],
    confidence: 82
  },
  {
    id: 'scenario-4',
    title: 'Evolution of Work Culture',
    predictedOutcome: 'Hybrid work becomes the standard, reshaping urban planning and real estate markets.',
    keyImplications: [
      'Reduced demand for traditional office spaces',
      'Increased investment in home office infrastructure',
      'Changes in work-life balance and productivity metrics',
      'New opportunities for co-working and flexible space providers'
    ],
    confidence: 90
  },
  {
    id: 'scenario-5',
    title: 'Cryptocurrency Market Stabilization',
    predictedOutcome: 'Regulated crypto market with increased institutional adoption and reduced volatility.',
    keyImplications: [
      'Greater mainstream acceptance of digital currencies',
      'New compliance requirements for crypto businesses',
      'Potential integration with traditional banking systems',
      'Increased consumer protection and market stability'
    ],
    confidence: 75
  },
  {
    id: 'scenario-6',
    title: 'AI-Enhanced Education System',
    predictedOutcome: 'Personalized learning experiences through AI tutoring systems and adaptive curricula.',
    keyImplications: [
      'Improved student outcomes through personalized learning',
      'Need for teacher training in AI-assisted education',
      'Potential digital divide concerns for underserved communities',
      'New career paths in educational technology'
    ],
    confidence: 88
  }
];