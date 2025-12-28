
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://tviqnybbwntjmeulabcl.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_jd_q9Lt3SKVLd7m7W2QWtw_tu9dVu_4';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);