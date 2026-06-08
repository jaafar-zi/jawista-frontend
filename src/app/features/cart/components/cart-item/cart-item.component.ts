// features/cart/components/cart-item/cart-item.component.ts

import {
  Component,
  Input,
  Output,
  EventEmitter,
  ChangeDetectionStrategy
} from '@angular/core';
import { CartItem, QuantityChangeEvent } from '../../../../core/models/cart.model';

@Component({
  selector: 'app-cart-item',
  standalone: false,
  templateUrl: './cart-item.component.html',
  styleUrls: ['./cart-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CartItemComponent {

  @Input() item!: CartItem;
  @Input() currencySymbol = 'R';

  @Output() quantityChange = new EventEmitter<QuantityChangeEvent>();
  @Output() remove = new EventEmitter<string>();

  get itemTotal(): number {
    return this.item.price * this.item.quantity;
  }

  get hasOptions(): boolean {
    return !!(this.item.size || this.item.color);
  }

  get hasBothOptions(): boolean {
    return !!(this.item.size && this.item.color);
  }

  get isMinQuantity(): boolean {
    return this.item.quantity <= 1;
  }

  onDecrease(): void {
    if (!this.isMinQuantity) {
      this.quantityChange.emit({
        itemId: this.item.id,
        quantity: this.item.quantity - 1
      });
    }
  }

  onIncrease(): void {
    this.quantityChange.emit({
      itemId: this.item.id,
      quantity: this.item.quantity + 1
    });
  }

  onRemove(): void {
    this.remove.emit(this.item.id);
  }
}