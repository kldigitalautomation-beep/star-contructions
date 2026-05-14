import { Ionicons } from '@expo/vector-icons';
import { Redirect, router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import { useState } from 'react';
import { Alert, Image, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppButton } from '../components/AppButton';
import { roleDescriptions, roleLabels } from '../navigation/accessMap';
import { getAccentCardBorder, roleAccent, roleAccentSoft, theme } from '../styles/theme';
import { useAppData } from '../utils/appState';
import type { DemoUser } from '../utils/types';

export function LoginScreen() {
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
            <View style={styles.cardTopBar} />
            <View style={styles.cardInner}>
              <Text style={styles.cardTitle}>Sign In</Text>
              <Text style={styles.cardSubtitle}>Enter your demo credentials to access the app.</Text>

              <View style={styles.fields}>
                <View style={styles.field}>
                  <Text style={styles.fieldLabel}>Email Address</Text>
                  <TextInput
                    autoCapitalize="none"
                    keyboardType="email-address"
                    onChangeText={setEmail}
                    placeholder="Enter email"
                    placeholderTextColor={theme.colors.textLight}
                    style={styles.input}
                    value={email}
                  />
                </View>

                <View style={styles.field}>
                  <Text style={styles.fieldLabel}>Password</Text>
                  <View style={styles.inputWrap}>
                    <TextInput
                      onChangeText={setPassword}
                      placeholder="Enter password"
                      placeholderTextColor={theme.colors.textLight}
                      secureTextEntry={!showPassword}
                      style={[styles.input, styles.inputWithIcon]}
                      value={password}
                    />
                    <Pressable
                      onPress={() => setShowPassword((v) => !v)}
                      style={({ pressed }) => [styles.eyeBtn, pressed ? styles.eyeBtnPressed : undefined]}
                    >
                      <Ionicons
                        color={theme.colors.textMuted}
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
            <View style={[styles.cardTopBar, { backgroundColor: theme.brand.navy }]} />
            <View style={styles.cardInner}>
              <Text style={styles.cardTitle}>Quick Login</Text>
              <Text style={styles.cardSubtitle}>Tap a role to instantly enter with demo credentials.</Text>
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
  const accent = roleAccent[user.role];
  const accentSoft = roleAccentSoft[user.role];

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.quickCard,
        { backgroundColor: accentSoft, borderColor: getAccentCardBorder(accent) },
        pressed ? styles.quickPressed : undefined,
      ]}
    >
      <View style={[styles.roleIconWrap, { backgroundColor: accent }]}>
        <Ionicons color="#fff" name="person" size={16} />
      </View>
      <View style={styles.quickTextWrap}>
        <Text style={[styles.quickRole, { color: accent }]}>{roleLabels[user.role]}</Text>
        <Text style={styles.quickName}>{user.name}</Text>
        <Text style={styles.quickInfo}>{user.email}  ·  {user.password}</Text>
        <Text style={styles.quickDescription}>{roleDescriptions[user.role]}</Text>
      </View>
      <Ionicons color={accent} name="chevron-forward" size={17} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
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
    paddingBottom: theme.spacing.xl + theme.spacing.md,
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
  },
  logoContainer: {
    width: 110,
    height: 110,
    borderRadius: theme.radius.xl,
    backgroundColor: 'rgba(255,255,255,0.14)',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.28)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing.sm,
    ...theme.shadow.md,
  },
  logo: {
    width: 90,
    height: 90,
  },
  brandName: {
    fontSize: 22,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 2,
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
    height: 2.5,
    backgroundColor: theme.brand.gold,
    borderRadius: 2,
    marginVertical: theme.spacing.xs,
  },
  brandSubtitle: {
    fontSize: theme.typography.caption,
    color: 'rgba(255,255,255,0.70)',
    textAlign: 'center',
    fontWeight: '600',
    letterSpacing: 0.4,
  },
  versionBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginTop: theme.spacing.sm,
    paddingHorizontal: 14,
    paddingVertical: 7,
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderRadius: theme.radius.full,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.18)',
  },
  versionText: {
    fontSize: theme.typography.micro,
    color: 'rgba(255,255,255,0.80)',
    fontWeight: '600',
    letterSpacing: 0.3,
  },

  // ── Cards ──
  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.xl,
    borderWidth: 1,
    borderColor: theme.card.border,
    overflow: 'hidden',
    marginHorizontal: theme.spacing.md,
    ...theme.card.shadow.md,
  },
  cardTopBar: {
    height: 3,
    backgroundColor: theme.brand.gold,
  },
  cardInner: {
    padding: theme.spacing.md,
    gap: theme.spacing.sm,
  },
  cardTitle: {
    fontSize: theme.typography.subtitle,
    fontWeight: '800',
    color: theme.colors.text,
    letterSpacing: -0.3,
  },
  cardSubtitle: {
    fontSize: theme.typography.small,
    color: theme.colors.textMuted,
    lineHeight: theme.typography.lineHeightBody,
  },

  // ── Form ──
  fields: {
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.xs,
  },
  field: {
    gap: 6,
  },
  fieldLabel: {
    fontSize: theme.typography.small,
    fontWeight: '700',
    color: theme.colors.textSecondary,
    letterSpacing: 0.1,
  },
  input: {
    height: 50,
    borderRadius: theme.radius.md,
    borderWidth: 1.5,
    borderColor: theme.control.inputBorder,
    backgroundColor: theme.colors.surfaceVariant,
    paddingHorizontal: theme.spacing.md,
    fontSize: theme.typography.body,
    color: theme.colors.text,
  },
  inputWrap: {
    position: 'relative',
  },
  inputWithIcon: {
    paddingRight: 48,
  },
  eyeBtn: {
    position: 'absolute',
    right: 14,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  eyeBtnPressed: {
    opacity: 0.72,
  },

  // ── Quick Login ──
  quickList: {
    gap: theme.spacing.sm,
  },
  quickCard: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
    borderRadius: theme.radius.lg,
    borderWidth: 1.5,
    padding: theme.spacing.sm + 2,
    alignItems: 'flex-start',
    ...theme.card.shadow.sm,
  },
  quickPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.984 }],
  },
  roleIconWrap: {
    width: 36,
    height: 36,
    borderRadius: theme.radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  quickTextWrap: {
    flex: 1,
    gap: 2,
  },
  quickRole: {
    fontSize: theme.typography.micro,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  quickName: {
    fontSize: theme.typography.body,
    fontWeight: '700',
    color: theme.colors.text,
  },
  quickInfo: {
    fontSize: theme.typography.caption,
    color: theme.colors.textMuted,
    fontFamily: undefined,
  },
  quickDescription: {
    marginTop: 2,
    fontSize: theme.typography.caption,
    lineHeight: theme.typography.lineHeightCaption,
    color: theme.colors.textMuted,
  },
});
