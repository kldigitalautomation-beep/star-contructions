import { StyleSheet, Text, View } from 'react-native';
import { theme } from '../styles/theme';

interface ProgressBarProps {
  label: string;
  value: number;
  color?: string;
}

export function ProgressBar({ label, value, color }: ProgressBarProps) {
  const safeValue = Math.max(0, Math.min(100, value));
  const barColor = color ?? (safeValue >= 80 ? theme.colors.success : safeValue >= 40 ? theme.colors.primary : theme.colors.warning);

  return (
    <View style={styles.wrapper}>
      <View style={styles.row}>
        <Text style={styles.label} numberOfLines={1}>{label}</Text>
        <Text style={[styles.value, { color: barColor }]}>{safeValue}%</Text>
      </View>
      <View style={styles.track}>
        <View style={[styles.fill, { width: `${safeValue}%`, backgroundColor: barColor }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    gap: 8,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  label: {
    flex: 1,
    fontSize: theme.typography.small,
    color: theme.colors.textSecondary,
    fontWeight: '600',
    marginRight: 8,
  },
  value: {
    fontSize: theme.typography.small,
    fontWeight: '800',
    minWidth: 36,
    textAlign: 'right',
  },
  track: {
    height: 8,
    borderRadius: theme.radius.full,
    backgroundColor: theme.colors.backgroundAlt,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: theme.radius.full,
  },
});