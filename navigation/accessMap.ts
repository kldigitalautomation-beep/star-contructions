import type { MenuItem, ModuleKey, UserRole } from '../utils/types';

export const roleLabels: Record<UserRole, string> = {
  overallAdmin: 'Overall Admin',
  paymentManager: 'Payment Manager',
  leadManager: 'Lead Manager',
  staff: 'Staff User',
};

export const roleDescriptions: Record<UserRole, string> = {
  overallAdmin: 'Full access to all construction, land, payment, employee, and document modules.',
  paymentManager: 'Handles salaries, labour payments, vendor payments, and monthly expenses.',
  leadManager: 'Tracks site progress, attendance, labour, materials, and daily work remarks.',
  staff: 'Views own work, attendance, leave, and assigned building details only.',
};

export const roleAccess: Record<UserRole, ModuleKey[]> = {
  overallAdmin: [
    'dashboard',
    'lands',
    'buildings',
    'employees',
    'attendance',
    'leave',
    'payments',
    'materials',
    'vendors',
    'pdfUpload',
    'reports',
    'remarks',
    'settings',
  ],
  paymentManager: ['dashboard', 'employees', 'payments', 'materials', 'vendors', 'reports', 'remarks'],
  leadManager: ['dashboard', 'buildings', 'employees', 'attendance', 'leave', 'materials', 'remarks'],
  staff: ['dashboard', 'buildings', 'employees', 'attendance', 'leave', 'remarks'],
};

export const moreMenuItems: MenuItem[] = [
  {
    key: 'attendance',
    label: 'Attendance',
    description: 'Mark today attendance and review daily presence.',
    route: '/attendance',
    icon: 'calendar',
  },
  {
    key: 'leave',
    label: 'Leave Management',
    description: 'Track 4 days leave rule and apply for leave.',
    route: '/leave',
    icon: 'document-text',
  },
  {
    key: 'payments',
    label: 'Payments',
    description: 'Vendor, salary, labour, and material payment tracking.',
    route: '/payments',
    icon: 'cash',
  },
  {
    key: 'materials',
    label: 'Materials',
    description: 'Building-wise materials, rates, stock, and pending balance.',
    route: '/materials',
    icon: 'cube',
  },
  {
    key: 'vendors',
    label: 'Vendors',
    description: 'Vendor contacts, GST, purchase totals, and payment history.',
    route: '/vendors',
    icon: 'storefront',
  },
  {
    key: 'pdfUpload',
    label: 'PDF Upload',
    description: 'Upload layout, agreement, estimate, and approval PDFs.',
    route: '/pdf-upload',
    icon: 'cloud-upload',
  },
  {
    key: 'reports',
    label: 'Reports',
    description: 'Download demo summaries for payment, employee, and project data.',
    route: '/reports',
    icon: 'download',
  },
  {
    key: 'remarks',
    label: 'Remarks',
    description: 'Site remarks, material issues, payment notes, and employee remarks.',
    route: '/remarks',
    icon: 'chatbubble-ellipses',
  },
  {
    key: 'settings',
    label: 'Settings',
    description: 'Demo role information, access summary, and app settings.',
    route: '/settings',
    icon: 'settings',
  },
];

export function canAccessModule(role: UserRole | undefined, moduleKey: ModuleKey) {
  if (!role) {
    return false;
  }

  return roleAccess[role].includes(moduleKey);
}