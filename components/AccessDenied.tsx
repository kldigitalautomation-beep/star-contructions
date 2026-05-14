import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import { AppButton } from './AppButton';
import { getAccentCardBorder, theme } from '../styles/theme';

interface AccessDeniedProps {
  title: string;
}

export function AccessDenied({ title }: AccessDeniedProps) {
  return (
    <View style={styles.card}>
      <View style={styles.iconWrap}>
        <Ionicons color={theme.colors.warning} name="lock-closed" size={32} />
      </View>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.message}>This page is not available for your current login role in the demo app.</Text>
      <AppButton label="Go To Dashboard" onPress={() => router.replace('/(tabs)/dashboard')} variant="secondary" />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.surfaceElevated,
    borderRadius: theme.radius.xl,
    borderWidth: 1,
    borderColor: getAccentCardBorder(theme.colors.warning),
    padding: theme.spacing.lg,
    gap: theme.spacing.md,
    alignItems: 'center',
    ...theme.card.shadow.md,
  },
  iconWrap: {
    width: 64,
    height: 64,
    borderRadius: theme.radius.full,
    backgroundColor: theme.colors.warningSoft,
    borderWidth: 1,
    borderColor: getAccentCardBorder(theme.colors.warning),
    alignItems: 'center',
    justifyContent: 'center',
    ...theme.card.shadow.sm,
  },
  title: {
    fontSize: theme.typography.subtitle,
    fontWeight: '800',
    color: theme.colors.warningText,
    textAlign: 'center',
  },
  message: {
    fontSize: theme.typography.body,
    lineHeight: theme.typography.lineHeightBody,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    opacity: 0.8,
  },
});