export namespace Transaction {
  export interface Response {
    success: boolean;
    data: Data;
    message: string;
    status: string;
    code: number;
  }

  export interface Data {
    id: number;
    billing_data: BillingData;
    customer_id: string;
    customer_number_id: number | string;
    customer_number: string;
    customer_name: string;
    customer_address: string;
    customer_type: string;
    invoice_number: string;
    transaction_number: string;
    transaction_details: TransactionDetail[];
    total_amount: number;
    original_price: number;
    admin_fee: number;
    currency_code: string;
    payment_method: string;
    payment_status: string;
    payment_status_bahasa: string;
    deleted_at: string | Date;
    created_at: string;
    updated_at: string;
    discount: {
      discount: string;
      discountInRp: number;
      discountType: string;
      finalAdminFee: number;
    };
  }

  export interface TransactionDetail {
    type: string;
    name: string;
    productName: string;
    price: number;
    originalPrice: number;
    quantity: number;
    category: string;
  }

  export interface BillingData {
    adminFees: number;
    billCycle: number;
    billPeriod: string;
    billReference: number;
    currency: string;
    custName: string;
    custNumber: string;
    custSegment: string;
    custType: string;
    gasInvAmount: number;
    grandTotal: number;
    guaranteeInvAmount: number;
    isDiscount: boolean;
    othersInvAmount: number;
    paymentCode: string;
    readingMethod: string;
    sessionId: string;
    standBegin: number;
    standEnd: number;
    timeResponse: string;
    totalAmount: number;
    totalBillPeriod: number;
    usage: number;
    discount: {
      discount: string;
      discountInRp: number;
      discountType: string;
      finalAdminFee: number;
    };
  }
}
