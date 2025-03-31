// utils/dangerEndpoint.ts
import { Audio } from 'expo-av';
import * as FileSystem from 'expo-file-system';
import { processImageFromUri, speakText } from '@/utils/submitAudioImage';

const endpoint = `${process.env.EXPO_PUBLIC_SERVER_URL}/api/image-process/image`;


/**
 * Upload an image to the "danger detection" endpoint.
 * If the backend indicates danger===true, we play TTS audio.
 *
 * @param photoUri The local URI of the photo taken by the camera
 */
export async function takeAutoPhoto(photoUri: string): Promise<void> {
  const imageURL = await processImageFromUri(photoUri);
  console.log('Converted to image URL');
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      imageURL: imageURL,
      request: "",
    }),
  });

  if (!response.ok) {
    throw new Error(`Combining request failed. Status: ${response.status}`);
  }

  const data = await response.json();
  // Expecting the TTS text in data.result.message.content
  const finalText = data.response;
  await speakText(finalText);
}