import { Text as DefaultText, View as DefaultView, useColorScheme } from 'react-native';

import { Colors } from '@/constants/Colors';

export type TextProps = DefaultText['props'] & {
  type?: 'title' | 'subtitle' | 'default' | 'defaultSemiBold';
};

export function ThemedText(props: TextProps) {
  const { style, type = 'default', ...otherProps } = props;
  const colorScheme = useColorScheme();
  const color = Colors.light.text;

  const getTextStyle = () => {
    switch (type) {
      case 'title':
        return { fontSize: 24, fontWeight: 'bold' as const };
      case 'subtitle':
        return { fontSize: 18, fontWeight: '600' as const };
      case 'defaultSemiBold':
        return { fontSize: 16, fontWeight: '600' as const };
      default:
        return { fontSize: 16 };
    }
  };

  return <DefaultText style={[{ color }, getTextStyle(), style]} {...otherProps} />;
}

export type ViewProps = DefaultView['props'];

export function ThemedView(props: ViewProps) {
  const { style, ...otherProps } = props;
  const colorScheme = useColorScheme();
  const backgroundColor = Colors.light.background;

  return <DefaultView style={[{ backgroundColor }, style]} {...otherProps} />;
} 