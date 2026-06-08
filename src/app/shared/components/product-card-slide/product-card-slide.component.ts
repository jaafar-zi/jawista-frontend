import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  OnDestroy,
  inject,
} from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Product } from '../../models/product.model';
import { PreferencesService } from '../../../core/services/preferences.service';

@Component({
  selector: 'app-product-card-slide',
  standalone: false,
  templateUrl: './product-card-slide.component.html',
  styleUrls: ['./product-card-slide.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductCardSlideComponent implements OnInit, OnDestroy {
  @Input() product!: Product;
  @Input() currencySymbol?: string;
  @Input() showBadge = false;
  @Input() badgeText?: string;
  @Input() badgeColor: 'red' | 'green' | 'blue' | 'black' = 'black';
  @Input() loading = false;
  @Input() hoverImage?: string;

  @Output() cardClick = new EventEmitter<Product>();

  private readonly router = inject(Router);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly preferences = inject(PreferencesService);
  private readonly destroy$ = new Subject<void>();

  isHovering = false;

  productLink = '';
  formattedPrice = '';
  badgeClasses = '';
  productReference = '';
  resolvedCurrency = '';

  ngOnInit(): void {
    this.productLink = `/collections/product/${this.product.id}`;
    this.productReference = `(OR-${this.product.id})`;
    this.badgeClasses = this.getBadgeClasses();

    // If parent passed a currency, use it. Otherwise subscribe to preferences.
    if (this.currencySymbol) {
      this.resolvedCurrency = this.currencySymbol;
      this.formattedPrice = this.product.price.toFixed(2);
    } else {
      this.resolvedCurrency = this.preferences.currentCurrency;
      this.formattedPrice = this.product.price.toFixed(2);
    }

    // React to currency changes
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

  private getBadgeClasses(): string {
    const colors: Record<string, string> = {
      red: 'bg-red-600 text-white',
      green: 'bg-green-600 text-white',
      blue: 'bg-blue-600 text-white',
      black: 'bg-black text-white',
    };
    return `absolute top-4 left-4 px-3 py-1 text-xs uppercase tracking-widest ${colors[this.badgeColor]} z-10`;
  }

  onCardClick(event: Event): void {
    event.preventDefault();
    this.cardClick.emit(this.product);
    this.router.navigate([this.productLink]);
  }

  onImageError(event: Event): void {
    const img = event.target as HTMLImageElement;
    img.src = 'assets/images/placeholder-product.jpg';
  }

  onMouseEnter(): void {
    this.isHovering = true;
  }

  onMouseLeave(): void {
    this.isHovering = false;
  }
}