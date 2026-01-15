// Supabase Configuration
// Replace with your actual Supabase credentials
const SUPABASE_URL = 'https://tujovuevhizbnxwjhmhd.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR1am92dWV2aGl6Ym54d2pobWhkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjgzODU2ODYsImV4cCI6MjA4Mzk2MTY4Nn0.6Y_uk0Gw5AcYj0g1Sazt8qfXqZaUEaQn9eLPstvROec';

// Initialize Supabase client
window.supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

console.log('Supabase client initialized successfully');
