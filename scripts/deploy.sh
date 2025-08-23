#!/bin/bash

# AztlanFi Deployment Script
# For Mobil3 Hackathon

echo "🚀 Deploying AztlanFi to Vercel..."

# Build the project
echo "📦 Building project..."
npm run build

# Deploy to Vercel
echo "🌐 Deploying to Vercel..."
vercel --prod

echo "✅ Deployment complete!"
echo "🔗 Your app is live at: https://aztlanfi.vercel.app"
echo "📱 PWA ready for mobile installation"
echo "⚡ Powered by Monad blockchain"
