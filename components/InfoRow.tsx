import { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { type AppTheme, useAppTheme } from '../utils/themeContext';

interface InfoRowProps {
  label: string;
  value: string;
}

export function InfoRow({ label, value }: InfoRowProps) {
  const { theme } = useAppTheme();
  const styles = useMemo(() => makeStyles(theme), [theme]);
  return (
    <View style={styles.row}>
      <Text style={styles.label} numberOfLines={1}>{label}</Text>
      <Text style={styles.value} numberOfLines={2}>{value}</Text>
    </View>
  );
}

function makeStyles(theme: AppTheme) { return StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: theme.spacing.sm,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.divider,
  },
  label: {
    flex: 1,
    fontSize: theme.typography.small,
    color: theme.colors.textMuted,
    fontWeight: '600',
  },
  value: {
    flex: 1.5,
    fontSize: theme.typography.body,
    color: theme.colors.text,
    fontWeight: '700',
    textAlign: 'right',
  },
}); }