/**
 * API Service Layer
 */

import {
  User, Store, LossReason, LossRecord, SaleRecord, UserRole,
} from "./types";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

function getAuthToken() {
  return localStorage.getItem("authToken") || "";
}

function authHeaders() {
  const token = getAuthToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function handleJson<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || res.statusText);
  }
  return res.json();
}

// ============ AUTH ============
export interface LoginResponse {
  token: string;
  user: User;
}

export async function apiLogin(email: string, password: string): Promise<LoginResponse | null> {
  const res = await fetch(`${API_BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) return null;
  return handleJson<LoginResponse>(res);
}

// ============ USERS / VENDORS ============
export async function apiGetUsers(): Promise<User[]> {
  const res = await fetch(`${API_BASE_URL}/users`, { headers: { ...authHeaders() } });
  return handleJson<User[]>(res);
}

export async function apiGetUsersByStore(storeId: string): Promise<User[]> {
  const res = await fetch(`${API_BASE_URL}/users?storeId=${storeId}`, { headers: { ...authHeaders() } });
  return handleJson<User[]>(res);
}

export async function apiGetVendorsByStore(storeId: string): Promise<User[]> {
  const res = await fetch(`${API_BASE_URL}/users?storeId=${storeId}&role=vendedor`, { headers: { ...authHeaders() } });
  return handleJson<User[]>(res);
}

export interface CreateUserPayload {
  name: string;
  email: string;
  role: UserRole;
  storeId: string;
  password?: string;
}

export async function apiCreateUser(payload: CreateUserPayload): Promise<User> {
  const res = await fetch(`${API_BASE_URL}/users`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify(payload),
  });
  return handleJson<User>(res);
}

export async function apiUpdateUser(id: string, payload: Partial<CreateUserPayload & { active: boolean }>): Promise<User> {
  const res = await fetch(`${API_BASE_URL}/users/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify(payload),
  });
  return handleJson<User>(res);
}

export async function apiDeleteUser(id: string): Promise<void> {
  const res = await fetch(`${API_BASE_URL}/users/${id}`, { method: "DELETE", headers: { ...authHeaders() } });
  if (!res.ok) throw new Error("Failed to delete user");
}

// ============ STORES ============
export async function apiGetStores(): Promise<Store[]> {
  const res = await fetch(`${API_BASE_URL}/stores`, { headers: { ...authHeaders() } });
  return handleJson<Store[]>(res);
}

export interface CreateStorePayload {
  name: string;
  managerId: string;
}

export async function apiCreateStore(payload: CreateStorePayload): Promise<Store> {
  const res = await fetch(`${API_BASE_URL}/stores`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify(payload),
  });
  return handleJson<Store>(res);
}

export async function apiUpdateStore(id: string, payload: Partial<CreateStorePayload & { active: boolean }>): Promise<Store> {
  const res = await fetch(`${API_BASE_URL}/stores/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify(payload),
  });
  return handleJson<Store>(res);
}

export async function apiDeleteStore(id: string): Promise<void> {
  const res = await fetch(`${API_BASE_URL}/stores/${id}`, { method: "DELETE", headers: { ...authHeaders() } });
  if (!res.ok) throw new Error("Failed to delete store");
}

// ============ LOSS REASONS ============
export async function apiGetLossReasons(): Promise<LossReason[]> {
  const res = await fetch(`${API_BASE_URL}/loss-reasons`, { headers: { ...authHeaders() } });
  return handleJson<LossReason[]>(res);
}

export async function apiCreateLossReason(payload: { label: string; requiresNote: boolean }): Promise<LossReason> {
  const res = await fetch(`${API_BASE_URL}/loss-reasons`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify(payload),
  });
  return handleJson<LossReason>(res);
}

export async function apiDeleteLossReason(id: string): Promise<void> {
  const res = await fetch(`${API_BASE_URL}/loss-reasons/${id}`, { method: "DELETE", headers: { ...authHeaders() } });
  if (!res.ok) throw new Error("Failed to delete reason");
}

// ============ LOSSES ============
export async function apiGetLosses(): Promise<LossRecord[]> {
  const res = await fetch(`${API_BASE_URL}/losses`, { headers: { ...authHeaders() } });
  return handleJson<LossRecord[]>(res);
}

export async function apiGetLossesForVendor(vendorId: string): Promise<LossRecord[]> {
  const res = await fetch(`${API_BASE_URL}/losses?vendorId=${vendorId}`, { headers: { ...authHeaders() } });
  return handleJson<LossRecord[]>(res);
}

export async function apiGetLossesForStore(storeId: string): Promise<LossRecord[]> {
  const res = await fetch(`${API_BASE_URL}/losses?storeId=${storeId}`, { headers: { ...authHeaders() } });
  return handleJson<LossRecord[]>(res);
}

export interface CreateLossPayload {
  vendorId: string;
  storeId: string;
  reasonId: string;
  reasonLabel: string;
  note?: string;
}

export async function apiCreateLoss(payload: CreateLossPayload): Promise<LossRecord> {
  const res = await fetch(`${API_BASE_URL}/losses`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify(payload),
  });
  return handleJson<LossRecord>(res);
}

// ============ SALES (integration-ready) ============
export async function apiGetSales(): Promise<SaleRecord[]> {
  const res = await fetch(`${API_BASE_URL}/sales`, { headers: { ...authHeaders() } });
  return handleJson<SaleRecord[]>(res);
}

export async function apiGetSalesForVendor(vendorId: string): Promise<SaleRecord[]> {
  const res = await fetch(`${API_BASE_URL}/sales?vendorId=${vendorId}`, { headers: { ...authHeaders() } });
  return handleJson<SaleRecord[]>(res);
}

export async function apiGetSalesForStore(storeId: string): Promise<SaleRecord[]> {
  const res = await fetch(`${API_BASE_URL}/sales?storeId=${storeId}`, { headers: { ...authHeaders() } });
  return handleJson<SaleRecord[]>(res);
}

// ============ METRICS (integration-ready) ============
export interface SalesMetrics {
  totalSales: number;
  totalValue: number;
  totalLosses: number;
  byVendor: Array<{
    vendorId: string;
    vendorName: string;
    sales: number;
    value: number;
    losses: number;
  }>;
  byReason: Array<{ reason: string; count: number }>;
}

export async function apiGetStoreMetrics(storeId: string): Promise<SalesMetrics> {
  const res = await fetch(`${API_BASE_URL}/metrics/store/${storeId}`, { headers: { ...authHeaders() } });
  return handleJson<SalesMetrics>(res);
}

export async function apiGetNetworkMetrics(): Promise<SalesMetrics & { byStore: Array<{ storeId: string; storeName: string; sales: number; value: number; losses: number }> }> {
  const res = await fetch(`${API_BASE_URL}/metrics/network`, { headers: { ...authHeaders() } });
  return handleJson<SalesMetrics & { byStore: Array<{ storeId: string; storeName: string; sales: number; value: number; losses: number }> }>(res);
}
