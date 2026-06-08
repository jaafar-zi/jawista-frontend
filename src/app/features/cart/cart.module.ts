import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartRoutingModule } from './cart-routing.module';
import { SharedModule } from '../../shared/shared.module';

import { CartPageComponent } from './pages/cart-page/cart-page.component';
import { CartItemComponent } from './components/cart-item/cart-item.component';
import { CartSummaryComponent } from './components/cart-summary/cart-summary.component';

@NgModule({
  declarations: [
    CartPageComponent,
    CartItemComponent,
    CartSummaryComponent
  ],
  imports: [
    CommonModule,
    CartRoutingModule,
    SharedModule
  ]
})
export class CartModule { }