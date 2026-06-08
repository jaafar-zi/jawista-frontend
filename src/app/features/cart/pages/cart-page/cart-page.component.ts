// src/app/features/cart/pages/cart-page/cart-page.component.ts

import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Observable } from 'rxjs';
import { CartFacade } from '../../facade/cart.facade';
import { CartItem } from '../../../../core/models/cart.model';
import { CartPageVm } from '../../../../core/models/cart-page.model';
import { APP_ROUTES } from '../../../../core/constants/app-routes.constants';
import { SeoService } from '../../../../core/services/seo.service';

@Component({
  selector: 'app-cart-page',
  standalone: false,
  templateUrl: './cart-page.component.html',
  styleUrls: ['./cart-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [CartFacade],
})
export class CartPageComponent implements OnInit {
  readonly vm$: Observable<CartPageVm>;
  readonly productsRoute = APP_ROUTES.collections.all;

  constructor(
    private readonly facade: CartFacade,
    private readonly seo: SeoService,
  ) {
    this.vm$ = this.facade.vm$;
  }

  ngOnInit(): void {
    this.seo.updateMetaFromKeys({
      titleKey:       'seo.cart.title',
      descriptionKey: 'seo.cart.description',
      noIndex:        true,
    });
  }

  onUpdateQuantity(itemId: string, qty: number): void { this.facade.updateQuantity(itemId, qty); }
  onRemoveItem(itemId: string): void                  { this.facade.removeItem(itemId); }
  onContinueShopping(): void                          { this.facade.navigateToProducts(); }
  onCheckout(): void                                  { this.facade.navigateToCheckout(); }
  trackByItemId(_: number, item: CartItem): string    { return item.id; }
}