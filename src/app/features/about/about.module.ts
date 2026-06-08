import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AboutRoutingModule } from './about-routing.module';

// Page component
import { AboutPageComponent } from './pages/about-page/about-page.component';

// Feature components (module-based)
import { AboutHeroComponent } from './components/about-hero/about-hero.component';
import { StickyGalleryComponent } from './components/sticky-gallery/sticky-gallery.component';

// Standalone component
import { CommunityCtaComponent } from './components/community-cta/community-cta.component';
import { StorySectionComponent } from './components/vision-section/story-section.component';
import { NewlineToBrPipe } from "../../shared/pipes/new-line-to-br.pipe";
import { HeroSectionComponent } from './components/hero-section/hero-section.component';
import { ImageSectionComponent } from './components/image-section/image-section.component';
import { ImageWithFallbackComponent } from "../../shared/components/image-with-fallback/image-with-fallback.component";
import { TranslocoPipe } from '@jsverse/transloco';
import { SharedModule } from '../../shared/shared.module';
import { SplitGridComponent } from './components/split-grid/split-grid.component';
import { CommunitySectionComponent } from './components/community-section/community-section.component';
import { BracketCtaComponent } from "../../shared/components/bracket-cta/bracket-cta.component";
import { NavLightDirective } from '../../shared/directives/nav-light.directive';

@NgModule({
  declarations: [
    AboutPageComponent,
    AboutHeroComponent,
    ImageSectionComponent,
    HeroSectionComponent,
    StorySectionComponent,
    CommunityCtaComponent,
    CommunitySectionComponent,
    SplitGridComponent,
    StickyGalleryComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    AboutRoutingModule,
    NewlineToBrPipe,
    TranslocoPipe,
    ImageWithFallbackComponent,
    BracketCtaComponent,
    NavLightDirective,
],
})
export class AboutModule {}