import { Ionicons } from '@expo/vector-icons';
import { Redirect, router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { InfoCard } from '../components/InfoCard';
import { MenuTile } from '../components/MenuTile';
import { ProgressBar } from '../components/ProgressBar';
import { RemarksSection } from '../components/RemarksSection';
import { ScreenContainer } from '../components/ScreenContainer';
import { SimpleBarChart } from '../components/SimpleBarChart';
import { StatCard } from '../components/StatCard';
import { moreMenuItems, roleLabels } from '../navigation/accessMap';
import { roleAccent, theme } from '../styles/theme';
import { useAppData } from '../utils/appState';
import { formatCurrency } from '../utils/format';

export function DashboardScreen() {
  const { currentUser, buildings, lands, employees, materials, payments, hasAccess } = useAppData();

  if (!currentUser) {
    return <Redirect href="/login" />;
  }

  const pendingPayments = payments.filter((payment) => payment.status !== 'Paid').length;
  const workingToday = employees.filter((employee) => employee.attendance.todayStatus !== 'Absent').length;
  const materialPending = materials.filter((material) => material.paymentStatus !== 'Paid').length;
  const activeProjects = buildings.filter((building) => building.constructionProgress < 100).length;
  const upcomingApprovals = buildings.reduce(
    (count, building) =>
      count + Object.values(building.approvals).filter((approval) => approval.status !== 'Approved' && approval.status !== 'Paid').length,
    0,
  );
  const monthlyExpense = payments.reduce((sum, payment) => sum + payment.amount, 0);
  const pendingAmount = payments
    .filter((payment) => payment.status !== 'Paid')
    .reduce((sum, payment) => sum + payment.amount, 0);
  const totalRevenue = buildings.reduce((sum, building) => sum + building.totalReceivedPayment, 0);
  const quickActions = moreMenuItems.filter((item) => hasAccess(item.key)).slice(0, 3);

  return (
    <ScreenContainer
      title="Dashboard"
      subtitle={`${roleLabels[currentUser.role]}`}
      headerRight={
        <View style={styles.roleBadge}>
          <View style={[styles.roleIndicator, { backgroundColor: roleAccent[currentUser.role] }]} />
          <Text style={styles.roleText}>{currentUser.name.split(' ')[0]}</Text>
        </View>
      }
    >
      {/* ── KPI Banner ── */}
      <InfoCard title="Operations Overview" subtitle="Live project snapshot — sites, payments, workforce." accent>
        <View style={styles.heroGrid}>
          <View style={styles.heroMetric}>
            <View style={[styles.heroIconWrap, { backgroundColor: theme.colors.primarySoft }]}>
              <Ionicons color={theme.brand.navy} name="cash-outline" size={16} />
            </View>
            <Text style={styles.heroMetricLabel}>Revenue</Text>
            <Text style={styles.heroMetricValue}>{formatCurrency(totalRevenue)}</Text>
          </View>
          <View style={styles.heroDivider} />
          <View style={styles.heroMetric}>
            <View style={[styles.heroIconWrap, { backgroundColor: theme.colors.warningSoft }]}>
              <Ionicons color={theme.brand.gold} name="time-outline" size={16} />
            </View>
            <Text style={styles.heroMetricLabel}>Pending</Text>
            <Text style={[styles.heroMetricValue, { color: theme.brand.gold }]}>{formatCurrency(pendingAmount)}</Text>
          </View>
          <View style={styles.heroDivider} />
          <View style={styles.heroMetric}>
            <View style={[styles.heroIconWrap, { backgroundColor: theme.colors.successSoft }]}>
              <Ionicons color={theme.colors.success} name="people-outline" size={16} />
            </View>
            <Text style={styles.heroMetricLabel}>Workforce</Text>
            <Text style={[styles.heroMetricValue, { color: theme.colors.success }]}>{workingToday}</Text>
          </View>
        </View>
      </InfoCard>

      {/* ── Stat Grid ── */}
      <View style={styles.grid}>
        <StatCard hint="All project sites" label="Buildings" value={buildings.length} accentColor={theme.brand.navy} />
        <StatCard hint="Layout and plots" label="Land Records" value={lands.length} accentColor={theme.colors.info} />
        <StatCard hint="In progress now" label="Active" value={activeProjects} accentColor={theme.colors.success} />
        <StatCard hint="Need attention" label="Pending Pay" value={pendingPayments} accentColor={theme.colors.danger} />
        <StatCard hint="Present or half day" label="Staff Today" value={workingToday} accentColor={theme.colors.success} />
        <StatCard hint="Vendor due" label="Materials" value={materialPending} accentColor={theme.colors.warning} />
        <StatCard hint="Open approvals" label="Approvals" value={upcomingApprovals} accentColor={theme.colors.info} />
        <StatCard hint="Total expenses" label="Monthly Exp" value={formatCurrency(monthlyExpense)} accentColor={theme.brand.gold} />
      </View>

      <InfoCard title="Expense Snapshot" subtitle="Building-wise cost overview in ₹ Lakhs">
        <SimpleBarChart
          items={buildings.map((building) => ({
            label: building.buildingName.split(' ')[0],
            value: Math.round(building.totalExpense / 100000),
          }))}
        />
        <Text style={styles.chartNote}>Values shown in lakhs (₹L)</Text>
      </InfoCard>

      <InfoCard title="Construction Progress" subtitle="Live progress for each building">
        <View style={styles.progressList}>
          {buildings.map((building) => (
            <Pressable
              key={building.id}
              onPress={() => router.push(`/buildings/${building.id}`)}
              style={({ pressed }) => [styles.progressItem, pressed && styles.progressPressed]}
            >
              <View style={styles.progressHeader}>
                <Text style={styles.progressTitle} numberOfLines={1}>{building.buildingName}</Text>
                <Text style={styles.progressMeta}>{building.constructionProgress}%</Text>
              </View>
              <ProgressBar label={building.siteAddress} value={building.constructionProgress} />
            </Pressable>
          ))}
        </View>
      </InfoCard>

      <InfoCard title="Quick Actions" subtitle="Modules available for your role">
        <View style={styles.quickActions}>
          {quickActions.map((item) => (
            <MenuTile key={item.key} description={item.description} icon={item.icon} label={item.label} onPress={() => router.push(item.route)} />
          ))}
        </View>
      </InfoCard>

      <RemarksSection module="dashboard" referenceId="home" />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  roleBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: theme.colors.primarySoft,
    borderRadius: theme.radius.full,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: theme.colors.primaryMuted,
  },
  roleIndicator: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
  },
  roleText: {
    fontSize: theme.typography.caption,
    fontWeight: '700',
    color: theme.brand.navy,
  },
  heroGrid: {
    flexDirection: 'row',
    alignItems: 'stretch',
  },
  heroMetric: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
    paddingVertical: theme.spacing.xs,
  },
  heroDivider: {
    width: 1,
    backgroundColor: theme.colors.divider,
    marginVertical: 4,
  },
  heroIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  heroMetricLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: theme.colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  heroMetricValue: {
    fontSize: 16,
    fontWeight: '800',
    color: theme.brand.navy,
    letterSpacing: -0.3,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.sm,
    alignItems: 'flex-start',
  },
  progressList: {
    gap: theme.spacing.md,
  },
  progressItem: {
    gap: 6,
    borderRadius: theme.radius.sm,
    padding: theme.spacing.xs,
  },
  progressPressed: {
    opacity: 0.82,
    transform: [{ scale: 0.983 }],
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: theme.spacing.sm,
    alignItems: 'center',
  },
  progressTitle: {
    flex: 1,
    fontSize: theme.typography.body,
    fontWeight: '700',
    color: theme.colors.text,
  },
  progressMeta: {
    fontSize: theme.typography.small,
    color: theme.brand.navy,
    fontWeight: '700',
  },
  quickActions: {
    gap: theme.spacing.sm,
  },
  chartNote: {
    fontSize: theme.typography.caption,
    color: theme.colors.textLight,
    fontStyle: 'italic',
    textAlign: 'right',
  },
});