#!/bin/bash

# Setup GitHub Secrets for MikroiMathites Deployment
# Run this script to add all required secrets to GitHub

echo "🔑 Setting up GitHub secrets for deployment..."

# Check if GitHub CLI is installed
if ! command -v gh &> /dev/null; then
    echo "❌ GitHub CLI (gh) is not installed."
    echo "📥 Install it from: https://cli.github.com/"
    echo ""
    echo "📋 Manual setup instructions:"
    echo "1. Go to: https://github.com/xFinVi/mikroimathites_new/settings/secrets/actions"
    echo "2. Add these secrets:"
    echo ""
    echo "VPS_SSH_PRIVATE_KEY:"
    cat ~/.ssh/mikroimathites_deploy
    echo ""
    echo "VPS_HOST: 62.72.16.175"
    echo "VPS_USER: root"
    echo "VPS_APP_PATH: /opt/mikroimathites/app"
    exit 1
fi

# Check if authenticated
if ! gh auth status &> /dev/null; then
    echo "❌ Not authenticated with GitHub CLI."
    echo "🔐 Run: gh auth login"
    exit 1
fi

echo "✅ GitHub CLI authenticated"

# Get the private key content
PRIVATE_KEY=$(cat ~/.ssh/mikroimathites_deploy)

# Add secrets
echo "📝 Adding VPS_SSH_PRIVATE_KEY..."
gh secret set VPS_SSH_PRIVATE_KEY --body "$PRIVATE_KEY"

echo "📝 Adding VPS_HOST..."
gh secret set VPS_HOST --body "62.72.16.175"

echo "📝 Adding VPS_USER..."
gh secret set VPS_USER --body "root"

echo "📝 Adding VPS_APP_PATH..."
gh secret set VPS_APP_PATH --body "/opt/mikroimathites/app"

echo "✅ All secrets added successfully!"
echo "🚀 Your deployment pipeline is now ready!"
echo ""
echo "📋 Next steps:"
echo "1. Push changes to develop branch"
echo "2. Check GitHub Actions tab for deployment status"