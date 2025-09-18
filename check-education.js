const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

async function checkEducationData() {
  try {
    const { data, error } = await supabase.from('education').select('*');
    if (error) {
      console.error('Error:', error);
      return;
    }

    console.log('Education data:');
    data.forEach(edu => {
      console.log(`ID: ${edu.id}, Institution: ${edu.institution}, Icon URL: ${edu.icon_url || 'null'}`);
    });
  } catch (err) {
    console.error('Error:', err);
  }
}

checkEducationData();