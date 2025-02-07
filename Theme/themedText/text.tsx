import { Text, StyleSheet, useColorScheme } from 'react-native';
import { Colors } from '@/constants/Colors';
import { ReactNode } from 'react';

interface ThemedTextProps {
  children?: string | ReactNode;
  style?: any;
}

export default function ThemedText({ children, style }: ThemedTextProps) {
  const colorScheme = useColorScheme();

  const themeTextStyle = colorScheme === 'light' ? styles.lightThemeText : styles.darkThemeText;

  return (
    <Text style={[themeTextStyle, style]}>{children}</Text>
  );
}

const styles = StyleSheet.create({
  lightThemeText: {
    color: Colors.text.textDark,
  },
  darkThemeText: {
    color: Colors.text.textLight,
  },
});
