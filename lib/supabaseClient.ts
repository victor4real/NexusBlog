
import { createClient } from '@supabase/supabase-js';

// ------------------------------------------------------------------
// CONFIGURATION
// ------------------------------------------------------------------

// Helper to safely access environment variables without throwing ReferenceError
const getEnv = (key: string): string | undefined => {
  try {
    // Check if import.meta exists and has env property (Vite)
    if (typeof import.meta !== 'undefined' && (import.meta as any).env) {
      return (import.meta as any).env[key];
    }
  } catch (e) {
    console.warn(`Error reading env var ${key}`, e);
  }
  return undefined;
};

// 1. Local/Development: Replace the strings below with your keys from Supabase Dashboard
const LOCAL_URL = 'https://ebmontfqbyarwroagcjf.supabase.co'; 
const LOCAL_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVibW9udGZxYnlhcndyb2FnY2pmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM3OTQ2MzIsImV4cCI6MjA3OTM3MDYzMn0.b7utImHWDBoMUtRG5vI4nSyIWmfcndYrS_nsksOLjgc';

// 2. Production: Attempt to read from environment variables
const ENV_URL = getEnv('VITE_SUPABASE_URL') || getEnv('NEXT_PUBLIC_SUPABASE_URL');
const ENV_KEY = getEnv('VITE_SUPABASE_ANON_KEY') || getEnv('NEXT_PUBLIC_SUPABASE_ANON_KEY');

// Logic: Use Env vars if they exist (Production), otherwise use Local vars (Development)
const SUPABASE_URL = ENV_URL || LOCAL_URL;
const SUPABASE_ANON_KEY = ENV_KEY || LOCAL_KEY;

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
