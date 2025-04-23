
# Supabase Setup for Lawyers Anywhere

This document outlines how to set up the Supabase backend for the Lawyers Anywhere teleconsultation app.

## 1. Create and Configure Supabase Project

1. Sign in to the [Supabase Dashboard](https://app.supabase.com)
2. Create a new project and give it a name (e.g., "lawyers-anywhere")
3. Note your project URL and anon key (to be added as environment variables)

## 2. Set Up Database Schema

1. Go to the SQL Editor in your Supabase dashboard
2. Copy and paste the SQL from `src/supabase/schema.sql`
3. Execute the SQL to create all tables, functions, and policies

## 3. Configure Authentication

1. Go to Authentication > Settings
2. Under Email Auth, ensure "Enable Email Signup" is turned on
3. Configure email templates for confirmation, magic links, etc.
4. (Optional) Set up OAuth providers if you want to support social login

## 4. Set Up Storage

1. Go to Storage in your Supabase dashboard
2. Create the following buckets:
   - `avatars` (for user profile images)
   - `documents` (for legal documents)
3. Configure access controls for each bucket:
   - `avatars`: Public read, authenticated write
   - `documents`: Private (authenticated access only)

## 5. Create Edge Functions (if needed)

For features that require server-side logic (like video sessions with Twilio):

1. Install Supabase CLI and log in:
   ```bash
   npm install -g supabase
   supabase login
   ```

2. Initialize Supabase in your project directory:
   ```bash
   supabase init
   ```

3. Create edge functions using the templates provided in this project:
   ```bash
   mkdir -p supabase/functions/create-video-session
   cp src/supabase/edge-function-templates/create-video-session.txt supabase/functions/create-video-session/index.ts
   
   mkdir -p supabase/functions/send-push-notification
   cp src/supabase/edge-function-templates/send-push-notification.txt supabase/functions/send-push-notification/index.ts
   
   mkdir -p supabase/functions/_shared
   cp src/supabase/edge-function-templates/_shared/cors.ts supabase/functions/_shared/
   ```

4. Deploy the functions:
   ```bash
   supabase functions deploy create-video-session
   supabase functions deploy send-push-notification
   ```

5. Set secrets for your functions:
   ```bash
   supabase secrets set TWILIO_ACCOUNT_SID=ACXXXXXXXX TWILIO_AUTH_TOKEN=your-auth-token
   ```

## 6. Set Environment Variables

In your Supabase project:

1. Go to Settings > API
2. Copy the URL and anon key
3. Add the following environment variables to your project:

```
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

For local development, you can create a `.env.local` file at the root of your project with these variables.

## 7. Connect with External Services (if required)

### For Video Consultations

1. Create a Twilio account and get your credentials
2. Add Twilio credentials as secrets to Supabase Edge Functions:
   ```bash
   supabase secrets set TWILIO_ACCOUNT_SID=ACXXXXXXXX TWILIO_AUTH_TOKEN=your-auth-token
   ```

### For Push Notifications

1. Set up Firebase Cloud Messaging (FCM) for Android
2. Set up Apple Push Notification service (APNs) for iOS  
3. Store the necessary credentials as secrets in Supabase Edge Functions

## 8. Testing the Backend

1. Use the Supabase dashboard to manually test queries and data
2. Test authentication by creating a test account
3. Verify Row Level Security by testing queries as different users

## 9. Monitoring and Logs

1. Set up logging in Supabase
2. Configure monitoring alerts for important events
3. Regularly check the logs for errors or suspicious activities

## 10. Backups

1. Configure database backups in Supabase
2. Set up a schedule for regular backups
3. Test the restoration process to ensure backups are valid

By following this setup guide, you will have a fully functional backend infrastructure for the Lawyers Anywhere teleconsultation app.
