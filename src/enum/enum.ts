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