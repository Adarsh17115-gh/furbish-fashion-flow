
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://hyvsfcqbqyyysaepxeqt.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh5dnNmY3FicXl5eXNhZXB4ZXF0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc1MDA3NTgsImV4cCI6MjA2MzA3Njc1OH0.3LSypg7MdPi7Fvrx3UkLGPJ31qwtSZZhD4RU2Pgns6Y";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
  }
});
