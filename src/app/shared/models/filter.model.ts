export interface Category {
  value: string;
  label: string;
}

export interface SortOption {
  value: string;
  label: string;
}

export interface FilterState {
  selectedCategory: string;
  sortBy: string;
  searchQuery: string;
}

export interface FilterChangeEvent {
  category?: string;
  sortBy?: string;
  searchQuery?: string;
}

export type SortValue = 'featured' | 'price-low' | 'price-high' | 'name';