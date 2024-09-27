import { createClient } from '@supabase/supabase-js';

// Supabase URL and public API key
const SUPABASE_URL = 'https://qukdqkjmmvpigfvrhsfz.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF1a2Rxa2ptbXZwaWdmdnJoc2Z6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mjc0MDE2MTMsImV4cCI6MjA0Mjk3NzYxM30.XPQXRCWEfPUIZSkDzoh8eiJKYfbzevxX6h0f8aSV_Wc';

// Create a single supabase client for interacting with your database
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

export default supabase;
