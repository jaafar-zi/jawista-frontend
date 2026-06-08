export const PRODUCT_LIMITS = {
  featured: 4,
  newArrivals: 8,
  related: 3
} as const;

export const PRODUCT_SORT_OPTIONS = {
  priceAsc: 'price-asc',
  priceDesc: 'price-desc',
  nameAsc: 'name-asc',
  nameDesc: 'name-desc'
} as const;

export const PRODUCT_CATEGORIES = {
  all: 'all',
  caps: 'caps',
  beanies: 'beanies'
} as const;