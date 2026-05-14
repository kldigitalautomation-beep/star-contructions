import { ReactNode } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { theme } from '../styles/theme';

interface InfoCardProps {
  title?: string;
  subtitle?: string;
  rightSlot?: ReactNode;
  children: ReactNode;
  accent?: boolean;
}

export function InfoCard({ title, subtitle, rightSlot, children, accent = false }: InfoCardProps) {
  return (
    <View style={[styles.card, accent && styles.cardAccent]}>
      {/* Left accent border */}
      <View style={[styles.leftBorder, { backgroundColor: accent ? theme.brand.gold : theme.brand.navy }]} />
      <View style={styles.inner}>
        {title || rightSlot ? (
          <View style={styles.header}>
            <View style={styles.headerText}>
              {title ? <Text style={styles.title}>{title}</Text> : null}
              {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
            </View>
            {rightSlot ? <View style={styles.rightSlot}>{rightSlot}</View> : null}
          </View>
        ) : null}
        <View style={styles.body}>{children}</View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    borderColor: theme.card.border,
    overflow: 'hidden',
    ...theme.card.shadow.sm,
  },
  cardAccent: {
    borderColor: theme.card.accentBorder,
  },
  leftBorder: {
    width: 4,
    flexShrink: 0,
  },
  inner: {
    flex: 1,
    minWidth: 0,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: theme.spacing.md,
    paddingTop: theme.spacing.md,
    paddingBottom: theme.spacing.sm,
    gap: theme.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.divider,
  },
  headerText: {
    flex: 1,
    gap: 2,
  },
  rightSlot: {
    flexShrink: 0,
  },
  title: {
    fontSize: theme.typography.subtitle,
    fontWeight: '700',
    color: theme.colors.text,
    letterSpacing: -0.2,
  },
  subtitle: {
    fontSize: theme.typography.caption,
    color: theme.colors.textMuted,
    lineHeight: theme.typography.lineHeightCaption,
  },
  body: {
    padding: theme.spacing.md,
    gap: theme.spacing.sm,
  },
});