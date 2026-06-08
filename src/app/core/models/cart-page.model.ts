import { Cart } from "./cart.model";

export interface CartPageVm {
  cart:           Cart;
  isEmpty:        boolean;
  subtotal:       number;
  itemCount:      number;
  currencySymbol: string;
  hasDiscount:    boolean;
  hasTax:         boolean;
  hasShipping:    boolean;
}