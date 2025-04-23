
import { supabase, AppointmentType } from '@/lib/supabase';
import { Database } from '@/types/supabase';

export const getClientAppointments = async (clientId: string) => {
  try {
    const { data, error } = await supabase
      .from('appointments')
      .select(`
        *,
        lawyer:profiles!lawyer_id(first_name, last_name, avatar_url, specialty)
      `)
      .eq('client_id', clientId)
      .order('start_time', { ascending: true });
      
    if (error) throw error;
    return { data, error: null };
  } catch (error: any) {
    console.error('Error getting client appointments:', error.message);
    return { data: null, error };
  }
};

export const getLawyerAppointments = async (lawyerId: string) => {
  try {
    const { data, error } = await supabase
      .from('appointments')
      .select(`
        *,
        client:profiles!client_id(first_name, last_name, avatar_url)
      `)
      .eq('lawyer_id', lawyerId)
      .order('start_time', { ascending: true });
      
    if (error) throw error;
    return { data, error: null };
  } catch (error: any) {
    console.error('Error getting lawyer appointments:', error.message);
    return { data: null, error };
  }
};

export const createAppointment = async (appointment: Omit<AppointmentType, 'id' | 'created_at' | 'updated_at'>) => {
  try {
    const { data, error } = await supabase.rpc('book_appointment', {
      p_client_id: appointment.client_id,
      p_lawyer_id: appointment.lawyer_id,
      p_start_time: appointment.start_time,
      p_end_time: appointment.end_time,
      p_notes: appointment.notes || null
    });
      
    if (error) throw error;
    return { data, error: null };
  } catch (error: any) {
    console.error('Error creating appointment:', error.message);
    return { data: null, error };
  }
};

export const updateAppointmentStatus = async (id: string, status: 'scheduled' | 'completed' | 'canceled') => {
  try {
    const { data, error } = await supabase
      .from('appointments')
      .update({ 
        status,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();
      
    if (error) throw error;
    return { data, error: null };
  } catch (error: any) {
    console.error('Error updating appointment status:', error.message);
    return { data: null, error };
  }
};
