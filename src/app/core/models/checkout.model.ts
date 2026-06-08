export interface CheckoutFormData {
  phone: string;
  email?: string;       
  name: string;
  address: string;
  city: string;
  province: string;
}

export interface CheckoutSummary {
  subtotal: number;
  shipping: number;
  tax: number;
  discount: number;
  total: number;
  appliedDiscountCode?: string;
  discountType?: 'FIXED' | 'PERCENTAGE';
}

export interface CheckoutResult {
  orderId: string;
  orderNumber: string;
  total: number;
  currency: string;
  discountApplied?: boolean;
}