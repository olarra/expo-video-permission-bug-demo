import React, { useRef, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TouchableOpacity, Alert } from 'react-native';
import { VideoView, useVideoPlayer } from 'expo-video';

/**
 * IMPORTANT: This app demonstrates the expo-video FOREGROUND_SERVICE_MEDIA_PLAYBACK permission issue.
 * 
 * Configuration in app.json:
 * - supportsBackgroundPlayback: false
 * - supportsPictureInPicture: false
 * 
 * ISSUE: Despite explicitly disabling background playback features, the expo-video plugin
 * still adds the FOREGROUND_SERVICE_MEDIA_PLAYBACK permission to the Android manifest.
 * This causes issues with Google Play Console submissions as the permission is added
 * even when the app doesn't actually use background media playback functionality.
 * 
 * Expected behavior: When supportsBackgroundPlayback is false, the permission should NOT be added.
 * Actual behavior: The permission is added regardless of the configuration.
 */

export default function App() {
  const videoRef = useRef<VideoView>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  // Using a sample video URL - you can replace with any valid video URL
  const videoSource = 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4';

  const player = useVideoPlayer(videoSource, (player) => {
    player.loop = true;
    player.play();
    setIsPlaying(true);
  });

  const togglePlayPause = () => {
    if (isPlaying) {
      player.pause();
      setIsPlaying(false);
    } else {
      player.play();
      setIsPlaying(true);
    }
  };

  const showPermissionInfo = () => {
    Alert.alert(
      'Permission Issue',
      'This app is configured with:\n\n' +
      '• supportsBackgroundPlayback: false\n' +
      '• supportsPictureInPicture: false\n\n' +
      'However, expo-video still adds FOREGROUND_SERVICE_MEDIA_PLAYBACK permission to Android manifest.\n\n' +
      'Check the generated android/app/src/main/AndroidManifest.xml after building to see the unwanted permission.',
      [{ text: 'OK' }]
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Expo Video Permission Issue Demo</Text>
      
      <Text style={styles.description}>
        This app demonstrates that expo-video adds FOREGROUND_SERVICE_MEDIA_PLAYBACK 
        permission even when background playback is disabled.
      </Text>

      <View style={styles.videoContainer}>
        <VideoView
          ref={videoRef}
          style={styles.video}
          player={player}
          allowsFullscreen={false}
          allowsPictureInPicture={false}
        />
      </View>

      <View style={styles.controls}>
        <TouchableOpacity style={styles.button} onPress={togglePlayPause}>
          <Text style={styles.buttonText}>
            {isPlaying ? 'Pause' : 'Play'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.infoButton} onPress={showPermissionInfo}>
          <Text style={styles.buttonText}>Show Issue Info</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.configInfo}>
        <Text style={styles.configTitle}>App Configuration:</Text>
        <Text style={styles.configText}>• supportsBackgroundPlayback: false</Text>
        <Text style={styles.configText}>• supportsPictureInPicture: false</Text>
        <Text style={styles.issueText}>
          ⚠️ Yet FOREGROUND_SERVICE_MEDIA_PLAYBACK permission is still added!
        </Text>
      </View>

      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 50,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
    color: '#333',
  },
  description: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 20,
    color: '#666',
    lineHeight: 20,
  },
  videoContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  video: {
    width: 300,
    height: 200,
    backgroundColor: '#000',
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 15,
    marginBottom: 30,
  },
  button: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  infoButton: {
    backgroundColor: '#FF9500',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  configInfo: {
    backgroundColor: '#f8f8f8',
    padding: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  configTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  configText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  issueText: {
    fontSize: 14,
    color: '#FF3B30',
    fontWeight: '600',
    marginTop: 8,
  },
}); 