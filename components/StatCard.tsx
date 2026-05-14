import { useMemo } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
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
  const softBg = `${accent}${theme.isDark ? '22' : '12'}`;
  const borderColor = `${accent}${theme.isDark ? '28' : '18'}`;

  return (
    <View style={[styles.card, { borderColor }]}>
      <LinearGradient
        colors={[`${accent}${theme.isDark ? '1A' : '0D'}`, theme.colors.surface]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFill}
      />
      {/* Top accent bar */}
      <View style={[styles.topBar, { backgroundColor: accent }]} />
      <View style={styles.body}>
        {/* Accent icon circle */}
        <View style={[styles.dotWrap, { backgroundColor: softBg, borderColor: `${accent}${theme.isDark ? '44' : '28'}` }]}>
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
    borderRadius: theme.radius.xl,
    borderWidth: 1,
    overflow: 'hidden',
    ...theme.card.shadow.md,
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
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  value: {
    fontSize: 28,
    fontWeight: '900',
    letterSpacing: -1,
    lineHeight: 32,
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

interface StatCardProps {
  label: string;
  value: string | number;
  hint?: string;
  accentColor?: string;
}