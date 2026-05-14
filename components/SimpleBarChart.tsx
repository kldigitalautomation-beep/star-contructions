import { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { type AppTheme, useAppTheme } from '../utils/themeContext';

interface BarItem {
  label: string;
  value: number;
}

interface SimpleBarChartProps {
  items: BarItem[];
}

export function SimpleBarChart({ items }: SimpleBarChartProps) {
  const { theme } = useAppTheme();
  const styles = useMemo(() => makeStyles(theme), [theme]);
  const BAR_COLORS = [
    theme.colors.primary,
    theme.colors.success,
    theme.brand.gold,
    theme.colors.info,
    '#7C3AED',
    '#DB2777',
  ];
  const highest = Math.max(...items.map((item) => item.value), 1);

  return (
    <View style={styles.chart}>
      {items.map((item, index) => {
        const barColor = BAR_COLORS[index % BAR_COLORS.length];
        const heightPct = Math.max((item.value / highest) * 100, 6);

        return (
          <View key={item.label} style={styles.column}>
            <Text style={[styles.amount, { color: barColor }]}>{item.value}</Text>
            <View style={styles.barWrapper}>
              <View style={[styles.bar, { height: `${heightPct}%`, backgroundColor: barColor }]} />
            </View>
            <Text style={styles.label} numberOfLines={1}>{item.label}</Text>
          </View>
        );
      })}
    </View>
  );
}

function makeStyles(theme: AppTheme) { return StyleSheet.create({
  chart: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    gap: 8,
    height: 180,
  },
  column: {
    flex: 1,
    alignItems: 'center',
    gap: 5,
  },
  barWrapper: {
    flex: 1,
    width: '100%',
    justifyContent: 'flex-end',
    backgroundColor: theme.isDark ? 'rgba(255,255,255,0.08)' : theme.colors.backgroundAlt,
    borderRadius: theme.radius.sm,
    overflow: 'hidden',
  },
  bar: {
    width: '100%',
    borderRadius: theme.radius.sm,
  },
  amount: {
    fontSize: theme.typography.micro,
    fontWeight: '800',
    color: theme.colors.textSecondary,
  },
  label: {
    fontSize: theme.typography.micro,
    color: theme.colors.textMuted,
    textAlign: 'center',
    fontWeight: '700',
  },
}); }