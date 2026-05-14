import { useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { Redirect, router, useLocalSearchParams } from 'expo-router';
import { AccessDenied } from '../components/AccessDenied';
import { AppButton } from '../components/AppButton';
import { EmptyState } from '../components/EmptyState';
import { InfoCard } from '../components/InfoCard';
import { InfoRow } from '../components/InfoRow';
import { ProgressBar } from '../components/ProgressBar';
import { RemarksSection } from '../components/RemarksSection';
import { ScreenContainer } from '../components/ScreenContainer';
import { StatusPill } from '../components/StatusPill';
import { theme } from '../styles/theme';
import { useAppData } from '../utils/appState';
import { formatCurrency } from '../utils/format';

export function BuildingDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { addDailyUpdate, buildings, currentUser, deleteBuilding, employees, hasAccess, materials, updateBuilding, vendors } = useAppData();
  const building = buildings.find((entry) => entry.id === id);
  const [clientName, setClientName] = useState(building?.clientName ?? '');
  const [approvalStatus, setApprovalStatus] = useState(building?.approvalStatus ?? '');
  const [progress, setProgress] = useState(String(building?.constructionProgress ?? 0));
  const [dailyNote, setDailyNote] = useState('');

  if (!currentUser) {
    return <Redirect href="/login" />;
  }

  if (!hasAccess('buildings')) {
    return (
      <ScreenContainer title="Building Details" subtitle="This role cannot open building details.">
        <AccessDenied title="Building details are restricted" />
      </ScreenContainer>
    );
  }

  if (!building) {
    return (
      <ScreenContainer title="Building Details" subtitle="The selected building was not found.">
        <EmptyState title="Building not found" description="Go back to the building list and choose another record." />
      </ScreenContainer>
    );
  }

  const buildingEmployees = employees.filter((employee) => building.employeeIds.includes(employee.id));
  const buildingMaterials = materials.filter((material) => material.buildingId === building.id);
  const buildingVendors = vendors.filter((vendor) => building.vendorIds.includes(vendor.id));
  const canEdit = currentUser.role === 'overallAdmin' || currentUser.role === 'leadManager';
  const canAddDailyUpdate = canEdit || (currentUser.role === 'staff' && currentUser.assignedBuildingId === building.id);
  const profitLoss = building.totalReceivedPayment - building.totalExpense;

  const onSave = () => {
    updateBuilding(building.id, {
      clientName,
      approvalStatus,
      constructionProgress: Number(progress) || building.constructionProgress,
    });
    Alert.alert('Building updated', 'The building record has been updated in the demo.');
  };

  return (
    <ScreenContainer title={building.buildingName} subtitle={`${building.clientName} • ${building.siteAddress}`}>
      <InfoCard title="Project Summary" rightSlot={<StatusPill status={building.approvalStatus} />}>
        <ProgressBar label="Construction Progress" value={building.constructionProgress} />
        <InfoRow label="Floors" value={String(building.floors)} />
        <InfoRow label="Area" value={building.buildingArea} />
        <InfoRow label="Agreement" value={building.agreementDetails} />
        <InfoRow label="Plan PDF" value={building.planLayoutPdfName} />
        <InfoRow label="Total Expense" value={formatCurrency(building.totalExpense)} />
        <InfoRow label="Received Payment" value={formatCurrency(building.totalReceivedPayment)} />
        <InfoRow label="Profit / Loss" value={formatCurrency(profitLoss)} />
      </InfoCard>

      {canEdit ? (
        <InfoCard title="Site Edit" subtitle="Lead and admin can adjust progress, client name, and approval status.">
          <TextInput onChangeText={setClientName} placeholder="Client name" placeholderTextColor={theme.colors.textMuted} style={styles.input} value={clientName} />
          <TextInput onChangeText={setApprovalStatus} placeholder="Approval status" placeholderTextColor={theme.colors.textMuted} style={styles.input} value={approvalStatus} />
          <TextInput keyboardType="numeric" onChangeText={setProgress} placeholder="Progress percentage" placeholderTextColor={theme.colors.textMuted} style={styles.input} value={progress} />
          <View style={styles.buttonGroup}>
            <AppButton label="Save Building" onPress={onSave} />
            {currentUser.role === 'overallAdmin' ? (
              <AppButton
                label="Delete Building"
                onPress={() => {
                  deleteBuilding(building.id);
                  router.replace('/(tabs)/buildings');
                }}
                variant="danger"
              />
            ) : null}
          </View>
        </InfoCard>
      ) : null}

      <InfoCard title="Construction Approvals" subtitle="VST, UDG, Panchayat, LPA, bank, tax, engineer, and online approvals.">
        {Object.entries(building.approvals).map(([label, approval]) => (
          <View key={label} style={styles.groupBox}>
            <InfoRow label={label} value={approval.status} />
            <InfoRow label="Date" value={approval.date} />
            <InfoRow label="Amount" value={formatCurrency(approval.amount)} />
            <InfoRow label="Remarks" value={approval.remarks} />
            <InfoRow label="Uploaded PDF" value={approval.pdfName} />
          </View>
        ))}
      </InfoCard>

      <InfoCard title="Building-wise Labour List" subtitle="Mason, carpenter, painter, welder, electrician, plumber, and helpers.">
        {building.labourList.map((labour) => (
          <InfoRow key={labour.title} label={labour.title} value={String(labour.count)} />
        ))}
      </InfoCard>

      <InfoCard title="Material Status & Sales" subtitle="Purchased, used, pending, vendor payment, and overall cost status.">
        <InfoRow label="Total Material Purchased" value={formatCurrency(building.materialsSummary.purchased)} />
        <InfoRow label="Used Materials" value={formatCurrency(building.materialsSummary.used)} />
        <InfoRow label="Pending Materials" value={formatCurrency(building.materialsSummary.pending)} />
        {buildingMaterials.map((material) => (
          <InfoRow key={material.id} label={`${material.materialName} • ${material.brand}`} value={material.paymentStatus} />
        ))}
      </InfoCard>

      <InfoCard title="Employee List" subtitle="Assigned employees for this building.">
        {buildingEmployees.map((employee) => (
          <Pressable key={employee.id} onPress={() => router.push(`/employee/${employee.id}`)} style={styles.linkRow}>
            <Text style={styles.linkTitle}>{employee.employeeName}</Text>
            <Text style={styles.linkMeta}>{employee.roleTitle}</Text>
          </Pressable>
        ))}
      </InfoCard>

      <InfoCard title="Vendor Details" subtitle="Building-wise vendor list for materials and services.">
        {buildingVendors.map((vendor) => (
          <InfoRow key={vendor.id} label={vendor.vendorName} value={`${vendor.materialType} • ${formatCurrency(vendor.paymentPending)} pending`} />
        ))}
      </InfoCard>

      <InfoCard title="Daily Work Updates" subtitle="Lead and assigned staff can add site updates.">
        {canAddDailyUpdate ? (
          <>
            <TextInput
              multiline
              onChangeText={setDailyNote}
              placeholder="Add simple daily work update"
              placeholderTextColor={theme.colors.textMuted}
              style={[styles.input, styles.multiline]}
              value={dailyNote}
            />
            <AppButton
              label="Add Work Update"
              onPress={() => {
                if (!dailyNote.trim()) {
                  return;
                }
                addDailyUpdate(building.id, dailyNote.trim());
                setDailyNote('');
                Alert.alert('Update added', 'The daily site update has been added.');
              }}
            />
          </>
        ) : null}
        {building.dailyUpdates.map((update) => (
          <View key={`${update.date}-${update.note}`} style={styles.groupBox}>
            <Text style={styles.updateDate}>{update.date}</Text>
            <Text style={styles.updateText}>{update.note}</Text>
          </View>
        ))}
      </InfoCard>

      <RemarksSection module="buildings" referenceId={building.id} title="Building Remarks" />
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
  multiline: {
    height: undefined,
    minHeight: 100,
    paddingTop: theme.spacing.sm,
    textAlignVertical: 'top',
  },
  buttonGroup: {
    gap: theme.spacing.sm,
  },
  groupBox: {
    borderRadius: theme.radius.md,
    backgroundColor: theme.colors.surfaceVariant,
    borderWidth: 1,
    borderColor: theme.card.sectionBorder,
    borderLeftWidth: 3,
    borderLeftColor: theme.colors.primaryDark,
    padding: theme.spacing.sm,
    paddingLeft: theme.spacing.sm + 2,
    gap: 4,
  },
  linkRow: {
    borderRadius: theme.radius.md,
    backgroundColor: theme.colors.surfaceVariant,
    borderWidth: 1,
    borderColor: theme.card.sectionBorder,
    padding: theme.spacing.sm,
    gap: 2,
  },
  linkTitle: {
    fontSize: theme.typography.body,
    fontWeight: '800',
    color: theme.colors.text,
    letterSpacing: -0.2,
  },
  linkMeta: {
    fontSize: theme.typography.small,
    color: theme.colors.textSecondary,
  },
  updateDate: {
    fontSize: theme.typography.caption,
    fontWeight: '700',
    color: theme.colors.primary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  updateText: {
    fontSize: theme.typography.body,
    color: theme.colors.text,
    fontWeight: '600',
    lineHeight: theme.typography.lineHeightBody,
  },
});