import { ReactNode, useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { type AppTheme, useAppTheme } from '../utils/themeContext';

interface InfoCardProps {
  title?: string;
  subtitle?: string;
  rightSlot?: ReactNode;
  children: ReactNode;
  accent?: boolean;
}

export function InfoCard({ title, subtitle, rightSlot, children, accent = false }: InfoCardProps) {
  const { theme } = useAppTheme();
  const styles = useMemo(() => makeStyles(theme), [theme]);
  const accentColor = accent ? theme.brand.gold : theme.colors.primary;
  return (
    <View style={[styles.card, accent && styles.cardAccent]}>
      {/* Top accent line */}
      <View style={[styles.topLine, { backgroundColor: accentColor }]} />
      {title || rightSlot ? (
        <View style={styles.header}>
          <View style={styles.headerText}>
            {title ? <Text style={styles.title}>{title}</Text> : null}
            {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
          </View>
          {rightSlot ? <View style={styles.rightSlot}>{rightSlot}</View> : null}
        </View>
      ) : null}
      <View style={[styles.body, (!title && !rightSlot) && styles.bodyNoHeader]}>{children}</View>
    </View>
  );
}

function makeStyles(theme: AppTheme) { return StyleSheet.create({
  card: {
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
  topLine: {
    height: 3,
    width: '100%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: theme.spacing.md,
    paddingTop: theme.spacing.sm + 4,
    paddingBottom: theme.spacing.sm,
    gap: theme.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.divider,
  },
  headerText: {
    flex: 1,
    gap: 3,
  },
  rightSlot: {
    flexShrink: 0,
  },
  title: {
    fontSize: theme.typography.body,
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
  bodyNoHeader: {
    paddingTop: theme.spacing.md,
  },
}); }