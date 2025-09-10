import { useCallback } from 'react';
import { supabase } from '@/lib/supabase';

export const useAnalytics = () => {
  const trackEvent = useCallback(async (eventType: string, sellerId?: string, metadata?: any) => {
    try {
      await supabase.functions.invoke('track-analytics-event', {
        body: {
          eventType,
          sellerId,
          metadata
        }
      });
    } catch (error) {
      console.error('Analytics tracking error:', error);
    }
  }, []);

  return { trackEvent };
};

export default useAnalytics;