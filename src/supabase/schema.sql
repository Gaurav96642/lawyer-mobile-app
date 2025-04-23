
-- Create profiles table
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('client', 'lawyer')),
  avatar_url TEXT,
  specialty TEXT, -- Only relevant for lawyers
  years_experience INTEGER, -- Only relevant for lawyers
  bio TEXT,
  hourly_rate NUMERIC, -- Only relevant for lawyers
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Create lawyer_availability table
CREATE TABLE public.lawyer_availability (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  lawyer_id UUID REFERENCES public.profiles(id) NOT NULL,
  day_of_week INTEGER CHECK (day_of_week BETWEEN 0 AND 6), -- 0=Sunday, 6=Saturday
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  is_recurring BOOLEAN DEFAULT true,
  specific_date DATE, -- Only used if is_recurring = false
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Create appointments table (renamed from "bookings" for consistency with existing code)
CREATE TABLE public.appointments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_id UUID REFERENCES public.profiles(id) NOT NULL,
  lawyer_id UUID REFERENCES public.profiles(id) NOT NULL,
  start_time TIMESTAMP WITH TIME ZONE NOT NULL,
  end_time TIMESTAMP WITH TIME ZONE NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('scheduled', 'completed', 'canceled')),
  meeting_url TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Create video_sessions table (new)
CREATE TABLE public.video_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  appointment_id UUID REFERENCES public.appointments(id) NOT NULL,
  provider TEXT NOT NULL DEFAULT 'zoom', -- 'zoom', 'twilio', etc.
  meeting_id TEXT NOT NULL,
  host_url TEXT, -- URL for the lawyer to host the meeting
  join_url TEXT NOT NULL, -- URL for the client to join the meeting
  password TEXT, -- Meeting password if applicable
  start_url TEXT, -- URL with embedded credentials to start the meeting
  status TEXT NOT NULL DEFAULT 'created' CHECK (status IN ('created', 'started', 'ended', 'failed')),
  provider_data JSONB, -- Store additional provider-specific data
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Create notifications table
CREATE TABLE public.notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('appointment_reminder', 'new_message', 'appointment_confirmation', 'appointment_cancellation')),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  read BOOLEAN DEFAULT false,
  data JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Create function to get available lawyers on a specific date
CREATE OR REPLACE FUNCTION public.get_available_lawyers(date_param DATE)
RETURNS TABLE (
  lawyer_id UUID,
  first_name TEXT,
  last_name TEXT,
  specialty TEXT,
  avatar_url TEXT,
  available_slots JSONB[]
) AS $$
BEGIN
  RETURN QUERY
  WITH lawyer_slots AS (
    SELECT 
      p.id,
      p.first_name,
      p.last_name,
      p.specialty,
      p.avatar_url,
      JSONB_BUILD_OBJECT(
        'start_time', la.start_time,
        'end_time', la.end_time
      ) AS slot
    FROM profiles p
    JOIN lawyer_availability la ON p.id = la.lawyer_id
    WHERE 
      p.role = 'lawyer' AND
      (
        (la.is_recurring = true AND la.day_of_week = EXTRACT(DOW FROM date_param)) OR
        (la.is_recurring = false AND la.specific_date = date_param)
      ) AND
      NOT EXISTS (
        SELECT 1 
        FROM appointments a 
        WHERE 
          a.lawyer_id = p.id AND 
          a.status != 'canceled' AND
          DATE(a.start_time) = date_param AND
          (
            (a.start_time::time, a.end_time::time) OVERLAPS (la.start_time, la.end_time)
          )
      )
  )
  SELECT 
    lawyer_id, 
    first_name, 
    last_name, 
    specialty, 
    avatar_url,
    ARRAY_AGG(slot) AS available_slots
  FROM lawyer_slots
  GROUP BY lawyer_id, first_name, last_name, specialty, avatar_url;
END;
$$ LANGUAGE plpgsql;

-- Create function to book an appointment
CREATE OR REPLACE FUNCTION public.book_appointment(
  p_client_id UUID,
  p_lawyer_id UUID,
  p_start_time TIMESTAMP WITH TIME ZONE,
  p_end_time TIMESTAMP WITH TIME ZONE,
  p_notes TEXT
)
RETURNS TABLE (appointment_id UUID) AS $$
DECLARE
  v_appointment_id UUID;
BEGIN
  -- Check if the lawyer is available at this time
  IF EXISTS (
    SELECT 1
    FROM appointments
    WHERE 
      lawyer_id = p_lawyer_id AND
      status != 'canceled' AND
      (p_start_time, p_end_time) OVERLAPS (start_time, end_time)
  ) THEN
    RAISE EXCEPTION 'The lawyer is not available at this time';
  END IF;

  -- Insert the appointment
  INSERT INTO appointments (
    client_id,
    lawyer_id,
    start_time,
    end_time,
    status,
    notes
  ) VALUES (
    p_client_id,
    p_lawyer_id,
    p_start_time,
    p_end_time,
    'scheduled',
    p_notes
  ) RETURNING id INTO v_appointment_id;

  -- Create notifications for both parties
  -- For client
  INSERT INTO notifications (
    user_id,
    type,
    title,
    message,
    data
  ) VALUES (
    p_client_id,
    'appointment_confirmation',
    'Appointment Confirmed',
    'Your appointment has been confirmed.',
    jsonb_build_object('appointment_id', v_appointment_id)
  );

  -- For lawyer
  INSERT INTO notifications (
    user_id,
    type,
    title,
    message,
    data
  ) VALUES (
    p_lawyer_id,
    'appointment_confirmation',
    'New Appointment',
    'A new appointment has been scheduled.',
    jsonb_build_object('appointment_id', v_appointment_id)
  );

  RETURN QUERY SELECT v_appointment_id;
END;
$$ LANGUAGE plpgsql;

-- Create function for creating video sessions
CREATE OR REPLACE FUNCTION public.create_video_session(
  p_appointment_id UUID
)
RETURNS TABLE (video_session_id UUID) AS $$
DECLARE
  v_video_session_id UUID;
  v_appointment RECORD;
BEGIN
  -- Get the appointment details
  SELECT * INTO v_appointment
  FROM appointments
  WHERE id = p_appointment_id;
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Appointment not found';
  END IF;
  
  IF v_appointment.status != 'scheduled' THEN
    RAISE EXCEPTION 'Cannot create video session for a non-scheduled appointment';
  END IF;
  
  -- Check if a video session already exists
  IF EXISTS (SELECT 1 FROM video_sessions WHERE appointment_id = p_appointment_id) THEN
    RAISE EXCEPTION 'Video session already exists for this appointment';
  END IF;
  
  -- Insert placeholder video session (will be updated by Edge Function)
  INSERT INTO video_sessions (
    appointment_id,
    provider,
    meeting_id,
    join_url,
    status,
    provider_data
  ) VALUES (
    p_appointment_id,
    'zoom',
    'pending', -- Will be updated by Edge Function
    'pending', -- Will be updated by Edge Function
    'created',
    '{}'::jsonb
  ) RETURNING id INTO v_video_session_id;
  
  -- Update the appointment with a placeholder meeting URL
  UPDATE appointments
  SET meeting_url = 'pending', -- Will be updated by Edge Function
      updated_at = now()
  WHERE id = p_appointment_id;
  
  RETURN QUERY SELECT v_video_session_id;
END;
$$ LANGUAGE plpgsql;

-- Set up Row Level Security policies

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lawyer_availability ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.video_sessions ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view their own profile"
  ON public.profiles
  FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles
  FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Lawyer profiles are visible to all authenticated users"
  ON public.profiles
  FOR SELECT
  USING (role = 'lawyer');

-- Lawyer availability policies
CREATE POLICY "Lawyers can manage their own availability"
  ON public.lawyer_availability
  FOR ALL
  USING (auth.uid() = lawyer_id);

CREATE POLICY "All users can view lawyer availability"
  ON public.lawyer_availability
  FOR SELECT
  TO authenticated
  USING (true);

-- Appointments policies
CREATE POLICY "Clients can view their own appointments"
  ON public.appointments
  FOR SELECT
  USING (auth.uid() = client_id);

CREATE POLICY "Lawyers can view appointments where they are the provider"
  ON public.appointments
  FOR SELECT
  USING (auth.uid() = lawyer_id);

CREATE POLICY "Clients can create appointments"
  ON public.appointments
  FOR INSERT
  WITH CHECK (auth.uid() = client_id);

CREATE POLICY "Clients can update their own appointments"
  ON public.appointments
  FOR UPDATE
  USING (auth.uid() = client_id);

CREATE POLICY "Lawyers can update appointments where they are the provider"
  ON public.appointments
  FOR UPDATE
  USING (auth.uid() = lawyer_id);

-- Video sessions policies
CREATE POLICY "Users can view video sessions for their own appointments"
  ON public.video_sessions
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1
      FROM appointments
      WHERE
        appointments.id = video_sessions.appointment_id
        AND (auth.uid() = appointments.client_id OR auth.uid() = appointments.lawyer_id)
    )
  );

CREATE POLICY "Only system can create video sessions"
  ON public.video_sessions
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1
      FROM appointments
      WHERE
        appointments.id = appointment_id
        AND (auth.uid() = appointments.client_id OR auth.uid() = appointments.lawyer_id)
    )
  );

CREATE POLICY "Only system can update video sessions"
  ON public.video_sessions
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1
      FROM appointments
      WHERE
        appointments.id = appointment_id
        AND (auth.uid() = appointments.client_id OR auth.uid() = appointments.lawyer_id)
    )
  );

-- Notifications policies
CREATE POLICY "Users can view their own notifications"
  ON public.notifications
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own notifications (to mark as read)"
  ON public.notifications
  FOR UPDATE
  USING (auth.uid() = user_id);

