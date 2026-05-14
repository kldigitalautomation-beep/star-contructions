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
import { getVisibleMaterials } from '../utils/visibility';

export function MaterialsScreen() {
  const { theme } = useAppTheme();
  const styles = useMemo(() => makeStyles(theme), [theme]);
  const { currentUser, hasAccess, materials, updateMaterialPaymentStatus } = useAppData();
  const visibleMaterials = getVisibleMaterials(currentUser, materials);
  const filterValues = ['All', ...Array.from(new Set(visibleMaterials.map((material) => material.buildingId)))];
  const [selectedBuilding, setSelectedBuilding] = useState(filterValues[0] ?? 'All');

  if (!currentUser) {
    return <Redirect href="/login" />;
  }

  if (!hasAccess('materials')) {
    return (
      <ScreenContainer title="Materials" subtitle="This role cannot access material records.">
        <AccessDenied title="Materials page is restricted" />
      </ScreenContainer>
    );
  }

  const canEditPayment = currentUser.role === 'overallAdmin' || currentUser.role === 'paymentManager';
  const filteredMaterials = visibleMaterials.filter((material) =>
    selectedBuilding === 'All' ? true : material.buildingId === selectedBuilding,
  );
  const totalPurchase = filteredMaterials.reduce((sum, material) => sum + material.totalAmount, 0);

  return (
    <ScreenContainer contentStyle={styles.page} scroll={false} title="Materials" subtitle="Building-wise material list with quantity, rate, amount, vendor, delivery, and payment status.">
      {filterValues.length > 1 ? (
        <FilterChips onChange={setSelectedBuilding} selectedValue={selectedBuilding} values={filterValues} />
      ) : null}
      <FlatList
      contentContainerStyle={styles.list}
      data={filteredMaterials}
      keyExtractor={(item) => item.id}
      ListEmptyComponent={<EmptyState title="No Materials" description="No material records were found for this filter." />}
      ListFooterComponent={<RemarksSection module="materials" referenceId={filteredMaterials[0]?.id ?? 'MAT001'} title="Material Remarks" />}
      ListHeaderComponent={
        <InfoCard title="Material Summary" subtitle="Simple totals for the selected building filter.">
          <View style={styles.summaryRow}>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Total Purchase</Text>
              <Text style={[styles.summaryValue, { color: theme.colors.primary }]}>{formatCurrency(totalPurchase)}</Text>
            </View>
            <View style={styles.summaryDivider} />
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Records</Text>
              <Text style={styles.summaryValue}>{filteredMaterials.length}</Text>
            </View>
          </View>
        </InfoCard>
      }
      renderItem={({ item }) => (
        <InfoCard subtitle={`${item.materialName} • ${item.brand}`} title={item.usedBuilding} rightSlot={<StatusPill status={item.paymentStatus} />}>
          <View style={styles.metaGrid}>
            <View style={styles.metaRow}>
              <Text style={styles.meta}>Quantity</Text>
              <Text style={styles.metaValue}>{item.quantity} {item.unit}</Text>
            </View>
            <View style={styles.metaRow}>
              <Text style={styles.meta}>Rate</Text>
              <Text style={styles.metaValue}>{formatCurrency(item.rate)}</Text>
            </View>
            <View style={styles.metaRow}>
              <Text style={styles.meta}>Total Amount</Text>
              <Text style={[styles.metaValue, { color: theme.colors.primary }]}>{formatCurrency(item.totalAmount)}</Text>
            </View>
            <View style={styles.metaRow}>
              <Text style={styles.meta}>Vendor</Text>
              <Text style={styles.metaValue}>{item.vendorName}</Text>
            </View>
            <View style={styles.metaRow}>
              <Text style={styles.meta}>Delivery Date</Text>
              <Text style={styles.metaValue}>{item.deliveryDate}</Text>
            </View>
            <View style={styles.metaRow}>
              <Text style={styles.meta}>Used / Pending</Text>
              <Text style={styles.metaValue}>{item.usedQuantity} / {item.pendingQuantity}</Text>
            </View>
          </View>
          {canEditPayment ? (
            <View style={styles.buttonGroup}>
              <AppButton label="Mark Paid" onPress={() => updateMaterialPaymentStatus(item.id, 'Paid')} variant="secondary" />
              <AppButton label="Mark Partial" onPress={() => updateMaterialPaymentStatus(item.id, 'Partial')} variant="outline" />
              <AppButton label="Mark Pending" onPress={() => updateMaterialPaymentStatus(item.id, 'Pending')} variant="danger" />
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
  buttonGroup: {
    gap: theme.spacing.sm,
  },
}); }