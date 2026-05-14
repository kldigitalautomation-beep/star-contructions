import { createContext, ReactNode, useContext, useState } from 'react';
import buildingsSeed from '../data/buildings.json';
import employeesSeed from '../data/employees.json';
import landsSeed from '../data/lands.json';
import materialsSeed from '../data/materials.json';
import paymentsSeed from '../data/payments.json';
import remarksSeed from '../data/remarks.json';
import usersSeed from '../data/users.json';
import vendorsSeed from '../data/vendors.json';
import { canAccessModule } from '../navigation/accessMap';
import type {
  BuildingRecord,
  DemoUser,
  EmployeeRecord,
  LandRecord,
  LeaveRequest,
  MaterialRecord,
  ModuleKey,
  PaymentRecord,
  RemarkRecord,
  UploadRecord,
  VendorRecord,
} from './types';

interface AppContextValue {
  currentUser: DemoUser | null;
  users: DemoUser[];
  lands: LandRecord[];
  buildings: BuildingRecord[];
  employees: EmployeeRecord[];
  materials: MaterialRecord[];
  vendors: VendorRecord[];
  payments: PaymentRecord[];
  remarks: RemarkRecord[];
  uploads: UploadRecord[];
  leaveRequests: LeaveRequest[];
  login: (email: string, password: string) => boolean;
  logout: () => void;
  hasAccess: (moduleKey: ModuleKey) => boolean;
  addDemoLand: () => void;
  updateLand: (id: string, changes: Partial<LandRecord>) => void;
  deleteLand: (id: string) => void;
  addDemoBuilding: () => void;
  updateBuilding: (id: string, changes: Partial<BuildingRecord>) => void;
  deleteBuilding: (id: string) => void;
  addDemoEmployee: () => void;
  updateEmployee: (id: string, changes: Partial<EmployeeRecord>) => void;
  deleteEmployee: (id: string) => void;
  updateAttendance: (employeeId: string, status: 'Present' | 'Absent' | 'Half Day') => void;
  requestLeave: (employeeId: string, reason: string, days: number) => void;
  updatePaymentStatus: (paymentId: string, status: string) => void;
  updateMaterialPaymentStatus: (materialId: string, status: string) => void;
  addRemark: (module: string, referenceId: string, text: string) => void;
  saveUpload: (record: UploadRecord) => void;
  addDailyUpdate: (buildingId: string, note: string) => void;
}

const initialLeaveRequests: LeaveRequest[] = [
  {
    id: 'LEV001',
    employeeId: 'EMP006',
    employeeName: 'K. Ravi',
    fromDate: '2026-05-20',
    toDate: '2026-05-20',
    days: 1,
    reason: 'Family function',
    status: 'Pending',
  },
  {
    id: 'LEV002',
    employeeId: 'EMP003',
    employeeName: 'P. Kumar',
    fromDate: '2026-05-22',
    toDate: '2026-05-23',
    days: 2,
    reason: 'Medical leave',
    status: 'Approved',
  },
];

const AppContext = createContext<AppContextValue | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<DemoUser | null>(null);
  const [users] = useState<DemoUser[]>(usersSeed as DemoUser[]);
  const [lands, setLands] = useState<LandRecord[]>(landsSeed as unknown as LandRecord[]);
  const [buildings, setBuildings] = useState<BuildingRecord[]>(buildingsSeed as BuildingRecord[]);
  const [employees, setEmployees] = useState<EmployeeRecord[]>(employeesSeed as EmployeeRecord[]);
  const [materials, setMaterials] = useState<MaterialRecord[]>(materialsSeed as MaterialRecord[]);
  const [vendors, setVendors] = useState<VendorRecord[]>(vendorsSeed as VendorRecord[]);
  const [payments, setPayments] = useState<PaymentRecord[]>(paymentsSeed as PaymentRecord[]);
  const [remarks, setRemarks] = useState<RemarkRecord[]>(remarksSeed as RemarkRecord[]);
  const [uploads, setUploads] = useState<UploadRecord[]>([]);
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>(initialLeaveRequests);

  const login = (email: string, password: string) => {
    const matchedUser = users.find(
      (user) => user.email.trim().toLowerCase() === email.trim().toLowerCase() && user.password === password,
    );

    if (!matchedUser) {
      return false;
    }

    setCurrentUser(matchedUser);
    return true;
  };

  const logout = () => setCurrentUser(null);

  const hasAccess = (moduleKey: ModuleKey) => canAccessModule(currentUser?.role, moduleKey);

  const addDemoLand = () => {
    setLands((current) => [
      {
        id: `LAND${String(current.length + 1).padStart(3, '0')}`,
        landName: `New Layout ${current.length + 1}`,
        location: 'Chengalpattu',
        totalArea: '2.4 Acres',
        surveyNumber: 'TBD',
        ownerName: 'New Owner',
        brokerDetails: 'New Broker',
        purchaseAmount: 1500000,
        registrationDetails: 'Registration pending',
        approvalStatus: 'Pending',
        layoutPdfName: 'new-layout.pdf',
        plotDetails: [],
        plotSales: [],
        expenses: [],
        remarks: ['Demo land added by admin'],
        approvals: {},
        maintenance: {
          plotCleaning: 'Pending',
          compoundStatus: 'Pending',
          ebStatus: 'Pending',
          roadStatus: 'Pending',
          securityDetails: 'Pending',
          waterConnection: 'Pending',
          drainage: 'Pending',
        },
        landSaleDetails: 'No plot sales yet',
      },
      ...current,
    ]);
  };

  const updateLand = (id: string, changes: Partial<LandRecord>) => {
    setLands((current) => current.map((land) => (land.id === id ? { ...land, ...changes } : land)));
  };

  const deleteLand = (id: string) => {
    setLands((current) => current.filter((land) => land.id !== id));
  };

  const addDemoBuilding = () => {
    setBuildings((current) => [
      {
        id: `BLD${String(current.length + 1).padStart(3, '0')}`,
        buildingName: `New Site ${current.length + 1}`,
        clientName: 'New Client',
        siteAddress: 'Chennai',
        landId: lands[0]?.id,
        floors: 1,
        buildingArea: '1800 Sq.ft',
        agreementDetails: 'Demo agreement',
        approvalStatus: 'Pending',
        planLayoutPdfName: 'demo-plan.pdf',
        constructionProgress: 10,
        totalExpense: 0,
        totalReceivedPayment: 0,
        employeeIds: [],
        labourList: [],
        vendorIds: [],
        materialsSummary: { purchased: 0, used: 0, pending: 0 },
        approvals: {},
        remarks: ['New building added in demo'],
        dailyUpdates: [],
      },
      ...current,
    ]);
  };

  const updateBuilding = (id: string, changes: Partial<BuildingRecord>) => {
    setBuildings((current) => current.map((building) => (building.id === id ? { ...building, ...changes } : building)));
  };

  const deleteBuilding = (id: string) => {
    setBuildings((current) => current.filter((building) => building.id !== id));
  };

  const addDemoEmployee = () => {
    setEmployees((current) => [
      {
        id: `EMP${String(current.length + 1).padStart(3, '0')}`,
        employeeName: 'New Employee',
        employeeCode: `SC${String(current.length + 1).padStart(3, '0')}`,
        mobileNumber: '+91 90000 00000',
        roleTitle: 'Helper',
        category: 'Labour Workers',
        assignedBuildingId: buildings[0]?.id ?? 'BLD001',
        salaryType: 'Weekly',
        salaryAmount: 3500,
        attendance: { present: 0, absent: 0, halfDay: 0, todayStatus: 'Present' },
        leaveUsed: 0,
        extraLeave: 0,
        leaveBalance: 4,
        paymentHistory: [],
        northIndian: false,
      },
      ...current,
    ]);
  };

  const updateEmployee = (id: string, changes: Partial<EmployeeRecord>) => {
    setEmployees((current) => current.map((employee) => (employee.id === id ? { ...employee, ...changes } : employee)));
  };

  const deleteEmployee = (id: string) => {
    setEmployees((current) => current.filter((employee) => employee.id !== id));
  };

  const updateAttendance = (employeeId: string, status: 'Present' | 'Absent' | 'Half Day') => {
    setEmployees((current) =>
      current.map((employee) => {
        if (employee.id !== employeeId) {
          return employee;
        }

        return {
          ...employee,
          attendance: {
            ...employee.attendance,
            todayStatus: status,
          },
        };
      }),
    );
  };

  const requestLeave = (employeeId: string, reason: string, days: number) => {
    const employee = employees.find((entry) => entry.id === employeeId);
    if (!employee) {
      return;
    }

    setLeaveRequests((current) => [
      {
        id: `LEV${String(current.length + 1).padStart(3, '0')}`,
        employeeId,
        employeeName: employee.employeeName,
        fromDate: '2026-05-24',
        toDate: '2026-05-24',
        days,
        reason,
        status: 'Pending',
      },
      ...current,
    ]);
  };

  const updatePaymentStatus = (paymentId: string, status: string) => {
    setPayments((current) => current.map((payment) => (payment.id === paymentId ? { ...payment, status } : payment)));
  };

  const updateMaterialPaymentStatus = (materialId: string, status: string) => {
    setMaterials((current) => current.map((material) => (material.id === materialId ? { ...material, paymentStatus: status } : material)));
  };

  const addRemark = (module: string, referenceId: string, text: string) => {
    if (!currentUser) {
      return;
    }

    setRemarks((current) => [
      {
        id: `RMK${String(current.length + 1).padStart(3, '0')}`,
        module,
        referenceId,
        authorRole: currentUser.role,
        date: new Date().toISOString(),
        text,
      },
      ...current,
    ]);
  };

  const saveUpload = (record: UploadRecord) => {
    setUploads((current) => [record, ...current]);
  };

  const addDailyUpdate = (buildingId: string, note: string) => {
    setBuildings((current) =>
      current.map((building) => {
        if (building.id !== buildingId) {
          return building;
        }

        return {
          ...building,
          dailyUpdates: [{ date: new Date().toISOString(), note }, ...building.dailyUpdates],
        };
      }),
    );
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        users,
        lands,
        buildings,
        employees,
        materials,
        vendors,
        payments,
        remarks,
        uploads,
        leaveRequests,
        login,
        logout,
        hasAccess,
        addDemoLand,
        updateLand,
        deleteLand,
        addDemoBuilding,
        updateBuilding,
        deleteBuilding,
        addDemoEmployee,
        updateEmployee,
        deleteEmployee,
        updateAttendance,
        requestLeave,
        updatePaymentStatus,
        updateMaterialPaymentStatus,
        addRemark,
        saveUpload,
        addDailyUpdate,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useAppData() {
  const context = useContext(AppContext);

  if (!context) {
    throw new Error('useAppData must be used inside AppProvider');
  }

  return context;
}