// src/app/features/home/pages/home-page/home-page.component.ts

import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { HomeFacade } from '../../facade/home.facade';
import { Product } from '../../../../shared/models/product.model';
import { SeoService } from '../../../../core/services/seo.service';

@Component({
  selector: 'app-home-page',
  standalone: false,
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomePageComponent implements OnInit {
  readonly newArrivals$!: Observable<Product[]>;
  readonly loadingNewArrivals$!: Observable<boolean>;
  readonly scrollSpeed!: number;
  readonly currencySymbol!: string;

  private emissionCount = 0;

  constructor(
    private readonly homeFacade: HomeFacade,
    private readonly seo: SeoService,
  ) {
    this.newArrivals$        = this.homeFacade.newArrivals$;
    this.loadingNewArrivals$ = this.homeFacade.loadingNewArrivals$;
    this.scrollSpeed         = this.homeFacade.featuredProductsConfig.scrollSpeed;
    this.currencySymbol      = this.homeFacade.featuredProductsConfig.currencySymbol;
  }

  ngOnInit(): void {
    this.seo.updateMetaFromKeys({
      titleKey:       'seo.home.title',
      descriptionKey: 'seo.home.description',
      keywordsKey:    'seo.home.keywords',
      ogType:         'website',
    });

    this.seo.setStructuredData({
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: 'Jawista Club',
      url: 'https://www.jawista.com',
      logo: 'https://www.jawista.com/assets/images/logo.png',
      contactPoint: {
        '@type': 'ContactPoint',
        email: 'hello@jawista.com',
        telephone: '+216-76-207-3387',
        contactType: 'customer service',
      },
      sameAs: [
        'https://www.instagram.com/jawista.club',
      ],
    });

    this.homeFacade.loadProducts();
  }
}