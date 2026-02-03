export enum PaymentMethod {
  STRIPE = 'stripe',
  CONTANTI = 'cash',
  POS = 'pos'
}

export interface AgentOption {
  id: number;
  value: string;
  label: string;
}

export enum ConditionalLogic{
  depends = 1,
  notDepends
}
export enum OptionType{
  select = 1,
  text,
  textarea,
  date,
  color
}

export enum UserRole {
  ADMIN = 'admin',
  OPERATOR = 'operator',
  CUSTOMER = 'customer'
}

export enum LoginType {
  homeWork = 'Home work',
  onSite = 'In sede',
}

export function normalizeDate(date: Date): Date {
  const d = new Date(date);
  d.setHours(12, 0, 0, 0);
  return d;
}