
import { createClient } from '@supabase/supabase-js';

// ------------------------------------------------------------------
// CONFIGURATION
// ------------------------------------------------------------------

// 1. Local/Development: Replace the strings below with your keys from Supabase Dashboard
// You get these from Project Settings -> API
const LOCAL_URL = 'https://ebmontfqbyarwroagcjf.supabase.co'; 
const LOCAL_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVibW9udGZxYnlhcndyb2FnY2pmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM3OTQ2MzIsImV4cCI6MjA3OTM3MDYzMn0.b7utImHWDBoMUtRG5vI4nSyIWmfcndYrS_nsksOLjgc';

// 2. Production (Vercel/Netlify): These will be populated automatically from Environment Variables
// We check for both Vite (VITE_) and Next.js (NEXT_PUBLIC_) prefixes to ensure compatibility with different build tools.
const ENV_URL = (typeof import.meta !== 'undefined' && (import.meta as any).env) 
  ? ((import.meta as any).env.VITE_SUPABASE_URL || (import.meta as any).env.NEXT_PUBLIC_SUPABASE_URL) 
  : undefined;

const ENV_KEY = (typeof import.meta !== 'undefined' && (import.meta as any).env) 
  ? ((import.meta as any).env.VITE_SUPABASE_ANON_KEY || (import.meta as any).env.NEXT_PUBLIC_SUPABASE_ANON_KEY) 
  : undefined;

// Logic: Use Env vars if they exist (Production), otherwise use Local vars (Development)
const SUPABASE_URL = ENV_URL || LOCAL_URL;
const SUPABASE_ANON_KEY = ENV_KEY || LOCAL_KEY;

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
