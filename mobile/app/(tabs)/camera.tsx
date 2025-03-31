import { CameraView, useCameraPermissions } from 'expo-camera';
import { Audio } from 'expo-av';
import { proccessImageFile } from '@/utils/imageInterface';
import * as FileSystem from 'expo-file-system';
import axios from 'axios';
import { Buffer } from 'buffer';
import { useEffect, useRef, useState } from 'react';
import { Button, StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SERVER_URL = process.env.EXPO_PUBLIC_SERVER_URL;
export default function MobileCamera() {
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef<CameraView>(null);
  const recordingRef = useRef<Audio.Recording | null>(null);
  const [recording, setRecording] = useState(false);
  const [transcription, setTranscription] = useState<string | null>(null);
  const [isFirstTime, setIsFirstTime] = useState<boolean>(false);

  // Check for first time user
  useEffect(() => {
    const checkFirstTimeUser = async () => {
      const firstTime = await AsyncStorage.getItem('isFirstTime');
      if (!firstTime) {
        setIsFirstTime(true);
        await AsyncStorage.setItem('isFirstTime', 'false');
      }
    };

    checkFirstTimeUser();
  }, []);

  // Introduce if it is the first time
  useEffect(() => {
    if (isFirstTime) {
      const introductionText = 'Welcome to the app! To use it, you can take a photo or hold the button to record a voice note. The app will describe your surroundings and answer any questions you have. Give it a try!';
      speakWithOpenAI(introductionText);
    }
  }, [isFirstTime]);

  if (!permission) return <View />;
  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>We need your permission to show the camera</Text>
        <Button onPress={requestPermission} title="Grant permission" />
      </View>
    );
  }

  async function handleTakePhoto() {
    if (cameraRef.current) {
      try {
        const options = {
          quality: 0.1,
          base64: true,
          exif: false,
        };
        const photo = await cameraRef.current.takePictureAsync(options);
        if (photo) {
          await uploadToBackend(photo.uri);
        }

      } catch (error) {
        console.error('Error taking photo:', error);
      }
    }
  }

  async function uploadToBackend(photoUri: string) {
    try{
      console.log('image uri:', photoUri);
      const response = await fetch(photoUri);
      const blob = await response.blob();
      const file = new File([blob], "image.jpg", { type: "image/jpeg" });
      console.log(file);
      const result = await proccessImageFile(file);
      console.log(typeof(result))
      if (result) {
        speakWithOpenAI(result); 
      }
    } catch (error) {
      console.error('Upload error:', error);
    }
  }

  async function speakWithOpenAI(text: string) {
    try {
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false, 
        playsInSilentModeIOS: true,
        staysActiveInBackground: false,
      });

      const ttsEndpoint = `${SERVER_URL}/api/audio/generate-speech`;
      const response = await fetch(ttsEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, voice: 'alloy' }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate speech');
      }
      const arrayBuffer = await response.arrayBuffer();
      const base64Audio = Buffer.from(arrayBuffer).toString('base64');
      const fileUri = FileSystem.cacheDirectory + 'tts_temp.mp3';

      await FileSystem.writeAsStringAsync(fileUri, base64Audio, {
        encoding: FileSystem.EncodingType.Base64,
      });

      const { sound } = await Audio.Sound.createAsync(
        { uri: fileUri },
        { shouldPlay: true }
      );

    } catch (error) {
      console.error('Error playing audio:', error);
    }
  }

  async function startRecording() {
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

  async function stopRecording() {
    try {
      if (!recordingRef.current) return;
      setRecording(false);

      await recordingRef.current.stopAndUnloadAsync();
      const uri = recordingRef.current.getURI();
      console.log('Recording stopped. File stored at:', uri);

      if (uri) {
        transcribeAudio(uri);
      }
    } catch (error) {
      console.error('Failed to stop recording:', error);
    }
  }

  async function transcribeAudio(uri: string) {
    try {

      const audioBuffer = await FileSystem.readAsStringAsync(uri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      const audioPostPayload = {"file": audioBuffer};
      const transcribeEndpoint = `${SERVER_URL}/api/audio/transcribe-audio`;
      const response = await axios.post(transcribeEndpoint, audioPostPayload);
      const transcribedText = response.data.text;
      setTranscription(transcribedText);
      console.log('Transcribed text:', transcribedText);
    } catch (error) {
      console.error('Error transcribing audio:', error);
      setTranscription('Error transcribing audio');
    }
  }

  return (
    <View style={styles.container}>
      <CameraView style={styles.camera} ref={cameraRef} facing="back">
        <TouchableOpacity
          style={styles.fullScreenTouchable}
          onPressIn={startRecording}
          onPressOut={stopRecording}
        >
          <View style={styles.overlay}>
            <Text style={styles.overlayText}>
              {recording ? 'Recording...' : 'Hold anywhere to record'}
            </Text>
          </View>
        </TouchableOpacity>

        <View style={styles.bottomContainer}>
          <TouchableOpacity
            style={styles.button}
            onPress={handleTakePhoto}
          >
            <Text style={styles.buttonText}>Take Photo</Text>
          </TouchableOpacity>
        </View>

        {transcription && (
          <Text style={styles.transcription}>
            Transcription: {transcription}
          </Text>
        )}
      </CameraView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center' },
  message: { textAlign: 'center', paddingBottom: 10 },
  camera: { flex: 1 },

  fullScreenTouchable: {
    flex: 1,
  },

  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.7)', 
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

  transcription: {
    position: 'absolute',
    bottom: 160,
    alignSelf: 'center',
    backgroundColor: 'white',
    padding: 8,
    borderRadius: 4,
    fontSize: 16,
    color: 'black',
    textAlign: 'center',
  },
});