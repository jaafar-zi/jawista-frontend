// src/app/features/about/components/image-section/image-section.component.ts

import {
  Component,
  OnInit,
  OnDestroy,
  OnChanges,
  SimpleChanges,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Input,
  inject
} from '@angular/core';
import { Subscription } from 'rxjs';
import { ImageSectionConfig } from '../../../../core/models/image-section.model';
import { LoggerService } from '../../../../core/services/logger.service';
import { MediaService } from '../../../../core/services/media.service';

@Component({
  selector: 'app-image-section',
  standalone: false,
  templateUrl: './image-section.component.html',
  styleUrls: ['./image-section.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ImageSectionComponent implements OnInit, OnChanges, OnDestroy {
  @Input({ required: true }) config!: ImageSectionConfig;

  private readonly mediaService = inject(MediaService);

  resolvedImageUrl = '';
  private imageSub?: Subscription;

  constructor(
    private logger: LoggerService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.resolveImageUrl();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['config'] && this.config) {
      this.resolveImageUrl();
    }
  }

  ngOnDestroy(): void {
    this.imageSub?.unsubscribe();
  }

  private resolveImageUrl(): void {
    const fallbackUrl = this.config?.imageUrl ?? '';
    this.resolvedImageUrl = fallbackUrl;
    this.imageSub?.unsubscribe();

    if (!this.config?.mediaOwnerType || this.config.mediaOwnerId == null) {
      this.cdr.markForCheck();
      return;
    }

    this.imageSub = this.mediaService
      .getAssetUrl(
        this.config.mediaOwnerType,
        this.config.mediaOwnerId,
        fallbackUrl
      )
      .subscribe(url => {
        this.resolvedImageUrl = url;
        this.cdr.markForCheck();
      });
  }
}