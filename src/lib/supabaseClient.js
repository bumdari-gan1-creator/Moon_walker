
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://tviqnybbwntjmeulabcl.supabase.co';
const SUPABASE_ANON_KEY = 'sb_secret_MRJ6nFqW7ezpTxyQTP8OqQ_NNCQ5bYs';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);