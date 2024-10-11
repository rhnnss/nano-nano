type Balance = {
  cash: number;
  poin: number;
  instalment: number;
  paylater: number;
  other: number;
};

type Card = {
  maskedNumber: string;
  panNumber: string;
};

export type PaymentMethod = {
  name?: string;
  id: string;
  sourceOfFund: string;
  iconUrl: string;
  type: string;
  reason: string;
  isActive: boolean;
  is_default?: boolean;
  code?: string;
  balance: Balance;
  card: Card;
  createdAt: string;
  updatedAt: string;
};

export type PaymentMethods = PaymentMethod[];
