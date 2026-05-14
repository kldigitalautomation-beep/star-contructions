import { ReactNode } from 'react';
import { Image, ScrollView, StyleSheet, Text, View, ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { theme } from '../styles/theme';

interface ScreenContainerProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
  scroll?: boolean;
  contentStyle?: ViewStyle;
  headerRight?: ReactNode;
}

export function ScreenContainer({ title, subtitle, children, scroll = true, contentStyle, headerRight }: ScreenContainerProps) {
  const body = (
    <View style={[styles.content, contentStyle]}>
      {children}
    </View>
  );

  return (
    <View style={styles.background}>
      <SafeAreaView edges={['top', 'left', 'right']} style={styles.safeArea}>
        <StatusBar style={theme.statusBarStyle} />
        {/* Header */}
        <View style={styles.headerOuter}>
          {/* Navy top accent bar */}
          <View style={styles.navyTopBar} />
          {/* Gold left brand strip */}
          <View style={styles.headerRow}>
            <View style={styles.brandStrip} />
            <View style={styles.header}>
              <View style={styles.headerLeft}>
                <Image
                  source={require('../assets/icon.png')}
                  style={styles.logoMark}
                  resizeMode="contain"
                />
                <View style={styles.headerText}>
                  <Text style={styles.title} numberOfLines={1}>{title}</Text>
                  {subtitle ? <Text style={styles.subtitle} numberOfLines={1}>{subtitle}</Text> : null}
                </View>
              </View>
              {headerRight ? <View style={styles.headerRight}>{headerRight}</View> : null}
            </View>
          </View>
        </View>
        {scroll ? (
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            style={styles.scroll}
          >
            {body}
          </ScrollView>
        ) : (
          body
        )}
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  safeArea: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  headerOuter: {
    backgroundColor: theme.colors.surface,
    marginHorizontal: theme.spacing.md,
    marginTop: theme.spacing.sm,
    borderRadius: theme.radius.lg,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: theme.card.border,
    ...theme.card.shadow.md,
  },
  navyTopBar: {
    height: 3,
    backgroundColor: theme.brand.navy,
    width: '100%',
  },
  headerRow: {
    flexDirection: 'row',
  },
  brandStrip: {
    width: 4,
    backgroundColor: theme.brand.gold,
  },
  header: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.md,
    gap: theme.spacing.sm,
  },
  headerLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    minWidth: 0,
  },
  logoMark: {
    width: 36,
    height: 36,
    borderRadius: theme.radius.xs,
  },
  headerText: {
    flex: 1,
    gap: 2,
    minWidth: 0,
  },
  headerRight: {
    flexShrink: 0,
  },
  title: {
    fontSize: theme.typography.subtitle,
    fontWeight: '800',
    color: theme.colors.text,
    letterSpacing: -0.4,
    lineHeight: theme.typography.lineHeightTitle,
  },
  subtitle: {
    fontSize: theme.typography.caption,
    color: theme.colors.textMuted,
    fontWeight: '600',
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: theme.spacing.sm,
    paddingBottom: 120,
  },
  content: {
    paddingHorizontal: theme.spacing.md,
    paddingTop: theme.spacing.sm,
    gap: theme.spacing.md,
  },
});