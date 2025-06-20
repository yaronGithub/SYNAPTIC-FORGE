import { useState, useEffect, useCallback } from 'react';
import { Event, Scenario, UserContext } from '../types';
import { aiService } from '../services/aiService';
import { events as mockEvents, scenarios as mockScenarios } from '../data/mockData';

interface AIDataState {
  events: Event[];
  scenarios: Scenario[];
  isLoading: boolean;
  error: string | null;
  lastUpdate: Date | null;
}

export function useAIData(userContext: UserContext) {
  const [state, setState] = useState<AIDataState>({
    events: mockEvents,
    scenarios: mockScenarios,
    isLoading: false,
    error: null,
    lastUpdate: null
  });

  const hasApiKey = Boolean(import.meta.env.VITE_OPENAI_API_KEY);

  const fetchAIData = useCallback(async () => {
    if (!userContext.location && !userContext.role && userContext.interests.length === 0) {
      // No context set, use mock data
      setState(prev => ({ ...prev, events: mockEvents, scenarios: mockScenarios }));
      return;
    }

    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const { events: aiEvents, scenarios: aiScenarios } = await aiService.fetchAndProcessNews(userContext);
      
      // Combine AI-generated events with mock events for richer experience
      const combinedEvents = [...aiEvents, ...mockEvents];
      const combinedScenarios = [...aiScenarios, ...mockScenarios];

      setState(prev => ({
        ...prev,
        events: combinedEvents,
        scenarios: combinedScenarios,
        isLoading: false,
        lastUpdate: new Date()
      }));
    } catch (error) {
      console.error('Error fetching AI data:', error);
      setState(prev => ({
        ...prev,
        error: 'Failed to fetch AI-generated insights',
        isLoading: false,
        events: mockEvents,
        scenarios: mockScenarios
      }));
    }
  }, [userContext]);

  // Auto-refresh data when user context changes
  useEffect(() => {
    fetchAIData();
  }, [fetchAIData]);

  // Auto-refresh every 5 minutes if API key is available
  useEffect(() => {
    if (!hasApiKey) return;

    const interval = setInterval(() => {
      if (userContext.location || userContext.role || userContext.interests.length > 0) {
        fetchAIData();
      }
    }, 5 * 60 * 1000); // 5 minutes

    return () => clearInterval(interval);
  }, [fetchAIData, hasApiKey, userContext]);

  return {
    ...state,
    hasApiKey,
    refreshData: fetchAIData
  };
}