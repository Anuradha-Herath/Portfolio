const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Read .env.local file manually
const envPath = path.join(__dirname, '.env.local');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  envContent.split('\n').forEach(line => {
    if (line.trim() && !line.startsWith('#')) {
      const [key, value] = line.split('=');
      if (key && value) {
        process.env[key.trim()] = value.trim();
      }
    }
  });
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function debugProjects() {
  try {
    console.log('Fetching projects...');
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error:', error);
      return;
    }
    
    console.log('Projects found:', data.length);
    
    data.forEach((project, index) => {
      console.log(`\n--- Project ${index + 1} ---`);
      console.log('ID:', project.id);
      console.log('Title:', project.title);
      console.log('Status:', project.status);
      console.log('Type:', project.type);
      console.log('Project Type Detail:', project.project_type_detail);
      console.log('Role:', project.role);
      console.log('Duration:', project.duration);
      console.log('Technologies (old field):', project.technologies);
      console.log('Technologies Used (new field):', project.technologies_used);
      console.log('Key Features:', project.key_features);
      console.log('My Contributions:', project.my_contributions);
      console.log('Additional Images:', project.additional_images);
    });
    
  } catch (err) {
    console.error('Unexpected error:', err);
  }
}

debugProjects();
