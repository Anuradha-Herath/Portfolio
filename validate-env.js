#!/usr/bin/env node

/**
 * Environment Variables Validation Script
 * This script validates that all required environment variables are set
 * for both development and production environments.
 */

require('dotenv').config({ path: '.env.local' });

const requiredVars = {
  development: [
    'NEXT_PUBLIC_SUPABASE_URL',
    'NEXT_PUBLIC_SUPABASE_ANON_KEY',
    'SUPABASE_SERVICE_ROLE_KEY',
    'ADMIN_USERNAME',
    'ADMIN_PASSWORD',
    'JWT_SECRET',
    'NEXT_PUBLIC_SITE_URL',
  ],
  production: [
    'NEXT_PUBLIC_SUPABASE_URL',
    'NEXT_PUBLIC_SUPABASE_ANON_KEY',
    'SUPABASE_SERVICE_ROLE_KEY',
    'ADMIN_USERNAME',
    'ADMIN_PASSWORD',
    'JWT_SECRET',
    'NEXT_PUBLIC_SITE_URL',
  ],
  optional: [
    'TEXTBEE_API_KEY',
    'TEXTBEE_DEVICE_ID',
    'ENABLE_SMS_NOTIFICATIONS',
    'GMAIL_USER',
    'GMAIL_PASS',
  ]
};

function validateEnvironmentVariables() {
  const environment = process.env.NODE_ENV || 'development';
  const required = requiredVars[environment] || requiredVars.development;
  
  console.log(`🔍 Validating environment variables for: ${environment}`);
  console.log('=' .repeat(50));
  
  const missing = [];
  const present = [];
  const optional = [];
  
  // Check required variables
  required.forEach(varName => {
    if (process.env[varName]) {
      present.push(varName);
      console.log(`✅ ${varName}`);
    } else {
      missing.push(varName);
      console.log(`❌ ${varName} - MISSING`);
    }
  });
  
  // Check optional variables
  requiredVars.optional.forEach(varName => {
    if (process.env[varName]) {
      optional.push(varName);
      console.log(`🔶 ${varName} - Optional (present)`);
    } else {
      console.log(`⚪ ${varName} - Optional (not set)`);
    }
  });
  
  console.log('\n' + '=' .repeat(50));
  console.log(`📊 Summary:`);
  console.log(`   Required present: ${present.length}/${required.length}`);
  console.log(`   Optional present: ${optional.length}/${requiredVars.optional.length}`);
  
  if (missing.length > 0) {
    console.log('\n❌ Missing required environment variables:');
    missing.forEach(varName => {
      console.log(`   - ${varName}`);
    });
    
    console.log('\n📝 To fix this:');
    console.log('   1. Copy .env.local.example to .env.local (if available)');
    console.log('   2. Add the missing variables to your .env.local file');
    console.log('   3. For production, add these to your Vercel environment variables');
    
    process.exit(1);
  } else {
    console.log('\n✅ All required environment variables are set!');
    
    // Validate URL formats
    const urlVars = ['NEXT_PUBLIC_SUPABASE_URL', 'NEXT_PUBLIC_SITE_URL'];
    const invalidUrls = [];
    
    urlVars.forEach(varName => {
      const value = process.env[varName];
      if (value) {
        try {
          new URL(value);
          console.log(`🔗 ${varName}: Valid URL format`);
        } catch (error) {
          invalidUrls.push(varName);
          console.log(`⚠️  ${varName}: Invalid URL format - ${value}`);
        }
      }
    });
    
    if (invalidUrls.length > 0) {
      console.log('\n⚠️  Some URLs have invalid formats. Please check them.');
      process.exit(1);
    }
    
    console.log('\n🎉 Environment validation passed!');
  }
}

// Run validation if this script is executed directly
if (require.main === module) {
  validateEnvironmentVariables();
}

module.exports = { validateEnvironmentVariables, requiredVars };