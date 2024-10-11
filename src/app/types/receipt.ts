export interface ReceiptInterface {
  transactionId: string;
  transactionDate: string;
  refNumber: number;
  serviceType: string;
  type: string;
  custNumber: string;
  name: string;
  periode: string;
  firstStand: number;
  lastStand: number;
  used: number;
  sourceOfFund: string;
  totalPrice: string;
  fees: string;
  grandTotal: string;
}
