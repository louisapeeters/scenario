// src/supabaseClient.js
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://nwvrwzhlefwvthvbtfrk.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im53dnJ3emhsZWZ3dnRodmJ0ZnJrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA2MTg0MTIsImV4cCI6MjA2NjE5NDQxMn0.YmqmmywaIAGdBuQ9SkOBUC7xWjSiCvP3jCWOcPMzAig';

export const supabase = createClient(supabaseUrl, supabaseKey);
