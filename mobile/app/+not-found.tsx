import { Link, Stack } from 'expo-router';
import { StyleSheet } from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Redirect } from 'expo-router';

export default function NotFoundScreen() {
  return <Redirect href="(tabs)/CameraHoldRel" />;
}