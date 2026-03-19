// Mock data for the sales loss tracking system

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

export const LOSS_REASONS: LossReason[] = [
  { id: "1", label: "Preço alto", requiresNote: false },
  { id: "2", label: "Crédito negado", requiresNote: false },
  { id: "3", label: "Falta de mercadoria", requiresNote: false },
  { id: "4", label: "Cliente apenas olhando", requiresNote: false },
  { id: "5", label: "Troca", requiresNote: false },
  { id: "6", label: "Outros", requiresNote: true },
];

export const STORES: Store[] = [
  { id: "s1", name: "Loja Centro", managerId: "u2", active: true },
  { id: "s2", name: "Loja Shopping Norte", managerId: "u5", active: true },
  { id: "s3", name: "Loja Bairro Sul", managerId: "u2", active: true },
];

export const USERS: User[] = [
  { id: "u1", name: "Carlos Silva", email: "carlos@loja.com", role: "vendedor", storeId: "s1" },
  { id: "u2", name: "Ana Gerente", email: "ana@loja.com", role: "gerente", storeId: "s1" },
  { id: "u3", name: "Roberto Admin", email: "roberto@loja.com", role: "dono", storeId: "s1" },
  { id: "u4", name: "Maria Santos", email: "maria@loja.com", role: "vendedor", storeId: "s1" },
  { id: "u5", name: "João Lima", email: "joao@loja.com", role: "gerente", storeId: "s2" },
  { id: "u6", name: "Fernanda Costa", email: "fernanda@loja.com", role: "vendedor", storeId: "s2" },
  { id: "u7", name: "Pedro Alves", email: "pedro@loja.com", role: "vendedor", storeId: "s2" },
  { id: "u8", name: "Lucas Oliveira", email: "lucas@loja.com", role: "vendedor", storeId: "s3" },
];

// Generate mock sales
export const SALES: SaleRecord[] = [
  { id: "sale1", vendorId: "u1", storeId: "s1", amount: 1250, date: "2026-03-17" },
  { id: "sale2", vendorId: "u1", storeId: "s1", amount: 890, date: "2026-03-16" },
  { id: "sale3", vendorId: "u1", storeId: "s1", amount: 2100, date: "2026-03-15" },
  { id: "sale4", vendorId: "u4", storeId: "s1", amount: 1750, date: "2026-03-17" },
  { id: "sale5", vendorId: "u4", storeId: "s1", amount: 620, date: "2026-03-16" },
  { id: "sale6", vendorId: "u6", storeId: "s2", amount: 3200, date: "2026-03-17" },
  { id: "sale7", vendorId: "u6", storeId: "s2", amount: 1100, date: "2026-03-16" },
  { id: "sale8", vendorId: "u7", storeId: "s2", amount: 980, date: "2026-03-17" },
  { id: "sale9", vendorId: "u7", storeId: "s2", amount: 2400, date: "2026-03-15" },
  { id: "sale10", vendorId: "u8", storeId: "s3", amount: 1500, date: "2026-03-17" },
  { id: "sale11", vendorId: "u8", storeId: "s3", amount: 870, date: "2026-03-16" },
  { id: "sale12", vendorId: "u1", storeId: "s1", amount: 1450, date: "2026-03-14" },
  { id: "sale13", vendorId: "u4", storeId: "s1", amount: 2200, date: "2026-03-14" },
  { id: "sale14", vendorId: "u6", storeId: "s2", amount: 1800, date: "2026-03-14" },
  { id: "sale15", vendorId: "u7", storeId: "s2", amount: 950, date: "2026-03-14" },
];

export const LOSSES: LossRecord[] = [
  { id: "l1", vendorId: "u1", storeId: "s1", reasonId: "1", reasonLabel: "Preço alto", createdAt: "2026-03-17T10:30:00" },
  { id: "l2", vendorId: "u1", storeId: "s1", reasonId: "3", reasonLabel: "Falta de mercadoria", createdAt: "2026-03-17T11:15:00" },
  { id: "l3", vendorId: "u1", storeId: "s1", reasonId: "4", reasonLabel: "Cliente apenas olhando", createdAt: "2026-03-16T14:00:00" },
  { id: "l4", vendorId: "u4", storeId: "s1", reasonId: "2", reasonLabel: "Crédito negado", createdAt: "2026-03-17T09:45:00" },
  { id: "l5", vendorId: "u4", storeId: "s1", reasonId: "1", reasonLabel: "Preço alto", createdAt: "2026-03-16T16:30:00" },
  { id: "l6", vendorId: "u6", storeId: "s2", reasonId: "1", reasonLabel: "Preço alto", createdAt: "2026-03-17T10:00:00" },
  { id: "l7", vendorId: "u6", storeId: "s2", reasonId: "5", reasonLabel: "Troca", createdAt: "2026-03-16T13:20:00" },
  { id: "l8", vendorId: "u7", storeId: "s2", reasonId: "4", reasonLabel: "Cliente apenas olhando", createdAt: "2026-03-17T15:00:00" },
  { id: "l9", vendorId: "u7", storeId: "s2", reasonId: "6", reasonLabel: "Outros", note: "Cliente desistiu na hora do pagamento", createdAt: "2026-03-15T11:30:00" },
  { id: "l10", vendorId: "u8", storeId: "s3", reasonId: "3", reasonLabel: "Falta de mercadoria", createdAt: "2026-03-17T09:00:00" },
  { id: "l11", vendorId: "u8", storeId: "s3", reasonId: "2", reasonLabel: "Crédito negado", createdAt: "2026-03-16T10:45:00" },
  { id: "l12", vendorId: "u1", storeId: "s1", reasonId: "1", reasonLabel: "Preço alto", createdAt: "2026-03-14T10:00:00" },
  { id: "l13", vendorId: "u6", storeId: "s2", reasonId: "2", reasonLabel: "Crédito negado", createdAt: "2026-03-14T14:00:00" },
];

export function getSalesForVendor(vendorId: string) {
  return SALES.filter(s => s.vendorId === vendorId);
}

export function getLossesForVendor(vendorId: string) {
  return LOSSES.filter(l => l.vendorId === vendorId);
}

export function getSalesForStore(storeId: string) {
  return SALES.filter(s => s.storeId === storeId);
}

export function getLossesForStore(storeId: string) {
  return LOSSES.filter(l => l.storeId === storeId);
}

export function getVendorsForStore(storeId: string) {
  return USERS.filter(u => u.storeId === storeId && u.role === "vendedor");
}

export function getStoreName(storeId: string) {
  return STORES.find(s => s.id === storeId)?.name ?? "Desconhecida";
}

export function getUserName(userId: string) {
  return USERS.find(u => u.id === userId)?.name ?? "Desconhecido";
}

export function formatCurrency(value: number) {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value);
}
