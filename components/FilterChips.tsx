import { useMemo } from 'react';
import { Pressable, ScrollView, StyleSheet, Text } from 'react-native';
import { type AppTheme, useAppTheme } from '../utils/themeContext';

interface FilterChipsProps {
  options?: Array<{ label: string; value: string }>;
  values?: string[];
  selectedValue: string;
  onChange: (value: string) => void;
}

export function FilterChips({ options, values, selectedValue, onChange }: FilterChipsProps) {
  const { theme } = useAppTheme();
  const styles = useMemo(() => makeStyles(theme), [theme]);
  const items = options ?? values?.map((value) => ({ label: value, value })) ?? [];

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.wrap}>
      {items.map((option) => {
        const active = selectedValue === option.value;

        return (
          <Pressable
            key={option.value}
            onPress={() => onChange(option.value)}
            style={({ pressed }) => [styles.chip, active ? styles.activeChip : undefined, pressed && !active ? styles.pressedChip : undefined]}
          >
            <Text style={[styles.chipText, active ? styles.activeText : undefined]}>{option.label}</Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

function makeStyles(theme: AppTheme) { return StyleSheet.create({
  wrap: {
    gap: theme.spacing.sm,
    paddingRight: theme.spacing.md,
    paddingVertical: 4,
  },
  chip: {
    borderRadius: theme.radius.full,
    borderWidth: 1.5,
    borderColor: theme.isDark ? theme.colors.border : theme.colors.borderStrong,
    backgroundColor: theme.colors.surface,
    paddingHorizontal: 18,
    paddingVertical: 10,
  },
  activeChip: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
    ...theme.control.shadow.md,
  },
  pressedChip: {
    opacity: theme.isDark ? 0.92 : 0.78,
    transform: [{ scale: 0.96 }],
  },
  chipText: {
    fontSize: theme.typography.small,
    fontWeight: '700',
    color: theme.colors.textMuted,
  },
  activeText: {
    color: '#FFFFFF',
    fontWeight: '800',
    letterSpacing: 0.1,
  },
}); }