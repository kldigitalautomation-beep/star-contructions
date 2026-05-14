import type { ModuleKey } from './types';

export type BuildingSectionKey =
  | 'overview'
  | 'company-payments'
  | 'builder-payments'
  | 'construction-payments'
  | 'employees'
  | 'salary'
  | 'attendance'
  | 'materials'
  | 'approvals'
  | 'land-details'
  | 'reports'
  | 'remarks';

export interface BuildingSectionDefinition {
  key: BuildingSectionKey;
  label: string;
  moduleKey: ModuleKey;
  icon: string;
  description: string;
}

export const buildingSections: BuildingSectionDefinition[] = [
  {
    key: 'overview',
    label: 'Overview',
    moduleKey: 'buildings',
    icon: 'grid-outline',
    description: 'Project summary, progress, worker strength, approvals, and recent activity.',
  },
  {
    key: 'company-payments',
    label: 'Company Payments',
    moduleKey: 'payments',
    icon: 'business-outline',
    description: 'Office expense, approval expense, monthly totals, and paid versus pending company outflow.',
  },
  {
    key: 'builder-payments',
    label: 'Builder Payments',
    moduleKey: 'payments',
    icon: 'cash-outline',
    description: 'Builder advances, contractor payouts, labour dues, and pending settlement tracking.',
  },
  {
    key: 'construction-payments',
    label: 'Construction Payments',
    moduleKey: 'payments',
    icon: 'wallet-outline',
    description: 'Material bills, vendor dues, cement, steel, sand, and site expense payments.',
  },
  {
    key: 'employees',
    label: 'Employees',
    moduleKey: 'employees',
    icon: 'people-outline',
    description: 'Building-wise employee directory with role, phone, assigned work, and current status.',
  },
  {
    key: 'salary',
    label: 'Salary',
    moduleKey: 'employees',
    icon: 'card-outline',
    description: 'Monthly salary, weekly wages, advances, pending salary, and deduction overview.',
  },
  {
    key: 'attendance',
    label: 'Attendance',
    moduleKey: 'attendance',
    icon: 'calendar-outline',
    description: 'Present, absent, leave status, worker count, and building attendance view.',
  },
  {
    key: 'materials',
    label: 'Materials',
    moduleKey: 'materials',
    icon: 'cube-outline',
    description: 'Material stock, used quantity, pending quantity, and vendor-linked material details.',
  },
  {
    key: 'approvals',
    label: 'Approvals',
    moduleKey: 'buildings',
    icon: 'document-text-outline',
    description: 'Approval register, uploaded PDFs, approved dates, and pending approval tracking.',
  },
  {
    key: 'land-details',
    label: 'Land Details',
    moduleKey: 'lands',
    icon: 'map-outline',
    description: 'Linked land parcel area, survey number, registration, owner details, and layout PDF.',
  },
  {
    key: 'reports',
    label: 'Reports',
    moduleKey: 'reports',
    icon: 'download-outline',
    description: 'Expense, salary, material, and attendance report actions for the selected building.',
  },
  {
    key: 'remarks',
    label: 'Remarks',
    moduleKey: 'remarks',
    icon: 'chatbubble-ellipses-outline',
    description: 'Site remarks, delay notes, material issues, engineer notes, and daily updates.',
  },
];

export function isBuildingSection(value: string | undefined): value is BuildingSectionKey {
  return buildingSections.some((section) => section.key === value);
}

export function getAccessibleBuildingSections(hasAccess: (moduleKey: ModuleKey) => boolean) {
  return buildingSections.filter((section) => hasAccess(section.moduleKey));
}

export function getDefaultBuildingSection(hasAccess: (moduleKey: ModuleKey) => boolean): BuildingSectionKey {
  return getAccessibleBuildingSections(hasAccess)[0]?.key ?? 'overview';
}

export function getBuildingSectionHref(buildingId: string, section: BuildingSectionKey) {
  return `/buildings/${buildingId}/${section}` as const;
}