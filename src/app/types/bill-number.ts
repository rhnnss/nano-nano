export type billNumberType = {
  name: string;
  phone: string;
  address: string;
  type: string;
};

export enum SaveCustomerIdStatus {
  NotSaved = "not_saved", // ID has not been saved at all
  Saved = "saved", // ID has been saved
  MaxLimitReached = "max_limit_reached", // Maximum limit for saving IDs has been reached
}

export enum CanSaveNewBillingStatus {
  NotSaved = "true",
  Saved = "saved",
  MaxLimitReached = "false",
}

export interface BillingInterface {
  name: string;
  phone: string;
  address: string;
  type: string;
  billingDetail: BillingDetailInterface;
  canSaveNewBilling: CanSaveNewBillingStatus;
  saveCustomerIdStatus: SaveCustomerIdStatus;
}

export interface BillingDetailInterface {
  paymentCode: string;
  custNumber: string;
  custName: string;
  custSegment?: string;
  custType?: string;
  standBegin: string;
  standEnd: string;
  readingMethod: string;
  usage: string;
  billAmount: string;
  currency: string;
  totalBillPeriod: string;
  billPeriod: string;
  billCycle: string;
  billReference: string;
  gasInvAmount: string;
  guaranteeInvAmount: string;
  othersInvAmount: string;
  totalAmount: string;
  sessionId?: string;
  timeResponse?: string;
  adminFees: number;
  grandTotal: string;
}

// Validate Customer
export interface IBillingNumber {
  id: number;
  name: string;
  number: string;
}

export interface ICustomer {
  id: number;
  uuid: string;
  name: string;
  email: string;
  created_at: string;
  updated_at: string;
  billing_numbers: IBillingNumber[];
}

export interface ICustomerData {
  customer: ICustomer;
}
