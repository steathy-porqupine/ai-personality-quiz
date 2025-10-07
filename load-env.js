#!/usr/bin/env node

/**
 * Environment Variable Loader
 * Loads environment variables from env.local for local development
 */

const fs = require('fs');
const path = require('path');

function loadEnvFile() {
  const envPath = path.join(__dirname, 'env.local');
  
  if (!fs.existsSync(envPath)) {
    console.log('⚠️  env.local file not found. Creating template...');
    const template = `# Resend API Keys
RESEND_API_KEY=your_resend_api_key_here
RESEND_API_KEY_BACKUP=your_backup_api_key_here

# Database URL (set in Netlify environment variables)
# DATABASE_URL=your_database_connection_string_here

# Development settings
NODE_ENV=development`;
    
    fs.writeFileSync(envPath, template);
    console.log('✅ Created env.local template. Please add your API keys.');
    return {};
  }
  
  const envContent = fs.readFileSync(envPath, 'utf8');
  const envVars = {};
  
  envContent.split('\n').forEach(line => {
    line = line.trim();
    if (line && !line.startsWith('#')) {
      const [key, ...valueParts] = line.split('=');
      if (key && valueParts.length > 0) {
        envVars[key.trim()] = valueParts.join('=').trim();
      }
    }
  });
  
  return envVars;
}

function setEnvVars() {
  const envVars = loadEnvFile();
  
  Object.entries(envVars).forEach(([key, value]) => {
    if (!process.env[key]) {
      process.env[key] = value;
      console.log(`✅ Loaded ${key}`);
    } else {
      console.log(`⚠️  ${key} already set in environment`);
    }
  });
  
  return envVars;
}

// Export for use in other scripts
module.exports = { loadEnvFile, setEnvVars };

// If run directly, load and display environment variables
if (require.main === module) {
  console.log('🔧 Loading environment variables from env.local...\n');
  const envVars = setEnvVars();
  
  console.log('\n📋 Loaded Environment Variables:');
  Object.entries(envVars).forEach(([key, value]) => {
    const displayValue = key.includes('API_KEY') ? 
      `${value.substring(0, 10)}...` : value;
    console.log(`  ${key}: ${displayValue}`);
  });
  
  console.log('\n✅ Environment variables loaded successfully!');
}
