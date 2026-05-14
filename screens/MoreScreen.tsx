import { Ionicons } from '@expo/vector-icons';
import { Redirect, router } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import { AppButton } from '../components/AppButton';
import { InfoCard } from '../components/InfoCard';
import { MenuTile } from '../components/MenuTile';
import { ScreenContainer } from '../components/ScreenContainer';
import { StatusPill } from '../components/StatusPill';
import { moreMenuItems, roleDescriptions, roleLabels } from '../navigation/accessMap';
import { roleAccent, theme } from '../styles/theme';
import { useAppData } from '../utils/appState';

export function MoreScreen() {
  const { currentUser, hasAccess, logout } = useAppData();

  if (!currentUser) {
    return <Redirect href="/login" />;
  }

  const allowedMenuItems = moreMenuItems.filter((item) => hasAccess(item.key));

  return (
    <ScreenContainer title="More Modules" subtitle="Open the extra pages that match this login role.">
      <InfoCard title={currentUser.name} subtitle={currentUser.email}>
        <View style={styles.profileRow}>
          <View style={[styles.profileAvatar, { backgroundColor: (roleAccent[currentUser.role] ?? theme.colors.primary) + '22', borderColor: (roleAccent[currentUser.role] ?? theme.colors.primary) + '44' }]}>
            <Ionicons color={roleAccent[currentUser.role] ?? theme.colors.primary} name="person" size={22} />
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

const styles = StyleSheet.create({
  profileRow: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
    alignItems: 'flex-start',
  },
  profileAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    flexShrink: 0,
  },
  profileInfo: {
    flex: 1,
    gap: 6,
  },
  description: {
    fontSize: theme.typography.small,
    lineHeight: theme.typography.lineHeightBody,
    color: theme.colors.textMuted,
  },
  menuList: {
    gap: theme.spacing.sm,
  },
});