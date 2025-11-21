import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function check(short) {
  const { data, error } = await supabase
    .from('urls')
    .select('id, original_url, short_url, custom_url')
    .or(`short_url.eq.${short},custom_url.eq.${short}`)
    .limit(1);

  if (error) {
    console.error('Error querying supabase:', error);
    process.exit(1);
  }

  if (!data || data.length === 0) {
    console.log('Not found');
  } else {
    console.log('Found:', data[0]);
  }
}

const arg = process.argv[2];
if (!arg) {
  console.error('Usage: node checkShort.js <short>');
  process.exit(1);
}

check(arg).then(() => process.exit(0));
