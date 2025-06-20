import { Event, UserContext, RelevanceScore } from '../types';

export function calculateRelevance(event: Event, userContext: UserContext): RelevanceScore {
  const matches: string[] = [];
  let score = 0;

  // Check location matches
  if (userContext.location) {
    const locationWords = userContext.location.toLowerCase().split(' ');
    const eventLocations = event.locations.map(loc => loc.toLowerCase());
    
    locationWords.forEach(word => {
      if (eventLocations.some(loc => loc.includes(word))) {
        matches.push(`Location: ${word}`);
        score += 3;
      }
    });
  }

  // Check role matches
  if (userContext.role) {
    const roleWords = userContext.role.toLowerCase().split(' ');
    const eventRoles = event.relevantRoles.map(role => role.toLowerCase());
    
    roleWords.forEach(word => {
      if (eventRoles.some(role => role.includes(word))) {
        matches.push(`Role: ${word}`);
        score += 2;
      }
    });
  }

  // Check interest matches
  userContext.interests.forEach(interest => {
    const interestWords = interest.toLowerCase().split(' ');
    const eventTags = event.tags.map(tag => tag.toLowerCase().replace('-', ' '));
    
    interestWords.forEach(word => {
      if (eventTags.some(tag => tag.includes(word) || word.includes(tag))) {
        matches.push(`Interest: ${interest}`);
        score += 1;
      }
    });
  });

  // Determine relevance level
  let level: 'low' | 'moderate' | 'high';
  if (score >= 5) {
    level = 'high';
  } else if (score >= 2) {
    level = 'moderate';
  } else {
    level = 'low';
  }

  return { score, level, matches };
}

export function filterEventsByRelevance(events: Event[], userContext: UserContext, minLevel: 'low' | 'moderate' | 'high' = 'low'): Event[] {
  const levelValues = { low: 0, moderate: 2, high: 5 };
  const minScore = levelValues[minLevel];

  return events.filter(event => {
    const relevance = calculateRelevance(event, userContext);
    return relevance.score >= minScore;
  });
}