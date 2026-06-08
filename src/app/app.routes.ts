// src/app/app.routes.ts

import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    loadChildren: () =>
      import('./features/home/home.module').then(m => m.HomeModule),
    title: 'Jawista — The One Who Knows How to Enjoy',
  },
  {
    path: 'collections',
    loadChildren: () =>
      import('./features/products/products.module').then(m => m.ProductsModule),
    title: 'Collections',
  },
  {
    path: 'about',
    loadChildren: () =>
      import('./features/about/about.module').then(m => m.AboutModule),
    title: 'About Us',
  },
  {
    path: 'cart',
    loadChildren: () =>
      import('./features/cart/cart.module').then(m => m.CartModule),
    title: 'Your Cart',
  },
  {
    path: 'checkout',
    loadChildren: () =>
      import('./features/checkout/checkout.module').then(m => m.CheckoutModule),
    title: 'Checkout',
  },
  {
    path: 'legal',
    loadChildren: () =>
      import('./features/legal/legal.module').then(m => m.LegalModule),
    title: 'Legal',
  },
  {
    path: '**',
    loadChildren: () =>
      import('./features/not-found/not-found.module').then(m => m.NotFoundModule),
    title: 'Page Not Found',
  },
];