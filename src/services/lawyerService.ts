
import { supabase, LawyerAvailabilityType, UserProfileType } from '@/lib/supabase';
import { Database } from '@/types/supabase';

export const getLawyers = async () => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('role', 'lawyer');
      
    if (error) throw error;
    return { data: data as UserProfileType[], error: null };
  } catch (error: any) {
    console.error('Error getting lawyers:', error.message);
    return { data: null, error };
  }
};

export const getLawyerById = async (id: string) => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', id)
      .eq('role', 'lawyer')
      .single();
      
    if (error) throw error;
    return { data: data as UserProfileType, error: null };
  } catch (error: any) {
    console.error('Error getting lawyer:', error.message);
    return { data: null, error };
  }
};

export const getAvailableLawyers = async (date: string) => {
  try {
    const { data, error } = await supabase
      .rpc('get_available_lawyers', { date_param: date });
      
    if (error) throw error;
    return { data, error: null };
  } catch (error: any) {
    console.error('Error getting available lawyers:', error.message);
    return { data: null, error };
  }
};

export const getLawyerAvailability = async (lawyerId: string) => {
  try {
    const { data, error } = await supabase
      .from('lawyer_availability')
      .select('*')
      .eq('lawyer_id', lawyerId);
      
    if (error) throw error;
    return { data: data as LawyerAvailabilityType[], error: null };
  } catch (error: any) {
    console.error('Error getting lawyer availability:', error.message);
    return { data: null, error };
  }
};

export const createLawyerAvailability = async (availability: Omit<LawyerAvailabilityType, 'id' | 'created_at' | 'updated_at'>) => {
  try {
    const { data, error } = await supabase
      .from('lawyer_availability')
      .insert({
        ...availability,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single();
      
    if (error) throw error;
    return { data, error: null };
  } catch (error: any) {
    console.error('Error creating lawyer availability:', error.message);
    return { data: null, error };
  }
};
