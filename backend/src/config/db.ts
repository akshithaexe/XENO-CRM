import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { logger } from '../utils/logger';

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseKey) {
  logger.warn('Supabase URL or Key is missing. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env');
}

const supabase: SupabaseClient = createClient(supabaseUrl, supabaseKey, {
  auth: { persistSession: false },
});

export default supabase;

/**
 * Verifies Supabase connectivity.
 */
export async function testConnection(): Promise<void> {
  try {
    const { error } = await supabase.from('customers').select('id').limit(1);
    if (error) throw error;
    logger.info('✅ Supabase connected successfully');
  } catch (err: any) {
    logger.error('Supabase connection test failed:', err.message);
  }
}
