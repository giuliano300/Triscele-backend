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

export enum FieldTypes {
  select = 1,
  selectMultiple, 
  date,
  color,
  checkbox, 
  radio,
  text,
  texarea
}

export enum ConditionalLogic{
  show = 1,
  hide
}