export type UserRole = "vendedor" | "gerente" | "dono";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  storeId: string;
  avatar?: string;
  active?: boolean;
}

export interface Store {
  id: string;
  name: string;
  managerId: string;
  active: boolean;
}

export interface LossReason {
  id: string;
  label: string;
  requiresNote: boolean;
}

export interface LossRecord {
  id: string;
  vendorId: string;
  storeId: string;
  reasonId: string;
  reasonLabel: string;
  note?: string;
  createdAt: string;
}

export interface SaleRecord {
  id: string;
  vendorId: string;
  storeId: string;
  amount: number;
  date: string;
}
