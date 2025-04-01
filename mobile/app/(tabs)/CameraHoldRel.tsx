import { CameraView, useCameraPermissions } from 'expo-camera';
import { Audio } from 'expo-av';
import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Button } from 'react-native';
import { processImageAndAudio } from '@/utils/submitAudioImage';
import { takeAutoPhoto } from '@/utils/autoPhoto';
import { fetchWeatherAndSpeak } from '@/utils/weather';

export default function CameraHoldRel() {
  const [camPermission, requestCamPermission] = useCameraPermissions();
  const cameraRef = useRef<CameraView>(null);

  const recordingRef = useRef<Audio.Recording | null>(null);
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [recording, setRecording] = useState<boolean>(false);
  const [message, setMessage] = useState<string | null>(null);
  const [autoCaptureActive, setAutoCaptureActive] = useState<boolean>(true);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (autoCaptureActive) {
      startAutoCapture();
    } else {
      stopAutoCapture();
    }
    return () => {
      stopAutoCapture();
    };
  }, [autoCaptureActive]);

  if (!camPermission) {
    return <Text>Loading permissions...</Text>;
  }
  if (!camPermission.granted) {
    return (
      <View>
        <Text>We need camera permission</Text>
        <Button onPress={requestCamPermission} title="Grant" />
      </View>
    );
  }

  function startAutoCapture() {
    console.log('Starting auto-capture every 30s...');
    handleAutoPhoto();
    intervalRef.current = setInterval(() => {
      handleAutoPhoto();
    }, 100000);
  }

  function stopAutoCapture() {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
      console.log('Stopped auto-capture.');
    }
  }

  async function handleAutoPhoto() {
    if (!cameraRef.current) return;
    console.log('Auto-capturing photo...');
    try {
      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.1,
        base64: false,
        exif: false,
      });
      if (photo?.uri) {
        console.log('Auto photo captured:', photo.uri);
        await takeAutoPhoto(photo.uri);
      }
    } catch (error) {
      console.error('Auto-capture error:', error);
    }
  }

  async function capturePhoto() {
    if (cameraRef.current) {
      try {
        const photo = await cameraRef.current.takePictureAsync({
          quality: 0.1,
          base64: false,
          exif: false,
        });
        if (photo?.uri) {
          setPhotoUri(photo.uri);
          console.log('Photo captured:', photo.uri);
        }
      } catch (error) {
        console.error('Error taking photo:', error);
      }
    }
  }

  async function startAudioRecording() {
    try {
      const { granted } = await Audio.requestPermissionsAsync();
      if (!granted) {
        console.warn('Microphone permission not granted');
        return;
      }
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
        staysActiveInBackground: false,
      });

      if (recordingRef.current) {
        console.warn('Already recording. Skipping new start...');
        return;
      }

      const recording = new Audio.Recording();
      await recording.prepareToRecordAsync(Audio.RecordingOptionsPresets.HIGH_QUALITY);
      await recording.startAsync();

      recordingRef.current = recording;
      setRecording(true);
      console.log('Recording started...');
    } catch (error) {
      console.error('Failed to start recording:', error);
    }
  }

  async function stopAudioRecordingAndUpload() {
    try {
      if (!recordingRef.current) return;
      setRecording(false);

      await recordingRef.current.stopAndUnloadAsync();
      const audioUri = recordingRef.current.getURI() || '';
      console.log('Recording stopped. File stored at:', audioUri);

      recordingRef.current = null;

      if (photoUri && audioUri) {
        setMessage('Sending image+audio to backend...');
        await processImageAndAudio(photoUri, audioUri);
        setMessage('Playback started!');
      } else {
        console.warn('Missing photoURI or audioURI.');
      }
    } catch (error) {
      console.error('Failed to stop recording or upload:', error);
      setMessage(`Error: ${String(error)}`);
    }
  }

  async function handlePressIn() {
    await capturePhoto();
    await startAudioRecording();
  }

  async function handlePressOut() {
    await stopAudioRecordingAndUpload();
  }

  async function handleWeather() {
    console.log('Weather button pressed, fetching weather...');
    await fetchWeatherAndSpeak();
  }

  return (
    <View style={styles.container}>
      <CameraView ref={cameraRef} style={styles.camera} facing="back">
        <TouchableOpacity
          style={styles.fullScreenTouchable}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
        >
          <View style={styles.overlay}>
            <Text style={styles.overlayText}>
              {recording ? 'Release to Stop' : 'Hold anywhere to capture & record'}
            </Text>
          </View>
        </TouchableOpacity>

        <View style={styles.bottomContainer}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              if (autoCaptureActive) {
                stopAutoCapture();
                setAutoCaptureActive(false);
              } else {
                setAutoCaptureActive(true);
              }
            }}
          >
            <Text style={styles.buttonText}>
              {autoCaptureActive ? 'Stop Auto-Capture' : 'Start Auto-Capture'}
            </Text>
          </TouchableOpacity>
          {/* Weather Button */}
          <Button title="Get Weather" onPress={handleWeather} />
          {message && <Text style={styles.feedback}>{message}</Text>}
        </View>
      </CameraView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  camera: { flex: 1 },
  fullScreenTouchable: { flex: 1 },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlayText: {
    color: '#fff',
    fontSize: 64,
    fontWeight: 'bold',
    textAlign: 'center',
    marginHorizontal: 20,
  },
  bottomContainer: {
    position: 'absolute',
    bottom: 100,
    width: '100%',
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#007AFF',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginTop: 10,
    width: '80%',
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  feedback: {
    color: '#000',
    fontSize: 16,
    marginTop: 10,
    paddingHorizontal: 20,
    textAlign: 'center',
  },
});
