import { useMemo } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { Redirect, router } from 'expo-router';
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

  return (
    <ScreenContainer title="More Modules" subtitle="Open the extra pages that match this login role.">
      <InfoCard title={currentUser.name} subtitle={currentUser.email}>
        <View style={styles.profileRow}>
          <View style={[styles.profileAvatar, { backgroundColor: (roleAccent[currentUser.role] ?? theme.colors.primary) + (theme.isDark ? '28' : '18'), borderColor: (roleAccent[currentUser.role] ?? theme.colors.primary) + (theme.isDark ? '55' : '38') }]}>
            <Ionicons color={roleAccent[currentUser.role] ?? theme.colors.primary} name="person" size={24} />
          </View>
          <View style={styles.profileInfo}>
            <StatusPill status={roleLabels[currentUser.role]} />
            <Text style={styles.description}>{roleDescriptions[currentUser.role]}</Text>
          </View>
        </View>
      </InfoCard>

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
  profileRow: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
    alignItems: 'flex-start',
  },
  profileAvatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    flexShrink: 0,
  },
  profileInfo: {
    flex: 1,
    gap: 7,
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