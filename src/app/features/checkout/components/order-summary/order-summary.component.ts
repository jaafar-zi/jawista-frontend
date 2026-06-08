import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnInit,
  OnDestroy,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { CartItem } from '../../../../core/models/cart.model';
import { CheckoutSummary } from '../../../../core/models/checkout.model';
import {
  CheckoutService,
  DiscountPhase,
} from '../../../../core/services/checkout.service';

@Component({
  selector: 'app-order-summary',
  standalone: false,
  templateUrl: './order-summary.component.html',
  styleUrls: ['./order-summary.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrderSummaryComponent implements OnInit, OnDestroy {

  @Input() cartItems: CartItem[] = [];
  @Input() summary!: CheckoutSummary;
  @Input() currencySymbol = 'TND';

  @Output() discountApplied = new EventEmitter<string>();
  @Output() discountRemoved = new EventEmitter<void>();

  discountCodeControl = new FormControl('');

  discountPhase: DiscountPhase = 'idle';
  discountError = '';
  appliedCode = '';
  isValidating = false;

  private readonly destroy$ = new Subject<void>();

  constructor(
    private readonly checkoutService: CheckoutService,
    private readonly cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.checkoutService.discountState$
      .pipe(takeUntil(this.destroy$))
      .subscribe(state => {
        this.discountPhase = state.phase;
        this.isValidating = state.phase === 'validating';
        this.appliedCode = state.code ?? '';
        this.discountError = state.error ?? '';
        this.cdr.markForCheck();
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  get isCodeEntered(): boolean {
    return (this.discountCodeControl.value?.trim().length ?? 0) > 0;
  }

  get hasValidDiscount(): boolean {
    return this.discountPhase === 'valid';
  }

  get showDiscountInput(): boolean {
    return this.discountPhase === 'idle' || this.discountPhase === 'failed';
  }

  trackByItemId(index: number, item: CartItem): string {
    return item.id;
  }

  formatPrice(price: number): string {
    return price.toFixed(2);
  }

  onApplyDiscount(): void {
    const code = this.discountCodeControl.value?.trim();
    if (!code) return;
    this.discountApplied.emit(code);
  }

  onRemoveDiscount(): void {
    this.discountCodeControl.setValue('');
    this.discountRemoved.emit();
  }
}