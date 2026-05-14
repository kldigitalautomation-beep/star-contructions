import { useState, useMemo } from 'react';
import { Alert, StyleSheet, Text, TextInput, View } from 'react-native';
import { Redirect, router, useLocalSearchParams } from 'expo-router';
import { AccessDenied } from '../components/AccessDenied';
import { AppButton } from '../components/AppButton';
import { EmptyState } from '../components/EmptyState';
import { InfoCard } from '../components/InfoCard';
import { InfoRow } from '../components/InfoRow';
import { RemarksSection } from '../components/RemarksSection';
import { ScreenContainer } from '../components/ScreenContainer';
import { StatusPill } from '../components/StatusPill';
import { type AppTheme, useAppTheme } from '../utils/themeContext';
import { useAppData } from '../utils/appState';
import { formatCurrency } from '../utils/format';

export function LandDetailsScreen() {
  const { theme } = useAppTheme();
  const styles = useMemo(() => makeStyles(theme), [theme]);
  const { id } = useLocalSearchParams<{ id: string }>();
  const { currentUser, lands, hasAccess, updateLand, deleteLand } = useAppData();
  const land = lands.find((entry) => entry.id === id);
  const [ownerName, setOwnerName] = useState(land?.ownerName ?? '');
  const [approvalStatus, setApprovalStatus] = useState(land?.approvalStatus ?? '');
  const [purchaseAmount, setPurchaseAmount] = useState(String(land?.purchaseAmount ?? ''));

  if (!currentUser) {
    return <Redirect href="/login" />;
  }

  if (!hasAccess('lands')) {
    return (
      <ScreenContainer title="Land Details" subtitle="This role cannot open land details.">
        <AccessDenied title="Land details are restricted" />
      </ScreenContainer>
    );
  }

  if (!land) {
    return (
      <ScreenContainer title="Land Details" subtitle="The selected land was not found.">
        <EmptyState title="Land not found" description="Go back to the land list and choose another record." />
      </ScreenContainer>
    );
  }

  const canEdit = currentUser.role === 'overallAdmin';
  const totalExpense = land.expenses.reduce((sum, expense) => sum + expense.amount, 0);

  const onSave = () => {
    updateLand(land.id, {
      ownerName,
      approvalStatus,
      purchaseAmount: Number(purchaseAmount) || land.purchaseAmount,
    });
    Alert.alert('Land updated', 'The demo land details have been updated.');
  };

  return (
    <ScreenContainer title={land.landName} subtitle={`${land.location} • ${land.totalArea}`}>
      <InfoCard title="Land Summary" rightSlot={<StatusPill status={land.approvalStatus} />}>
        <InfoRow label="Survey Number" value={land.surveyNumber} />
        <InfoRow label="Owner Name" value={land.ownerName} />
        <InfoRow label="Broker Details" value={land.brokerDetails} />
        <InfoRow label="Purchase Amount" value={formatCurrency(land.purchaseAmount)} />
        <InfoRow label="Registration" value={land.registrationDetails} />
        <InfoRow label="Layout PDF" value={land.layoutPdfName} />
        <InfoRow label="Land Sale Details" value={land.landSaleDetails} />
      </InfoCard>

      {canEdit ? (
        <InfoCard title="Admin Edit" subtitle="Quick demo edit for land master details.">
          <TextInput onChangeText={setOwnerName} placeholder="Owner name" placeholderTextColor={theme.colors.textMuted} style={styles.input} value={ownerName} />
          <TextInput onChangeText={setApprovalStatus} placeholder="Approval status" placeholderTextColor={theme.colors.textMuted} style={styles.input} value={approvalStatus} />
          <TextInput keyboardType="numeric" onChangeText={setPurchaseAmount} placeholder="Purchase amount" placeholderTextColor={theme.colors.textMuted} style={styles.input} value={purchaseAmount} />
          <View style={styles.actionRow}>
            <AppButton label="Save Land" onPress={onSave} />
            <AppButton
              label="Delete Land"
              onPress={() => {
                deleteLand(land.id);
                router.replace('/(tabs)/lands');
              }}
              variant="danger"
            />
          </View>
        </InfoCard>
      ) : null}

      <InfoCard title="Plot Details" subtitle="Simple plot stock and sales view.">
        {land.plotDetails.map((plot) => (
          <InfoRow key={plot.plotNumber} label={`${plot.plotNumber} • ${plot.plotSize}`} value={plot.status} />
        ))}
      </InfoCard>

      <InfoCard title="Plot Sales" subtitle="Buyer, payment, registration, and agreement details.">
        {land.plotSales.map((sale) => (
          <View key={sale.id} style={styles.groupBox}>
            <InfoRow label="Buyer" value={sale.buyerName} />
            <InfoRow label="Phone" value={sale.buyerPhoneNumber} />
            <InfoRow label="Plot" value={`${sale.plotNumber} • ${sale.plotSize}`} />
            <InfoRow label="Sale Amount" value={formatCurrency(sale.saleAmount)} />
            <InfoRow label="Advance" value={formatCurrency(sale.advanceAmount)} />
            <InfoRow label="Balance" value={formatCurrency(sale.balanceAmount)} />
            <InfoRow label="Registration Date" value={sale.registrationDate} />
            <InfoRow label="Broker Commission" value={formatCurrency(sale.brokerCommission)} />
            <InfoRow label="Agreement PDF" value={sale.agreementCopyPdf} />
            <InfoRow label="Payment Status" value={sale.paymentStatus} />
            <InfoRow label="Approval Note" value={sale.landApprovalDetails} />
          </View>
        ))}
      </InfoCard>

      <InfoCard title="Land Expense Details" subtitle={`Total expense ${formatCurrency(totalExpense)}`}>
        {land.expenses.map((expense) => (
          <InfoRow key={expense.name} label={expense.name} value={formatCurrency(expense.amount)} />
        ))}
      </InfoCard>

      <InfoCard title="Approval Details" subtitle="DTCP, local body, RERA, legal, and registration status.">
        {Object.entries(land.approvals).map(([label, approval]) => (
          <View key={label} style={styles.groupBox}>
            <InfoRow label={label} value={approval.status} />
            <InfoRow label="Date" value={approval.date} />
            <InfoRow label="Amount" value={formatCurrency(approval.amount)} />
            <InfoRow label="Remarks" value={approval.remarks} />
            <InfoRow label="PDF" value={approval.pdfName} />
          </View>
        ))}
      </InfoCard>

      <InfoCard title="Plot Maintenance" subtitle="Cleaning, compound, EB, road, water, and drainage status.">
        <InfoRow label="Plot Cleaning" value={land.maintenance.plotCleaning} />
        <InfoRow label="Compound Status" value={land.maintenance.compoundStatus} />
        <InfoRow label="EB Status" value={land.maintenance.ebStatus} />
        <InfoRow label="Road Status" value={land.maintenance.roadStatus} />
        <InfoRow label="Security" value={land.maintenance.securityDetails} />
        <InfoRow label="Water" value={land.maintenance.waterConnection} />
        <InfoRow label="Drainage" value={land.maintenance.drainage} />
      </InfoCard>

      <RemarksSection module="lands" referenceId={land.id} title="Land Remarks" />
    </ScreenContainer>
  );
}

function makeStyles(theme: AppTheme) { return StyleSheet.create({
  input: {
    height: 52,
    borderRadius: theme.radius.md,
    borderWidth: 1.5,
    borderColor: theme.control.inputBorder,
    backgroundColor: theme.colors.inputBg,
    paddingHorizontal: theme.spacing.md,
    fontSize: theme.typography.body,
    color: theme.colors.text,
  },
  actionRow: {
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
}); }