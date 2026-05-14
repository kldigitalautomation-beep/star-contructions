import { useMemo } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { Redirect, router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { InfoCard } from '../components/InfoCard';
import { MenuTile } from '../components/MenuTile';
import { ProgressBar } from '../components/ProgressBar';
import { RemarksSection } from '../components/RemarksSection';
import { ScreenContainer } from '../components/ScreenContainer';
import { SimpleBarChart } from '../components/SimpleBarChart';
import { StatCard } from '../components/StatCard';
import { moreMenuItems, roleLabels } from '../navigation/accessMap';
import { roleAccent } from '../styles/theme';
import { type AppTheme, useAppTheme } from '../utils/themeContext';
import { useAppData } from '../utils/appState';
import { formatCurrency } from '../utils/format';

export function DashboardScreen() {
  const { theme } = useAppTheme();
  const styles = useMemo(() => makeStyles(theme), [theme]);
  const { currentUser, buildings, lands, employees, materials, payments, hasAccess } = useAppData();

  if (!currentUser) {
    return <Redirect href="/login" />;
  }

  const pendingPayments = payments.filter((p) => p.status !== 'Paid').length;
  const workingToday = employees.filter((e) => e.attendance.todayStatus !== 'Absent').length;
  const materialPending = materials.filter((m) => m.paymentStatus !== 'Paid').length;
  const activeProjects = buildings.filter((b) => b.constructionProgress < 100).length;
  const upcomingApprovals = buildings.reduce(
    (count, b) =>
      count + Object.values(b.approvals).filter((a) => a.status !== 'Approved' && a.status !== 'Paid').length,
    0,
  );
  const monthlyExpense = payments.reduce((sum, p) => sum + p.amount, 0);
  const pendingAmount = payments.filter((p) => p.status !== 'Paid').reduce((sum, p) => sum + p.amount, 0);
  const totalRevenue = buildings.reduce((sum, b) => sum + b.totalReceivedPayment, 0);
  const avgProgress = buildings.length
    ? Math.round(buildings.reduce((sum, b) => sum + b.constructionProgress, 0) / buildings.length)
    : 0;
  const quickActions = moreMenuItems.filter((item) => hasAccess(item.key)).slice(0, 4);
  const firstName = currentUser.name.split(' ')[0];

  return (
    <ScreenContainer
      title="Dashboard"
      subtitle={`${roleLabels[currentUser.role]} · ${firstName}`}
      greeting={`Hey ${firstName} 👋`}
      headerRight={
        <View style={styles.roleBadge}>
          <View style={[styles.roleIndicator, { backgroundColor: roleAccent[currentUser.role] }]} />
          <Text style={styles.roleText}>{roleLabels[currentUser.role]}</Text>
        </View>
      }
    >
      {/* ── Project Snapshot Hero ── */}
      <LinearGradient
        colors={theme.gradients.hero}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.snapshotCard}
      >
        {/* Decorative circle */}
        <View style={styles.snapshotCircle} />
        <View style={styles.snapshotRow}>
          <View style={styles.snapshotLeft}>
            <Text style={styles.snapshotLabel}>Project Snapshot</Text>
            <Text style={styles.snapshotPercent}>{avgProgress}%</Text>
            <Text style={styles.snapshotSub}>Avg completion</Text>
            <View style={styles.onTrackBadge}>
              <View style={styles.onTrackDot} />
              <Text style={styles.onTrackText}>On Track</Text>
            </View>
          </View>
          <View style={styles.snapshotRight}>
            {/* Mini bar chart in hero */}
            <View style={styles.miniChartWrap}>
              {buildings.slice(0, 5).map((b, i) => {
                const h = Math.max(14, (b.constructionProgress / 100) * 56);
                return (
                  <View key={b.id} style={styles.miniBarCol}>
                    <View style={[styles.miniBar, { height: h, opacity: 0.72 + i * 0.06 }]} />
                  </View>
                );
              })}
            </View>
            <Text style={styles.miniChartLabel}>{buildings.length} Projects</Text>
          </View>
        </View>
        {/* Progress bar */}
        <View style={styles.snapshotBarTrack}>
          <View style={[styles.snapshotBarFill, { width: `${avgProgress}%` }]} />
        </View>
        {/* Budget / Spent row */}
        <View style={styles.budgetRow}>
          <View style={styles.budgetCell}>
            <View style={styles.budgetIconWrap}>
              <Ionicons name="wallet-outline" size={13} color="rgba(255,255,255,0.80)" />
            </View>
            <View>
              <Text style={styles.budgetLabel}>Revenue</Text>
              <Text style={styles.budgetValue}>{formatCurrency(totalRevenue)}</Text>
            </View>
          </View>
          <View style={styles.budgetDivider} />
          <View style={styles.budgetCell}>
            <View style={[styles.budgetIconWrap, { backgroundColor: 'rgba(245,166,35,0.28)' }]}>
              <Ionicons name="trending-up-outline" size={13} color={theme.brand.gold} />
            </View>
            <View>
              <Text style={styles.budgetLabel}>Spent</Text>
              <Text style={[styles.budgetValue, { color: theme.brand.gold }]}>{formatCurrency(monthlyExpense)}</Text>
            </View>
          </View>
          <View style={styles.budgetDivider} />
          <View style={styles.budgetCell}>
            <View style={[styles.budgetIconWrap, { backgroundColor: 'rgba(255,107,107,0.24)' }]}>
              <Ionicons name="time-outline" size={13} color={theme.isDark ? '#FF9A9A' : '#FFB0B0'} />
            </View>
            <View>
              <Text style={styles.budgetLabel}>Pending</Text>
              <Text style={[styles.budgetValue, { color: theme.isDark ? '#FF9A9A' : '#FFB0B0' }]}>{formatCurrency(pendingAmount)}</Text>
            </View>
          </View>
        </View>
      </LinearGradient>

      {/* ── KPI Stat Grid ── */}
      <View style={styles.grid}>
        <StatCard hint="All project sites" label="Buildings" value={buildings.length} accentColor={theme.colors.primary} />
        <StatCard hint="Layout and plots" label="Land Records" value={lands.length} accentColor={theme.colors.info} />
        <StatCard hint="In progress now" label="Active" value={activeProjects} accentColor={theme.colors.success} />
        <StatCard hint="Need attention" label="Pending Pay" value={pendingPayments} accentColor={theme.colors.danger} />
        <StatCard hint="Present or half day" label="Staff Today" value={workingToday} accentColor={theme.colors.success} />
        <StatCard hint="Vendor due" label="Materials" value={materialPending} accentColor={theme.colors.warning} />
        <StatCard hint="Open approvals" label="Approvals" value={upcomingApprovals} accentColor={theme.colors.info} />
        <StatCard hint="Total workforce" label="Employees" value={employees.length} accentColor={theme.brand.gold} />
      </View>

      {/* ── Active Projects Progress ── */}
      <InfoCard title="Active Projects" subtitle="Live construction progress per site">
        <View style={styles.progressList}>
          {buildings.map((b) => (
            <Pressable
              key={b.id}
              onPress={() => router.push(`/buildings/${b.id}`)}
              style={({ pressed }) => [styles.progressItem, pressed && styles.progressPressed]}
            >
              <View style={styles.progressHeader}>
                <View style={styles.progressIconWrap}>
                  <Ionicons
                    name="business"
                    size={14}
                    color={b.constructionProgress >= 80 ? theme.colors.success : b.constructionProgress >= 40 ? theme.colors.primary : theme.colors.warning}
                  />
                </View>
                <Text style={styles.progressTitle} numberOfLines={1}>{b.buildingName}</Text>
                <View style={[styles.progressBadge, {
                  backgroundColor: b.constructionProgress >= 80
                    ? theme.colors.successSoft
                    : b.constructionProgress >= 40
                    ? theme.colors.primarySoft
                    : theme.colors.warningSoft,
                }]}>
                  <Text style={[styles.progressBadgeText, {
                    color: b.constructionProgress >= 80
                      ? theme.colors.success
                      : b.constructionProgress >= 40
                      ? theme.colors.primary
                      : theme.colors.warning,
                  }]}>{b.constructionProgress}%</Text>
                </View>
              </View>
              <ProgressBar label={b.siteAddress} value={b.constructionProgress} />
            </Pressable>
          ))}
        </View>
      </InfoCard>

      {/* ── Expense Snapshot ── */}
      <InfoCard title="Expense Snapshot" subtitle="Building-wise cost overview in ₹ Lakhs">
        <SimpleBarChart
          items={buildings.map((b) => ({
            label: b.buildingName.split(' ')[0],
            value: Math.round(b.totalExpense / 100000),
          }))}
        />
        <Text style={styles.chartNote}>Values shown in lakhs (₹L)</Text>
      </InfoCard>

      {/* ── Quick Actions ── */}
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

function makeStyles(theme: AppTheme) { return StyleSheet.create({
  roleBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255,255,255,0.16)',
    borderRadius: theme.radius.full,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.26)',
  },
  roleIndicator: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
  },
  roleText: {
    fontSize: theme.typography.caption,
    fontWeight: '700',
    color: '#FFFFFF',
  },

  // ── Project Snapshot Hero Card ──
  snapshotCard: {
    borderRadius: theme.radius.xl,
    padding: theme.spacing.md,
    paddingBottom: theme.spacing.sm,
    overflow: 'hidden',
    ...theme.shadow.lg,
  },
  snapshotCircle: {
    position: 'absolute',
    top: -40,
    right: -40,
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: 'rgba(255,255,255,0.06)',
  },
  snapshotRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.md,
  },
  snapshotLeft: {
    flex: 1,
    gap: 4,
  },
  snapshotLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: 'rgba(255,255,255,0.65)',
    textTransform: 'uppercase',
    letterSpacing: 1.2,
  },
  snapshotPercent: {
    fontSize: 48,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: -2,
    lineHeight: 54,
    marginTop: 2,
  },
  snapshotSub: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.70)',
    fontWeight: '500',
  },
  onTrackBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: 'rgba(46,232,122,0.22)',
    borderRadius: theme.radius.full,
    paddingHorizontal: 10,
    paddingVertical: 5,
    alignSelf: 'flex-start',
    marginTop: 6,
    borderWidth: 1,
    borderColor: 'rgba(46,232,122,0.36)',
  },
  onTrackDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#2EE87A',
  },
  onTrackText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#2EE87A',
  },
  snapshotRight: {
    alignItems: 'flex-end',
    gap: 4,
    paddingTop: 4,
  },
  miniChartWrap: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 4,
    height: 60,
  },
  miniBarCol: {
    alignItems: 'center',
    justifyContent: 'flex-end',
    width: 18,
    height: 60,
  },
  miniBar: {
    width: 18,
    borderRadius: 4,
    backgroundColor: 'rgba(255,255,255,0.60)',
  },
  miniChartLabel: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.60)',
    fontWeight: '600',
  },
  snapshotBarTrack: {
    height: 6,
    borderRadius: theme.radius.full,
    backgroundColor: 'rgba(255,255,255,0.20)',
    overflow: 'hidden',
    marginBottom: theme.spacing.md,
  },
  snapshotBarFill: {
    height: '100%',
    borderRadius: theme.radius.full,
    backgroundColor: theme.brand.gold,
  },
  budgetRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 0,
    paddingTop: theme.spacing.sm,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.14)',
  },
  budgetCell: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    paddingVertical: 8,
    paddingHorizontal: 2,
  },
  budgetIconWrap: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.16)',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  budgetDivider: {
    width: 1,
    height: 36,
    backgroundColor: 'rgba(255,255,255,0.16)',
    marginHorizontal: 4,
  },
  budgetLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: 'rgba(255,255,255,0.60)',
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  budgetValue: {
    fontSize: 12,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -0.3,
  },

  // ── Stat Grid ──
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.sm,
    alignItems: 'flex-start',
  },

  // ── Active Projects ──
  progressList: {
    gap: theme.spacing.md,
  },
  progressItem: {
    gap: 8,
    borderRadius: theme.radius.md,
    backgroundColor: theme.isDark ? 'rgba(255,255,255,0.03)' : 'rgba(22,58,124,0.02)',
    padding: theme.spacing.sm,
    borderWidth: 1,
    borderColor: theme.colors.divider,
  },
  progressPressed: {
    opacity: theme.isDark ? 0.94 : 0.82,
    transform: [{ scale: 0.984 }],
  },
  progressHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  progressIconWrap: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: theme.colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  progressTitle: {
    flex: 1,
    fontSize: theme.typography.small,
    fontWeight: '700',
    color: theme.colors.text,
    letterSpacing: -0.1,
  },
  progressBadge: {
    borderRadius: theme.radius.full,
    paddingHorizontal: 8,
    paddingVertical: 3,
    flexShrink: 0,
  },
  progressBadgeText: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.2,
  },

  // ── Quick Actions ──
  quickActions: {
    gap: theme.spacing.sm,
  },
  chartNote: {
    fontSize: theme.typography.caption,
    color: theme.colors.textLight,
    fontStyle: 'italic',
    textAlign: 'right',
  },
}); }