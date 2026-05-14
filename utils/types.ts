export type UserRole = 'overallAdmin' | 'paymentManager' | 'leadManager' | 'staff';

export type ModuleKey =
  | 'dashboard'
  | 'lands'
  | 'buildings'
  | 'employees'
  | 'attendance'
  | 'leave'
  | 'payments'
  | 'materials'
  | 'vendors'
  | 'pdfUpload'
  | 'reports'
  | 'remarks'
  | 'settings';

export interface DemoUser {
  id: string;
  name: string;
  email: string;
  password: string;
  phone: string;
  role: UserRole;
  assignedBuildingId?: string;
  employeeId?: string;
}

export interface PaymentHistoryItem {
  date: string;
  amount: number;
  note: string;
}

export interface ApprovalDetail {
  status: string;
  date: string;
  amount: number;
  remarks: string;
  pdfName: string;
}

export interface PlotDetail {
  plotNumber: string;
  plotSize: string;
  status: string;
}

export interface LandExpense {
  name: string;
  amount: number;
}

export interface LandSale {
  id: string;
  buyerName: string;
  buyerPhoneNumber: string;
  plotNumber: string;
  plotSize: string;
  saleAmount: number;
  advanceAmount: number;
  balanceAmount: number;
  paymentHistory: PaymentHistoryItem[];
  registrationDate: string;
  brokerCommission: number;
  agreementCopyPdf: string;
  paymentStatus: string;
  landApprovalDetails: string;
}

export interface MaintenanceStatus {
  plotCleaning: string;
  compoundStatus: string;
  ebStatus: string;
  roadStatus: string;
  securityDetails: string;
  waterConnection: string;
  drainage: string;
}

export interface LandRecord {
  id: string;
  landName: string;
  location: string;
  totalArea: string;
  surveyNumber: string;
  ownerName: string;
  brokerDetails: string;
  purchaseAmount: number;
  registrationDetails: string;
  approvalStatus: string;
  layoutPdfName: string;
  plotDetails: PlotDetail[];
  plotSales: LandSale[];
  expenses: LandExpense[];
  remarks: string[];
  approvals: Record<string, ApprovalDetail>;
  maintenance: MaintenanceStatus;
  landSaleDetails: string;
}

export interface LabourGroup {
  title: string;
  count: number;
}

export interface DailyUpdate {
  date: string;
  note: string;
}

export interface BuildingRecord {
  id: string;
  buildingName: string;
  clientName: string;
  siteAddress: string;
  landId?: string;
  floors: number;
  buildingArea: string;
  agreementDetails: string;
  approvalStatus: string;
  planLayoutPdfName: string;
  constructionProgress: number;
  totalExpense: number;
  totalReceivedPayment: number;
  employeeIds: string[];
  labourList: LabourGroup[];
  vendorIds: string[];
  materialsSummary: {
    purchased: number;
    used: number;
    pending: number;
  };
  approvals: Record<string, ApprovalDetail>;
  remarks: string[];
  dailyUpdates: DailyUpdate[];
}

export interface EmployeeAttendance {
  present: number;
  absent: number;
  halfDay: number;
  todayStatus: 'Present' | 'Absent' | 'Half Day';
}

export interface EmployeeRecord {
  id: string;
  employeeName: string;
  employeeCode: string;
  mobileNumber: string;
  roleTitle: string;
  category: string;
  assignedBuildingId: string;
  salaryType: 'Weekly' | 'Monthly';
  salaryAmount: number;
  attendance: EmployeeAttendance;
  leaveUsed: number;
  extraLeave: number;
  leaveBalance: number;
  paymentHistory: PaymentHistoryItem[];
  northIndian: boolean;
}

export interface MaterialRecord {
  id: string;
  buildingId: string;
  materialName: string;
  brand: string;
  quantity: number;
  unit: string;
  rate: number;
  totalAmount: number;
  vendorName: string;
  paymentStatus: string;
  deliveryDate: string;
  usedBuilding: string;
  usedQuantity: number;
  pendingQuantity: number;
}

export interface VendorRecord {
  id: string;
  vendorName: string;
  phone: string;
  materialType: string;
  paymentPending: number;
  totalPurchase: number;
  paymentHistory: PaymentHistoryItem[];
  gstNumber: string;
  address: string;
}

export interface PaymentRecord {
  id: string;
  title: string;
  category: string;
  buildingId?: string;
  employeeId?: string;
  vendorId?: string;
  amount: number;
  dueDate: string;
  status: string;
  remarks: string;
  frequency: string;
  paidTo: string;
}

export interface RemarkRecord {
  id: string;
  module: string;
  referenceId: string;
  authorRole: UserRole;
  date: string;
  text: string;
}

export interface UploadRecord {
  id: string;
  module: string;
  referenceId: string;
  name: string;
  uri: string;
  mimeType: string;
  uploadedAt: string;
}

export interface LeaveRequest {
  id: string;
  employeeId: string;
  employeeName: string;
  fromDate: string;
  toDate: string;
  days: number;
  reason: string;
  status: string;
}

export interface MenuItem {
  key: ModuleKey;
  label: string;
  description: string;
  route: string;
  icon: string;
}