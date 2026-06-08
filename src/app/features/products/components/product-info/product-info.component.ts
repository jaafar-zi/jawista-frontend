import {
  Component,
  Input,
  Output,
  EventEmitter,
  ChangeDetectionStrategy,
  OnInit,
  OnDestroy,
  inject,
  ChangeDetectorRef,
} from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Product, ProductAttribute } from '../../../../shared/models/product.model';
import { PreferencesService } from '../../../../core/services/preferences.service';

@Component({
  selector: 'app-product-info',
  standalone: false,
  templateUrl: './product-info.component.html',
  styleUrls: ['./product-info.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductInfoComponent implements OnInit, OnDestroy {
  @Input() product!: Product;
  @Input() selectedSize: string | null  = null;
  @Input() selectedColor: string | null = null;
  @Input() quantity                     = 1;
  @Input() isAddingToCart               = false;
  @Input() addToCartSuccess             = false;
  @Input() currencySymbol?: string;

  @Output() sizeChange     = new EventEmitter<string>();
  @Output() colorChange    = new EventEmitter<string>();
  @Output() quantityChange = new EventEmitter<number>();
  @Output() addToCart      = new EventEmitter<void>();
  @Output() buyNow         = new EventEmitter<void>();

  private readonly preferences = inject(PreferencesService);
  private readonly cdr         = inject(ChangeDetectorRef);
  private readonly destroy$    = new Subject<void>();

  expandedSections = new Set<string>();
  resolvedCurrency = '';

  ngOnInit(): void {
    this.resolvedCurrency = this.currencySymbol ?? this.preferences.currentCurrency;

    this.preferences.currency$
      .pipe(takeUntil(this.destroy$))
      .subscribe(currency => {
        if (!this.currencySymbol) {
          this.resolvedCurrency = currency;
          this.cdr.markForCheck();
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  get formattedPrice(): string {
    return this.product.price.toFixed(2);
  }

  get canAddToCart(): boolean {
    if (!this.product.inStock)                              return false;
    if (this.product.sizes?.length  && !this.selectedSize)  return false;
    if (this.product.colors?.length && !this.selectedColor) return false;
    return true;
  }

  get productAttributes(): ProductAttribute[] {
    return this.product.attributes ?? [];
  }

  onSelectSize(size: string): void {
    this.sizeChange.emit(size);
  }

  onSelectColor(color: string): void {
    this.colorChange.emit(color);
  }

  onAddToCart(): void {
    if (this.canAddToCart && !this.isAddingToCart) {
      this.addToCart.emit();
    }
  }

  onBuyNow(): void {
    if (this.canAddToCart && !this.isAddingToCart) {
      this.buyNow.emit();
    }
  }

  toggleAccordion(attributeId: string): void {
    if (this.expandedSections.has(attributeId)) {
      this.expandedSections.delete(attributeId);
    } else {
      this.expandedSections.add(attributeId);
    }
  }

  isExpanded(attributeId: string): boolean {
    return this.expandedSections.has(attributeId);
  }

  trackByAttributeId(_index: number, attribute: ProductAttribute): string {
    return attribute.id;
  }
}