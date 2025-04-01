// utils/weather.ts
import * as Location from 'expo-location';
import { speakText } from '@/utils/submitAudioImage';

const serverURL = process.env.EXPO_PUBLIC_SERVER_URL;

export async function fetchWeatherAndSpeak() {

  const { status } = await Location.requestForegroundPermissionsAsync();
  if (status !== 'granted') {
    alert('Permission to access location was denied');
    return;
  }

  const location = await Location.getCurrentPositionAsync({});
  const { latitude, longitude } = location.coords;
  console.log(`Location: ${latitude}, ${longitude}`);

  try {
    const response = await fetch(`${serverURL}/api/weather/weather`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ latitude, longitude }),
    });

    if (!response.ok) {
      throw new Error(`Error fetching weather. Status: ${response.status}`);
    }

    const data = await response.json();
    const weatherText = data.text;

    console.log('Weather text:', weatherText);

    await speakText(weatherText);
  } catch (error) {
    console.error('Error in fetchWeatherAndSpeak:', error);
  }
}
