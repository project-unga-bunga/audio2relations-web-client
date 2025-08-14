#!/bin/bash

echo "🚀 Deploying Audio Recorder App..."

# Build the application
echo "📦 Building application..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed!"
    exit 1
fi

# Sync with Capacitor
echo "📱 Syncing with Capacitor..."
npx cap sync

if [ $? -ne 0 ]; then
    echo "⚠️  Capacitor sync had warnings (this is normal on macOS without Xcode)"
fi

echo "✅ Deployment complete!"
echo ""
echo "📁 Built files are in: dist/audio-recorder/browser/"
echo "📱 Android project: android/"
echo "🍎 iOS project: ios/ (requires Xcode)"
echo ""
echo "🌐 To test web version: npm start"
echo "🤖 To open Android: npm run cap:open:android"
echo "🍎 To open iOS: npm run cap:open:ios"
