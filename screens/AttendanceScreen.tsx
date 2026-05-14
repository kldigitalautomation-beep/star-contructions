import { useState, useMemo } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { Redirect } from 'expo-router';
import { AccessDenied } from '../components/AccessDenied';
import { ScreenContainer } from '../components/ScreenContainer';
import { AppButton } from '../components/AppButton';
import { EmptyState } from '../components/EmptyState';
import { FilterChips } from '../components/FilterChips';
import { InfoCard } from '../components/InfoCard';
import { RemarksSection } from '../components/RemarksSection';
import { StatusPill } from '../components/StatusPill';
import { type AppTheme, useAppTheme } from '../utils/themeContext';
import { useAppData } from '../utils/appState';
import { getVisibleBuildings, getVisibleEmployees } from '../utils/visibility';

export function AttendanceScreen() {
  const { theme } = useAppTheme();
  const styles = useMemo(() => makeStyles(theme), [theme]);
  const { buildings, currentUser, employees, hasAccess, updateAttendance } = useAppData();
  const visibleBuildings = getVisibleBuildings(currentUser, buildings);
  const filterValues = ['All', ...visibleBuildings.map((building) => building.id)];
  const [selectedBuilding, setSelectedBuilding] = useState(filterValues[0] ?? 'All');

  if (!currentUser) {
    return <Redirect href="/login" />;
  }

  if (!hasAccess('attendance')) {
    return (
      <ScreenContainer title="Attendance" subtitle="This role cannot access attendance records.">
        <AccessDenied title="Attendance page is restricted" />
      </ScreenContainer>
    );
  }

  const canEdit = currentUser.role === 'overallAdmin' || currentUser.role === 'leadManager';
  const visibleEmployees = getVisibleEmployees(currentUser, employees).filter((employee) =>
    selectedBuilding === 'All' ? true : employee.assignedBuildingId === selectedBuilding,
  );

  return (
    <ScreenContainer contentStyle={styles.page} scroll={false} title="Attendance" subtitle="Daily present, absent, and half day tracking.">
      {filterValues.length > 1 ? (
        <FilterChips onChange={setSelectedBuilding} selectedValue={selectedBuilding} values={filterValues} />
      ) : null}
      <FlatList
        contentContainerStyle={styles.list}
        data={visibleEmployees}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={<EmptyState title="No Attendance Records" description="No employees found for this filter." />}
        ListFooterComponent={<RemarksSection module="attendance" referenceId={visibleEmployees[0]?.id ?? 'EMP001'} title="Attendance Remarks" />}
        renderItem={({ item }) => (
          <InfoCard subtitle={`${item.roleTitle} • ${item.assignedBuildingId}`} title={item.employeeName} rightSlot={<StatusPill status={item.attendance.todayStatus} />}>
            <View style={styles.metaRow}>
              <Text style={styles.meta}>Working Days</Text>
              <Text style={styles.metaValue}>{item.attendance.present + item.attendance.halfDay + item.attendance.absent}</Text>
            </View>
            <View style={styles.metaRow}>
              <Text style={styles.meta}>Leave Used</Text>
              <Text style={styles.metaValue}>{item.leaveUsed} days ({item.extraLeave} extra)</Text>
            </View>
            {canEdit ? (
              <View style={styles.buttonGroup}>
                <AppButton label="Present" onPress={() => updateAttendance(item.id, 'Present')} variant="secondary" />
                <AppButton label="Half Day" onPress={() => updateAttendance(item.id, 'Half Day')} variant="outline" />
                <AppButton label="Absent" onPress={() => updateAttendance(item.id, 'Absent')} variant="danger" />
              </View>
            ) : null}
          </InfoCard>
        )}
        showsVerticalScrollIndicator={false}
      />
    </ScreenContainer>
  );
}

function makeStyles(theme: AppTheme) { return StyleSheet.create({
  page: {
    flex: 1,
  },
  list: {
    paddingBottom: 140,
    gap: theme.spacing.sm,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  meta: {
    fontSize: theme.typography.small,
    color: theme.colors.textMuted,
    fontWeight: '600',
  },
  metaValue: {
    fontSize: theme.typography.small,
    color: theme.colors.textSecondary,
    fontWeight: '700',
  },
  buttonGroup: {
    gap: theme.spacing.sm,
  },
}); }
