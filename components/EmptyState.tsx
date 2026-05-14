import { Ionicons } from '@expo/vector-icons';
import { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { type AppTheme, useAppTheme } from '../utils/themeContext';

interface EmptyStateProps {
  title: string;
  description: string;
  icon?: string;
}

export function EmptyState({ title, description, icon = 'folder-open-outline' }: EmptyStateProps) {
  const { theme } = useAppTheme();
  const styles = useMemo(() => makeStyles(theme), [theme]);
  return (
    <View style={styles.box}>
      <View style={styles.iconWrap}>
        <Ionicons color={theme.isDark ? theme.colors.primaryLight : theme.colors.primary} name={icon as keyof typeof Ionicons.glyphMap} size={34} />
      </View>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{description}</Text>
    </View>
  );
}

function makeStyles(theme: AppTheme) { return StyleSheet.create({
  box: {
    borderRadius: theme.radius.xl,
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.card.border,
    paddingVertical: theme.spacing.xl + 4,
    paddingHorizontal: theme.spacing.lg,
    gap: 12,
    alignItems: 'center',
    marginVertical: theme.spacing.sm,
    ...theme.card.shadow.sm,
  },
  iconWrap: {
    width: 72,
    height: 72,
    borderRadius: theme.radius.full,
    backgroundColor: theme.isDark ? 'rgba(122,170,255,0.14)' : theme.colors.primarySoft,
    borderWidth: 1.5,
    borderColor: theme.isDark ? 'rgba(122,170,255,0.28)' : theme.colors.primaryMuted,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  title: {
    fontSize: theme.typography.subtitle,
    fontWeight: '700',
    color: theme.colors.text,
  },
  description: {
    fontSize: theme.typography.small,
    color: theme.colors.textMuted,
    textAlign: 'center',
    lineHeight: theme.typography.lineHeightBody,
  },
}); }