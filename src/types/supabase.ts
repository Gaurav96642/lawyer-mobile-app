
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          first_name: string
          last_name: string
          email: string
          role: 'client' | 'lawyer'
          avatar_url: string | null
          specialty: string | null
          years_experience: number | null
          bio: string | null
          hourly_rate: number | null
          created_at: string
          updated_at: string | null
        }
        Insert: {
          id: string
          first_name: string
          last_name: string
          email: string
          role: 'client' | 'lawyer'
          avatar_url?: string | null
          specialty?: string | null
          years_experience?: number | null
          bio?: string | null
          hourly_rate?: number | null
          created_at?: string
          updated_at?: string | null
        }
        Update: {
          id?: string
          first_name?: string
          last_name?: string
          email?: string
          role?: 'client' | 'lawyer'
          avatar_url?: string | null
          specialty?: string | null
          years_experience?: number | null
          bio?: string | null
          hourly_rate?: number | null
          created_at?: string
          updated_at?: string | null
        }
      }
      lawyer_availability: {
        Row: {
          id: string
          lawyer_id: string
          day_of_week: number
          start_time: string
          end_time: string
          is_recurring: boolean
          specific_date: string | null
          created_at: string
          updated_at: string | null
        }
        Insert: {
          id?: string
          lawyer_id: string
          day_of_week: number
          start_time: string
          end_time: string
          is_recurring: boolean
          specific_date?: string | null
          created_at?: string
          updated_at?: string | null
        }
        Update: {
          id?: string
          lawyer_id?: string
          day_of_week?: number
          start_time?: string
          end_time?: string
          is_recurring?: boolean
          specific_date?: string | null
          created_at?: string
          updated_at?: string | null
        }
      }
      appointments: {
        Row: {
          id: string
          client_id: string
          lawyer_id: string
          start_time: string
          end_time: string
          status: 'scheduled' | 'completed' | 'canceled'
          meeting_url: string | null
          notes: string | null
          created_at: string
          updated_at: string | null
        }
        Insert: {
          id?: string
          client_id: string
          lawyer_id: string
          start_time: string
          end_time: string
          status: 'scheduled' | 'completed' | 'canceled'
          meeting_url?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string | null
        }
        Update: {
          id?: string
          client_id?: string
          lawyer_id?: string
          start_time?: string
          end_time?: string
          status?: 'scheduled' | 'completed' | 'canceled'
          meeting_url?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string | null
        }
      }
      notifications: {
        Row: {
          id: string
          user_id: string
          type: 'appointment_reminder' | 'new_message' | 'appointment_confirmation' | 'appointment_cancellation'
          title: string
          message: string
          read: boolean
          data: Json | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          type: 'appointment_reminder' | 'new_message' | 'appointment_confirmation' | 'appointment_cancellation'
          title: string
          message: string
          read?: boolean
          data?: Json | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          type?: 'appointment_reminder' | 'new_message' | 'appointment_confirmation' | 'appointment_cancellation'
          title?: string
          message?: string
          read?: boolean
          data?: Json | null
          created_at?: string
        }
      }
      video_sessions: {
        Row: {
          id: string
          appointment_id: string
          provider: 'zoom' | 'twilio'
          meeting_id: string
          host_url: string | null
          join_url: string
          password: string | null
          start_url: string | null
          status: 'created' | 'started' | 'ended' | 'failed'
          provider_data: Json | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          appointment_id: string
          provider?: 'zoom' | 'twilio'
          meeting_id: string
          host_url?: string | null
          join_url: string
          password?: string | null
          start_url?: string | null
          status?: 'created' | 'started' | 'ended' | 'failed'
          provider_data?: Json | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          appointment_id?: string
          provider?: 'zoom' | 'twilio'
          meeting_id?: string
          host_url?: string | null
          join_url?: string
          password?: string | null
          start_url?: string | null
          status?: 'created' | 'started' | 'ended' | 'failed'
          provider_data?: Json | null
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      available_lawyers: {
        Row: {
          lawyer_id: string
          first_name: string
          last_name: string
          specialty: string | null
          years_experience: number | null
          avatar_url: string | null
          hourly_rate: number | null
        }
      }
    }
    Functions: {
      get_available_lawyers: {
        Args: {
          date_param: string
        }
        Returns: {
          lawyer_id: string
          first_name: string
          last_name: string
          specialty: string | null
          avatar_url: string | null
          available_slots: Json[]
        }[]
      }
      book_appointment: {
        Args: {
          p_client_id: string
          p_lawyer_id: string
          p_start_time: string
          p_end_time: string
          p_notes: string | null
        }
        Returns: {
          appointment_id: string
        }
      }
      create_video_session: {
        Args: {
          p_appointment_id: string
        }
        Returns: {
          video_session_id: string
        }
      }
    }
  }
}

