import { StyleSheet, Text, View } from 'react-native';
import { theme } from '../styles/theme';

interface StatCardProps {
  label: string;
  value: string | number;
  hint?: string;
  accentColor?: string;
}

export function StatCard({ label, value, hint, accentColor }: StatCardProps) {
  const accent = accentColor ?? theme.brand.navy;

  return (
    <View style={styles.card}>
      <View style={[styles.topBar, { backgroundColor: accent }]} />
      <View style={styles.body}>
        <Text style={[styles.value, { color: accent }]} numberOfLines={1}>{value}</Text>
        <Text style={styles.label} numberOfLines={1}>{label}</Text>
        {hint ? <Text style={styles.hint} numberOfLines={1}>{hint}</Text> : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: '46%',
    minWidth: 0,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    borderColor: theme.card.border,
    overflow: 'hidden',
    ...theme.card.shadow.sm,
  },
  topBar: {
    height: 3,
    width: '100%',
  },
  body: {
    padding: theme.spacing.md,
    paddingTop: theme.spacing.sm + 2,
    gap: 3,
  },
  label: {
    fontSize: 10,
    color: theme.colors.textMuted,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  value: {
    fontSize: 24,
    fontWeight: '800',
    letterSpacing: -0.6,
    lineHeight: 28,
  },
  hint: {
    fontSize: theme.typography.micro,
    color: theme.colors.textLight,
    fontWeight: '500',
    marginTop: 1,
  },
});