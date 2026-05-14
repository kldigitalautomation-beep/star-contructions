import { StyleSheet, Text, View } from 'react-native';
import { getStatusColors } from '../utils/format';
import { useAppTheme } from '../utils/themeContext';

interface StatusPillProps {
  status: string;
  size?: 'sm' | 'md';
}

export function StatusPill({ status, size = 'md' }: StatusPillProps) {
  const { theme } = useAppTheme();
  const colors = getStatusColors(status, theme);

  return (
    <View style={[styles.pill, size === 'sm' && styles.pillSm, { backgroundColor: colors.backgroundColor, borderColor: colors.borderColor }]}>
      <View style={[styles.dot, { backgroundColor: colors.textColor }]} />
      <Text style={[styles.text, size === 'sm' && styles.textSm, { color: colors.textColor }]}>{status}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
    borderWidth: 1,
  },
  pillSm: {
    paddingHorizontal: 7,
    paddingVertical: 3,
  },
  dot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
  },
  text: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.1,
  },
  textSm: {
    fontSize: 11,
  },
});