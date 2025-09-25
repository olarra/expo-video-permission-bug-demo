#!/bin/bash

echo "🔍 Checking for FOREGROUND_SERVICE_MEDIA_PLAYBACK permission in Android manifest..."
echo ""

# Check if android directory exists
if [ ! -d "android" ]; then
    echo "❌ Android project not found. Run 'npx expo prebuild --platform android' first."
    exit 1
fi

# Check if AndroidManifest.xml exists
MANIFEST_PATH="android/app/src/main/AndroidManifest.xml"
if [ ! -f "$MANIFEST_PATH" ]; then
    echo "❌ AndroidManifest.xml not found at $MANIFEST_PATH"
    exit 1
fi

echo "📄 Checking $MANIFEST_PATH..."
echo ""

# Search for the permission
if grep -q "FOREGROUND_SERVICE_MEDIA_PLAYBACK" "$MANIFEST_PATH"; then
    echo "⚠️  ISSUE CONFIRMED: FOREGROUND_SERVICE_MEDIA_PLAYBACK permission found!"
    echo ""
    echo "📋 Permission line:"
    grep "FOREGROUND_SERVICE_MEDIA_PLAYBACK" "$MANIFEST_PATH"
    echo ""
    echo "🔧 This permission was added despite having:"
    echo "   • supportsBackgroundPlayback: false"
    echo "   • supportsPictureInPicture: false"
    echo ""
    echo "💡 This demonstrates the expo-video plugin bug."
else
    echo "✅ FOREGROUND_SERVICE_MEDIA_PLAYBACK permission not found."
    echo "   This would be the expected behavior when background playback is disabled."
fi

echo ""
echo "📱 To reproduce this issue:"
echo "   1. npm install"
echo "   2. npx expo prebuild --platform android"
echo "   3. ./check-permissions.sh" 