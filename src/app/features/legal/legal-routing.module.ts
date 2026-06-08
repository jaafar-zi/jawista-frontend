// src/app/features/legal/legal-routing.module.ts

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PrivacyPolicyComponent } from './components/privacy-policy/privacy-policy.component';
import { RefundsComponent } from './components/refunds/refunds.component';
import { ShippingComponent } from './components/shipping/shipping.component';
import { TermsOfServiceComponent } from './components/terms-of-service/terms-of-service.component';

const routes: Routes = [
  {
    path: 'privacy-policy',
    component: PrivacyPolicyComponent,
    title: 'Privacy Policy',
  },
  {
    path: 'refunds',
    component: RefundsComponent,
    title: 'Refund Policy',
  },
  {
    path: 'shipping',
    component: ShippingComponent,
    title: 'Shipping Policy',
  },
  {
    path: 'terms-of-service',
    component: TermsOfServiceComponent,
    title: 'Terms of Service',
  },
  {
    path: '',
    redirectTo: 'privacy-policy',
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LegalRoutingModule {}