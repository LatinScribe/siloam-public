// utils/processImageAndAudio.ts

import * as FileSystem from 'expo-file-system';
import { Audio } from 'expo-av';
import { Buffer } from 'buffer';

// -----------------------------------------------------------------------------
// Environment variables or hard-coded values
// -----------------------------------------------------------------------------
const customAPIKey =
  "843789jjeejldkeJDdjejkflrWJerjklerfjrelfre9f9FSD5223432JKFLSLKJFSDSF&&&%@#$$SFDFD#$@@#^^$#%klfjfsdlklsf#%$$%";
const customAPIurl = process.env.EXPO_PUBLIC_CUSTOM_FILE_API_PATH;
const serverURL = process.env.EXPO_PUBLIC_SERVER_URL;
const customAPIOutputPath = process.env.EXPO_PUBLIC_CUSTOM_FILE_OUTPUT_PATH;

// -----------------------------------------------------------------------------
// 1) Convert local file → base64
// -----------------------------------------------------------------------------
async function fileUriToBase64(localUri: string): Promise<string> {
  return await FileSystem.readAsStringAsync(localUri, {
    encoding: FileSystem.EncodingType.Base64,
  });
}

// -----------------------------------------------------------------------------
// 2) Process the image: generate an image URL only.
//    (We no longer call the main server endpoint here.)
// -----------------------------------------------------------------------------
export async function processImageFromUri(photoUri: string): Promise<string> {
  // Convert the local photo file to base64.
  const base64Image = await fileUriToBase64(photoUri);

  // Upload to the custom file API endpoint to get a partial image URL.
  const generateUrlEndpoint = `${customAPIurl}/api/image-process/image-url-generate`;
  const generateUrlPayload = {
    image: base64Image,
    image_name: 'mobile-photo.jpg',
    customAPIKey: customAPIKey,
  };

  console.log('Generating image link via:', generateUrlEndpoint);
  const generateUrlResponse = await fetch(generateUrlEndpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(generateUrlPayload),
  });

  if (!generateUrlResponse.ok) {
    throw new Error(`Error generating image link. Status: ${generateUrlResponse.status}`);
  }

  const generateUrlData = await generateUrlResponse.json();
  const partialPath = generateUrlData?.result?.image_url;
  if (!partialPath) {
    throw new Error('No image_url returned from the file API.');
  }
  // Concatenate the output path to generate the full URL.
  const fullImageUrl = `${customAPIOutputPath}${partialPath}`;
  return fullImageUrl;
}

// -----------------------------------------------------------------------------
// 3) Transcribe audio using /api/audio/transcribe-audio
// -----------------------------------------------------------------------------
async function transcribeAudioFromUri(audioUri: string): Promise<string> {
  const base64Audio = await fileUriToBase64(audioUri);

  const transcribeEndpoint = `${serverURL}/api/audio/transcribe-audio`;
  console.log('Transcribing audio via:', transcribeEndpoint);

  const response = await fetch(transcribeEndpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ file: base64Audio }),
  });

  if (!response.ok) {
    throw new Error(`Audio transcription failed. Status: ${response.status}`);
  }

  const responseData = await response.json();
  const transcribedText = responseData?.text || 'No transcription returned';
  return transcribedText;
}

// -----------------------------------------------------------------------------
// 4) Combine the image URL and transcribed text via the final endpoint.
// -----------------------------------------------------------------------------
async function requestWithImageAndText(imageUrl: string, textRequest: string): Promise<string> {
  const endpoint = `${serverURL}/api/image-process/image`;
  console.log('Combining image URL & transcription via:', endpoint);
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      imageURL: imageUrl,
      request: textRequest,
    }),
  });

  if (!response.ok) {
    throw new Error(`Combining request failed. Status: ${response.status}`);
  }

  const data = await response.json();
  // Expecting the TTS text in data.result.message.content
  const finalText = data.response;
  return finalText;
}

// -----------------------------------------------------------------------------
// 5) TTS: Convert text to speech, write MP3 locally, and play it.
// -----------------------------------------------------------------------------
export async function speakText(text: string) {
  const ttsEndpoint = `${serverURL}/api/audio/generate-speech`;
  console.log('Generating speech from text via:', ttsEndpoint);

  const response = await fetch(ttsEndpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text, voice: 'alloy' }),
  });

  if (!response.ok) {
    throw new Error(`TTS generation failed. Status: ${response.status}`);
  }

  const arrayBuffer = await response.arrayBuffer();
  const base64Audio = Buffer.from(arrayBuffer).toString('base64');
  const fileUri = FileSystem.cacheDirectory + 'tts_temp.mp3';

  await FileSystem.writeAsStringAsync(fileUri, base64Audio, {
    encoding: FileSystem.EncodingType.Base64,
  });

  await Audio.setAudioModeAsync({
    allowsRecordingIOS: false,
    playsInSilentModeIOS: true,
    staysActiveInBackground: false,
  });

  await Audio.Sound.createAsync({ uri: fileUri }, { shouldPlay: true });
  console.log('TTS audio playback started...');
}

// -----------------------------------------------------------------------------
// MAIN Export: Chain all steps in one function
// -----------------------------------------------------------------------------
/**
 * 1. Generate an image URL from the local photo.
 * 2. Transcribe the local audio.
 * 3. Combine the image URL and transcribed text for further processing.
 * 4. Convert the final text to speech and play it.
 */
export async function processImageAndAudio(photoUri: string, audioUri: string) {
  try {
    // 1) Generate the image URL.
    const imageUrl = await processImageFromUri(photoUri);
    console.log('Image URL:', imageUrl);

    // 2) Transcribe the audio.
    const transcribedText = await transcribeAudioFromUri(audioUri);
    console.log('Transcribed Audio:', transcribedText);

    // 3) Combine the image URL and transcription.
    const finalText = await requestWithImageAndText(imageUrl, transcribedText);
    console.log('Server returned final text:', finalText);

    // 4) Generate speech from the final text.
    await speakText(finalText);
  } catch (error) {
    console.error('Error in processImageAndAudio:', error);
    throw error;
  }
}
