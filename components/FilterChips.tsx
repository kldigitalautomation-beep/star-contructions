import { Pressable, ScrollView, StyleSheet, Text } from 'react-native';
import { theme } from '../styles/theme';

interface FilterChipsProps {
  options?: Array<{ label: string; value: string }>;
  values?: string[];
  selectedValue: string;
  onChange: (value: string) => void;
}

export function FilterChips({ options, values, selectedValue, onChange }: FilterChipsProps) {
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

const styles = StyleSheet.create({
  wrap: {
    gap: theme.spacing.sm,
    paddingRight: theme.spacing.md,
    paddingVertical: 4,
  },
  chip: {
    borderRadius: theme.radius.full,
    borderWidth: 1.5,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.surface,
    paddingHorizontal: 16,
    paddingVertical: 9,
  },
  activeChip: {
    backgroundColor: theme.brand.navy,
    borderColor: theme.brand.navy,
    ...theme.control.shadow.md,
  },
  pressedChip: {
    opacity: 0.80,
    transform: [{ scale: 0.97 }],
  },
  chipText: {
    fontSize: theme.typography.small,
    fontWeight: '700',
    color: theme.colors.textMuted,
  },
  activeText: {
    color: '#FFFFFF',
    fontWeight: '800',
  },
});