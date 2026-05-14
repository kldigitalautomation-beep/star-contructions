import { ReactNode, useMemo } from 'react';
import { Image, ScrollView, StyleSheet, Text, View, ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import { type AppTheme, useAppTheme } from '../utils/themeContext';

interface ScreenContainerProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
  scroll?: boolean;
  contentStyle?: ViewStyle;
  headerRight?: ReactNode;
  /** When provided, renders a greeting-style hero header */
  greeting?: string;
}

export function ScreenContainer({ title, subtitle, children, scroll = true, contentStyle, headerRight, greeting }: ScreenContainerProps) {
  const { theme } = useAppTheme();
  const styles = useMemo(() => makeStyles(theme), [theme]);
  const body = (
    <View style={[styles.content, contentStyle]}>
      {children}
    </View>
  );

  return (
    <View style={styles.background}>
      <StatusBar style="light" />
      <SafeAreaView edges={['top', 'left', 'right']} style={styles.safeArea}>
        {/* ── Premium Gradient Header ── */}
        <LinearGradient
          colors={theme.gradients.screenHeader}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.headerGradient}
        >
          {greeting ? (
            /* Greeting-style dashboard header */
            <View style={styles.greetingRow}>
              <View style={styles.greetingLeft}>
                <View style={styles.logoWrap}>
                  <Image
                    source={require('../assets/icon.png')}
                    style={styles.logoMark}
                    resizeMode="contain"
                  />
                </View>
                <View style={styles.greetingText}>
                  <Text style={styles.greetingLine}>{greeting}</Text>
                  <Text style={styles.greetingSubLine}>{subtitle ?? title}</Text>
                </View>
              </View>
              {headerRight ? <View style={styles.headerRight}>{headerRight}</View> : null}
            </View>
          ) : (
            /* Standard header */
            <View style={styles.headerRow}>
              <View style={styles.headerLeft}>
                <View style={styles.logoWrap}>
                  <Image
                    source={require('../assets/icon.png')}
                    style={styles.logoMark}
                    resizeMode="contain"
                  />
                </View>
                <View style={styles.headerText}>
                  <Text style={styles.title} numberOfLines={1}>{title}</Text>
                  {subtitle ? <Text style={styles.subtitle} numberOfLines={2}>{subtitle}</Text> : null}
                </View>
              </View>
              {headerRight ? <View style={styles.headerRight}>{headerRight}</View> : null}
            </View>
          )}
          {/* Gold accent line at bottom of header */}
          <View style={styles.goldLine} />
        </LinearGradient>

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

function makeStyles(theme: AppTheme) { return StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  safeArea: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  headerGradient: {
    paddingHorizontal: theme.spacing.md,
    paddingTop: theme.spacing.md,
    paddingBottom: 0,
    ...theme.shadow.md,
  },
  // Standard header row
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: theme.spacing.md,
    gap: theme.spacing.sm,
  },
  headerLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    minWidth: 0,
  },
  // Greeting-style header
  greetingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: theme.spacing.md + 2,
    gap: theme.spacing.sm,
  },
  greetingLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    minWidth: 0,
  },
  greetingText: {
    flex: 1,
    gap: 2,
    minWidth: 0,
  },
  greetingLine: {
    fontSize: 20,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -0.5,
    lineHeight: 26,
  },
  greetingSubLine: {
    fontSize: theme.typography.small,
    color: 'rgba(255,255,255,0.72)',
    fontWeight: '500',
    lineHeight: 18,
  },
  logoWrap: {
    width: 46,
    height: 46,
    borderRadius: theme.radius.md,
    backgroundColor: 'rgba(255,255,255,0.16)',
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.28)',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    overflow: 'hidden',
  },
  logoMark: {
    width: 40,
    height: 40,
  },
  headerText: {
    flex: 1,
    gap: 3,
    minWidth: 0,
  },
  headerRight: {
    flexShrink: 0,
  },
  title: {
    fontSize: theme.typography.subtitle,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -0.3,
    lineHeight: 22,
  },
  subtitle: {
    fontSize: theme.typography.caption,
    color: 'rgba(255,255,255,0.72)',
    fontWeight: '500',
    lineHeight: 16,
  },
  goldLine: {
    height: 3,
    backgroundColor: theme.brand.gold,
    marginHorizontal: -theme.spacing.md,
    borderRadius: 0,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: theme.spacing.md,
    paddingBottom: 120,
  },
  content: {
    paddingHorizontal: theme.spacing.md,
    paddingTop: theme.spacing.xs,
    gap: theme.spacing.md,
  },
}); }