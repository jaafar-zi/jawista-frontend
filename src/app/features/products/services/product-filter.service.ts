// features/products/services/product-filter.service.ts

import { Injectable } from '@angular/core';
import { SortValue } from '../../../shared/models/filter.model';
import { Product } from '../../../shared/models/product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductFilterService {

  applyFiltersAndSort(
    products: Product[],
    category: string,
    searchQuery: string,
    sortBy: SortValue
  ): Product[] {
    let filtered = this.filterByCategory(products, category);
    filtered = this.filterBySearch(filtered, searchQuery);
    return this.sortProducts(filtered, sortBy);
  }

  filterByCategory(products: Product[], category: string): Product[] {
    if (!category || category === 'all') {
      return [...products];
    }
    return products.filter(p => p.category === category);
  }

  filterBySearch(products: Product[], searchQuery: string): Product[] {
    const query = searchQuery?.trim().toLowerCase();

    if (!query) {
      return products;
    }

    return products.filter(p =>
      p.name.toLowerCase().includes(query) ||
      p.category.toLowerCase().includes(query)
    );
  }

  sortProducts(products: Product[], sortBy: SortValue): Product[] {
    const sorted = [...products];

    const strategies: Record<string, (a: Product, b: Product) => number> = {
      'price-low': (a, b) => a.price - b.price,
      'price-high': (a, b) => b.price - a.price,
      'price-asc': (a, b) => a.price - b.price,
      'price-desc': (a, b) => b.price - a.price,
      'name': (a, b) => a.name.localeCompare(b.name),
      'name-asc': (a, b) => a.name.localeCompare(b.name),
      'name-desc': (a, b) => b.name.localeCompare(a.name),
      'featured': () => 0
    };

    const strategy = strategies[sortBy];
    return strategy ? sorted.sort(strategy) : sorted;
  }
}