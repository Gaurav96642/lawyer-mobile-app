
import { createClient } from '@supabase/supabase-js';
import { Database } from '../types/supabase';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://your-project-url.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key';

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

// Types for auth state
export type UserSession = {
  user: {
    id: string;
    email?: string;
  } | null;
  session: any;
  isLoading: boolean;
  error: Error | null;
};

export type UserProfileType = {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  role: 'client' | 'lawyer';
  avatar_url?: string;
  specialty?: string;
  years_experience?: number;
  bio?: string;
  hourly_rate?: number;
  created_at: string;
  updated_at: string;
};

export type LawyerAvailabilityType = {
  id: string;
  lawyer_id: string;
  day_of_week: number; // 0-6 for Sunday-Saturday
  start_time: string;  // Format: HH:MM (24-hour)
  end_time: string;    // Format: HH:MM (24-hour)
  is_recurring: boolean;
  specific_date?: string; // ISO date, only if not recurring
  created_at: string;
  updated_at: string;
};

export type AppointmentType = {
  id: string;
  client_id: string;
  lawyer_id: string;
  start_time: string; // ISO date-time
  end_time: string;   // ISO date-time
  status: 'scheduled' | 'completed' | 'canceled';
  meeting_url?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
};

export type VideoSessionType = {
  id: string;
  appointment_id: string;
  provider: 'zoom' | 'twilio';
  meeting_id: string;
  host_url?: string;
  join_url: string;
  password?: string;
  start_url?: string;
  status: 'created' | 'started' | 'ended' | 'failed';
  provider_data?: any;
  created_at: string;
  updated_at: string;
};
