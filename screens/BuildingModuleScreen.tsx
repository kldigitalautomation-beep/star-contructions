import { useMemo } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { Redirect, router, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AccessDenied } from '../components/AccessDenied';
import { AppButton } from '../components/AppButton';
import { EmptyState } from '../components/EmptyState';
import { InfoCard } from '../components/InfoCard';
import { InfoRow } from '../components/InfoRow';
import { ProgressBar } from '../components/ProgressBar';
import { RemarksSection } from '../components/RemarksSection';
import { StatusPill } from '../components/StatusPill';
import { type AppTheme, useAppTheme } from '../utils/themeContext';
import { useAppData } from '../utils/appState';
import {
  type BuildingSectionDefinition,
  type BuildingSectionKey,
  getAccessibleBuildingSections,
  getBuildingSectionHref,
  getDefaultBuildingSection,
  isBuildingSection,
} from '../utils/buildingModule';
import { formatCurrency, formatShortDate } from '../utils/format';
import { createTextReport, shareTextReport } from '../utils/reporting';
import type { ApprovalDetail, EmployeeRecord, LeaveRequest, MaterialRecord, PaymentRecord } from '../utils/types';

type ApprovalEntry = { name: string } & ApprovalDetail;

interface MetricItem {
  label: string;
  value: string;
  tone?: 'default' | 'success' | 'warning' | 'danger';
}

interface NoteItem {
  id: string;
  title: string;
  description?: string;
  meta?: string;
}

interface MonthlyTotal {
  month: string;
  total: number;
  count: number;
}

function getInitials(value: string) {
  const parts = value.split(' ').filter(Boolean);

  return parts.slice(0, 2).map((part) => part[0]?.toUpperCase() ?? '').join('') || 'SC';
}

function isCompleteStatus(status: string) {
  const normalized = status.toLowerCase();

  return normalized.includes('paid') || normalized.includes('approved') || normalized.includes('done') || normalized.includes('present');
}

function isPendingStatus(status: string) {
  const normalized = status.toLowerCase();

  return normalized.includes('pending') || normalized.includes('partial') || normalized.includes('submitted') || normalized.includes('not started');
}

function sumByAmount(items: Array<{ amount: number }>) {
  return items.reduce((sum, item) => sum + item.amount, 0);
}

function groupAmountsByMonth(items: Array<{ amount: number; date: string }>) {
  const monthlyMap = new Map<string, MonthlyTotal>();

  items.forEach((item) => {
    const month = new Intl.DateTimeFormat('en-IN', { month: 'short', year: 'numeric' }).format(new Date(item.date));
    const current = monthlyMap.get(month);

    if (current) {
      current.total += item.amount;
      current.count += 1;
      return;
    }

    monthlyMap.set(month, {
      month,
      total: item.amount,
      count: 1,
    });
  });

  return Array.from(monthlyMap.values());
}

function getSalaryDeduction(employee: EmployeeRecord) {
  const cycleRate = employee.salaryType === 'Monthly' ? employee.salaryAmount / 26 : employee.salaryAmount / 6;

  return Math.round(cycleRate * employee.extraLeave);
}

function buildDelayNotes(pendingPayments: PaymentRecord[], pendingApprovals: ApprovalEntry[]): NoteItem[] {
  return [
    ...pendingPayments.map((payment) => ({
      id: `payment-${payment.id}`,
      title: `${payment.title} is ${payment.status}`,
      description: `${payment.paidTo} • ${formatCurrency(payment.amount)}`,
      meta: `Due ${formatShortDate(payment.dueDate)}`,
    })),
    ...pendingApprovals.map((approval) => ({
      id: `approval-${approval.name}`,
      title: `${approval.name} needs follow-up`,
      description: approval.remarks,
      meta: `${approval.status} • ${formatShortDate(approval.date)}`,
    })),
  ];
}

function buildMaterialIssueNotes(buildingMaterials: MaterialRecord[]) {
  return buildingMaterials
    .filter((material) => material.pendingQuantity > 0 || isPendingStatus(material.paymentStatus))
    .map((material) => ({
      id: material.id,
      title: `${material.materialName} requires attention`,
      description: `${material.vendorName} • ${material.pendingQuantity} ${material.unit} pending`,
      meta: `${material.paymentStatus} • Delivered ${formatShortDate(material.deliveryDate)}`,
    }));
}

function buildEngineerNotes(approvalEntries: ApprovalEntry[]) {
  return approvalEntries.map((approval) => ({
    id: approval.name,
    title: approval.name,
    description: approval.remarks,
    meta: `${approval.status} • ${formatShortDate(approval.date)}`,
  }));
}

function MetricGrid({ items }: { items: MetricItem[] }) {
  const { theme } = useAppTheme();
  const styles = useMemo(() => makeStyles(theme), [theme]);
  return (
    <View style={styles.metricGrid}>
      {items.map((item) => (
        <View key={item.label} style={styles.metricTile}>
          <Text style={styles.metricLabel}>{item.label}</Text>
          <Text
            style={[
              styles.metricValue,
              item.tone === 'success'
                ? styles.metricValueSuccess
                : item.tone === 'warning'
                  ? styles.metricValueWarning
                  : item.tone === 'danger'
                    ? styles.metricValueDanger
                    : undefined,
            ]}
          >
            {item.value}
          </Text>
        </View>
      ))}
    </View>
  );
}

function NoteListCard({
  title,
  subtitle,
  items,
  emptyTitle,
  emptyDescription,
}: {
  title: string;
  subtitle: string;
  items: NoteItem[];
  emptyTitle: string;
  emptyDescription: string;
}) {
  const { theme } = useAppTheme();
  const styles = useMemo(() => makeStyles(theme), [theme]);
  return (
    <InfoCard title={title} subtitle={subtitle}>
      {items.length === 0 ? (
        <EmptyState title={emptyTitle} description={emptyDescription} icon="document-text-outline" />
      ) : (
        items.map((item) => (
          <View key={item.id} style={styles.detailPanel}>
            <Text style={styles.panelTitle}>{item.title}</Text>
            {item.description ? <Text style={styles.panelBody}>{item.description}</Text> : null}
            {item.meta ? <Text style={styles.panelMeta}>{item.meta}</Text> : null}
          </View>
        ))
      )}
    </InfoCard>
  );
}

function EmployeeTile({ employee }: { employee: EmployeeRecord }) {
  const { theme } = useAppTheme();
  const styles = useMemo(() => makeStyles(theme), [theme]);
  return (
    <View style={styles.employeeTile}>
      <View style={styles.employeeHeaderRow}>
        <View style={styles.avatarWrap}>
          <Text style={styles.avatarText}>{getInitials(employee.employeeName)}</Text>
        </View>
        <View style={styles.employeeTextWrap}>
          <Text style={styles.employeeName}>{employee.employeeName}</Text>
          <Text style={styles.employeeMeta}>{employee.roleTitle} • {employee.category}</Text>
        </View>
        <StatusPill size="sm" status={employee.attendance.todayStatus} />
      </View>
      <InfoRow label="Phone" value={employee.mobileNumber} />
      <InfoRow label="Assigned Work" value={employee.roleTitle} />
      <InfoRow label="Salary" value={`${employee.salaryType} • ${formatCurrency(employee.salaryAmount)}`} />
    </View>
  );
}

export function BuildingModuleScreen() {
  const { theme } = useAppTheme();
  const styles = useMemo(() => makeStyles(theme), [theme]);
  const { buildingId, section } = useLocalSearchParams<{ buildingId: string; section?: string }>();
  const {
    buildings,
    currentUser,
    employees,
    hasAccess,
    lands,
    leaveRequests,
    materials,
    payments,
    remarks,
    uploads,
    vendors,
  } = useAppData();

  if (!currentUser) {
    return <Redirect href="/login" />;
  }

  const accessibleSections = getAccessibleBuildingSections(hasAccess);
  const defaultSection = getDefaultBuildingSection(hasAccess);
  const building = buildings.find((entry) => entry.id === buildingId);

  if (accessibleSections.length === 0) {
    return (
      <SafeAreaView edges={['top', 'left', 'right']} style={styles.safeArea}>
        <StatusBar style={theme.statusBarStyle} />
        <View style={styles.blockedWrap}>
          <AccessDenied title="This role cannot open building sections" />
        </View>
      </SafeAreaView>
    );
  }

  if (!building) {
    return (
      <SafeAreaView edges={['top', 'left', 'right']} style={styles.safeArea}>
        <StatusBar style={theme.statusBarStyle} />
        <View style={styles.blockedWrap}>
          <EmptyState title="Building not found" description="Return to the building list and open another project." />
        </View>
      </SafeAreaView>
    );
  }

  if (!isBuildingSection(section)) {
    return <Redirect href={getBuildingSectionHref(building.id, defaultSection)} />;
  }

  const currentSection = accessibleSections.find((item) => item.key === section);

  if (!currentSection) {
    return (
      <SafeAreaView edges={['top', 'left', 'right']} style={styles.safeArea}>
        <StatusBar style={theme.statusBarStyle} />
        <View style={styles.blockedWrap}>
          <AccessDenied title="This building section is restricted for this role" />
        </View>
      </SafeAreaView>
    );
  }

  const backHref = hasAccess('buildings') ? '/buildings' : '/dashboard';
  const buildingEmployeeIds = new Set(building.employeeIds);
  const buildingEmployees = employees.filter((employee) => buildingEmployeeIds.has(employee.id));
  const buildingMaterials = materials.filter((material) => material.buildingId === building.id);
  const buildingVendors = vendors.filter((vendor) => building.vendorIds.includes(vendor.id));
  const buildingPayments = payments.filter((payment) => payment.buildingId === building.id);
  const approvalEntries: ApprovalEntry[] = Object.entries(building.approvals).map(([name, approval]) => ({ name, ...approval }));
  const buildingRemarks = remarks.filter((item) => item.module === 'buildings' && item.referenceId === building.id);
  const materialRemarks = remarks.filter((item) => item.module === 'materials' && buildingMaterials.some((material) => material.id === item.referenceId));
  const buildingUploads = uploads.filter(
    (upload) => upload.referenceId === building.id || upload.referenceId === building.landId || upload.referenceId === building.planLayoutPdfName,
  );
  const buildingLeaveRequests = leaveRequests.filter((request) => buildingEmployeeIds.has(request.employeeId));
  const linkedLand = lands.find((land) => land.id === building.landId);
  const totalWorkers = building.labourList.reduce((sum, labour) => sum + labour.count, 0);
  const pendingPayments = buildingPayments.filter((payment) => !isCompleteStatus(payment.status));
  const pendingPaymentTotal = sumByAmount(pendingPayments);
  const approvalExpenseTotal = sumByAmount(approvalEntries);
  const pendingApprovals = approvalEntries.filter((approval) => isPendingStatus(approval.status));
  const relatedCompanyPayments = buildingPayments.filter((payment) => payment.category === 'Expense');
  const relatedBuilderPayments = buildingPayments.filter((payment) => payment.category === 'Labour' || payment.category === 'Salary');
  const relatedConstructionPayments = buildingPayments.filter((payment) => ['Vendor', 'Material', 'Expense'].includes(payment.category));
  const companyMonthlyTotals = groupAmountsByMonth([
    ...relatedCompanyPayments.map((payment) => ({ amount: payment.amount, date: payment.dueDate })),
    ...approvalEntries.map((approval) => ({ amount: approval.amount, date: approval.date })),
  ]);
  const builderAdvanceTotal = sumByAmount(
    relatedBuilderPayments.filter((payment) => payment.title.toLowerCase().includes('advance') || payment.remarks.toLowerCase().includes('advance')),
  );
  const contractorPaymentTotal = sumByAmount(relatedBuilderPayments.filter((payment) => payment.category === 'Labour'));
  const pendingBuilderTotal = sumByAmount(relatedBuilderPayments.filter((payment) => !isCompleteStatus(payment.status)));
  const paidSalaryTotal = sumByAmount(relatedBuilderPayments.filter((payment) => payment.category === 'Salary' && isCompleteStatus(payment.status)));
  const pendingSalaryTotal = sumByAmount(relatedBuilderPayments.filter((payment) => payment.category === 'Salary' && !isCompleteStatus(payment.status)));
  const monthlySalaryTotal = buildingEmployees.filter((employee) => employee.salaryType === 'Monthly').reduce((sum, employee) => sum + employee.salaryAmount, 0);
  const weeklySalaryTotal = buildingEmployees.filter((employee) => employee.salaryType === 'Weekly').reduce((sum, employee) => sum + employee.salaryAmount, 0);
  const salaryDeductionTotal = buildingEmployees.reduce((sum, employee) => sum + getSalaryDeduction(employee), 0);
  const presentCount = buildingEmployees.filter((employee) => employee.attendance.todayStatus === 'Present').length;
  const absentCount = buildingEmployees.filter((employee) => employee.attendance.todayStatus === 'Absent').length;
  const halfDayCount = buildingEmployees.filter((employee) => employee.attendance.todayStatus === 'Half Day').length;
  const pendingLeaveCount = buildingLeaveRequests.filter((request) => request.status !== 'Approved').length;
  const materialValueTotal = buildingMaterials.reduce((sum, material) => sum + material.totalAmount, 0);
  const cementPaymentTotal = buildingMaterials.filter((material) => material.materialName.toLowerCase().includes('cement')).reduce((sum, material) => sum + material.totalAmount, 0);
  const sandPaymentTotal = buildingMaterials.filter((material) => material.materialName.toLowerCase().includes('sand')).reduce((sum, material) => sum + material.totalAmount, 0);
  const steelPaymentTotal = buildingMaterials.filter((material) => material.materialName.toLowerCase().includes('steel')).reduce((sum, material) => sum + material.totalAmount, 0);
  const vendorDueTotal = buildingVendors.reduce((sum, vendor) => sum + vendor.paymentPending, 0);
  const recentActivities = [
    ...building.dailyUpdates.map((update) => ({
      id: `update-${update.date}-${update.note}`,
      title: update.note,
      description: 'Daily site update',
      meta: formatShortDate(update.date),
      date: update.date,
    })),
    ...buildingRemarks.map((remark) => ({
      id: remark.id,
      title: remark.text,
      description: `Remark by ${remark.authorRole}`,
      meta: formatShortDate(remark.date),
      date: remark.date,
    })),
  ]
    .sort((left, right) => new Date(right.date).getTime() - new Date(left.date).getTime())
    .slice(0, 5)
    .map(({ date: _date, ...item }) => item);
  const siteRemarkItems = [
    ...building.remarks.map((remark, index) => ({ id: `summary-${index}`, title: remark, meta: building.buildingName })),
    ...buildingRemarks.map((remark) => ({ id: remark.id, title: remark.text, meta: `${remark.authorRole} • ${formatShortDate(remark.date)}` })),
  ];
  const delayRemarkItems = buildDelayNotes(pendingPayments, pendingApprovals);
  const materialIssueItems = [
    ...buildMaterialIssueNotes(buildingMaterials),
    ...materialRemarks.map((remark) => ({ id: remark.id, title: remark.text, meta: `${remark.authorRole} • ${formatShortDate(remark.date)}` })),
  ];
  const engineerNoteItems = buildEngineerNotes(approvalEntries);
  const dailyUpdateItems = building.dailyUpdates.map((update) => ({
    id: `${update.date}-${update.note}`,
    title: update.note,
    meta: formatShortDate(update.date),
  }));

  const createReport = async (mode: 'download' | 'share', fileName: string, content: string) => {
    try {
      const uri = mode === 'download' ? await createTextReport(fileName, content) : await shareTextReport(fileName, content);
      Alert.alert(mode === 'download' ? 'Report downloaded' : 'Report shared', `Report ready at ${uri}`);
    } catch (error) {
      Alert.alert('Report failed', error instanceof Error ? error.message : 'Unable to prepare the report.');
    }
  };

  const renderPaymentLedger = (
    title: string,
    subtitle: string,
    entries: PaymentRecord[],
    emptyTitle: string,
    emptyDescription: string,
  ) => (
    <InfoCard title={title} subtitle={subtitle}>
      {entries.length === 0 ? (
        <EmptyState title={emptyTitle} description={emptyDescription} icon="cash-outline" />
      ) : (
        entries.map((payment) => (
          <View key={payment.id} style={styles.detailPanel}>
            <View style={styles.panelHeaderRow}>
              <View style={styles.panelTextWrap}>
                <Text style={styles.panelTitle}>{payment.title}</Text>
                <Text style={styles.panelMeta}>{payment.category} • {payment.frequency}</Text>
              </View>
              <StatusPill size="sm" status={payment.status} />
            </View>
            <InfoRow label="Paid To" value={payment.paidTo} />
            <InfoRow label="Amount" value={formatCurrency(payment.amount)} />
            <InfoRow label="Due Date" value={formatShortDate(payment.dueDate)} />
            <InfoRow label="Remarks" value={payment.remarks} />
          </View>
        ))
      )}
    </InfoCard>
  );

  const renderApprovalRegister = () => (
    <InfoCard title="Approval Register" subtitle="Approval name, status, uploaded PDF, and approved date for this building.">
      {approvalEntries.length === 0 ? (
        <EmptyState title="No approvals yet" description="This building does not have approval entries yet." icon="document-text-outline" />
      ) : (
        approvalEntries.map((approval) => (
          <View key={approval.name} style={styles.detailPanel}>
            <View style={styles.panelHeaderRow}>
              <View style={styles.panelTextWrap}>
                <Text style={styles.panelTitle}>{approval.name}</Text>
                <Text style={styles.panelMeta}>{approval.pdfName}</Text>
              </View>
              <StatusPill size="sm" status={approval.status} />
            </View>
            <InfoRow label="Approved Date" value={formatShortDate(approval.date)} />
            <InfoRow label="Amount" value={formatCurrency(approval.amount)} />
            <InfoRow label="Remarks" value={approval.remarks} />
          </View>
        ))
      )}
    </InfoCard>
  );

  const renderOverviewSection = () => {
    const quickLinks = accessibleSections.filter((item) => ['employees', 'materials', 'attendance', 'construction-payments', 'reports', 'remarks'].includes(item.key)).slice(0, 4);

    return (
      <>
        <MetricGrid
          items={[
            { label: 'Total Workers', value: String(totalWorkers), tone: 'success' },
            { label: 'Pending Payments', value: formatCurrency(pendingPaymentTotal), tone: pendingPaymentTotal > 0 ? 'warning' : 'success' },
            { label: 'Pending Approvals', value: String(pendingApprovals.length), tone: pendingApprovals.length > 0 ? 'warning' : 'success' },
            { label: 'Material Pending', value: formatCurrency(building.materialsSummary.pending), tone: 'warning' },
          ]}
        />

        <InfoCard accent title="Building Overview" subtitle="Quick summary cards for this selected building.">
          <ProgressBar label="Construction progress" value={building.constructionProgress} />
          <InfoRow label="Building Name" value={building.buildingName} />
          <InfoRow label="Client Name" value={building.clientName} />
          <InfoRow label="Site Address" value={building.siteAddress} />
          <InfoRow label="Total Floors" value={String(building.floors)} />
          <InfoRow label="Approval Status" value={building.approvalStatus} />
          <InfoRow label="Total Workers" value={String(totalWorkers)} />
          <InfoRow label="Pending Payments" value={formatCurrency(pendingPaymentTotal)} />
          <InfoRow label="Material Status" value={`${formatCurrency(building.materialsSummary.used)} used • ${formatCurrency(building.materialsSummary.pending)} pending`} />
        </InfoCard>

        {quickLinks.length > 0 ? (
          <InfoCard title="Quick Navigation" subtitle="Large shortcuts for fast site-side movement between building sections.">
            <View style={styles.buttonGroup}>
              {quickLinks.map((item, index) => (
                <AppButton
                  key={item.key}
                  fullWidth={false}
                  icon={<Ionicons color={index % 2 === 0 ? theme.colors.primary : theme.colors.textSecondary} name={item.icon as never} size={18} />}
                  label={item.label}
                  onPress={() => router.replace(getBuildingSectionHref(building.id, item.key))}
                  size="sm"
                  variant={index % 2 === 0 ? 'secondary' : 'outline'}
                />
              ))}
            </View>
          </InfoCard>
        ) : null}

        <NoteListCard
          title="Recent Activities"
          subtitle="Latest daily updates and site remarks for this project."
          items={recentActivities}
          emptyTitle="No recent activity"
          emptyDescription="Daily updates and remarks will appear here for this building."
        />
      </>
    );
  };

  const renderCompanyPaymentsSection = () => (
    <>
      <MetricGrid
        items={[
          { label: 'Office Payments', value: formatCurrency(sumByAmount(relatedCompanyPayments)) },
          { label: 'Approval Expenses', value: formatCurrency(approvalExpenseTotal) },
          { label: 'Monthly Buckets', value: String(companyMonthlyTotals.length) },
          { label: 'Pending', value: formatCurrency(sumByAmount(pendingPayments.filter((payment) => payment.category === 'Expense'))), tone: 'warning' },
        ]}
      />

      <InfoCard title="Paid / Pending Status" subtitle="Company expenses and approval costs for this building.">
        <InfoRow label="Paid Company Expenses" value={formatCurrency(sumByAmount(relatedCompanyPayments.filter((payment) => isCompleteStatus(payment.status))))} />
        <InfoRow label="Pending Company Expenses" value={formatCurrency(sumByAmount(relatedCompanyPayments.filter((payment) => !isCompleteStatus(payment.status))))} />
        <InfoRow label="Approval Expense Total" value={formatCurrency(approvalExpenseTotal)} />
        <InfoRow label="Pending Approval Expense" value={formatCurrency(sumByAmount(pendingApprovals))} />
      </InfoCard>

      <InfoCard title="Monthly Totals" subtitle="Grouped company-related outflow month by month.">
        {companyMonthlyTotals.length === 0 ? (
          <EmptyState title="No monthly totals" description="No company-side payments have been recorded for this building." icon="calendar-outline" />
        ) : (
          companyMonthlyTotals.map((item) => (
            <InfoRow key={item.month} label={`${item.month} • ${item.count} entries`} value={formatCurrency(item.total)} />
          ))
        )}
      </InfoCard>

      {renderPaymentLedger(
        'Company Expense Register',
        'Office payments and site expense entries tied to this building.',
        relatedCompanyPayments,
        'No company expenses',
        'Company-side payment entries will appear here when added for this building.',
      )}

      <InfoCard title="Approval Expense Register" subtitle="Approval-linked spending pulled only from this building approvals.">
        {approvalEntries.length === 0 ? (
          <EmptyState title="No approval expenses" description="Approval charges will appear here for the selected building." icon="document-attach-outline" />
        ) : (
          approvalEntries.map((approval) => (
            <View key={approval.name} style={styles.detailPanel}>
              <View style={styles.panelHeaderRow}>
                <View style={styles.panelTextWrap}>
                  <Text style={styles.panelTitle}>{approval.name}</Text>
                  <Text style={styles.panelMeta}>{approval.pdfName}</Text>
                </View>
                <StatusPill size="sm" status={approval.status} />
              </View>
              <InfoRow label="Amount" value={formatCurrency(approval.amount)} />
              <InfoRow label="Date" value={formatShortDate(approval.date)} />
              <InfoRow label="Remarks" value={approval.remarks} />
            </View>
          ))
        )}
      </InfoCard>
    </>
  );

  const renderBuilderPaymentsSection = () => (
    <>
      <MetricGrid
        items={[
          { label: 'Builder Advance', value: formatCurrency(builderAdvanceTotal) },
          { label: 'Contractor Payments', value: formatCurrency(contractorPaymentTotal) },
          { label: 'Salary Payouts', value: formatCurrency(sumByAmount(relatedBuilderPayments.filter((payment) => payment.category === 'Salary'))) },
          { label: 'Pending Dues', value: formatCurrency(pendingBuilderTotal), tone: pendingBuilderTotal > 0 ? 'warning' : 'success' },
        ]}
      />

      <InfoCard title="Builder Settlement" subtitle="Builder advance, contractor payouts, and labour contractor dues for this building.">
        <InfoRow label="Client Receipts" value={formatCurrency(building.totalReceivedPayment)} />
        <InfoRow label="Current Expense" value={formatCurrency(building.totalExpense)} />
        <InfoRow label="Pending Dues" value={formatCurrency(pendingBuilderTotal)} />
        <InfoRow label="Profit / Loss" value={formatCurrency(building.totalReceivedPayment - building.totalExpense)} />
      </InfoCard>

      {renderPaymentLedger(
        'Builder Payments Register',
        'Advance, contractor, labour contractor, and salary-linked payment entries.',
        relatedBuilderPayments,
        'No builder payments',
        'Builder-related entries will show here for this selected building.',
      )}
    </>
  );

  const renderConstructionPaymentsSection = () => (
    <>
      <MetricGrid
        items={[
          { label: 'Cement Payments', value: formatCurrency(cementPaymentTotal) },
          { label: 'Sand Payments', value: formatCurrency(sandPaymentTotal) },
          { label: 'Steel Payments', value: formatCurrency(steelPaymentTotal) },
          { label: 'Vendor Dues', value: formatCurrency(vendorDueTotal), tone: vendorDueTotal > 0 ? 'warning' : 'success' },
        ]}
      />

      <InfoCard title="Construction Payment Summary" subtitle="Material vendor payments and site expenses scoped to this selected building.">
        <InfoRow label="Material Vendor Payments" value={formatCurrency(sumByAmount(relatedConstructionPayments.filter((payment) => payment.category === 'Vendor' || payment.category === 'Material')))} />
        <InfoRow label="Site Expenses" value={formatCurrency(sumByAmount(relatedConstructionPayments.filter((payment) => payment.category === 'Expense')))} />
        <InfoRow label="Material Register Total" value={formatCurrency(materialValueTotal)} />
        <InfoRow label="Pending Vendor Dues" value={formatCurrency(vendorDueTotal)} />
      </InfoCard>

      <InfoCard title="Material Vendor Register" subtitle="Material list, stock status, used quantity, pending quantity, and vendor details.">
        {buildingMaterials.length === 0 ? (
          <EmptyState title="No materials yet" description="Material entries for this building will appear here." icon="cube-outline" />
        ) : (
          buildingMaterials.map((material) => (
            <View key={material.id} style={styles.detailPanel}>
              <View style={styles.panelHeaderRow}>
                <View style={styles.panelTextWrap}>
                  <Text style={styles.panelTitle}>{material.materialName} • {material.brand}</Text>
                  <Text style={styles.panelMeta}>{material.vendorName}</Text>
                </View>
                <StatusPill size="sm" status={material.paymentStatus} />
              </View>
              <InfoRow label="Quantity" value={`${material.quantity} ${material.unit}`} />
              <InfoRow label="Used Quantity" value={`${material.usedQuantity} ${material.unit}`} />
              <InfoRow label="Pending Quantity" value={`${material.pendingQuantity} ${material.unit}`} />
              <InfoRow label="Total Amount" value={formatCurrency(material.totalAmount)} />
            </View>
          ))
        )}
      </InfoCard>

      {renderPaymentLedger(
        'Construction Payment Ledger',
        'Cement, sand, steel, vendor, material, and site expense entries for this building.',
        relatedConstructionPayments,
        'No construction payments',
        'Construction-specific ledger entries will appear here for this selected building.',
      )}
    </>
  );

  const renderEmployeesSection = () => (
    <>
      <MetricGrid
        items={[
          { label: 'Employees', value: String(buildingEmployees.length) },
          { label: 'Present Today', value: String(presentCount), tone: 'success' },
          { label: 'Absent Today', value: String(absentCount), tone: absentCount > 0 ? 'warning' : 'success' },
          { label: 'Total Workers', value: String(totalWorkers) },
        ]}
      />

      <InfoCard title="Building Employees" subtitle="Employee photo, name, role, phone number, assigned work, and current status.">
        {buildingEmployees.length === 0 ? (
          <EmptyState title="No employees assigned" description="Assign employees to this building to see them here." icon="people-outline" />
        ) : (
          buildingEmployees.map((employee) => <EmployeeTile key={employee.id} employee={employee} />)
        )}
      </InfoCard>
    </>
  );

  const renderSalarySection = () => (
    <>
      <MetricGrid
        items={[
          { label: 'Monthly Salary', value: formatCurrency(monthlySalaryTotal) },
          { label: 'Weekly Payment', value: formatCurrency(weeklySalaryTotal) },
          { label: 'Pending Salary', value: formatCurrency(pendingSalaryTotal), tone: pendingSalaryTotal > 0 ? 'warning' : 'success' },
          { label: 'Salary Deduction', value: formatCurrency(salaryDeductionTotal), tone: salaryDeductionTotal > 0 ? 'danger' : 'success' },
        ]}
      />

      <InfoCard title="Salary Summary" subtitle="Monthly salary, weekly payment, advance salary, pending salary, and salary deduction.">
        <InfoRow label="Monthly Salary" value={formatCurrency(monthlySalaryTotal)} />
        <InfoRow label="Weekly Payment" value={formatCurrency(weeklySalaryTotal)} />
        <InfoRow label="Advance Salary" value={formatCurrency(builderAdvanceTotal)} />
        <InfoRow label="Paid Salary" value={formatCurrency(paidSalaryTotal)} />
        <InfoRow label="Pending Salary" value={formatCurrency(pendingSalaryTotal)} />
        <InfoRow label="Salary Deduction" value={formatCurrency(salaryDeductionTotal)} />
      </InfoCard>

      <InfoCard title="Salary Lines" subtitle="Building-wise salary cycle per assigned employee.">
        {buildingEmployees.length === 0 ? (
          <EmptyState title="No salary lines" description="Assigned employees will show their salary lines here." icon="wallet-outline" />
        ) : (
          buildingEmployees.map((employee) => (
            <View key={employee.id} style={styles.detailPanel}>
              <Text style={styles.panelTitle}>{employee.employeeName}</Text>
              <Text style={styles.panelMeta}>{employee.roleTitle}</Text>
              <InfoRow label="Salary Cycle" value={employee.salaryType} />
              <InfoRow label="Salary Amount" value={formatCurrency(employee.salaryAmount)} />
              <InfoRow label="Leave Used" value={String(employee.leaveUsed)} />
              <InfoRow label="Deduction" value={formatCurrency(getSalaryDeduction(employee))} />
            </View>
          ))
        )}
      </InfoCard>

      {renderPaymentLedger(
        'Salary Payment Register',
        'Salary and labour-related payment history for this selected building.',
        relatedBuilderPayments,
        'No salary payments',
        'Salary-related entries will appear here for the selected building.',
      )}
    </>
  );

  const renderAttendanceSection = () => (
    <>
      <MetricGrid
        items={[
          { label: 'Present', value: String(presentCount), tone: 'success' },
          { label: 'Half Day', value: String(halfDayCount), tone: halfDayCount > 0 ? 'warning' : 'success' },
          { label: 'Absent', value: String(absentCount), tone: absentCount > 0 ? 'danger' : 'success' },
          { label: 'Leave Requests', value: String(pendingLeaveCount), tone: pendingLeaveCount > 0 ? 'warning' : 'success' },
        ]}
      />

      <InfoCard title="Attendance Register" subtitle="Daily attendance, leave status, and worker count for this building only.">
        {buildingEmployees.length === 0 ? (
          <EmptyState title="No attendance records" description="Assigned employees will appear here with attendance status." icon="calendar-outline" />
        ) : (
          buildingEmployees.map((employee) => (
            <View key={employee.id} style={styles.detailPanel}>
              <View style={styles.panelHeaderRow}>
                <View style={styles.panelTextWrap}>
                  <Text style={styles.panelTitle}>{employee.employeeName}</Text>
                  <Text style={styles.panelMeta}>{employee.roleTitle}</Text>
                </View>
                <StatusPill size="sm" status={employee.attendance.todayStatus} />
              </View>
              <InfoRow label="Present / Absent / Half Day" value={`${employee.attendance.present} / ${employee.attendance.absent} / ${employee.attendance.halfDay}`} />
              <InfoRow label="Leave Used" value={`${employee.leaveUsed} used • ${employee.leaveBalance} balance`} />
              <InfoRow label="Current Worker Count" value={String(totalWorkers)} />
            </View>
          ))
        )}
      </InfoCard>

      <InfoCard title="Leave Status" subtitle="Building-wise leave requests for assigned employees.">
        {buildingLeaveRequests.length === 0 ? (
          <EmptyState title="No leave requests" description="Leave requests for this building will appear here." icon="document-text-outline" />
        ) : (
          buildingLeaveRequests.map((request: LeaveRequest) => (
            <View key={request.id} style={styles.detailPanel}>
              <View style={styles.panelHeaderRow}>
                <View style={styles.panelTextWrap}>
                  <Text style={styles.panelTitle}>{request.employeeName}</Text>
                  <Text style={styles.panelMeta}>{request.reason}</Text>
                </View>
                <StatusPill size="sm" status={request.status} />
              </View>
              <InfoRow label="Dates" value={`${request.fromDate} to ${request.toDate}`} />
              <InfoRow label="Days" value={`${request.days} day(s)`} />
            </View>
          ))
        )}
      </InfoCard>
    </>
  );

  const renderMaterialsSection = () => (
    <>
      <MetricGrid
        items={[
          { label: 'Purchased', value: formatCurrency(building.materialsSummary.purchased) },
          { label: 'Used', value: formatCurrency(building.materialsSummary.used), tone: 'success' },
          { label: 'Pending', value: formatCurrency(building.materialsSummary.pending), tone: 'warning' },
          { label: 'Vendor Dues', value: formatCurrency(vendorDueTotal), tone: vendorDueTotal > 0 ? 'warning' : 'success' },
        ]}
      />

      <InfoCard title="Materials Summary" subtitle="Material list, stock status, used quantity, pending quantity, and vendor details.">
        <InfoRow label="Material Register Value" value={formatCurrency(materialValueTotal)} />
        <InfoRow label="Used Quantity Value" value={formatCurrency(building.materialsSummary.used)} />
        <InfoRow label="Pending Quantity Value" value={formatCurrency(building.materialsSummary.pending)} />
        <InfoRow label="Active Vendors" value={String(buildingVendors.length)} />
      </InfoCard>

      <InfoCard title="Material Register" subtitle="Building-scoped materials only.">
        {buildingMaterials.length === 0 ? (
          <EmptyState title="No materials found" description="Add material entries for this building to see them here." icon="cube-outline" />
        ) : (
          buildingMaterials.map((material) => (
            <View key={material.id} style={styles.detailPanel}>
              <View style={styles.panelHeaderRow}>
                <View style={styles.panelTextWrap}>
                  <Text style={styles.panelTitle}>{material.materialName} • {material.brand}</Text>
                  <Text style={styles.panelMeta}>{material.vendorName}</Text>
                </View>
                <StatusPill size="sm" status={material.paymentStatus} />
              </View>
              <InfoRow label="Stock Status" value={`${material.quantity} ${material.unit}`} />
              <InfoRow label="Used Quantity" value={`${material.usedQuantity} ${material.unit}`} />
              <InfoRow label="Pending Quantity" value={`${material.pendingQuantity} ${material.unit}`} />
              <InfoRow label="Vendor Details" value={material.vendorName} />
            </View>
          ))
        )}
      </InfoCard>

      <InfoCard title="Vendor Details" subtitle="Vendor list attached only to this building.">
        {buildingVendors.length === 0 ? (
          <EmptyState title="No vendors linked" description="Vendor details for this building will appear here." icon="storefront-outline" />
        ) : (
          buildingVendors.map((vendor) => (
            <View key={vendor.id} style={styles.detailPanel}>
              <Text style={styles.panelTitle}>{vendor.vendorName}</Text>
              <Text style={styles.panelMeta}>{vendor.materialType}</Text>
              <InfoRow label="Phone" value={vendor.phone} />
              <InfoRow label="Pending Payment" value={formatCurrency(vendor.paymentPending)} />
              <InfoRow label="Total Purchase" value={formatCurrency(vendor.totalPurchase)} />
            </View>
          ))
        )}
      </InfoCard>
    </>
  );

  const renderApprovalsSection = () => (
    <>
      <MetricGrid
        items={[
          { label: 'Approvals', value: String(approvalEntries.length) },
          { label: 'Approved', value: String(approvalEntries.filter((approval) => isCompleteStatus(approval.status)).length), tone: 'success' },
          { label: 'Pending', value: String(pendingApprovals.length), tone: pendingApprovals.length > 0 ? 'warning' : 'success' },
          { label: 'Uploaded Files', value: String(approvalEntries.length + 1 + buildingUploads.length) },
        ]}
      />

      <InfoCard title="Uploaded PDFs" subtitle="Plan PDF, approval PDFs, approved date, and pending approvals for this building.">
        <InfoRow label="Plan Layout PDF" value={building.planLayoutPdfName} />
        {buildingUploads.map((upload) => (
          <InfoRow key={upload.id} label={`Upload • ${upload.name}`} value={formatShortDate(upload.uploadedAt)} />
        ))}
      </InfoCard>

      {renderApprovalRegister()}
    </>
  );

  const renderLandDetailsSection = () => (
    <>
      {linkedLand ? (
        <>
          <MetricGrid
            items={[
              { label: 'Land Area', value: linkedLand.totalArea },
              { label: 'Survey No', value: linkedLand.surveyNumber },
              { label: 'Approval', value: linkedLand.approvalStatus, tone: isPendingStatus(linkedLand.approvalStatus) ? 'warning' : 'success' },
              { label: 'Layout PDF', value: linkedLand.layoutPdfName },
            ]}
          />

          <InfoCard title="Land Overview" subtitle="Linked land parcel details only for this selected building.">
            <InfoRow label="Land Area" value={linkedLand.totalArea} />
            <InfoRow label="Survey Number" value={linkedLand.surveyNumber} />
            <InfoRow label="Owner Details" value={linkedLand.ownerName} />
            <InfoRow label="Registration Details" value={linkedLand.registrationDetails} />
            <InfoRow label="Layout PDF" value={linkedLand.layoutPdfName} />
          </InfoCard>

          <InfoCard title="Land Approvals" subtitle="Parcel approval and registration records linked to this building.">
            {Object.entries(linkedLand.approvals).map(([label, approval]) => (
              <View key={label} style={styles.detailPanel}>
                <View style={styles.panelHeaderRow}>
                  <View style={styles.panelTextWrap}>
                    <Text style={styles.panelTitle}>{label}</Text>
                    <Text style={styles.panelMeta}>{approval.pdfName}</Text>
                  </View>
                  <StatusPill size="sm" status={approval.status} />
                </View>
                <InfoRow label="Date" value={formatShortDate(approval.date)} />
                <InfoRow label="Amount" value={formatCurrency(approval.amount)} />
                <InfoRow label="Remarks" value={approval.remarks} />
              </View>
            ))}
          </InfoCard>

          <InfoCard title="Maintenance" subtitle="Land parcel maintenance and layout readiness.">
            <InfoRow label="Plot Cleaning" value={linkedLand.maintenance.plotCleaning} />
            <InfoRow label="Compound Status" value={linkedLand.maintenance.compoundStatus} />
            <InfoRow label="EB Status" value={linkedLand.maintenance.ebStatus} />
            <InfoRow label="Road Status" value={linkedLand.maintenance.roadStatus} />
            <InfoRow label="Water" value={linkedLand.maintenance.waterConnection} />
            <InfoRow label="Drainage" value={linkedLand.maintenance.drainage} />
          </InfoCard>
        </>
      ) : (
        <InfoCard title="Land Details" subtitle="No linked parcel was found for this building.">
          <EmptyState title="No linked land" description="Add a land link to this building to surface parcel details here." icon="map-outline" />
        </InfoCard>
      )}
    </>
  );

  const renderReportsSection = () => {
    const reportItems = [
      {
        key: 'expense',
        title: 'Expense Report',
        description: 'Company, builder, and construction expense summary for the selected building.',
        content: [
          `Building: ${building.buildingName}`,
          `Company Payments: ${formatCurrency(sumByAmount(relatedCompanyPayments))}`,
          `Builder Payments: ${formatCurrency(sumByAmount(relatedBuilderPayments))}`,
          `Construction Payments: ${formatCurrency(sumByAmount(relatedConstructionPayments))}`,
          `Pending Payments: ${formatCurrency(pendingPaymentTotal)}`,
        ].join('\n'),
      },
      {
        key: 'salary',
        title: 'Salary Report',
        description: 'Monthly salary, weekly wage, advance salary, and salary deduction for this building.',
        content: [
          `Building: ${building.buildingName}`,
          `Monthly Salary: ${formatCurrency(monthlySalaryTotal)}`,
          `Weekly Payment: ${formatCurrency(weeklySalaryTotal)}`,
          `Pending Salary: ${formatCurrency(pendingSalaryTotal)}`,
          `Salary Deduction: ${formatCurrency(salaryDeductionTotal)}`,
          ...buildingEmployees.map((employee) => `${employee.employeeName} | ${employee.salaryType} | ${formatCurrency(employee.salaryAmount)}`),
        ].join('\n'),
      },
      {
        key: 'material',
        title: 'Material Report',
        description: 'Material stock, used quantity, pending quantity, and vendor-linked materials for this building.',
        content: [
          `Building: ${building.buildingName}`,
          `Purchased: ${formatCurrency(building.materialsSummary.purchased)}`,
          `Used: ${formatCurrency(building.materialsSummary.used)}`,
          `Pending: ${formatCurrency(building.materialsSummary.pending)}`,
          ...buildingMaterials.map((material) => `${material.materialName} | ${material.vendorName} | ${material.quantity} ${material.unit} | ${material.paymentStatus}`),
        ].join('\n'),
      },
      {
        key: 'attendance',
        title: 'Attendance Report',
        description: 'Daily attendance, present/absent counts, leave status, and worker count for this building.',
        content: [
          `Building: ${building.buildingName}`,
          `Present: ${presentCount}`,
          `Half Day: ${halfDayCount}`,
          `Absent: ${absentCount}`,
          `Worker Count: ${totalWorkers}`,
          ...buildingEmployees.map((employee) => `${employee.employeeName} | ${employee.attendance.todayStatus} | Leave Balance ${employee.leaveBalance}`),
        ].join('\n'),
      },
    ];

    return (
      <>
        <MetricGrid
          items={[
            { label: 'Expense Reports', value: '1' },
            { label: 'Salary Reports', value: '1' },
            { label: 'Material Reports', value: '1' },
            { label: 'Attendance Reports', value: '1' },
          ]}
        />

        <InfoCard title="Building Reports" subtitle="Download and share building-only reports for expense, salary, material, and attendance.">
          {reportItems.map((report) => (
            <View key={report.key} style={styles.detailPanel}>
              <Text style={styles.panelTitle}>{report.title}</Text>
              <Text style={styles.panelBody}>{report.description}</Text>
              <View style={styles.buttonGroup}>
                <AppButton
                  fullWidth={false}
                  icon={<Ionicons color={theme.colors.textSecondary} name="download-outline" size={18} />}
                  label="Download"
                  onPress={() => createReport('download', `${building.id}-${report.key}-report`, report.content)}
                  size="sm"
                  variant="outline"
                />
                <AppButton
                  fullWidth={false}
                  icon={<Ionicons color={theme.colors.primary} name="share-social-outline" size={18} />}
                  label="Share"
                  onPress={() => createReport('share', `${building.id}-${report.key}-report`, report.content)}
                  size="sm"
                  variant="secondary"
                />
              </View>
            </View>
          ))}
        </InfoCard>
      </>
    );
  };

  const renderRemarksSection = () => (
    <>
      <MetricGrid
        items={[
          { label: 'Site Remarks', value: String(siteRemarkItems.length) },
          { label: 'Delay Notes', value: String(delayRemarkItems.length), tone: delayRemarkItems.length > 0 ? 'warning' : 'success' },
          { label: 'Material Issues', value: String(materialIssueItems.length), tone: materialIssueItems.length > 0 ? 'warning' : 'success' },
          { label: 'Daily Updates', value: String(dailyUpdateItems.length) },
        ]}
      />

      <NoteListCard
        title="Site Remarks"
        subtitle="General site remarks for this building only."
        items={siteRemarkItems}
        emptyTitle="No site remarks"
        emptyDescription="Site remarks will appear here for the selected building."
      />

      <NoteListCard
        title="Delay Remarks"
        subtitle="Pending approvals and payments that may affect site movement."
        items={delayRemarkItems}
        emptyTitle="No delay remarks"
        emptyDescription="Delay-related notes will appear here when something is blocked or pending."
      />

      <NoteListCard
        title="Material Issue Remarks"
        subtitle="Material stock and vendor issues scoped only to this building."
        items={materialIssueItems}
        emptyTitle="No material issues"
        emptyDescription="Material issue notes will appear here if this building has shortages or blocked vendor payments."
      />

      <NoteListCard
        title="Engineer Notes"
        subtitle="Engineer-facing approval and technical remarks for this building."
        items={engineerNoteItems}
        emptyTitle="No engineer notes"
        emptyDescription="Engineer notes will appear here from the building approval register."
      />

      <NoteListCard
        title="Daily Updates"
        subtitle="Daily site updates for this building."
        items={dailyUpdateItems}
        emptyTitle="No daily updates"
        emptyDescription="Daily work updates will appear here for this selected building."
      />

      <RemarksSection module="buildings" referenceId={building.id} title="Building Remarks" />
    </>
  );

  const renderSectionContent = (item: BuildingSectionDefinition) => {
    switch (item.key as BuildingSectionKey) {
      case 'overview':
        return renderOverviewSection();
      case 'company-payments':
        return renderCompanyPaymentsSection();
      case 'builder-payments':
        return renderBuilderPaymentsSection();
      case 'construction-payments':
        return renderConstructionPaymentsSection();
      case 'employees':
        return renderEmployeesSection();
      case 'salary':
        return renderSalarySection();
      case 'attendance':
        return renderAttendanceSection();
      case 'materials':
        return renderMaterialsSection();
      case 'approvals':
        return renderApprovalsSection();
      case 'land-details':
        return renderLandDetailsSection();
      case 'reports':
        return renderReportsSection();
      case 'remarks':
        return renderRemarksSection();
      default:
        return null;
    }
  };

  return (
    <SafeAreaView edges={['top', 'left', 'right']} style={styles.safeArea}>
      <StatusBar style={theme.statusBarStyle} />
      <View style={styles.header}>
        <View style={styles.headerTopRow}>
          <Pressable
            accessibilityRole="button"
            onPress={() => router.push(backHref)}
            style={({ pressed }) => [styles.backButton, pressed ? styles.backButtonPressed : undefined]}
          >
            <Ionicons color={theme.colors.text} name="chevron-back" size={20} />
            <Text style={styles.backText}>Back</Text>
          </Pressable>
          <StatusPill size="sm" status={building.approvalStatus} />
        </View>
        <Text style={styles.sectionEyebrow}>{currentSection.label}</Text>
        <Text style={styles.title}>{building.buildingName}</Text>
        <Text style={styles.subtitle}>{building.clientName} • {building.siteAddress}</Text>
      </View>

      <View style={styles.tabBarWrap}>
        <ScrollView contentContainerStyle={styles.tabBarContent} horizontal showsHorizontalScrollIndicator={false}>
          {accessibleSections.map((item) => {
            const active = item.key === currentSection.key;

            return (
              <Pressable
                key={item.key}
                accessibilityRole="button"
                onPress={() => router.replace(getBuildingSectionHref(building.id, item.key))}
                style={({ pressed }) => [styles.tabChip, active ? styles.tabChipActive : undefined, pressed ? styles.tabChipPressed : undefined]}
              >
                <Ionicons color={active ? theme.colors.primary : theme.colors.textSecondary} name={item.icon as never} size={16} />
                <Text style={[styles.tabChipText, active ? styles.tabChipTextActive : undefined]}>{item.label}</Text>
              </Pressable>
            );
          })}
        </ScrollView>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <InfoCard accent title={currentSection.label} subtitle={currentSection.description}>
          <Text style={styles.bodyText}>All cards, registers, reports, and remarks below are filtered only for {building.buildingName}.</Text>
        </InfoCard>

        {renderSectionContent(currentSection)}
      </ScrollView>
    </SafeAreaView>
  );
}

function makeStyles(theme: AppTheme) { return StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  blockedWrap: {
    flex: 1,
    padding: theme.spacing.md,
  },
  header: {
    paddingHorizontal: theme.spacing.md,
    paddingTop: theme.spacing.md,
    paddingBottom: theme.spacing.sm,
    gap: 4,
    backgroundColor: theme.colors.background,
  },
  headerTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: theme.spacing.sm,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    borderRadius: theme.radius.full,
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.card.border,
  },
  backButtonPressed: {
    opacity: theme.isDark ? 0.94 : 0.82,
  },
  backText: {
    fontSize: theme.typography.small,
    fontWeight: '700',
    color: theme.colors.textSecondary,
  },
  sectionEyebrow: {
    fontSize: theme.typography.caption,
    fontWeight: '800',
    letterSpacing: 1,
    textTransform: 'uppercase',
    color: theme.colors.primary,
  },
  title: {
    fontSize: theme.typography.title,
    fontWeight: '800',
    color: theme.colors.text,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: theme.typography.small,
    color: theme.colors.textMuted,
    lineHeight: theme.typography.lineHeightBody,
  },
  tabBarWrap: {
    paddingBottom: theme.spacing.sm,
    backgroundColor: theme.colors.background,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.divider,
  },
  tabBarContent: {
    paddingHorizontal: theme.spacing.md,
    gap: theme.spacing.sm,
  },
  tabChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: theme.radius.full,
    borderWidth: 1,
    borderColor: theme.card.border,
    backgroundColor: theme.colors.surface,
  },
  tabChipActive: {
    backgroundColor: theme.colors.primarySoft,
    borderColor: theme.card.accentBorder,
  },
  tabChipPressed: {
    opacity: theme.isDark ? 0.94 : 0.82,
  },
  tabChipText: {
    fontSize: theme.typography.small,
    fontWeight: '700',
    color: theme.colors.textSecondary,
  },
  tabChipTextActive: {
    color: theme.colors.primary,
  },
  content: {
    padding: theme.spacing.md,
    gap: theme.spacing.md,
    paddingBottom: 120,
  },
  bodyText: {
    fontSize: theme.typography.body,
    lineHeight: theme.typography.lineHeightBody,
    color: theme.colors.textSecondary,
  },
  metricGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.sm,
  },
  metricTile: {
    minWidth: '47%',
    flexGrow: 1,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.card.sectionBorder,
    backgroundColor: theme.colors.backgroundAlt,
    padding: theme.spacing.sm,
    gap: 4,
  },
  metricLabel: {
    fontSize: theme.typography.caption,
    color: theme.colors.textLight,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  metricValue: {
    fontSize: theme.typography.subtitle,
    fontWeight: '800',
    color: theme.colors.text,
  },
  metricValueSuccess: {
    color: theme.colors.success,
  },
  metricValueWarning: {
    color: theme.colors.warning,
  },
  metricValueDanger: {
    color: theme.colors.danger,
  },
  detailPanel: {
    borderRadius: theme.radius.md,
    backgroundColor: theme.colors.backgroundAlt,
    borderWidth: 1,
    borderColor: theme.card.sectionBorder,
    padding: theme.spacing.sm,
    gap: theme.spacing.xs,
  },
  panelHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: theme.spacing.sm,
  },
  panelTextWrap: {
    flex: 1,
    gap: 2,
  },
  panelTitle: {
    fontSize: theme.typography.body,
    fontWeight: '800',
    color: theme.colors.text,
  },
  panelBody: {
    fontSize: theme.typography.small,
    lineHeight: theme.typography.lineHeightBody,
    color: theme.colors.textSecondary,
  },
  panelMeta: {
    fontSize: theme.typography.caption,
    color: theme.colors.textLight,
  },
  buttonGroup: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.sm,
  },
  employeeTile: {
    borderRadius: theme.radius.md,
    backgroundColor: theme.colors.backgroundAlt,
    borderWidth: 1,
    borderColor: theme.card.sectionBorder,
    padding: theme.spacing.sm,
    gap: theme.spacing.xs,
  },
  employeeHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  avatarWrap: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: theme.colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: theme.typography.small,
    fontWeight: '800',
    color: theme.colors.primary,
  },
  employeeTextWrap: {
    flex: 1,
    gap: 2,
  },
  employeeName: {
    fontSize: theme.typography.body,
    fontWeight: '800',
    color: theme.colors.text,
  },
  employeeMeta: {
    fontSize: theme.typography.caption,
    color: theme.colors.textSecondary,
  },
}); }