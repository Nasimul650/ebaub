const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

async function test() {
  const { data } = await supabase.from('news').select('*').limit(1);
  console.log('News items list:', data);
  
  if (data && data.length > 0) {
    const id = data[0].id;
    console.log('Fetching id:', id);
    const { data: singleData, error } = await supabase.from('news').select('id, title, content').eq('id', id).single();
    console.log('Single fetch:', singleData, 'Error:', error);
  } else {
    console.log('No news data found.');
  }
}
test();
