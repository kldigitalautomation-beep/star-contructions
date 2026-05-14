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

export function LandListScreen() {
  const { theme } = useAppTheme();
  const styles = useMemo(() => makeStyles(theme), [theme]);
  const { currentUser, lands, hasAccess, addDemoLand } = useAppData();

  if (!currentUser) {
    return <Redirect href="/login" />;
  }

  if (!hasAccess('lands')) {
    return (
      <ScreenContainer subtitle="This role cannot open land records." title="Land Management">
        <AccessDenied title="Land pages are restricted" />
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer contentStyle={styles.page} scroll={false} subtitle="Layout, plot sale, approval, and expense records." title="Land List">
      {currentUser.role === 'overallAdmin' ? <AppButton label="Add Demo Land" onPress={addDemoLand} /> : null}
      <FlatList
        contentContainerStyle={styles.list}
        data={lands}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => {
          const totalExpenses = item.expenses.reduce((sum, expense) => sum + expense.amount, 0);

          return (
            <Pressable
              accessibilityRole="button"
              onPress={() => router.push(`/land/${item.id}`)}
              style={({ pressed }) => [styles.cardPressable, pressed ? styles.cardPressed : undefined]}
            >
              <InfoCard subtitle={`${item.location} • ${item.totalArea}`} title={item.landName} rightSlot={<StatusPill status={item.approvalStatus} />}>
                <View style={styles.metricsRow}>
                  <View style={styles.metricChip}>
                    <Text style={styles.metricLabel}>Purchase</Text>
                    <Text style={[styles.metricValue, { color: theme.colors.primary }]}>{formatCurrency(item.purchaseAmount)}</Text>
                  </View>
                  <View style={styles.metricDivider} />
                  <View style={styles.metricChip}>
                    <Text style={styles.metricLabel}>Expenses</Text>
                    <Text style={styles.metricValue}>{formatCurrency(totalExpenses)}</Text>
                  </View>
                </View>
                <View style={styles.tagRow}>
                  <View style={styles.tag}><Text style={styles.tagText}>{item.ownerName}</Text></View>
                  <View style={styles.tag}><Text style={styles.tagText}>{item.surveyNumber}</Text></View>
                  <View style={styles.tag}><Text style={styles.tagText}>{item.plotDetails.length} plots</Text></View>
                  <View style={styles.tag}><Text style={styles.tagText}>{item.plotSales.length} sales</Text></View>
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
    color: theme.colors.textLight,
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
  tagRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.xs,
  },
  tag: {
    borderRadius: theme.radius.full,
    paddingHorizontal: 10,
    paddingVertical: 4,
    backgroundColor: theme.colors.surfaceVariant,
    borderWidth: 1,
    borderColor: theme.card.sectionBorder,
  },
  tagText: {
    fontSize: theme.typography.caption,
    color: theme.colors.textSecondary,
    fontWeight: '700',
  },
}); }