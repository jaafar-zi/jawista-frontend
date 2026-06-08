// src/app/features/about/pages/about-page/about-page.component.ts

import { Component, OnInit } from '@angular/core';
import { AboutFacade } from '../../facade/about.facade';
import { StickyItem } from '../../../../core/models/about.model';
import { FlickthroughImage } from '../../../../core/models/flick-through-image.model';
import { ImageSectionConfig } from '../../../../core/models/image-section.model';
import { SeoService } from '../../../../core/services/seo.service';

@Component({
  selector: 'app-about-page',
  standalone: false,
  templateUrl: './about-page.component.html',
  styleUrls: ['./about-page.component.scss'],
})
export class AboutPageComponent implements OnInit {
  heroConfig!: ImageSectionConfig;
  rightImageAlt = '';
  rightImageUrl = '';
  flickthroughImages: FlickthroughImage[] = [];
  stickyItems: StickyItem[] = [];

  readonly instagramUrl: string;
  readonly productsRoute: string;
  readonly stickyFallbackImages: readonly string[];

  constructor(
    private readonly aboutFacade: AboutFacade,
    private readonly seo: SeoService,
  ) {
    this.instagramUrl = this.aboutFacade.instagramUrl;
    this.productsRoute = this.aboutFacade.productsRoute;
    this.stickyFallbackImages = this.aboutFacade.stickyFallbackImages;

    // initial fallback
    this.rightImageUrl = this.aboutFacade.fallbackRightImageUrl;
  }

  ngOnInit(): void {
    this.seo.updateMetaFromKeys({
      titleKey: 'seo.about.title',
      descriptionKey: 'seo.about.description',
      keywordsKey: 'seo.about.keywords',
      ogType: 'website',
    });

    this.seo.setStructuredData({
      '@context': 'https://schema.org',
      '@type': 'AboutPage',
      name: 'About Jawista',
      url: 'https://www.jawista.com/about',
      mainEntity: {
        '@type': 'Organization',
        name: 'Jawista Club',
        foundingLocation: {
          '@type': 'Place',
          name: 'Tunisia',
        },
      },
    });

    this.heroConfig = this.aboutFacade.imageSectionConfig;

    // fallback first
    this.flickthroughImages = this.aboutFacade.getFlickthroughImages();
    this.stickyItems = this.aboutFacade.getStickyGalleryItems();

    // backend override if assets exist
    this.aboutFacade.loadRightImageUrl(url => {
      this.rightImageUrl = url;
    });

    this.aboutFacade.getFlickthroughImagesWithMedia(images => {
      this.flickthroughImages = images;
    });

    this.aboutFacade.getStickyGalleryItemsWithMedia(items => {
      this.stickyItems = items;
    });
  }
}