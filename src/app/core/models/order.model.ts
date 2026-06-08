// src/app/core/models/order.model.ts

export type OrderStatus =
  | 'PENDING'
  | 'CONFIRMED'
  | 'PROCESSING'
  | 'SHIPPED'
  | 'DELIVERED'
  | 'CANCELLED';

export type OrderStatusColor =
  | 'info'
  | 'primary'
  | 'success'
  | 'danger';

export const ORDER_STATUS_CONFIG: Record<
  OrderStatus,
  { label: string; color: OrderStatusColor }
> = {
  PENDING: {label: "Pending",color: "primary"},
  CONFIRMED: { label: 'Confirmed', color: 'info' },
  PROCESSING: { label: 'Processing', color: 'info' },
  SHIPPED: { label: 'Shipped', color: 'primary' },
  DELIVERED: { label: 'Delivered', color: 'success' },
  CANCELLED: { label: 'Cancelled', color: 'danger' },
};

export const CANCELLABLE_STATUSES: OrderStatus[] = [
  'CONFIRMED',
];

export interface OrderItem {
  productId: number;
  productName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface Order {
  id: number;
  orderNumber: string;
  customerPhone: string;
  customerEmail?: string;
  customerName: string;
  status: OrderStatus;
  items: OrderItem[];

  // Pricing
  subtotal: number;
  tax: number;
  total: number;
  currency: string;
  shippingCost?: number;

  // Discount
  discountCode?: DiscountCode;
  appliedDiscountCode?: string;
  discountAmount?: number;

  // Addresses
  shippingAddress: string;
  billingAddress: string;

  // Timestamps
  createdAt: Date | null;
  updatedAt?: Date | null;

  // Computed / UI helpers
  itemCount: number;
  isConfirmed: boolean;
  isDelivered: boolean;
  isCancelled: boolean;
  canBeCancelled: boolean;
  statusLabel: string;
  statusColor: OrderStatusColor;
}

export interface CreateOrderItem {
  productId: number;
  productName: string;
  quantity: number;
  unitPrice: number;
}

export interface CreateOrderPayload {
  customerPhone: string;
  customerEmail?: string;
  customerName: string;
  items: CreateOrderItem[];
  shippingAddress: string;
  billingAddress?: string;
  currency?: string;
  shippingCost?: number;
}

export interface UpdateOrderStatusPayload {
  orderNumber: number;
  status: OrderStatus;
}

export interface OrderFilter {
  customerEmail?: string;
  customerPhone?: string;
  status?: OrderStatus;
}

export type DiscountType = 'FIXED' | 'PERCENTAGE';

export interface DiscountCode {
  id?: number;
  code?: string;
  userPrefix?: string;
  discountType?: DiscountType;
  discountValue?: number;
  minimumOrderAmount?: number;
  maxUses?: number;
  currentUses?: number;
  maxUsesPerCustomer?: number;
  expiresAt?: string;
  active?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface ApplyDiscountCodePayload {
  code: string;
}

export interface CreateDiscountCodePayload {
  userPrefix: string;
  discountType: DiscountType;
  discountValue: number;
  minimumOrderAmount?: number;
  maxUses?: number;
  maxUsesPerCustomer?: number;
  expiresAt?: string;
}