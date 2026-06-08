import {
  Component,
  Input,
  Output,
  EventEmitter,
  HostBinding,
  ViewChild,
  ElementRef,
  OnInit,
  OnDestroy,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  inject,
} from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { TranslocoService } from '@jsverse/transloco';
import { Product } from '../../models/product.model';
import { CursorHoverElementComponent } from '../cursor-hover-element/cursor-hover-element.component';
import { PreferencesService } from '../../../core/services/preferences.service';

@Component({
  selector: 'app-product-card',
  standalone: false,
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductCardComponent implements OnInit, OnDestroy {
  @Input() product!: Product;
  @Input() showQuickView = false;
  @Input() showAddToCart = false;
  @Input() showWishlist = false;
  @Input() imageAspectRatio: 'square' | 'portrait' | 'landscape' = 'square';
  @Input() currencySymbol?: string;
  @Input() showBadge = false;
  @Input() badgeText?: string;
  @Input() badgeColor: 'red' | 'green' | 'blue' | 'black' = 'black';
  @Input() loading = false;

  @Output() quickView = new EventEmitter<Product>();
  @Output() addToCart = new EventEmitter<Product>();
  @Output() addToWishlist = new EventEmitter<Product>();
  @Output() cardClick = new EventEmitter<Product>();

  @ViewChild(CursorHoverElementComponent, { static: false })
  cursorHoverElement!: CursorHoverElementComponent;

  @ViewChild('imageWrapper', { static: false })
  imageWrapper!: ElementRef;

  @HostBinding('class.loading') get isLoading() {
    return this.loading;
  }

  private readonly router = inject(Router);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly preferences = inject(PreferencesService);
  private readonly transloco = inject(TranslocoService);
  private readonly destroy$ = new Subject<void>();

  isWishlisted = false;
  isHovering = false;
  resolvedCurrency = '';

  // Translated strings for the cursor hover element
  viewProductText = '';

  ngOnInit(): void {
    // Currency
    this.resolvedCurrency = this.currencySymbol ?? this.preferences.currentCurrency;

    this.preferences.currency$
      .pipe(takeUntil(this.destroy$))
      .subscribe(currency => {
        if (!this.currencySymbol) {
          this.resolvedCurrency = currency;
          this.cdr.markForCheck();
        }
      });

    // Translated action text for hover element
    this.viewProductText = this.transloco.translate('products.card.viewProduct');

    this.transloco.langChanges$
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.viewProductText = this.transloco.translate('products.card.viewProduct');
        this.cdr.markForCheck();
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  get productLink(): string {
    return `/collections/product/${this.product.id}`;
  }

  get aspectRatioClass(): string {
    const ratios: Record<string, string> = {
      square: 'aspect-square',
      portrait: 'aspect-[3/4]',
      landscape: 'aspect-[4/3]',
    };
    return ratios[this.imageAspectRatio];
  }

  get formattedPrice(): string {
    return this.product.price.toFixed(2);
  }

  get badgeClasses(): string {
    const colors: Record<string, string> = {
      red: 'bg-red-600 text-white',
      green: 'bg-green-600 text-white',
      blue: 'bg-blue-600 text-white',
      black: 'bg-black text-white',
    };
    return `absolute top-4 left-4 px-3 py-1 text-xs uppercase tracking-widest ${colors[this.badgeColor]}`;
  }

  get productReference(): string {
    return `(OR-${this.product.id})`;
  }

  onCardClick(event: Event): void {
    this.cardClick.emit(this.product);
  }

  onQuickView(event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    this.quickView.emit(this.product);
  }

  onAddToCart(event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    this.addToCart.emit(this.product);
  }

  onWishlistToggle(event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    this.isWishlisted = !this.isWishlisted;
    this.addToWishlist.emit(this.product);
  }

  onImageError(event: Event): void {
    const img = event.target as HTMLImageElement;
    img.src = 'assets/images/placeholder-product.jpg';
  }

  onMouseMove(event: MouseEvent): void {
    if (this.cursorHoverElement && this.imageWrapper) {
      this.cursorHoverElement.updatePosition(event, this.imageWrapper.nativeElement);
    }
  }

  onMouseEnter(): void {
    this.isHovering = true;
    if (this.cursorHoverElement) {
      this.cursorHoverElement.startAnimation();
    }
  }

  onMouseLeave(): void {
    this.isHovering = false;
    if (this.cursorHoverElement) {
      this.cursorHoverElement.stopAnimation();
    }
  }
}