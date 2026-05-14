import { useMemo } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
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
            style={({ pressed }) => [styles.chip, !active && pressed ? styles.pressedChip : undefined]}
          >
            {active ? (
              <LinearGradient
                colors={theme.isDark ? ['#4B84F0', '#2252B8'] : [theme.colors.primary, theme.colors.primaryDark]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.activeChipGradient}
              >
                <Text style={styles.activeText}>{option.label}</Text>
              </LinearGradient>
            ) : (
              <View style={styles.inactiveChip}>
                <Text style={styles.chipText}>{option.label}</Text>
              </View>
            )}
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
    overflow: 'hidden',
  },
  activeChipGradient: {
    borderRadius: theme.radius.full,
    paddingHorizontal: 18,
    paddingVertical: 10,
    ...theme.control.shadow.md,
  },
  inactiveChip: {
    borderRadius: theme.radius.full,
    borderWidth: 1.5,
    borderColor: theme.isDark ? 'rgba(255,255,255,0.18)' : theme.colors.border,
    backgroundColor: theme.colors.surface,
    paddingHorizontal: 18,
    paddingVertical: 10,
  },
  pressedChip: {
    opacity: theme.isDark ? 0.90 : 0.76,
    transform: [{ scale: 0.96 }],
  },
  chipText: {
    fontSize: theme.typography.small,
    fontWeight: '700',
    color: theme.isDark ? theme.colors.textSecondary : theme.colors.textMuted,
  },
  activeText: {
    fontSize: theme.typography.small,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.2,
  },
}); }