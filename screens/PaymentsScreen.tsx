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
import { formatCurrency } from '../utils/format';
import { getVisiblePayments } from '../utils/visibility';

export function PaymentsScreen() {
  const { theme } = useAppTheme();
  const styles = useMemo(() => makeStyles(theme), [theme]);
  const { currentUser, hasAccess, payments, updatePaymentStatus } = useAppData();
  const visiblePayments = getVisiblePayments(currentUser, payments);
  const filterValues = ['All', ...Array.from(new Set(visiblePayments.map((payment) => payment.buildingId).filter(Boolean))) as string[]];
  const [selectedBuilding, setSelectedBuilding] = useState(filterValues[0] ?? 'All');

  if (!currentUser) {
    return <Redirect href="/login" />;
  }

  if (!hasAccess('payments')) {
    return (
      <ScreenContainer title="Payments" subtitle="This role cannot access payment records.">
        <AccessDenied title="Payments page is restricted" />
      </ScreenContainer>
    );
  }

  const filteredPayments = visiblePayments.filter((payment) =>
    selectedBuilding === 'All' ? true : payment.buildingId === selectedBuilding,
  );
  const pendingTotal = filteredPayments.filter((payment) => payment.status !== 'Paid').reduce((sum, payment) => sum + payment.amount, 0);

  return (
    <ScreenContainer contentStyle={styles.page} scroll={false} title="Payments" subtitle="Salary, vendor, labour, material, weekly, and monthly payment tracking.">
      {filterValues.length > 1 ? (
        <FilterChips onChange={setSelectedBuilding} selectedValue={selectedBuilding} values={filterValues} />
      ) : null}
      <FlatList
      contentContainerStyle={styles.list}
      data={filteredPayments}
      keyExtractor={(item) => item.id}
      ListEmptyComponent={<EmptyState title="No Payment Records" description="No payments were found for this filter." />}
      ListFooterComponent={<RemarksSection module="payments" referenceId={filteredPayments[0]?.id ?? 'PAY001'} title="Payment Remarks" />}
      ListHeaderComponent={
        <InfoCard title="Payment Summary" subtitle="Building-wise totals and pending amount.">
          <View style={styles.summaryRow}>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Pending Amount</Text>
              <Text style={[styles.summaryValue, { color: theme.colors.warning }]}>{formatCurrency(pendingTotal)}</Text>
            </View>
            <View style={styles.summaryDivider} />
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Total Records</Text>
              <Text style={styles.summaryValue}>{filteredPayments.length}</Text>
            </View>
          </View>
        </InfoCard>
      }
      renderItem={({ item }) => (
        <InfoCard subtitle={`${item.category} • ${item.frequency}`} title={item.title} rightSlot={<StatusPill status={item.status} />}>
          <View style={styles.metaGrid}>
            <View style={styles.metaRow}>
              <Text style={styles.meta}>Paid To</Text>
              <Text style={styles.metaValue}>{item.paidTo}</Text>
            </View>
            <View style={styles.metaRow}>
              <Text style={styles.meta}>Amount</Text>
              <Text style={[styles.metaValue, { color: theme.colors.primary }]}>{formatCurrency(item.amount)}</Text>
            </View>
            <View style={styles.metaRow}>
              <Text style={styles.meta}>Due Date</Text>
              <Text style={styles.metaValue}>{item.dueDate}</Text>
            </View>
            <View style={styles.metaRow}>
              <Text style={styles.meta}>Building</Text>
              <Text style={styles.metaValue}>{item.buildingId ?? 'General'}</Text>
            </View>
          </View>
          {item.remarks ? <Text style={styles.remarks}>{item.remarks}</Text> : null}
          <View style={styles.buttonGroup}>
            <AppButton label="Mark Paid" onPress={() => updatePaymentStatus(item.id, 'Paid')} variant="secondary" />
            <AppButton label="Mark Partial" onPress={() => updatePaymentStatus(item.id, 'Partial')} variant="outline" />
            <AppButton label="Mark Pending" onPress={() => updatePaymentStatus(item.id, 'Pending')} variant="danger" />
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
  summaryRow: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
  },
  summaryItem: {
    flex: 1,
    gap: 2,
  },
  summaryDivider: {
    width: 1,
    backgroundColor: theme.colors.divider,
  },
  summaryLabel: {
    fontSize: theme.typography.caption,
    color: theme.colors.textMuted,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  summaryValue: {
    fontSize: theme.typography.subtitle,
    fontWeight: '800',
    color: theme.colors.text,
    letterSpacing: -0.3,
  },
  metaGrid: {
    gap: 6,
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
    textAlign: 'right',
    flex: 1,
    paddingLeft: theme.spacing.sm,
  },
  remarks: {
    fontSize: theme.typography.caption,
    color: theme.colors.textLight,
    fontStyle: 'italic',
    lineHeight: theme.typography.lineHeightCaption,
  },
  buttonGroup: {
    gap: theme.spacing.sm,
  },
}); }