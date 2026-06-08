// quantity-selector.component.ts
import {
  Component,
  Input,
  Output,
  EventEmitter,
  ChangeDetectionStrategy
} from '@angular/core';

@Component({
  selector: 'app-quantity-selector',
  standalone: false,
  templateUrl: './quantity-selector.component.html',
  styleUrls: ['./quantity-selector.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class QuantitySelectorComponent {
  @Input() quantity = 1;
  @Input() min = 1;
  @Input() max = 99;
  @Input() disabled = false;

  @Output() quantityChange = new EventEmitter<number>();

  get canDecrease(): boolean {
    return this.quantity > this.min && !this.disabled;
  }

  get canIncrease(): boolean {
    return this.quantity < this.max && !this.disabled;
  }

  decrease(): void {
    if (this.canDecrease) {
      this.quantityChange.emit(this.quantity - 1);
    }
  }

  increase(): void {
    if (this.canIncrease) {
      this.quantityChange.emit(this.quantity + 1);
    }
  }
}