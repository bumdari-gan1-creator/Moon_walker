// src/lib/supabaseClient.js
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://(YOUR URL HERE)';
const SUPABASE_ANON_KEY = 'YOUR ANON KEY HERE';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);