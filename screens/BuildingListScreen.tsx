import { useMemo } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { Redirect, router } from 'expo-router';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { AccessDenied } from '../components/AccessDenied';
import { AppButton } from '../components/AppButton';
import { InfoCard } from '../components/InfoCard';
import { ProgressBar } from '../components/ProgressBar';
import { ScreenContainer } from '../components/ScreenContainer';
import { StatusPill } from '../components/StatusPill';
import { type AppTheme, useAppTheme } from '../utils/themeContext';
import { useAppData } from '../utils/appState';
import { formatCurrency } from '../utils/format';

export function BuildingListScreen() {
  const { theme } = useAppTheme();
  const styles = useMemo(() => makeStyles(theme), [theme]);
  const { currentUser, buildings, hasAccess, addDemoBuilding } = useAppData();

  const openBuilding = (buildingId: string) => {
    router.push(`/buildings/${buildingId}`);
  };

  if (!currentUser) {
    return <Redirect href="/login" />;
  }

  if (!hasAccess('buildings')) {
    return (
      <ScreenContainer subtitle="This role cannot open building records." title="Building List">
        <AccessDenied title="Building pages are restricted" />
      </ScreenContainer>
    );
  }

  const visibleBuildings =
    currentUser.role === 'staff' && currentUser.assignedBuildingId
      ? buildings.filter((building) => building.id === currentUser.assignedBuildingId)
      : buildings;

  return (
    <ScreenContainer contentStyle={styles.page} scroll={false} subtitle="Every project is managed building-wise." title="Building List">
      {currentUser.role === 'overallAdmin' ? <AppButton label="Add Demo Building" onPress={addDemoBuilding} /> : null}
      <FlatList
        contentContainerStyle={styles.list}
        data={visibleBuildings}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => {
          const profitLoss = item.totalReceivedPayment - item.totalExpense;

          return (
                    <Pressable
              accessibilityRole="button"
              onPress={() => openBuilding(item.id)}
              style={({ pressed }) => [styles.cardPressable, pressed ? styles.cardPressed : undefined]}
            >
              <InfoCard subtitle={`${item.clientName} • ${item.siteAddress}`} title={item.buildingName} rightSlot={<StatusPill status={item.approvalStatus} />}>
                <ProgressBar label="Construction progress" value={item.constructionProgress} />
                <View style={styles.metricsRow}>
                  <View style={styles.metricChip}>
                    <Ionicons color={theme.colors.textMuted} name="trending-down-outline" size={13} />
                    <Text style={styles.metricLabel}>Expense</Text>
                    <Text style={styles.metricValue}>{formatCurrency(item.totalExpense)}</Text>
                  </View>
                  <View style={styles.metricDivider} />
                  <View style={styles.metricChip}>
                    <Ionicons color={theme.colors.textMuted} name="trending-up-outline" size={13} />
                    <Text style={styles.metricLabel}>Received</Text>
                    <Text style={styles.metricValue}>{formatCurrency(item.totalReceivedPayment)}</Text>
                  </View>
                  <View style={styles.metricDivider} />
                  <View style={styles.metricChip}>
                    <Ionicons color={profitLoss >= 0 ? theme.colors.success : theme.colors.danger} name={profitLoss >= 0 ? 'arrow-up-outline' : 'arrow-down-outline'} size={13} />
                    <Text style={styles.metricLabel}>P / L</Text>
                    <Text style={[styles.metricValue, { color: profitLoss >= 0 ? theme.colors.success : theme.colors.danger }]}>
                      {formatCurrency(profitLoss)}
                    </Text>
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
  metricsRow: {
    flexDirection: 'row',
    gap: 0,
    borderRadius: theme.radius.sm,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: theme.card.sectionBorder,
  },
  metricChip: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: 4,
    gap: 3,
    backgroundColor: theme.colors.surfaceVariant,
  },
  metricDivider: {
    width: 1,
    backgroundColor: theme.card.sectionBorder,
  },
  metricLabel: {
    fontSize: theme.typography.micro,
    color: theme.colors.textMuted,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  metricValue: {
    fontSize: theme.typography.small,
    fontWeight: '800',
    color: theme.colors.text,
    letterSpacing: -0.2,
    textAlign: 'center',
  },
}); }