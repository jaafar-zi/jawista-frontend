// community-section.component.ts

import {
  Component,
  OnInit,
  OnDestroy,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  PLATFORM_ID,
  Inject,
  inject,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { TranslocoService } from '@jsverse/transloco';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ContentSection } from '../../../../core/models/community-section.model';
import { MediaService } from '../../../../core/services/media.service';

@Component({
  selector: 'app-community-section',
  standalone: false,
  templateUrl: './community-section.component.html',
  styleUrls: ['./community-section.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CommunitySectionComponent implements OnInit, OnDestroy {

  private readonly mediaService = inject(MediaService);

  sections: ContentSection[] = [];
  hoveredSection: ContentSection | null = null;
  isBrowser: boolean;
  logoUrl: string = 'jawista-logo-dark.png';

  private destroy$ = new Subject<void>();

  constructor(
    private cdr: ChangeDetectorRef,
    private transloco: TranslocoService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit(): void {
    this.initSections();
    this.loadLogo();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private initSections(): void {
    const sectionConfigs = [
      {
        titleKey: 'home.moreThanGolf.sections.0.title',
        descriptionKey: 'home.moreThanGolf.sections.0.description',
        imageUrl: 'story-section.jpg',
        imageAltKey: 'home.moreThanGolf.sections.0.imageAlt',
      },
    ];

    this.sections = sectionConfigs.map((config) => ({
      ...config,
      isHovered: false,
    }));

    this.loadSectionImages();
    this.cdr.markForCheck();
  }

  /**
   * Load logo from backend.
   * BRAND/2 = community section logo
   */
  private loadLogo(): void {
    this.mediaService
      .getAssetUrl('BRAND', 2, 'jawista-logo-dark.png')
      .pipe(takeUntil(this.destroy$))
      .subscribe(url => {
        this.logoUrl = url;
        this.cdr.markForCheck();
      });
  }

  /**
   * Load section images from backend.
   * BANNER/20 = community section image 0
   * (increment for additional sections if added later)
   */
  private loadSectionImages(): void {
    this.sections.forEach((section, index) => {
      const ownerId = 20 + index;

      this.mediaService
        .getAssetUrl('BANNER', ownerId, section.imageUrl)
        .pipe(takeUntil(this.destroy$))
        .subscribe(url => {
          section.imageUrl = url;
          this.cdr.markForCheck();
        });
    });
  }

  onSectionHover(section: ContentSection): void {
    this.hoveredSection = section;
    section.isHovered = true;
    this.preloadImage(section.imageUrl);
    this.cdr.markForCheck();
  }

  onSectionLeave(section: ContentSection): void {
    this.hoveredSection = null;
    section.isHovered = false;
    this.cdr.markForCheck();
  }

  private preloadImage(url: string): void {
    if (!this.isBrowser) return;
    const img = new Image();
    img.src = url;
  }

  trackByTitleKey(index: number, section: ContentSection): string {
    return section.titleKey;
  }
}