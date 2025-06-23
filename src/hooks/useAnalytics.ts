import { supabase } from '../lib/supabase';
import { useAuth } from './useAuth';

export function useAnalytics() {
  const { user } = useAuth();

  const trackEvent = async (eventType: string, eventData: Record<string, any> = {}) => {
    if (!user) return;

    try {
      await supabase
        .from('user_analytics')
        .insert({
          user_id: user.id,
          event_type: eventType,
          event_data: eventData,
        });
    } catch (error) {
      console.error('Error tracking event:', error);
    }
  };

  return { trackEvent };
}