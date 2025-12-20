/**
 * Quick test script to verify Sanity connection
 * Run with: node scripts/test-sanity.js
 */

require('dotenv').config({ path: '.env.local' });

const { createClient } = require('@sanity/client');

const projectId = process.env.SANITY_PROJECT_ID;
const dataset = process.env.SANITY_DATASET;
const apiVersion = process.env.SANITY_API_VERSION || '2024-03-01';
const token = process.env.SANITY_TOKEN || process.env.SANITY_READ_TOKEN;

console.log('🔍 Testing Sanity Connection...\n');
console.log('Configuration:');
console.log(`  Project ID: ${projectId || '❌ MISSING'}`);
console.log(`  Dataset: ${dataset || '❌ MISSING'}`);
console.log(`  API Version: ${apiVersion}`);
console.log(`  Token: ${token ? '✅ Set (' + token.substring(0, 20) + '...)' : '❌ MISSING'}`);
console.log('');

if (!projectId || !dataset) {
  console.error('❌ Missing required environment variables!');
  process.exit(1);
}

const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
  token,
});

// Test query
client
  .fetch('*[_type == "activity"][0...1]')
  .then((results) => {
    console.log('✅ Connection successful!');
    console.log(`   Found ${results.length} activities`);
    if (results.length > 0) {
      console.log(`   Sample: ${results[0].title || 'Untitled'}`);
    }
    console.log('\n🎉 Sanity is properly configured!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Connection failed:');
    console.error(`   ${error.message}`);
    if (error.message.includes('401') || error.message.includes('403')) {
      console.error('\n💡 Tip: Check your SANITY_TOKEN - it might be invalid or expired.');
      console.error('   Get a new token from: https://sanity.io/manage');
    }
    process.exit(1);
  });


