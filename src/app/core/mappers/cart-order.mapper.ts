import { Injectable } from '@angular/core';
import { Cart, CartItem, CartCheckoutPayload } from '../models/cart.model';
import { CreateOrderPayload, CreateOrderItem } from '../models/order.model';

export interface CartValidation {
  isValid: boolean;
  errors: string[];
}

@Injectable({ providedIn: 'root' })
export class CartOrderMapper {

  toCreateOrderPayload(
    cart: Cart,
    checkout: CartCheckoutPayload
  ): CreateOrderPayload {
    return {
      customerPhone:   checkout.customerPhone,
      customerEmail:   checkout.customerEmail || undefined,
      customerName:    checkout.customerName,
      items:           cart.items.map(item => this.toOrderItem(item)),
      shippingAddress: checkout.shippingAddress,
      billingAddress:  checkout.billingAddress,
      currency:        checkout.currency ?? 'TND',
      shippingCost:    checkout.shippingCost,
    };
  }

  validateCart(cart: Cart): CartValidation {
    const errors: string[] = [];

    if (!cart.items || cart.items.length === 0) {
      errors.push('Cart is empty');
    }

    cart.items.forEach((item, index) => {
      if (!item.productId) {
        errors.push(`Item ${index + 1}: missing product ID`);
      }
      if (item.quantity <= 0) {
        errors.push(`Item ${index + 1}: invalid quantity`);
      }
      if (item.price <= 0) {
        errors.push(`Item ${index + 1}: invalid price`);
      }
    });

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  private toOrderItem(item: CartItem): CreateOrderItem {
    return {
      productId:   Number(item.productId),
      productName: item.name,
      quantity:    item.quantity,
      unitPrice:   item.price,
    };
  }
}