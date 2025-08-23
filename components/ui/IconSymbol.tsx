import { Ionicons } from '@expo/vector-icons';
import { StyleProp, TextStyle } from 'react-native';

interface IconSymbolProps {
  name: keyof typeof Ionicons.glyphMap;
  size: number;
  color: string;
  style?: StyleProp<TextStyle>;
}

export function IconSymbol({ name, size, color, style }: IconSymbolProps) {
  return <Ionicons name={name} size={size} color={color} style={style} />;
} 