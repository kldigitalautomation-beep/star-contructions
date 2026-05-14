import type {
  BuildingRecord,
  DemoUser,
  EmployeeRecord,
  LandRecord,
  LeaveRequest,
  MaterialRecord,
  PaymentRecord,
  VendorRecord,
} from './types';

export function getVisibleLands(user: DemoUser | null, lands: LandRecord[]) {
  if (!user || user.role !== 'overallAdmin') {
    return [];
  }

  return lands;
}

export function getVisibleBuildings(user: DemoUser | null, buildings: BuildingRecord[]) {
  if (!user) {
    return [];
  }

  if (user.role === 'staff' && user.assignedBuildingId) {
    return buildings.filter((building) => building.id === user.assignedBuildingId);
  }

  return buildings;
}

export function getVisibleEmployees(user: DemoUser | null, employees: EmployeeRecord[]) {
  if (!user) {
    return [];
  }

  if (user.role === 'staff' && user.employeeId) {
    return employees.filter((employee) => employee.id === user.employeeId);
  }

  return employees;
}

export function getVisiblePayments(user: DemoUser | null, payments: PaymentRecord[]) {
  if (!user || (user.role !== 'overallAdmin' && user.role !== 'paymentManager')) {
    return [];
  }

  return payments;
}

export function getVisibleMaterials(user: DemoUser | null, materials: MaterialRecord[]) {
  if (!user) {
    return [];
  }

  if (user.role === 'staff' && user.assignedBuildingId) {
    return materials.filter((material) => material.buildingId === user.assignedBuildingId);
  }

  if (user.role === 'overallAdmin' || user.role === 'paymentManager' || user.role === 'leadManager') {
    return materials;
  }

  return [];
}

export function getVisibleVendors(user: DemoUser | null, vendors: VendorRecord[]) {
  if (!user || (user.role !== 'overallAdmin' && user.role !== 'paymentManager')) {
    return [];
  }

  return vendors;
}

export function getVisibleLeaveRequests(user: DemoUser | null, leaveRequests: LeaveRequest[]) {
  if (!user) {
    return [];
  }

  if (user.role === 'staff' && user.employeeId) {
    return leaveRequests.filter((leaveRequest) => leaveRequest.employeeId === user.employeeId);
  }

  if (user.role === 'paymentManager') {
    return [];
  }

  return leaveRequests;
}