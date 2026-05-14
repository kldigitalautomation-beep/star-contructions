import { StyleSheet, Text, View } from 'react-native';
import { Redirect, router } from 'expo-router';
import { AccessDenied } from '../components/AccessDenied';
import { AppButton } from '../components/AppButton';
import { InfoCard } from '../components/InfoCard';
import { ScreenContainer } from '../components/ScreenContainer';
import { roleAccess, roleLabels } from '../navigation/accessMap';
import { theme } from '../styles/theme';
import { useAppData } from '../utils/appState';

export function SettingsScreen() {
  const { currentUser, hasAccess, logout, users } = useAppData();

  if (!currentUser) {
    return <Redirect href="/login" />;
  }

  if (!hasAccess('settings')) {
    return (
      <ScreenContainer title="Settings" subtitle="This role cannot open admin settings.">
        <AccessDenied title="Settings are restricted" />
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer title="Settings" subtitle="Admin-only page for role access summary and demo user info.">
      <InfoCard title="Demo Access Matrix" subtitle="Role-based access used in this frontend demo.">
        {Object.entries(roleLabels).map(([role, label]) => (
          <View key={role} style={styles.groupBox}>
            <Text style={styles.roleLabel}>{label}</Text>
            <Text style={styles.roleModules}>{roleAccess[role as keyof typeof roleAccess].join(', ')}</Text>
          </View>
        ))}
      </InfoCard>

      <InfoCard title="Demo Login Users" subtitle="Quick reference for the four sample roles.">
        {users.map((user) => (
          <View key={user.id} style={styles.groupBox}>
            <Text style={styles.roleLabel}>{user.name}</Text>
            <Text style={styles.roleModules}>{user.email} • {roleLabels[user.role]}</Text>
          </View>
        ))}
      </InfoCard>

      <InfoCard title="App Controls" subtitle="Frontend-only controls for the demo app.">
        <View style={styles.buttonGroup}>
          <AppButton label="Go To Dashboard" onPress={() => router.replace('/(tabs)/dashboard')} />
          <AppButton label="Logout" onPress={() => { logout(); router.replace('/login'); }} variant="outline" />
        </View>
      </InfoCard>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  groupBox: {
    borderRadius: theme.radius.md,
    backgroundColor: theme.colors.surfaceVariant,
    borderWidth: 1,
    borderColor: theme.card.sectionBorder,
    borderLeftWidth: 3,
    borderLeftColor: theme.colors.primary,
    paddingVertical: theme.spacing.sm,
    paddingRight: theme.spacing.sm,
    paddingLeft: theme.spacing.sm + 2,
    gap: 3,
  },
  roleLabel: {
    fontSize: theme.typography.body,
    fontWeight: '800',
    color: theme.colors.text,
    letterSpacing: -0.2,
  },
  roleModules: {
    fontSize: theme.typography.small,
    lineHeight: theme.typography.lineHeightBody,
    color: theme.colors.textSecondary,
  },
  buttonGroup: {
    gap: theme.spacing.sm,
  },
});