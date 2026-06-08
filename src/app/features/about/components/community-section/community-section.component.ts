// community-section.component.ts

import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { MediaService } from '../../../../core/services/media.service';

@Component({
  selector: 'app-community-section',
  standalone: false,
  templateUrl: './community-section.component.html',
  styleUrls: ['./community-section.component.scss']
})
export class CommunitySectionComponent implements OnInit, OnDestroy {

  private readonly mediaService = inject(MediaService);
  private readonly destroy$ = new Subject<void>();

  instagramUrl = 'https://www.instagram.com/jawista.club/';

  /**
   * BRAND/3 = About page community section logo
   */
  logoUrl = 'Jawistawebsite-visuals-01.webp';

  ngOnInit(): void {
    this.loadLogo();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onInstagramClick(event: MouseEvent): void {
    console.log('Instagram link clicked');
  }

  private loadLogo(): void {
    this.mediaService
      .getAssetUrl('BRAND', 3, 'Jawistawebsite-visuals-01.webp')
      .pipe(takeUntil(this.destroy$))
      .subscribe(url => {
        this.logoUrl = url;
      });
  }
}