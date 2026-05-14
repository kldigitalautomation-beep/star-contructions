import { useMemo } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { Redirect } from 'expo-router';
import { AccessDenied } from '../components/AccessDenied';
import { ScreenContainer } from '../components/ScreenContainer';
import { EmptyState } from '../components/EmptyState';
import { InfoCard } from '../components/InfoCard';
import { RemarksSection } from '../components/RemarksSection';
import { StatusPill } from '../components/StatusPill';
import { type AppTheme, useAppTheme } from '../utils/themeContext';
import { useAppData } from '../utils/appState';
import { formatCurrency } from '../utils/format';
import { getVisibleVendors } from '../utils/visibility';

export function VendorsScreen() {
  const { theme } = useAppTheme();
  const styles = useMemo(() => makeStyles(theme), [theme]);
  const { currentUser, hasAccess, vendors } = useAppData();

  if (!currentUser) {
    return <Redirect href="/login" />;
  }

  if (!hasAccess('vendors')) {
    return (
      <ScreenContainer title="Vendors" subtitle="This role cannot access vendor records.">
        <AccessDenied title="Vendor page is restricted" />
      </ScreenContainer>
    );
  }

  const visibleVendors = getVisibleVendors(currentUser, vendors);

  return (
    <ScreenContainer contentStyle={styles.page} scroll={false} title="Vendors" subtitle="Vendor name, phone, material type, purchase totals, pending payments, GST, and address.">
      <FlatList
      contentContainerStyle={styles.list}
      data={visibleVendors}
      keyExtractor={(item) => item.id}
      ListEmptyComponent={<EmptyState title="No Vendors" description="No vendor records are available for this role." />}
      ListFooterComponent={<RemarksSection module="vendors" referenceId={visibleVendors[0]?.id ?? 'VND001'} title="Vendor Remarks" />}
      renderItem={({ item }) => (
        <InfoCard subtitle={item.materialType} title={item.vendorName} rightSlot={<StatusPill status={item.paymentPending > 0 ? 'Pending' : 'Paid'} />}>
          <View style={styles.metaGrid}>
            <View style={styles.metaRow}>
              <Text style={styles.meta}>Phone</Text>
              <Text style={styles.metaValue}>{item.phone}</Text>
            </View>
            <View style={styles.metaRow}>
              <Text style={styles.meta}>Pending Amount</Text>
              <Text style={[styles.metaValue, item.paymentPending > 0 ? { color: theme.colors.warning } : {}]}>{formatCurrency(item.paymentPending)}</Text>
            </View>
            <View style={styles.metaRow}>
              <Text style={styles.meta}>Total Purchase</Text>
              <Text style={[styles.metaValue, { color: theme.colors.primary }]}>{formatCurrency(item.totalPurchase)}</Text>
            </View>
            <View style={styles.metaRow}>
              <Text style={styles.meta}>GST</Text>
              <Text style={styles.metaValue}>{item.gstNumber}</Text>
            </View>
            <View style={styles.metaRow}>
              <Text style={styles.meta}>Address</Text>
              <Text style={styles.metaValue}>{item.address}</Text>
            </View>
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
}); }