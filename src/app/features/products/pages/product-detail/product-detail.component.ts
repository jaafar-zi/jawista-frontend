import {
  Component,
  OnInit,
  OnDestroy,
  inject,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject, takeUntil, Observable } from 'rxjs';
import { ProductDetailFacade } from '../../facade/product-detail.facade';
import { APP_ROUTES } from '../../../../core/constants/app-routes.constants';
import { Product } from '../../../../shared/models/product.model';
import { SeoService } from '../../../../core/services/seo.service';
import { PreferencesService } from '../../../../core/services/preferences.service';

@Component({
  selector: 'app-product-detail',
  standalone: false,
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.scss'],
  providers: [ProductDetailFacade],
})
export class ProductDetailComponent implements OnInit, OnDestroy {
  product: Product | null = null;
  selectedSize: string | null = null;
  selectedColor: string | null = null;
  quantity = 1;

  readonly isLoading$: Observable<boolean>;
  readonly error$: Observable<string | null>;
  readonly isAddingToCart$: Observable<boolean>;
  readonly addToCartSuccess$: Observable<boolean>;
  readonly selectSizeError$: Observable<boolean>;
  readonly productsRoute: string;

  private readonly destroy$ = new Subject<void>();
  private readonly route = inject(ActivatedRoute);
  private readonly facade = inject(ProductDetailFacade);
  private readonly seo = inject(SeoService);
  private readonly preferences = inject(PreferencesService);

  constructor() {
    this.isLoading$ = this.facade.loading$;
    this.error$ = this.facade.error$;
    this.isAddingToCart$ = this.facade.addingToCart$;
    this.addToCartSuccess$ = this.facade.addToCartSuccess$;
    this.selectSizeError$ = this.facade.selectSizeError$;
    this.productsRoute = APP_ROUTES.collections.all;
  }

  ngOnInit(): void {
    this.route.paramMap
      .pipe(takeUntil(this.destroy$))
      .subscribe(params => {
        const id = params.get('id');
        if (id) this.facade.loadProduct(+id);
      });

    this.facade.product$
      .pipe(takeUntil(this.destroy$))
      .subscribe(product => {
        this.product = product;

        if (product) {
          this.seo.updateProductMeta({
            name: product.name,
            description: product.description,
            image: product.image,
            price: product.price,
            currency: this.preferences.currentCurrency,
            availability: product.inStock ? 'InStock' : 'OutOfStock',
          });

          const selection = this.facade.initializeSelection(product);
          this.selectedSize = selection.selectedSize;
          this.selectedColor = selection.selectedColor;
        }
      });
  }

  ngOnDestroy(): void {
    this.seo.removeStructuredData();
    this.destroy$.next();
    this.destroy$.complete();
  }

  onSizeChange(size: string): void {
    this.selectedSize = size;
  }

  onColorChange(color: string): void {
    this.selectedColor = color;
  }

  onQuantityChange(qty: number): void {
    this.quantity = qty;
  }

  onAddToCart(): void {
    if (!this.product) return;
    this.facade.addToCart(
      this.product,
      this.quantity,
      this.selectedSize,
      this.selectedColor,
    );
  }

  onBuyNow(): void {
    if (!this.product) return;
    const added = this.facade.addToCart(
      this.product,
      this.quantity,
      this.selectedSize,
      this.selectedColor,
    );
    if (added) this.facade.navigateToCheckout();
  }
}