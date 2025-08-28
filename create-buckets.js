/**
 * Storage Bucket Creation Script
 * Run this script to create the required storage buckets for the certification system
 * 
 * Usage: node create-buckets.js
 */

const fs = require('fs');
const path = require('path');

// Read environment variables from .env.local
function loadEnvVars() {
  const envPath = path.join(__dirname, '.env.local');
  const envVars = {};
  
  try {
    const envContent = fs.readFileSync(envPath, 'utf8');
    envContent.split('\n').forEach(line => {
      const [key, ...values] = line.split('=');
      if (key && values.length > 0) {
        envVars[key.trim()] = values.join('=').trim();
      }
    });
  } catch (error) {
    console.error('❌ Could not read .env.local file');
    process.exit(1);
  }
  
  return envVars;
}

const env = loadEnvVars();
const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client with service role key
const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  console.error('❌ Missing required environment variables:');
  console.error('- NEXT_PUBLIC_SUPABASE_URL');
  console.error('- SUPABASE_SERVICE_ROLE_KEY');
  console.error('\nPlease check your .env.local file');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function createBucket(bucketName, config) {
  try {
    console.log(`🔄 Creating bucket: ${bucketName}`);
    
    // Check if bucket already exists
    const { data: buckets, error: listError } = await supabase.storage.listBuckets();
    
    if (listError) {
      throw listError;
    }

    const bucketExists = buckets?.some(bucket => bucket.name === bucketName);

    if (bucketExists) {
      console.log(`✅ Bucket '${bucketName}' already exists`);
      return;
    }

    // Create the bucket
    const { error: createError } = await supabase.storage.createBucket(bucketName, config);

    if (createError) {
      throw createError;
    }

    console.log(`✅ Successfully created bucket: ${bucketName}`);
    
  } catch (error) {
    console.error(`❌ Error creating bucket '${bucketName}':`, error.message);
    throw error;
  }
}

async function main() {
  console.log('🚀 Starting storage bucket creation...\n');

  try {
    // Create skill-icons bucket
    await createBucket('skill-icons', {
      public: true,
      allowedMimeTypes: ['image/svg+xml'],
      fileSizeLimit: 1024 * 1024 // 1MB
    });

    // Create certificates bucket
    await createBucket('certificates', {
      public: true,
      allowedMimeTypes: [
        'application/pdf',
        'image/jpeg',
        'image/jpg', 
        'image/png',
        'image/webp'
      ],
      fileSizeLimit: 10 * 1024 * 1024 // 10MB
    });

    console.log('\n🎉 All storage buckets created successfully!');
    console.log('\nYou can now:');
    console.log('1. Upload skill icons to the "skill-icons" bucket');
    console.log('2. Upload certificates to the "certificates" bucket');
    console.log('3. Test the admin interface at /admin/certifications');

  } catch (error) {
    console.error('\n💥 Failed to create storage buckets');
    console.error('Please try creating them manually in the Supabase Dashboard');
    process.exit(1);
  }
}

// Run the script
main();
