// src/app/core/models/cart.model.ts

export interface CartItem {
  id:         string;
  productId:  string;
  name:       string;
  price:      number;
  quantity:   number;
  image?:     string;
  size?:      string;
  color?:     string;
  sku?:       string;
}

export interface Cart {
  items:     CartItem[];
  itemCount: number;
  subtotal:  number;
  total:     number;
  currency:  string;
  tax?:      number;
  shipping?: number;
  discount?: number;
}

export interface UpdateCartItemRequest {
  itemId:   string;
  quantity: number;
}

export interface RemoveCartItemRequest {
  itemId: string;
}

export interface QuantityChangeEvent {
  itemId:   string;
  quantity: number;
}

// ─── Cart → Order ─────────────────────────────────────────────
export interface CartCheckoutPayload {
  customerPhone: string;
  customerEmail?: string;
  customerName: string;
  shippingAddress: string;
  billingAddress: string;
  currency: string;
  shippingCost?: number;
}