import { Address } from "./address.model";

export type ShippingStatusColor =
  | 'warning'
  | 'info'
  | 'primary'
  | 'success'
  | 'danger';

export const SHIPPING_STATUS_CONFIG: Record<
  string,
  { label: string; color: ShippingStatusColor; step: number }
> = {
  PENDING:          { label: 'Pending',           color: 'warning', step: 0 },
  PROCESSING:       { label: 'Processing',         color: 'warning', step: 1 },
  PICKED_UP:        { label: 'Picked Up',          color: 'info',    step: 2 },
  IN_TRANSIT:       { label: 'In Transit',         color: 'info',    step: 3 },
  OUT_FOR_DELIVERY: { label: 'Out for Delivery',   color: 'primary', step: 4 },
  DELIVERED:        { label: 'Delivered',          color: 'success', step: 5 },
  FAILED:           { label: 'Delivery Failed',    color: 'danger',  step: -1 },
  RETURNED:         { label: 'Returned',           color: 'danger',  step: -1 },
};

export interface ShippingStatusEntry {
  id: number;
  shippingId: number;
  status: string;
  location: string;
  timestamp: Date;
  description: string;
  notes: string;
  updatedBy: string;
  createdAt: Date | null;
}

export interface Shipping {
  id: number;
  trackingNumber: string;
  orderId: number;
  orderNumber: string;
  shippingAddress: Address;
  shippingMethod: string;
  currentStatus: string;
  carrier: string;
  shippingCost: number;
  weight: number;
  estimatedDeliveryDate: Date | null;
  actualDeliveryDate: Date | null;
  shippedDate: Date | null;
  specialInstructions: string;
  notes: string;
  statusHistory: ShippingStatusEntry[];
  createdAt: Date | null;
  updatedAt: Date | null;
  isDelivered: boolean;
  isFailed: boolean;
  isInTransit: boolean;
  statusLabel: string;
  statusColor: ShippingStatusColor;
  deliveryStep: number;
  latestStatus: ShippingStatusEntry | null;
  daysUntilDelivery: number | null;
  isOverdue: boolean;
}

export interface CreateShippingPayload {
  orderId: number;
  shippingAddressId: number;
  shippingMethod: string;
  carrier: string;
  shippingCost?: number;
  weight?: number;
  specialInstructions?: string;
  notes?: string;
}

export interface UpdateShippingPayload {
  trackingNumber: string;
  carrier?: string;
  shippingMethod?: string;
  shippingCost?: number;
  weight?: number;
  specialInstructions?: string;
  notes?: string;
  estimatedDeliveryDate?: Date;
}

export interface UpdateShippingStatusPayload {
  trackingNumber: string;
  status: string;
  location: string;
  description?: string;
  notes?: string;
  updatedBy?: string;
}

export interface ShippingFilter {
  status?: string;
  customerEmail?: string;
  orderId?: number;
}