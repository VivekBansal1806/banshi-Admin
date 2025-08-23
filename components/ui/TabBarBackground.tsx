import { BlurView } from 'expo-blur';
import { Platform, StyleSheet } from 'react-native';

export default function TabBarBackground() {
  if (Platform.OS === 'ios') {
    return <BlurView style={[StyleSheet.absoluteFill, styles.rounded]} intensity={80} />;
  }
  return null;
} 

const styles = StyleSheet.create({
  rounded: {
    borderRadius: 28,
  },
});