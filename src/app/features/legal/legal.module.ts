// legal.module.ts
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/shared.module';
import { LegalRoutingModule } from './legal-routing.module';
import { PrivacyPolicyComponent } from './components/privacy-policy/privacy-policy.component';
import { RefundsComponent } from './components/refunds/refunds.component';
import { ShippingComponent } from './components/shipping/shipping.component';
import { TermsOfServiceComponent } from './components/terms-of-service/terms-of-service.component';
import { LegalPageLayoutComponent } from './pages/legal-page-layout/legal-page-layout.component';
import { NavLightDirective } from "../../shared/directives/nav-light.directive";


@NgModule({
  declarations: [
    LegalPageLayoutComponent,
    PrivacyPolicyComponent,
    RefundsComponent,
    ShippingComponent,
    TermsOfServiceComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    LegalRoutingModule,
    NavLightDirective,
],
})
export class LegalModule {}