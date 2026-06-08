// src/app/features/products/pages/product-list/product-list.component.ts

import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Observable, combineLatest, map } from 'rxjs';
import { Product } from '../../../../shared/models/product.model';
import { FilterService } from '../../../../core/services/filter.service';
import { SortValue } from '../../../../shared/models/filter.model';
import { ProductListFacade } from '../../facade/product-list.facade';
import { SeoService } from '../../../../core/services/seo.service';

interface ProductListVm {
  filteredProducts: Product[];
  isLoading: boolean;
  selectedCategory: string;
  sortBy: SortValue;
  searchQuery: string;
  hasNoResults: boolean;
  showProducts: boolean;
}

@Component({
  selector: 'app-product-list',
  standalone: false,
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ProductListFacade],
})
export class ProductListComponent implements OnInit {
  readonly currentYear          = new Date().getFullYear();
  readonly loadingSkeletonCount = Array(9).fill(0);
  readonly emptyProduct: Product = {
    id: 0, name: '', price: 0,
    image: '', category: '', inStock: true,
  };

  readonly vm$: Observable<ProductListVm>;

  constructor(
    private readonly facade: ProductListFacade,
    private readonly filterService: FilterService,
    private readonly seo: SeoService,
  ) {
    this.vm$ = combineLatest({
      filteredProducts: this.facade.filteredProducts$,
      isLoading:        this.facade.loading$,
      selectedCategory: this.facade.selectedCategory$,
      sortBy:           this.facade.sortBy$,
      searchQuery:      this.facade.searchQuery$,
    }).pipe(
      map(state => ({
        ...state,
        hasNoResults: !state.isLoading && state.filteredProducts.length === 0,
        showProducts: !state.isLoading && state.filteredProducts.length > 0,
      }))
    );
  }

  ngOnInit(): void {
    this.seo.updateMetaFromKeys({
      titleKey:       'seo.collections.title',
      descriptionKey: 'seo.collections.description',
      keywordsKey:    'seo.collections.keywords',
      ogType:         'website',
    });

    this.seo.setStructuredData({
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: 'Jawista — Collection 01 El Mediterraneo',
      url: 'https://www.jawista.com/collections/all',
    });

    this.facade.initialize();
  }

  onCategoryChange(category: string): void { this.filterService.setCategory(category); }
  onSortChange(sortBy: SortValue): void     { this.filterService.setSortBy(sortBy); }
  onSearchChange(query: string): void       { this.filterService.setSearchQuery(query); }
  onClearFilters(): void                    { this.filterService.resetFilters(); }

  trackByProductId(_: number, p: Product): number { return p.id; }
  trackByIndex(i: number): number                  { return i; }
}