// src/app/features/home/home.module.ts

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { HomeRoutingModule } from './home-routing.module';
import { SharedModule } from '../../shared/shared.module';

import { HomePageComponent } from './pages/home-page/home-page.component';
import { HeroSliderComponent } from './components/hero-slider/hero-slider.component';
import { AboutSectionComponent } from './components/about-section/about-section.component';
import { ThreeColumnSectionComponent } from './components/three-column-section/three-column-section.component';
import { BrandSectionComponent } from './components/brand-section/brand-section.component';
import { FeaturedProductsSectionComponent } from './components/feature-product-section/featured-products-section.component';
import { NavLightDirective } from '../../shared/directives/nav-light.directive';
import { BracketCtaComponent } from '../../shared/components/bracket-cta/bracket-cta.component';

// Facades
import { NewsletterFacade } from './facade/newsletter.facade';
import { MediaShowcaseSliderComponent } from './components/media-showcase-slider/media-showcase-slider.component';
import { CommunityCtaComponent } from '../about/components/community-cta/community-cta.component';
import { CommunitySectionComponent } from './components/community-section/community-section.component';
import { ImageWithFallbackComponent } from "../../shared/components/image-with-fallback/image-with-fallback.component";

@NgModule({
  declarations: [
    HomePageComponent,
    HeroSliderComponent,
    FeaturedProductsSectionComponent,
    MediaShowcaseSliderComponent,
    CommunitySectionComponent,
    BrandSectionComponent,
    AboutSectionComponent,
    ThreeColumnSectionComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    HomeRoutingModule,
    NavLightDirective,
    SharedModule,
    BracketCtaComponent,
    ImageWithFallbackComponent
],
  providers: [
    NewsletterFacade, 
  ],
})
export class HomeModule {}