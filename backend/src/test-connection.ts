/**
 * Quick connection test — run with: npx ts-node src/test-connection.ts
 */
import dotenv from 'dotenv';
dotenv.config();

import { createClient } from '@supabase/supabase-js';

const url = process.env.SUPABASE_URL || '';
const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || '';

console.log('🔍 Testing Supabase connection...');
console.log(`   URL: ${url}`);
console.log(`   Key: ${key.slice(0, 20)}...${key.slice(-10)}`);

const supabase = createClient(url, key, { auth: { persistSession: false } });

async function test() {
  // Test 1: Basic connectivity
  try {
    const { data, error } = await supabase.from('customers').select('id').limit(1);
    if (error) {
      console.log(`\n❌ Connection failed: ${error.message}`);
      console.log(`   Code: ${error.code}`);
      console.log(`   Hint: ${error.hint || 'none'}`);
      
      if (error.message.includes('relation') && error.message.includes('does not exist')) {
        console.log('\n💡 The tables don\'t exist yet. You need to run the SQL schema first:');
        console.log('   1. Go to Supabase Dashboard → SQL Editor');
        console.log('   2. Paste the contents of supabase_schema.sql');
        console.log('   3. Click Run');
      }
    } else {
      console.log('\n✅ Supabase connected successfully!');
      console.log(`   Customers found: ${data?.length || 0}`);
    }
  } catch (err: any) {
    console.log(`\n❌ Error: ${err.message}`);
  }

  // Test 2: Check which tables exist
  try {
    const tables = ['customers', 'orders', 'segments', 'campaigns', 'communication_logs'];
    console.log('\n📋 Table check:');
    for (const table of tables) {
      const { error } = await supabase.from(table).select('id').limit(0);
      const status = error ? `❌ ${error.message}` : '✅ exists';
      console.log(`   ${table}: ${status}`);
    }
  } catch {}
}

test().then(() => process.exit(0));
