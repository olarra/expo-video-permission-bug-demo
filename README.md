# Expo Video FOREGROUND_SERVICE_MEDIA_PLAYBACK Permission Issue Demo

This minimal Expo React Native app demonstrates a permission issue with the `expo-video` package where the `FOREGROUND_SERVICE_MEDIA_PLAYBACK` permission is added to the Android manifest even when background playback features are explicitly disabled. 

**To verify this issue, reviewers must build the .aab bundle and manually inspect the extracted AndroidManifest.xml file.**

## The Issue

Despite configuring the expo-video plugin with:
- `supportsBackgroundPlayback: false`
- `supportsPictureInPicture: false`

The plugin still adds the `FOREGROUND_SERVICE_MEDIA_PLAYBACK` permission to the Android manifest, which can cause issues with Google Play Console submissions.

## Configuration

### app.json
```json
{
  "expo": {
    "plugins": [
      [
        "expo-video",
        {
          "supportsBackgroundPlayback": false,
          "supportsPictureInPicture": false
        }
      ]
    ]
  }
}
```

### package.json Dependencies
```json
{
  "dependencies": {
    "expo": "~54.0.10",
    "expo-status-bar": "~3.0.8",
    "expo-video": "~2.1.0",
    "react": "19.1.0",
    "react-native": "0.81.4"
  }
}
```

## How to Reproduce the Issue

### Build .aab Bundle and Check Manifest

1. Install dependencies:
   ```bash
   npm install --legacy-peer-deps
   ```

2. Install EAS CLI:
   ```bash
   npm install -g eas-cli
   ```

3. Login to Expo:
   ```bash
   eas login
   ```

4. Configure the project:
   ```bash
   eas build:configure
   ```

5. Build Android App Bundle (.aab):
   ```bash
   npm run build:android:production
   ```

6. **Download the .aab file** from the EAS build dashboard

7. **Extract and inspect the manifest manually:**
   - Rename the `.aab` file to `.zip`
   - Extract the contents
   - Navigate to `base/manifest/AndroidManifest.xml`
   - Open the file and search for `FOREGROUND_SERVICE_MEDIA_PLAYBACK`

8. **Verify the issue:** You will find this permission in the manifest:
   ```xml
   <uses-permission android:name="android.permission.FOREGROUND_SERVICE_MEDIA_PLAYBACK" />
   ```

### Alternative: Local Build Method

1. Generate Android project locally:
   ```bash
   npx expo prebuild --platform android
   ```

2. Build the bundle locally:
   ```bash
   cd android && ./gradlew bundleRelease
   ```

3. Find the .aab file in `android/app/build/outputs/bundle/release/`

4. Extract and inspect the manifest as described above

## Expected vs Actual Behavior

**Expected:** When `supportsBackgroundPlayback` is set to `false`, the `FOREGROUND_SERVICE_MEDIA_PLAYBACK` permission should NOT be added to the Android manifest.

**Actual:** The permission is added regardless of the configuration. This can be verified by:
1. Building the .aab bundle using EAS or local Gradle build
2. Extracting the .aab file (rename to .zip and unzip)
3. Manually inspecting `base/manifest/AndroidManifest.xml`
4. Finding the unwanted permission in the manifest

## App Features

This demo app includes:
- Basic video playback using expo-video
- Simple play/pause controls
- Information dialog explaining the issue
- Visual indication of the configuration vs actual behavior

## Running the App

```bash
# Install dependencies (required first time)
npm install --legacy-peer-deps

# Start the development server
npm start

# Run on Android
npm run android

# Run on iOS
npm run ios
```

## Building for Production

```bash
# Build Android App Bundle (.aab) for Google Play Store
npm run build:android:production

# Build APK for testing
npm run build:android:preview

# Build for any platform
npm run build:android
```

## Impact

This issue affects developers who:
1. Want to use expo-video for simple video playback without background features
2. Need to submit their apps to Google Play Console
3. Want to avoid unnecessary permissions in their app manifest

The unwanted permission can lead to:
- Additional review requirements from Google Play Console
- Potential app rejections
- User privacy concerns about unnecessary permissions 