import { useCallback } from 'react';
import { supabase } from '@/lib/supabase';

export const useNotifications = () => {
  const triggerNotification = useCallback(async (
    sellerId: string, 
    eventType: string, 
    phoneNumber?: string
  ) => {
    try {
      if (!phoneNumber) {
        // Get seller's phone number from database
        const { data: seller } = await supabase
          .from('sellers')
          .select('phone')
          .eq('id', sellerId)
          .single();
        
        if (!seller?.phone) {
          console.warn('No phone number found for seller:', sellerId);
          return;
        }
        phoneNumber = seller.phone;
      }

      const { data, error } = await supabase.functions.invoke('send-whatsapp-notification', {
        body: {
          sellerId,
          eventType,
          phoneNumber
        }
      });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Notification error:', error);
    }
  }, []);

  const generateWhatsAppLink = useCallback((message: string, phoneNumber: string) => {
    const encodedMessage = encodeURIComponent(message);
    return `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
  }, []);

  return { triggerNotification, generateWhatsAppLink };
};

export default useNotifications;