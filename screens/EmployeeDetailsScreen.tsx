import { useState } from 'react';
import { Alert, StyleSheet, TextInput, View } from 'react-native';
import { Redirect, useLocalSearchParams } from 'expo-router';
import { AccessDenied } from '../components/AccessDenied';
import { AppButton } from '../components/AppButton';
import { EmptyState } from '../components/EmptyState';
import { InfoCard } from '../components/InfoCard';
import { InfoRow } from '../components/InfoRow';
import { RemarksSection } from '../components/RemarksSection';
import { ScreenContainer } from '../components/ScreenContainer';
import { StatusPill } from '../components/StatusPill';
import { theme } from '../styles/theme';
import { useAppData } from '../utils/appState';
import { formatCurrency } from '../utils/format';

export function EmployeeDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { buildings, currentUser, employees, hasAccess, leaveRequests, updateAttendance, updateEmployee } = useAppData();
  const employee = employees.find((entry) => entry.id === id);
  const [roleTitle, setRoleTitle] = useState(employee?.roleTitle ?? '');
  const [assignedBuildingId, setAssignedBuildingId] = useState(employee?.assignedBuildingId ?? '');
  const [salaryAmount, setSalaryAmount] = useState(String(employee?.salaryAmount ?? ''));

  if (!currentUser) {
    return <Redirect href="/login" />;
  }

  if (!hasAccess('employees')) {
    return (
      <ScreenContainer title="Employee Details" subtitle="This role cannot open employee details.">
        <AccessDenied title="Employee details are restricted" />
      </ScreenContainer>
    );
  }

  if (currentUser.role === 'staff' && currentUser.employeeId !== id) {
    return (
      <ScreenContainer title="Employee Details" subtitle="Staff users can only see their own record.">
        <AccessDenied title="Only your own profile is available" />
      </ScreenContainer>
    );
  }

  if (!employee) {
    return (
      <ScreenContainer title="Employee Details" subtitle="The selected employee was not found.">
        <EmptyState title="Employee not found" description="Go back and choose another employee record." />
      </ScreenContainer>
    );
  }

  const buildingName = buildings.find((building) => building.id === employee.assignedBuildingId)?.buildingName ?? employee.assignedBuildingId;
  const employeeLeaves = leaveRequests.filter((leaveRequest) => leaveRequest.employeeId === employee.id);
  const canEdit = currentUser.role === 'overallAdmin';
  const canManageAttendance = currentUser.role === 'overallAdmin' || currentUser.role === 'leadManager';
  const canSeeSalary = currentUser.role === 'overallAdmin' || currentUser.role === 'paymentManager' || currentUser.employeeId === employee.id;

  const onSave = () => {
    updateEmployee(employee.id, {
      roleTitle,
      assignedBuildingId,
      salaryAmount: Number(salaryAmount) || employee.salaryAmount,
    });
    Alert.alert('Employee updated', 'The employee record has been updated.');
  };

  return (
    <ScreenContainer title={employee.employeeName} subtitle={`${employee.roleTitle} • ${employee.category}`}>
      <InfoCard title="Employee Summary" rightSlot={<StatusPill status={employee.attendance.todayStatus} />}>
        <InfoRow label="Employee ID" value={employee.employeeCode} />
        <InfoRow label="Mobile Number" value={employee.mobileNumber} />
        <InfoRow label="Assigned Building" value={buildingName} />
        <InfoRow label="Salary Type" value={employee.salaryType} />
        {canSeeSalary ? <InfoRow label="Salary Amount" value={formatCurrency(employee.salaryAmount)} /> : null}
      </InfoCard>

      {canEdit ? (
        <InfoCard title="Admin Edit" subtitle="Admins can change role, building, and salary value.">
          <TextInput onChangeText={setRoleTitle} placeholder="Role title" placeholderTextColor={theme.colors.textMuted} style={styles.input} value={roleTitle} />
          <TextInput onChangeText={setAssignedBuildingId} placeholder="Assigned building id" placeholderTextColor={theme.colors.textMuted} style={styles.input} value={assignedBuildingId} />
          <TextInput keyboardType="numeric" onChangeText={setSalaryAmount} placeholder="Salary amount" placeholderTextColor={theme.colors.textMuted} style={styles.input} value={salaryAmount} />
          <AppButton label="Save Employee" onPress={onSave} />
        </InfoCard>
      ) : null}

      <InfoCard title="Attendance & Leave" subtitle="Monthly 4 days leave rule with extra leave deduction.">
        <InfoRow label="Present Days" value={String(employee.attendance.present)} />
        <InfoRow label="Absent Days" value={String(employee.attendance.absent)} />
        <InfoRow label="Half Days" value={String(employee.attendance.halfDay)} />
        <InfoRow label="Leave Used" value={String(employee.leaveUsed)} />
        <InfoRow label="Extra Leave" value={String(employee.extraLeave)} />
        <InfoRow label="Leave Balance" value={String(employee.leaveBalance)} />
        {canManageAttendance ? (
          <View style={styles.buttonGroup}>
            <AppButton label="Mark Present" onPress={() => updateAttendance(employee.id, 'Present')} variant="secondary" />
            <AppButton label="Mark Half Day" onPress={() => updateAttendance(employee.id, 'Half Day')} variant="outline" />
            <AppButton label="Mark Absent" onPress={() => updateAttendance(employee.id, 'Absent')} variant="danger" />
          </View>
        ) : null}
      </InfoCard>

      <InfoCard title="Payment History" subtitle="Salary and wage history for this employee.">
        {employee.paymentHistory.map((payment) => (
          <InfoRow key={`${payment.date}-${payment.note}`} label={`${payment.date} • ${payment.note}`} value={formatCurrency(payment.amount)} />
        ))}
      </InfoCard>

      <InfoCard title="Leave Requests" subtitle="Submitted leave requests for this employee.">
        {employeeLeaves.map((leaveRequest) => (
          <InfoRow key={leaveRequest.id} label={`${leaveRequest.fromDate} to ${leaveRequest.toDate}`} value={`${leaveRequest.days} day(s) • ${leaveRequest.status}`} />
        ))}
      </InfoCard>

      <RemarksSection module="employees" referenceId={employee.id} title="Employee Remarks" />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  input: {
    height: 52,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.control.inputBorder,
    backgroundColor: theme.colors.surfaceElevated,
    paddingHorizontal: theme.spacing.md,
    fontSize: theme.typography.body,
    color: theme.colors.text,
  },
  buttonGroup: {
    gap: theme.spacing.sm,
  },
});