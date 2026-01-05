
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://lbxlorjokoceopvzlpfy.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_q-gQn3cQbGlkUT1aaoYs5Q_eFm84cIN';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);