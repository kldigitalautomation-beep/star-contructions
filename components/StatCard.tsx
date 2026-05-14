import { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { type AppTheme, useAppTheme } from '../utils/themeContext';

interface StatCardProps {
  label: string;
  value: string | number;
  hint?: string;
  accentColor?: string;
}

export function StatCard({ label, value, hint, accentColor }: StatCardProps) {
  const { theme } = useAppTheme();
  const styles = useMemo(() => makeStyles(theme), [theme]);
  const accent = accentColor ?? theme.colors.primary;
  const softBg = `${accent}18`;
  const softBorder = `${accent}28`;

  return (
    <View style={[styles.card, { borderColor: theme.isDark ? `${accent}22` : theme.card.border }]}>
      {/* Top accent bar */}
      <View style={[styles.topBar, { backgroundColor: accent }]} />
      <View style={styles.body}>
        {/* Accent icon dot */}
        <View style={[styles.dotWrap, { backgroundColor: softBg, borderColor: softBorder }]}>
          <View style={[styles.dot, { backgroundColor: accent }]} />
        </View>
        <Text style={[styles.value, { color: accent }]} numberOfLines={1}>{value}</Text>
        <Text style={styles.label} numberOfLines={1}>{label}</Text>
        {hint ? <Text style={styles.hint} numberOfLines={1}>{hint}</Text> : null}
      </View>
    </View>
  );
}

function makeStyles(theme: AppTheme) { return StyleSheet.create({
  card: {
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: '46%',
    minWidth: 0,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    overflow: 'hidden',
    ...theme.card.shadow.sm,
  },
  topBar: {
    height: 4,
    width: '100%',
  },
  body: {
    padding: theme.spacing.md,
    paddingTop: theme.spacing.sm + 4,
    gap: 4,
  },
  dotWrap: {
    width: 26,
    height: 26,
    borderRadius: 13,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 2,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  value: {
    fontSize: 26,
    fontWeight: '800',
    letterSpacing: -0.8,
    lineHeight: 30,
  },
  label: {
    fontSize: 10,
    color: theme.colors.textMuted,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  hint: {
    fontSize: theme.typography.micro,
    color: theme.colors.textLight,
    fontWeight: '500',
  },
}); }