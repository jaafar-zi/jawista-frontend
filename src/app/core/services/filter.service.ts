// src/app/core/services/filter.service.ts

import {
  Injectable,
  PLATFORM_ID,
  inject,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { BehaviorSubject, Observable, combineLatest } from 'rxjs';
import { map, debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { FilterState, SortValue } from '../../shared/models/filter.model';

@Injectable({ providedIn: 'root' })
export class FilterService {

  private readonly platformId = inject(PLATFORM_ID);
  private readonly isBrowser  = isPlatformBrowser(this.platformId);

  private categorySubject   = new BehaviorSubject<string>('all');
  private sortBySubject     = new BehaviorSubject<SortValue>('featured');
  private searchQuerySubject = new BehaviorSubject<string>('');

  readonly category$    = this.categorySubject.asObservable();
  readonly sortBy$      = this.sortBySubject.asObservable();
  readonly searchQuery$ = this.searchQuerySubject.asObservable().pipe(
    debounceTime(300),
    distinctUntilChanged()
  );

  readonly filterState$: Observable<FilterState> = combineLatest([
    this.category$,
    this.sortBy$,
    this.searchQuery$,
  ]).pipe(
    map(([category, sortBy, searchQuery]) => ({
      selectedCategory: category,
      sortBy,
      searchQuery,
    }))
  );

  constructor() {
    // ← only load from storage in browser
    if (this.isBrowser) {
      this.loadFiltersFromStorage();
    }
  }

  setCategory(category: string): void {
    this.categorySubject.next(category);
    this.saveFiltersToStorage();
  }

  setSortBy(sortBy: SortValue): void {
    this.sortBySubject.next(sortBy);
    this.saveFiltersToStorage();
  }

  setSearchQuery(query: string): void {
    this.searchQuerySubject.next(query);
    this.saveFiltersToStorage();
  }

  getCurrentFilterState(): FilterState {
    return {
      selectedCategory: this.categorySubject.value,
      sortBy:           this.sortBySubject.value,
      searchQuery:      this.searchQuerySubject.value,
    };
  }

  resetFilters(): void {
    this.categorySubject.next('all');
    this.sortBySubject.next('featured');
    this.searchQuerySubject.next('');
    this.clearFiltersFromStorage();
  }

  resetCategory(): void {
    this.categorySubject.next('all');
    this.saveFiltersToStorage();
  }

  resetSort(): void {
    this.sortBySubject.next('featured');
    this.saveFiltersToStorage();
  }

  resetSearch(): void {
    this.searchQuerySubject.next('');
    this.saveFiltersToStorage();
  }

  getActiveFilterCount(): number {
    let count = 0;
    if (this.categorySubject.value !== 'all') count++;
    if (this.sortBySubject.value !== 'featured') count++;
    if (this.searchQuerySubject.value.trim() !== '') count++;
    return count;
  }

  // ─── Storage (browser only) ───────────────────────────────────

  private saveFiltersToStorage(): void {
    if (!this.isBrowser) return;
    try {
      sessionStorage.setItem(
        'productFilters',
        JSON.stringify(this.getCurrentFilterState())
      );
    } catch (err) {
      console.error('Error saving filters to storage:', err);
    }
  }

  private loadFiltersFromStorage(): void {
    if (!this.isBrowser) return;
    try {
      const saved = sessionStorage.getItem('productFilters');
      if (saved) {
        const state: FilterState = JSON.parse(saved);
        this.categorySubject.next(state.selectedCategory);
        this.sortBySubject.next(state.sortBy as SortValue);
        this.searchQuerySubject.next(state.searchQuery);
      }
    } catch (err) {
      console.error('Error loading filters from storage:', err);
    }
  }

  private clearFiltersFromStorage(): void {
    if (!this.isBrowser) return;
    try {
      sessionStorage.removeItem('productFilters');
    } catch (err) {
      console.error('Error clearing filters from storage:', err);
    }
  }
}