// src/app/api/api.module.ts

/* eslint-disable */
import { NgModule } from '@angular/core';
import { AddressControllerService } from '../services/address-controller.service';
import { OrderControllerService } from '../services/order-controller.service';
import { ProductControllerService } from '../services/product-controller.service';
import { ShippingControllerService } from '../services/shipping-controller.service';
import { SubscriberControllerService } from '../services/subscriber-controller.service';

@NgModule({
  providers: [
    ProductControllerService,
    OrderControllerService,
    ShippingControllerService,
    AddressControllerService,
    SubscriberControllerService,
  ],
})
export class ApiModule {}