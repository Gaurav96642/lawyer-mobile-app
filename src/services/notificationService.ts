
import { supabase } from '@/lib/supabase';

export const saveDeviceToken = async (userId: string, token: string, platform: 'ios' | 'android' | 'web') => {
  try {
    // In a deployed app, this would create/update a record in the device_tokens table
    console.log(`Saving device token ${token} for user ${userId} on platform ${platform}`);
    
    // For development, just log it, but in production you'd use:
    // const { data, error } = await supabase
    //   .from('device_tokens')
    //   .upsert({ 
    //     user_id: userId, 
    //     token, 
    //     platform,
    //     last_seen: new Date().toISOString()
    //   })
    //   .select()
    //   .single();
      
    return { data: { success: true }, error: null };
  } catch (error: any) {
    console.error('Error saving device token:', error.message);
    return { data: null, error };
  }
};

export const getNotifications = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
      
    if (error) throw error;
    return { data, error: null };
  } catch (error: any) {
    console.error('Error getting notifications:', error.message);
    return { data: null, error };
  }
};

export const markNotificationAsRead = async (notificationId: string) => {
  try {
    const { data, error } = await supabase
      .from('notifications')
      .update({ read: true })
      .eq('id', notificationId)
      .select()
      .single();
      
    if (error) throw error;
    return { data, error: null };
  } catch (error: any) {
    console.error('Error marking notification as read:', error.message);
    return { data: null, error };
  }
};

// This would call a Supabase Edge Function in production
export const sendPushNotification = async (userId: string, title: string, body: string, data: any = {}) => {
  try {
    // In a real implementation with deployed edge functions, you would use:
    // const { data: result, error } = await supabase.functions.invoke('send-push-notification', {
    //   body: { userId, title, body, data }
    // });
    
    // For development, just log it
    console.log(`[MOCK] Sending push notification to user ${userId}: ${title} - ${body}`);
    
    return { data: { success: true }, error: null };
  } catch (error: any) {
    console.error('Error sending push notification:', error.message);
    return { data: null, error };
  }
};
