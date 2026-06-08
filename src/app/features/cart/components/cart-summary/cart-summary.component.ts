// features/cart/components/cart-summary/cart-summary.component.ts

import {
  Component,
  Input,
  Output,
  EventEmitter,
  ChangeDetectionStrategy
} from '@angular/core';

@Component({
  selector: 'app-cart-summary',
  standalone: false,
  templateUrl: './cart-summary.component.html',
  styleUrls: ['./cart-summary.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CartSummaryComponent {

  @Input() subtotal = 0;
  @Input() tax = 0;
  @Input() shipping = 0;
  @Input() discount = 0;
  @Input() currencySymbol = 'R';
  @Input() showTax = false;
  @Input() showShipping = false;
  @Input() showDiscount = false;

  @Output() checkout = new EventEmitter<void>();
  @Output() continueShopping = new EventEmitter<void>();

  get total(): number {
    return this.subtotal + this.tax + this.shipping - this.discount;
  }

  get showTotal(): boolean {
    return this.showTax || this.showShipping || this.showDiscount;
  }

  onCheckout(): void {
    this.checkout.emit();
  }

  onContinueShopping(): void {
    this.continueShopping.emit();
  }
}