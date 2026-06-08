// src/app/features/checkout/checkout.module.ts

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { CheckoutRoutingModule } from './checkout-routing.module';
import { SharedModule } from '../../shared/shared.module';

import { CheckoutPageComponent } from './pages/checkout-page/checkout-page.component';
import { CheckoutFormComponent } from './components/checkout-form/checkout-form.component';
import { OrderSummaryComponent } from './components/order-summary/order-summary.component';


@NgModule({
  declarations: [
    CheckoutPageComponent,
    CheckoutFormComponent,
    OrderSummaryComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CheckoutRoutingModule,
    SharedModule,
  ],
})
export class CheckoutModule {}