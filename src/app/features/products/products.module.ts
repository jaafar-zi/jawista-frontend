// src/app/features/products/products.module.ts

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/shared.module';

import { ProductDetailComponent } from './pages/product-detail/product-detail.component';
import { ProductGalleryComponent } from './components/product-gallery/product-gallery.component';
import { ProductInfoComponent } from './components/product-info/product-info.component';
import { ProductsRoutingModule } from './products-routing.module';
import { ProductListComponent } from './pages/product-list/product-list.component';
import { ProductsCollectionHeaderComponent } from './components/products-collection-header/products-collection-header.component';

@NgModule({
  declarations: [
    ProductListComponent,
    ProductDetailComponent,
    ProductsCollectionHeaderComponent,
    ProductGalleryComponent,
    ProductInfoComponent,
  ],
  imports: [
    CommonModule,
    ProductsRoutingModule,
    SharedModule,
]
})
export class ProductsModule {}