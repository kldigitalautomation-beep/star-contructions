import { Ionicons } from '@expo/vector-icons';
import { Redirect, router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import { useState, useMemo } from 'react';
import { Alert, Image, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppButton } from '../components/AppButton';
import { roleDescriptions, roleLabels } from '../navigation/accessMap';
import { roleAccent } from '../styles/theme';
import { type AppTheme, useAppTheme } from '../utils/themeContext';
import { useAppData } from '../utils/appState';
import type { DemoUser } from '../utils/types';

export function LoginScreen() {
  const { theme } = useAppTheme();
  const styles = useMemo(() => makeStyles(theme), [theme]);
  const { currentUser, users, login } = useAppData();
  const [email, setEmail] = useState('admin@test.com');
  const [password, setPassword] = useState('123456');
  const [showPassword, setShowPassword] = useState(false);

  if (currentUser) {
    return <Redirect href="/(tabs)/dashboard" />;
  }

  const handleLogin = (selectedEmail?: string, selectedPassword?: string) => {
    const success = login(selectedEmail ?? email, selectedPassword ?? password);
    if (!success) {
      Alert.alert('Login Failed', 'Use one of the demo email and password combinations shown below.');
      return;
    }
    router.replace('/(tabs)/dashboard');
  };

  return (
    <View style={styles.root}>
      <StatusBar style="light" />
      <SafeAreaView edges={['top', 'left', 'right', 'bottom']} style={styles.safeArea}>
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          style={styles.scroll}
        >
          {/* ── Brand Header ── */}
          <LinearGradient
            colors={theme.gradients.loginBrand}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.brandHeader}
          >
            {/* Decorative circles */}
            <View style={styles.decorCircle1} />
            <View style={styles.decorCircle2} />

            {/* Logo */}
            <View style={styles.logoContainer}>
              <Image
                source={require('../assets/icon.png')}
                style={styles.logo}
                resizeMode="contain"
              />
            </View>
            {/* Brand Name */}
            <Text style={styles.brandName}>STAR CONSTRUCTIONS</Text>
            <Text style={styles.brandTag}>& PROMOTERS</Text>
            <View style={styles.goldDivider} />
            <Text style={styles.brandSubtitle}>Construction Management ERP</Text>

            {/* Pill badge */}
            <View style={styles.versionBadge}>
              <Ionicons color={theme.brand.gold} name="shield-checkmark" size={12} />
              <Text style={styles.versionText}>Secure · Role-Based · Mobile ERP</Text>
            </View>
          </LinearGradient>

          {/* ── Sign In Card ── */}
          <View style={styles.card}>
            <LinearGradient
              colors={theme.gradients.card}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={StyleSheet.absoluteFill}
            />
            <View style={[styles.cardTopBar, { backgroundColor: theme.brand.gold }]} />
            <View style={styles.cardInner}>
              <View style={styles.cardTitleRow}>
                <View style={[styles.cardTitleIcon, { backgroundColor: theme.colors.primarySoft }]}>
                  <Ionicons name="log-in-outline" size={18} color={theme.isDark ? theme.colors.primaryLight : theme.colors.primary} />
                </View>
                <View>
                  <Text style={styles.cardTitle}>Sign In</Text>
                  <Text style={styles.cardSubtitle}>Enter your credentials to continue</Text>
                </View>
              </View>

              <View style={styles.fields}>
                <View style={styles.field}>
                  <Text style={styles.fieldLabel}>Email Address</Text>
                  <View style={styles.inputWrap}>
                    <View style={styles.inputIconLeft}>
                      <Ionicons color={theme.isDark ? theme.colors.primaryLight : theme.colors.primary} name="mail-outline" size={18} />
                    </View>
                    <TextInput
                      autoCapitalize="none"
                      keyboardType="email-address"
                      onChangeText={setEmail}
                      placeholder="Enter email"
                      placeholderTextColor={theme.isDark ? theme.colors.textLight : '#B0BECC'}
                      style={[styles.input, styles.inputWithLeftIcon]}
                      value={email}
                    />
                  </View>
                </View>

                <View style={styles.field}>
                  <Text style={styles.fieldLabel}>Password</Text>
                  <View style={styles.inputWrap}>
                    <View style={styles.inputIconLeft}>
                      <Ionicons color={theme.isDark ? theme.colors.primaryLight : theme.colors.primary} name="lock-closed-outline" size={18} />
                    </View>
                    <TextInput
                      onChangeText={setPassword}
                      placeholder="Enter password"
                      placeholderTextColor={theme.isDark ? theme.colors.textLight : '#B0BECC'}
                      secureTextEntry={!showPassword}
                      style={[styles.input, styles.inputWithLeftIcon, styles.inputWithRightIcon]}
                      value={password}
                    />
                    <Pressable
                      onPress={() => setShowPassword((v) => !v)}
                      style={({ pressed }) => [styles.eyeBtn, pressed ? styles.eyeBtnPressed : undefined]}
                    >
                      <Ionicons
                        color={theme.isDark ? theme.colors.textSecondary : theme.colors.textMuted}
                        name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                        size={20}
                      />
                    </Pressable>
                  </View>
                </View>
              </View>

              <AppButton label="Sign In" onPress={() => handleLogin()} size="lg" variant="accent" />
            </View>
          </View>

          {/* ── Quick Login Card ── */}
          <View style={styles.card}>
            <LinearGradient
              colors={theme.gradients.card}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={StyleSheet.absoluteFill}
            />
            <View style={[styles.cardTopBar, { backgroundColor: theme.colors.primary }]} />
            <View style={styles.cardInner}>
              <View style={styles.cardTitleRow}>
                <View style={[styles.cardTitleIcon, { backgroundColor: theme.isDark ? 'rgba(122,170,255,0.18)' : theme.colors.primarySoft }]}>
                  <Ionicons name="flash-outline" size={18} color={theme.isDark ? theme.colors.primaryLight : theme.colors.primary} />
                </View>
                <View>
                  <Text style={styles.cardTitle}>Quick Login</Text>
                  <Text style={styles.cardSubtitle}>Tap a role to instantly sign in</Text>
                </View>
              </View>
              <View style={styles.quickList}>
                {users.map((user) => (
                  <QuickLoginCard key={user.id} onPress={() => handleLogin(user.email, user.password)} user={user} />
                ))}
              </View>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

function QuickLoginCard({ user, onPress }: { user: DemoUser; onPress: () => void }) {
  const { theme } = useAppTheme();
  const styles = useMemo(() => makeStyles(theme), [theme]);
  const accent = roleAccent[user.role];
  const accentSoft = theme.roleAccentSoft[user.role];

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.quickCard,
        { backgroundColor: accentSoft, borderColor: theme.getAccentCardBorder(accent) },
        pressed ? styles.quickPressed : undefined,
      ]}
    >
      <LinearGradient
        colors={[`${accent}${theme.isDark ? '22' : '10'}`, 'transparent']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFill}
      />
      <View style={[styles.roleIconWrap, { backgroundColor: accent }]}>
        <Ionicons color="#fff" name="person" size={16} />
      </View>
      <View style={styles.quickTextWrap}>
        <Text style={[styles.quickRole, { color: accent }]}>{roleLabels[user.role]}</Text>
        <Text style={styles.quickName}>{user.name}</Text>
        <Text style={styles.quickInfo}>{user.email}  ·  {user.password}</Text>
        <Text style={styles.quickDescription}>{roleDescriptions[user.role]}</Text>
      </View>
      <View style={[styles.quickArrow, { backgroundColor: `${accent}${theme.isDark ? '28' : '18'}`, borderColor: `${accent}${theme.isDark ? '44' : '28'}` }]}>
        <Ionicons color={accent} name="chevron-forward" size={15} />
      </View>
    </Pressable>
  );
}

function makeStyles(theme: AppTheme) { return StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  safeArea: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  scroll: {
    flex: 1,
  },
  content: {
    gap: theme.spacing.md,
    paddingBottom: theme.spacing.xxl,
  },

  // ── Brand Header ──
  brandHeader: {
    paddingTop: theme.spacing.xl,
    paddingBottom: theme.spacing.lg,
    paddingHorizontal: theme.spacing.lg,
    alignItems: 'center',
    gap: 6,
    borderBottomLeftRadius: theme.radius.xxl,
    borderBottomRightRadius: theme.radius.xxl,
    overflow: 'hidden',
    ...theme.shadow.lg,
  },
  decorCircle1: {
    position: 'absolute',
    top: -50,
    right: -50,
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: 'rgba(255,255,255,0.06)',
  },
  decorCircle2: {
    position: 'absolute',
    bottom: -30,
    left: -30,
    width: 130,
    height: 130,
    borderRadius: 65,
    backgroundColor: 'rgba(255,255,255,0.04)',
  },
  logoContainer: {
    width: 116,
    height: 116,
    borderRadius: theme.radius.xl,
    backgroundColor: 'rgba(255,255,255,0.16)',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.30)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing.sm,
    ...theme.shadow.md,
  },
  logo: {
    width: 96,
    height: 96,
  },
  brandName: {
    fontSize: 22,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 2.5,
    textAlign: 'center',
  },
  brandTag: {
    fontSize: theme.typography.small,
    fontWeight: '700',
    color: theme.brand.gold,
    letterSpacing: 3,
    textAlign: 'center',
    textTransform: 'uppercase',
  },
  goldDivider: {
    width: 60,
    height: 3,
    backgroundColor: theme.brand.gold,
    borderRadius: 2,
    marginVertical: theme.spacing.xs,
  },
  brandSubtitle: {
    fontSize: theme.typography.caption,
    color: 'rgba(255,255,255,0.76)',
    textAlign: 'center',
    fontWeight: '600',
    letterSpacing: 0.6,
  },
  versionBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginTop: theme.spacing.sm,
    paddingHorizontal: 14,
    paddingVertical: 8,
    backgroundColor: 'rgba(255,255,255,0.14)',
    borderRadius: theme.radius.full,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.24)',
  },
  versionText: {
    fontSize: theme.typography.micro,
    color: 'rgba(255,255,255,0.88)',
    fontWeight: '600',
    letterSpacing: 0.4,
  },

  // ── Cards ──
  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.xxl,
    borderWidth: 1,
    borderColor: theme.card.border,
    overflow: 'hidden',
    marginHorizontal: theme.spacing.md,
    ...theme.card.shadow.lg,
  },
  cardTopBar: {
    height: 4,
  },
  cardInner: {
    padding: theme.spacing.md,
    paddingTop: theme.spacing.md + 2,
    gap: theme.spacing.md,
  },
  cardTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  cardTitleIcon: {
    width: 44,
    height: 44,
    borderRadius: theme.radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  cardTitle: {
    fontSize: theme.typography.subtitle,
    fontWeight: '800',
    color: theme.colors.text,
    letterSpacing: -0.4,
  },
  cardSubtitle: {
    fontSize: theme.typography.small,
    color: theme.colors.textMuted,
    lineHeight: theme.typography.lineHeightBody,
    marginTop: 1,
  },

  // ── Form ──
  fields: {
    gap: theme.spacing.sm + 2,
  },
  field: {
    gap: 7,
  },
  fieldLabel: {
    fontSize: theme.typography.small,
    fontWeight: '700',
    color: theme.colors.textSecondary,
    letterSpacing: 0.2,
  },
  input: {
    height: 52,
    borderRadius: theme.radius.xl,
    borderWidth: 1.5,
    borderColor: theme.isDark ? theme.control.inputBorder : '#D0DCEE',
    backgroundColor: theme.isDark ? theme.colors.inputBg : '#F8FBFF',
    fontSize: theme.typography.body,
    color: theme.colors.text,
  },
  inputWrap: {
    position: 'relative',
    flexDirection: 'row',
    alignItems: 'center',
  },
  inputIconLeft: {
    position: 'absolute',
    left: 16,
    zIndex: 1,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputWithLeftIcon: {
    flex: 1,
    paddingLeft: 48,
  },
  inputWithRightIcon: {
    paddingRight: 50,
  },
  eyeBtn: {
    position: 'absolute',
    right: 14,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
    zIndex: 1,
  },
  eyeBtnPressed: {
    opacity: 0.70,
  },

  // ── Quick Login ──
  quickList: {
    gap: theme.spacing.sm,
  },
  quickCard: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
    borderRadius: theme.radius.xl,
    borderWidth: 1.5,
    padding: theme.spacing.sm + 2,
    alignItems: 'flex-start',
    overflow: 'hidden',
  },
  quickPressed: {
    opacity: theme.isDark ? 0.92 : 0.84,
    transform: [{ scale: 0.982 }],
  },
  roleIconWrap: {
    width: 38,
    height: 38,
    borderRadius: theme.radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
    flexShrink: 0,
  },
  quickTextWrap: {
    flex: 1,
    gap: 2,
  },
  quickRole: {
    fontSize: theme.typography.micro,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 1.0,
  },
  quickName: {
    fontSize: theme.typography.body,
    fontWeight: '700',
    color: theme.colors.text,
    letterSpacing: -0.2,
  },
  quickInfo: {
    fontSize: theme.typography.caption,
    color: theme.colors.textMuted,
  },
  quickDescription: {
    marginTop: 2,
    fontSize: theme.typography.caption,
    lineHeight: theme.typography.lineHeightCaption,
    color: theme.isDark ? theme.colors.textLight : theme.colors.textMuted,
  },
  quickArrow: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    flexShrink: 0,
    alignSelf: 'center',
  },
}); }
