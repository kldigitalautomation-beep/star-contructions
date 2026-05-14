import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { theme } from '../styles/theme';

interface MenuTileProps {
  icon: string;
  label: string;
  description: string;
  onPress: () => void;
  badge?: string | number;
}

export function MenuTile({ icon, label, description, onPress, badge }: MenuTileProps) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.tile, pressed ? styles.pressed : undefined]}>
      <View style={styles.iconWrap}>
        <Ionicons color={theme.brand.navy} name={icon as keyof typeof Ionicons.glyphMap} size={20} />
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
        <Ionicons color={theme.brand.gold} name="chevron-forward" size={16} />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
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
    opacity: 0.85,
    transform: [{ scale: 0.983 }],
  },
  iconWrap: {
    width: 42,
    height: 42,
    borderRadius: theme.radius.md,
    backgroundColor: theme.colors.primarySoft,
    borderWidth: 1,
    borderColor: theme.colors.primaryMuted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textWrap: {
    flex: 1,
    gap: 1,
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
  },
  badge: {
    backgroundColor: theme.colors.danger,
    borderRadius: theme.radius.full,
    paddingHorizontal: 7,
    paddingVertical: 2,
    minWidth: 22,
    alignItems: 'center',
  },
  badgeText: {
    fontSize: theme.typography.micro,
    fontWeight: '800',
    color: '#fff',
  },
  chevronWrap: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: theme.colors.accentSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
});