import { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
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
  const BAR_COLORS: [string, string][] = [
    [theme.isDark ? '#4B84F0' : theme.colors.primary, theme.isDark ? '#2252B8' : theme.colors.primaryDark],
    [theme.colors.success, '#00D070'],
    [theme.brand.gold, theme.brand.orange],
    [theme.colors.info, theme.colors.primary],
    ['#9B59E8', '#7C3AED'],
    ['#E84393', '#DB2777'],
  ];
  const highest = Math.max(...items.map((item) => item.value), 1);

  return (
    <View style={styles.chart}>
      {items.map((item, index) => {
        const colors = BAR_COLORS[index % BAR_COLORS.length];
        const heightPct = Math.max((item.value / highest) * 100, 8);

        return (
          <View key={item.label} style={styles.column}>
            <Text style={[styles.amount, { color: colors[0] }]}>{item.value}</Text>
            <View style={styles.barWrapper}>
              <LinearGradient
                colors={colors}
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 1 }}
                style={[styles.bar, { height: `${heightPct}%` }]}
              >
                <View style={styles.barShine} />
              </LinearGradient>
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
    backgroundColor: theme.isDark ? 'rgba(255,255,255,0.07)' : theme.colors.backgroundAlt,
    borderRadius: theme.radius.md,
    overflow: 'hidden',
  },
  bar: {
    width: '100%',
    borderRadius: theme.radius.md,
    overflow: 'hidden',
  },
  barShine: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: '50%',
    bottom: 0,
    backgroundColor: 'rgba(255,255,255,0.14)',
    borderTopLeftRadius: theme.radius.md,
    borderBottomLeftRadius: theme.radius.md,
  },
  amount: {
    fontSize: theme.typography.micro,
    fontWeight: '800',
  },
  label: {
    fontSize: theme.typography.micro,
    color: theme.colors.textMuted,
    textAlign: 'center',
    fontWeight: '700',
  },
}); }

interface BarItem {
  label: string;
  value: number;
}

interface SimpleBarChartProps {
  items: BarItem[];
}