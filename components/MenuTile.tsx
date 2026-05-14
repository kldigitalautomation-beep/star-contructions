import { Ionicons } from '@expo/vector-icons';
import { useMemo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { type AppTheme, useAppTheme } from '../utils/themeContext';

interface MenuTileProps {
  icon: string;
  label: string;
  description: string;
  onPress: () => void;
  badge?: string | number;
}

export function MenuTile({ icon, label, description, onPress, badge }: MenuTileProps) {
  const { theme } = useAppTheme();
  const styles = useMemo(() => makeStyles(theme), [theme]);
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.tile, pressed ? styles.pressed : undefined]}>
      <View style={styles.iconWrap}>
        <Ionicons
          color={theme.isDark ? theme.colors.primaryLight : theme.colors.primary}
          name={icon as keyof typeof Ionicons.glyphMap}
          size={22}
        />
      </View>
      <View style={styles.textWrap}>
        <Text style={styles.label} numberOfLines={1}>{label}</Text>
        <Text style={styles.description} numberOfLines={1}>{description}</Text>
      </View>
      {badge != null ? (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{badge}</Text>
        </View>
      ) : null}
      <View style={styles.chevronWrap}>
        <Ionicons color={theme.brand.gold} name="chevron-forward" size={14} />
      </View>
    </Pressable>
  );
}

function makeStyles(theme: AppTheme) { return StyleSheet.create({
  tile: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.lg,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.card.border,
    ...theme.card.shadow.sm,
  },
  pressed: {
    opacity: theme.isDark ? 0.94 : 0.84,
    transform: [{ scale: 0.982 }],
  },
  iconWrap: {
    width: 46,
    height: 46,
    borderRadius: theme.radius.md,
    backgroundColor: theme.isDark ? 'rgba(122,170,255,0.16)' : theme.colors.primarySoft,
    borderWidth: 1.5,
    borderColor: theme.isDark ? 'rgba(122,170,255,0.32)' : theme.colors.primaryMuted,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  textWrap: {
    flex: 1,
    gap: 2,
    minWidth: 0,
  },
  label: {
    fontSize: theme.typography.body,
    fontWeight: '700',
    color: theme.colors.text,
    letterSpacing: -0.2,
  },
  description: {
    fontSize: theme.typography.caption,
    color: theme.colors.textMuted,
    lineHeight: theme.typography.lineHeightCaption,
  },
  badge: {
    backgroundColor: theme.colors.danger,
    borderRadius: theme.radius.full,
    paddingHorizontal: 8,
    paddingVertical: 3,
    minWidth: 22,
    alignItems: 'center',
    flexShrink: 0,
  },
  badgeText: {
    fontSize: theme.typography.micro,
    fontWeight: '800',
    color: '#fff',
  },
  chevronWrap: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: theme.isDark ? theme.colors.accentSoft : theme.colors.accentSoft,
    borderWidth: 1,
    borderColor: theme.isDark ? 'rgba(245,166,35,0.36)' : 'rgba(245,166,35,0.30)',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
}); }