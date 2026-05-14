import { useMemo } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { Redirect, router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, Text, View } from 'react-native';
import { AppButton } from '../components/AppButton';
import { InfoCard } from '../components/InfoCard';
import { MenuTile } from '../components/MenuTile';
import { ScreenContainer } from '../components/ScreenContainer';
import { StatusPill } from '../components/StatusPill';
import { moreMenuItems, roleDescriptions, roleLabels } from '../navigation/accessMap';
import { roleAccent } from '../styles/theme';
import { type AppTheme, useAppTheme } from '../utils/themeContext';
import { useAppData } from '../utils/appState';

export function MoreScreen() {
  const { theme } = useAppTheme();
  const styles = useMemo(() => makeStyles(theme), [theme]);
  const { currentUser, hasAccess, logout } = useAppData();

  if (!currentUser) {
    return <Redirect href="/login" />;
  }

  const allowedMenuItems = moreMenuItems.filter((item) => hasAccess(item.key));
  const accent = roleAccent[currentUser.role] ?? theme.colors.primary;

  return (
    <ScreenContainer title="More Modules" subtitle="Open the extra pages that match this login role.">
      {/* ── Premium Profile Card ── */}
      <LinearGradient
        colors={theme.isDark
          ? [`${accent}28`, `${accent}10`, theme.colors.surface]
          : [`${accent}14`, `${accent}06`, theme.colors.surface]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.profileCard, { borderColor: `${accent}${theme.isDark ? '28' : '18'}` }]}
      >
        <View style={styles.profileRow}>
          <View style={[styles.profileAvatar, { backgroundColor: `${accent}${theme.isDark ? '28' : '18'}`, borderColor: `${accent}${theme.isDark ? '50' : '36'}` }]}>
            <Ionicons color={accent} name="person" size={26} />
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>{currentUser.name}</Text>
            <Text style={styles.profileEmail}>{currentUser.email}</Text>
            <StatusPill status={roleLabels[currentUser.role]} />
          </View>
        </View>
        <View style={[styles.profileDivider, { backgroundColor: `${accent}${theme.isDark ? '20' : '14'}` }]} />
        <Text style={styles.description}>{roleDescriptions[currentUser.role]}</Text>
      </LinearGradient>

      <View style={styles.menuList}>
        {allowedMenuItems.map((item) => (
          <MenuTile key={item.key} description={item.description} icon={item.icon} label={item.label} onPress={() => router.push(item.route)} />
        ))}
      </View>

      <InfoCard title="Quick Exit" subtitle="Logout is always available here.">
        <AppButton
          label="Logout"
          onPress={() => {
            logout();
            router.replace('/login');
          }}
          variant="outline"
        />
      </InfoCard>
    </ScreenContainer>
  );
}

function makeStyles(theme: AppTheme) { return StyleSheet.create({
  profileCard: {
    borderRadius: theme.radius.xxl,
    padding: theme.spacing.md,
    gap: theme.spacing.sm,
  
  },
  profileRow: {
    flexDirection: 'row',
    gap: theme.spacing.md,
    alignItems: 'center',
  },
  profileAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2.5,
    flexShrink: 0,
  },
  profileInfo: {
    flex: 1,
    gap: 4,
  },
  profileName: {
    fontSize: theme.typography.subtitle,
    fontWeight: '800',
    color: theme.colors.text,
    letterSpacing: -0.3,
  },
  profileEmail: {
    fontSize: theme.typography.small,
    color: theme.colors.textMuted,
    marginBottom: 2,
  },
  profileDivider: {
    height: 1,
    borderRadius: 1,
    marginVertical: 2,
  },
  description: {
    fontSize: theme.typography.small,
    lineHeight: theme.typography.lineHeightBody,
    color: theme.colors.textMuted,
  },
  menuList: {
    gap: theme.spacing.sm,
  },
}); }