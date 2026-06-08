import {
  Component,
  Input,
  OnInit,
  OnChanges,
  OnDestroy,
  SimpleChanges,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  inject,
} from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Product } from '../../models/product.model';
import { PreferencesService } from '../../../core/services/preferences.service';

@Component({
  selector: 'app-horizontal-product-carousel',
  standalone: false,
  templateUrl: './horizontal-product-carousel.component.html',
  styleUrls: ['./horizontal-product-carousel.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HorizontalProductCarouselComponent implements OnInit, OnChanges, OnDestroy {
  @Input() products: Product[] = [];
  @Input() scrollSpeed = 1;
  @Input() currencySymbol?: string;

  private readonly cdr = inject(ChangeDetectorRef);
  private readonly preferences = inject(PreferencesService);
  private readonly destroy$ = new Subject<void>();

  resolvedCurrency = '';
  animationDuration = '40s';

  ngOnInit(): void {
    this.updateAnimationDuration();

    // Set initial currency
    this.resolvedCurrency = this.currencySymbol ?? this.preferences.currentCurrency;

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

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['scrollSpeed'] || changes['products']) {
      this.updateAnimationDuration();
    }

    if (changes['currencySymbol'] && this.currencySymbol) {
      this.resolvedCurrency = this.currencySymbol;
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  trackByProduct(index: number, product: Product): string {
    return `${product.id}-${index}`;
  }

  private updateAnimationDuration(): void {
    const safeSpeed = this.scrollSpeed > 0 ? this.scrollSpeed : 1;
    const baseDuration = 40;
    const duration = Math.max(5, baseDuration / safeSpeed);
    this.animationDuration = `${duration}s`;
  }
}