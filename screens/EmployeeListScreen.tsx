import { useMemo } from 'react';
import { Redirect, router } from 'expo-router';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { AccessDenied } from '../components/AccessDenied';
import { AppButton } from '../components/AppButton';
import { InfoCard } from '../components/InfoCard';
import { ScreenContainer } from '../components/ScreenContainer';
import { StatusPill } from '../components/StatusPill';
import { type AppTheme, useAppTheme } from '../utils/themeContext';
import { useAppData } from '../utils/appState';
import { formatCurrency } from '../utils/format';

export function EmployeeListScreen() {
  const { theme } = useAppTheme();
  const styles = useMemo(() => makeStyles(theme), [theme]);
  const { currentUser, employees, buildings, hasAccess, addDemoEmployee } = useAppData();

  if (!currentUser) {
    return <Redirect href="/login" />;
  }

  if (!hasAccess('employees')) {
    return (
      <ScreenContainer subtitle="This role cannot open employee records." title="Employee List">
        <AccessDenied title="Employee pages are restricted" />
      </ScreenContainer>
    );
  }

  const visibleEmployees =
    currentUser.role === 'staff' && currentUser.employeeId
      ? employees.filter((employee) => employee.id === currentUser.employeeId)
      : employees;

  return (
    <ScreenContainer contentStyle={styles.page} scroll={false} subtitle="Company staff, site employees, labour workers, and north Indian workers." title="Employee List">
      {currentUser.role === 'overallAdmin' ? <AppButton label="Add Demo Employee" onPress={addDemoEmployee} /> : null}
      <FlatList
        contentContainerStyle={styles.list}
        data={visibleEmployees}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => {
          const buildingName = buildings.find((building) => building.id === item.assignedBuildingId)?.buildingName ?? item.assignedBuildingId;
          const initials = item.employeeName.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase();

          return (
            <Pressable
              accessibilityRole="button"
              onPress={() => router.push(`/employee/${item.id}`)}
              style={({ pressed }) => [styles.cardPressable, pressed ? styles.cardPressed : undefined]}
            >
              <InfoCard subtitle={`${item.roleTitle} • ${item.category}`} title={item.employeeName} rightSlot={<StatusPill status={item.attendance.todayStatus} />}>
                <View style={styles.empRow}>
                  <View style={styles.avatar}>
                    <Text style={styles.avatarText}>{initials}</Text>
                  </View>
                  <View style={styles.empInfo}>
                    <View style={styles.metaRow}>
                      <Text style={styles.metaLabel}>Code</Text>
                      <Text style={styles.metaValue}>{item.employeeCode}</Text>
                    </View>
                    <View style={styles.metaRow}>
                      <Text style={styles.metaLabel}>Building</Text>
                      <Text style={styles.metaValue}>{buildingName}</Text>
                    </View>
                    <View style={styles.metaRow}>
                      <Text style={styles.metaLabel}>Salary</Text>
                      <Text style={[styles.metaValue, { color: theme.colors.primary }]}>{formatCurrency(item.salaryAmount)} / {item.salaryType}</Text>
                    </View>
                  </View>
                </View>
              </InfoCard>
            </Pressable>
          );
        }}
        showsVerticalScrollIndicator={false}
      />
    </ScreenContainer>
  );
}

function makeStyles(theme: AppTheme) { return StyleSheet.create({
  page: {
    flex: 1,
  },
  cardPressable: {
    borderRadius: theme.radius.lg,
  },
  cardPressed: {
    opacity: theme.isDark ? 0.96 : 0.92,
    transform: [{ scale: 0.994 }],
  },
  list: {
    paddingTop: theme.spacing.md,
    paddingBottom: 140,
    gap: theme.spacing.md,
  },
  empRow: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
    alignItems: 'flex-start',
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: theme.colors.primarySoft,
    borderWidth: 1.5,
    borderColor: theme.colors.primaryMuted,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  avatarText: {
    fontSize: theme.typography.small,
    fontWeight: '900',
    color: theme.colors.primary,
    letterSpacing: 0.5,
  },
  empInfo: {
    flex: 1,
    gap: 5,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  metaLabel: {
    fontSize: theme.typography.small,
    color: theme.colors.textMuted,
    fontWeight: '600',
    minWidth: 56,
  },
  metaValue: {
    fontSize: theme.typography.small,
    color: theme.colors.textSecondary,
    fontWeight: '700',
    flex: 1,
    textAlign: 'right',
  },
}); }