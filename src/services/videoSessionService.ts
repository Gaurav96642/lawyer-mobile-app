
import { supabase, VideoSessionType } from '@/lib/supabase';
import { Database } from '@/types/supabase';

export const createVideoSession = async (appointmentId: string) => {
  try {
    // First, use the database function to create a placeholder session
    const { data: sessionData, error: sessionError } = await supabase.rpc('create_video_session', {
      p_appointment_id: appointmentId
    });
    
    if (sessionError) throw sessionError;
    
    // Then call the Edge Function to create the actual Zoom meeting
    const { data: zoomData, error: zoomError } = await supabase.functions.invoke('create-zoom-meeting', {
      body: { appointmentId }
    });
    
    if (zoomError) throw zoomError;
    
    return { data: zoomData, error: null };
  } catch (error: any) {
    console.error('Error creating video session:', error.message);
    return { data: null, error };
  }
};

export const getVideoSession = async (appointmentId: string) => {
  try {
    const { data, error } = await supabase
      .from('video_sessions')
      .select('*')
      .eq('appointment_id', appointmentId)
      .single();
      
    if (error) throw error;
    return { data: data as VideoSessionType, error: null };
  } catch (error: any) {
    console.error('Error getting video session:', error.message);
    return { data: null, error };
  }
};

export const updateVideoSessionStatus = async (id: string, status: 'created' | 'started' | 'ended' | 'failed') => {
  try {
    const { data, error } = await supabase
      .from('video_sessions')
      .update({ 
        status,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();
      
    if (error) throw error;
    return { data: data as VideoSessionType, error: null };
  } catch (error: any) {
    console.error('Error updating video session status:', error.message);
    return { data: null, error };
  }
};
