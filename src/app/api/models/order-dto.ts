// Generated model — adapted to match new API Order entity response

import { DiscountCode } from '../../core/models/order.model';
import { OrderItemDto } from '../models/order-item-dto';

export interface OrderDto {
  id?: number;
  orderNumber?: string;
  customerPhone?: string;    
  customerEmail?: string;
  customerName: string;
  status?: 'PENDING' | 'CONFIRMED' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
  items: Array<OrderItemDto>;

  // Pricing
  subtotal?: number;
  tax?: number;
  total?: number;
  currency?: string;
  shippingCost?: number;          

  // Discount
  discountCode?: DiscountCode;    
  appliedDiscountCode?: string;   
  discountAmount?: number;        

  // Addresses
  shippingAddress?: string;
  billingAddress?: string;

  // Timestamps
  createdAt?: string;
  updatedAt?: string;             
}