// src/app/core/constants/app-routes.constants.ts

export const APP_ROUTES = {
  home: '/',
  collections: {
    all: '/collections/all',
    detail: (id: string) => `/products/${id}`
  },
  about: '/about',
  checkout: '/checkout',
  cart: '/cart',
  orderConfirmation: '/order-confirmation',
} as const;