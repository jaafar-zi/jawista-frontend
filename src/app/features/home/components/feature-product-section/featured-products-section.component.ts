import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { Product } from '../../../../shared/models/product.model';
import { HomeFacade } from '../../facade/home.facade';

@Component({
  selector: 'app-featured-products-section',
  standalone: false,
  templateUrl: './featured-products-section.component.html',
  styleUrls: ['./featured-products-section.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FeaturedProductsSectionComponent {
  @Input() products: Product[] = [];
  @Input() scrollSpeed!: number;
  @Input() currencySymbol!: string;

  readonly ctaHref: string;
  readonly ctaColorScheme: string;

  constructor(private homeFacade: HomeFacade) {
    this.ctaHref = this.homeFacade.featuredProductsConfig.ctaHref;
    this.ctaColorScheme = this.homeFacade.featuredProductsConfig.ctaColorScheme;
  }
}