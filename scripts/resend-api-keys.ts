/**
 * Resend API Key Management Script
 * 
 * This script helps manage Resend API keys for dev and production environments
 * 
 * Usage:
 *   npm run resend:list          - List all API keys
 *   npm run resend:create:dev    - Create a dev API key
 *   npm run resend:create:prod   - Create a production API key
 *   npm run resend:delete        - Delete an API key (requires ID)
 * 
 * Note: You need your master API key to run these commands
 */

import { Resend } from 'resend';

// Get API key from environment or command line
const masterApiKey = process.env.RESEND_MASTER_API_KEY || process.argv[2];

if (!masterApiKey) {
  console.error('❌ Error: RESEND_MASTER_API_KEY environment variable or API key argument required');
  console.log('\nUsage:');
  console.log('  RESEND_MASTER_API_KEY=re_xxxxx npm run resend:list');
  console.log('  npm run resend:list re_xxxxx');
  process.exit(1);
}

const resend = new Resend(masterApiKey);

async function listApiKeys() {
  try {
    console.log('📋 Fetching API keys...\n');
    const response = await resend.apiKeys.list();
    
    // Handle different response structures
    const keys = response.data || response || [];
    
    if (Array.isArray(keys) && keys.length > 0) {
      console.log('✅ Found API keys:\n');
      keys.forEach((key: any) => {
        console.log(`  Name: ${key.name || 'Unnamed'}`);
        console.log(`  ID: ${key.id || 'N/A'}`);
        if (key.created_at) {
          console.log(`  Created: ${new Date(key.created_at).toLocaleString()}`);
        }
        if (key.permission) {
          console.log(`  Permissions: ${key.permission}`);
        }
        console.log('  ---');
      });
    } else {
      console.log('ℹ️  No API keys found');
      console.log('\n💡 Note: This might mean:');
      console.log('   - You\'re using your main/master API key (which is fine!)');
      console.log('   - Or the API response structure is different');
      console.log('\n✅ Your current API key is working - no need to create new ones for development!');
    }
  } catch (error: any) {
    console.error('❌ Error listing API keys:', error.message);
    if (error.message?.includes('permission') || error.message?.includes('unauthorized')) {
      console.log('\n💡 This API key might not have permission to list keys.');
      console.log('   That\'s okay - your key still works for sending emails!');
    }
    process.exit(1);
  }
}

async function createApiKey(name: string) {
  try {
    console.log(`🔑 Creating API key: ${name}...\n`);
    const response = await resend.apiKeys.create({ name });
    
    // Handle different response structures
    const keyData = response.data || response;
    
    if (keyData && (keyData.token || keyData.id)) {
      console.log('✅ API key created successfully!\n');
      console.log('⚠️  IMPORTANT: Save this key now - it won\'t be shown again!\n');
      console.log(`  Name: ${keyData.name || name}`);
      console.log(`  ID: ${keyData.id || 'N/A'}`);
      if (keyData.token) {
        console.log(`  Key: ${keyData.token}\n`);
        console.log('Add to your .env.local:');
        console.log(`  RESEND_API_KEY=${keyData.token}\n`);
      } else {
        console.log('  ⚠️  Token not returned - check Resend dashboard for the key\n');
      }
    } else {
      console.error('❌ Failed to create API key - unexpected response format');
      console.log('Response:', JSON.stringify(response, null, 2));
      console.log('\n💡 Try creating the key manually in the Resend dashboard instead.');
      process.exit(1);
    }
  } catch (error: any) {
    console.error('❌ Error creating API key:', error.message);
    if (error.message?.includes('permission') || error.message?.includes('unauthorized')) {
      console.log('\n💡 This API key might not have permission to create keys.');
      console.log('   Try using the Resend dashboard instead: https://resend.com/api-keys');
    }
    process.exit(1);
  }
}

async function deleteApiKey(keyId: string) {
  try {
    console.log(`🗑️  Deleting API key: ${keyId}...\n`);
    await resend.apiKeys.remove(keyId);
    console.log('✅ API key deleted successfully');
  } catch (error: any) {
    console.error('❌ Error deleting API key:', error.message);
    process.exit(1);
  }
}

// Main execution
const command = process.argv[3] || process.env.RESEND_COMMAND || 'list';

switch (command) {
  case 'list':
    listApiKeys();
    break;
  case 'create:dev':
    createApiKey('Mikroi Mathites - Development');
    break;
  case 'create:prod':
    createApiKey('Mikroi Mathites - Production');
    break;
  case 'delete':
    const keyId = process.argv[4] || process.env.RESEND_KEY_ID;
    if (!keyId) {
      console.error('❌ Error: API key ID required for deletion');
      console.log('Usage: npm run resend:delete <key-id>');
      process.exit(1);
    }
    deleteApiKey(keyId);
    break;
  default:
    console.log('Available commands:');
    console.log('  list       - List all API keys');
    console.log('  create:dev - Create development API key');
    console.log('  create:prod - Create production API key');
    console.log('  delete     - Delete an API key (requires ID)');
}

