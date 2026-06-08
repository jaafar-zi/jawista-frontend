// src/app/features/products/products-routing.module.ts

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductListComponent } from './pages/product-list/product-list.component';
import { ProductDetailComponent } from './pages/product-detail/product-detail.component';

const routes: Routes = [
  {
    path: 'all',
    component: ProductListComponent,
    title: 'All Collections — El Mediterraneo',
  },
  {
    path: 'product/:id',
    component: ProductDetailComponent,
    title: 'Product',
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProductsRoutingModule {}