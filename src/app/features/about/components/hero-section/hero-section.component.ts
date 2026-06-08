import {
  Component,
  ChangeDetectionStrategy,
  ViewChild,
  ElementRef,
  AfterViewInit,
  OnDestroy,
  HostListener,
  inject,
} from '@angular/core';
import { Observable } from 'rxjs';
import { MediaService } from '../../../../core/services/media.service';

@Component({
  selector: 'app-hero-section',
  standalone: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './hero-section.component.html',
  styleUrls: ['./hero-section.component.scss']
})
export class HeroSectionComponent implements AfterViewInit, OnDestroy {
  @ViewChild('contentWrapper') contentWrapper!: ElementRef<HTMLDivElement>;

  private readonly mediaService = inject(MediaService);

  hoveredSection = false;
  private resizeTimeout: any;

  /**
   * BANNER/40 = About page hero visual
   */
  readonly heroImageUrl$: Observable<string> = this.mediaService.getAssetUrl(
    'BANNER',
    40,
    'community-section-visual.webp'
  );

  ngAfterViewInit(): void {
    setTimeout(() => this.setHeight(), 100);
  }

  ngOnDestroy(): void {
    if (this.resizeTimeout) {
      clearTimeout(this.resizeTimeout);
    }
  }

  @HostListener('window:resize')
  onResize(): void {
    if (this.resizeTimeout) {
      clearTimeout(this.resizeTimeout);
    }
    this.resizeTimeout = setTimeout(() => this.setHeight(), 150);
  }

  onMouseEnter(): void {
    this.hoveredSection = true;
    setTimeout(() => this.setHeight(), 10);
  }

  onMouseLeave(): void {
    this.hoveredSection = false;
    setTimeout(() => this.setHeight(), 10);
  }

  private setHeight(): void {
    if (!this.contentWrapper) return;

    const element = this.contentWrapper.nativeElement;
    const activeContent = this.hoveredSection
      ? element.querySelector('.description')
      : element.querySelector('.headline');

    if (activeContent) {
      const height = (activeContent as HTMLElement).scrollHeight;
      element.style.height = `${height}px`;
    }
  }
}