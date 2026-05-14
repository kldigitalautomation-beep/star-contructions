import { useState, useMemo } from 'react';
import { Alert, FlatList, StyleSheet, Text, TextInput, View } from 'react-native';
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
import { getVisibleLeaveRequests } from '../utils/visibility';

export function LeaveManagementScreen() {
  const { theme } = useAppTheme();
  const styles = useMemo(() => makeStyles(theme), [theme]);
  const { currentUser, employees, hasAccess, leaveRequests, requestLeave } = useAppData();
  const [selectedDays, setSelectedDays] = useState('1');
  const [reason, setReason] = useState('');

  if (!currentUser) {
    return <Redirect href="/login" />;
  }

  if (!hasAccess('leave')) {
    return (
      <ScreenContainer title="Leave Management" subtitle="This role cannot access leave records.">
        <AccessDenied title="Leave page is restricted" />
      </ScreenContainer>
    );
  }

  const visibleRequests = getVisibleLeaveRequests(currentUser, leaveRequests);
  const ownEmployee = employees.find((employee) => employee.id === currentUser.employeeId);

  return (
    <ScreenContainer contentStyle={styles.page} scroll={false} title="Leave Management" subtitle="All staff get 4 days leave per month. Extra leave causes salary deduction.">
      <FlatList
      contentContainerStyle={styles.list}
      data={visibleRequests}
      keyExtractor={(item) => item.id}
      ListEmptyComponent={<EmptyState title="No Leave Requests" description="No leave requests are available for this view." />}
      ListFooterComponent={<RemarksSection module="leave" referenceId={visibleRequests[0]?.employeeId ?? ownEmployee?.id ?? 'EMP001'} title="Leave Remarks" />}
      ListHeaderComponent={
        (ownEmployee || (currentUser.role === 'staff' && currentUser.employeeId)) ? (
          <View style={styles.headerCards}>
            {ownEmployee ? (
              <InfoCard title="Your Leave Summary" subtitle="Simple monthly rule view.">
                <View style={styles.leaveRow}>
                  <View style={styles.leaveChip}>
                    <Text style={styles.leaveChipLabel}>Used</Text>
                    <Text style={[styles.leaveChipValue, { color: theme.colors.warning }]}>{ownEmployee.leaveUsed}</Text>
                  </View>
                  <View style={styles.leaveChip}>
                    <Text style={styles.leaveChipLabel}>Balance</Text>
                    <Text style={[styles.leaveChipValue, { color: theme.colors.success }]}>{ownEmployee.leaveBalance}</Text>
                  </View>
                  <View style={styles.leaveChip}>
                    <Text style={styles.leaveChipLabel}>Extra</Text>
                    <Text style={[styles.leaveChipValue, { color: theme.colors.danger }]}>{ownEmployee.extraLeave}</Text>
                  </View>
                </View>
              </InfoCard>
            ) : null}
            {currentUser.role === 'staff' && currentUser.employeeId ? (
              <InfoCard title="Request Leave" subtitle="Submit a simple leave request.">
                <FilterChips onChange={setSelectedDays} selectedValue={selectedDays} values={['1', '2', '3', '4']} />
                <TextInput
                  multiline
                  onChangeText={setReason}
                  placeholder="Reason for leave"
                  placeholderTextColor={theme.colors.textMuted}
                  style={styles.input}
                  value={reason}
                />
                <AppButton
                  label="Submit Leave Request"
                  onPress={() => {
                    if (!reason.trim()) {
                      return;
                    }
                    requestLeave(currentUser.employeeId!, reason.trim(), Number(selectedDays));
                    setReason('');
                    Alert.alert('Leave submitted', 'The leave request has been added to the demo list.');
                  }}
                />
              </InfoCard>
            ) : null}
          </View>
        ) : null
      }
      renderItem={({ item }) => (
        <InfoCard subtitle={`${item.fromDate} to ${item.toDate}`} title={item.employeeName} rightSlot={<StatusPill status={item.status} />}>
          <View style={styles.metaRow}>
            <Text style={styles.meta}>Days</Text>
            <Text style={styles.metaValue}>{item.days}</Text>
          </View>
          <View style={styles.metaRow}>
            <Text style={styles.meta}>Reason</Text>
            <Text style={styles.metaValue}>{item.reason}</Text>
          </View>
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
  headerCards: {
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.sm,
  },
  leaveRow: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
  },
  leaveChip: {
    flex: 1,
    borderRadius: theme.radius.md,
    backgroundColor: theme.colors.surfaceVariant,
    borderWidth: 1,
    borderColor: theme.card.sectionBorder,
    padding: theme.spacing.sm,
    alignItems: 'center',
    gap: 2,
  },
  leaveChipLabel: {
    fontSize: theme.typography.caption,
    color: theme.colors.textMuted,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  leaveChipValue: {
    fontSize: 22,
    fontWeight: '800',
    color: theme.colors.text,
    letterSpacing: -0.5,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: theme.spacing.sm,
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
    flex: 1,
    textAlign: 'right',
  },
  input: {
    minHeight: 90,
    borderRadius: theme.radius.md,
    borderWidth: 1.5,
    borderColor: theme.control.inputBorder,
    backgroundColor: theme.colors.inputBg,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    fontSize: theme.typography.body,
    color: theme.colors.text,
    textAlignVertical: 'top',
  },
}); }