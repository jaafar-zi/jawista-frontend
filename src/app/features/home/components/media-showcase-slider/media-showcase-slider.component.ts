// media-showcase-slider.component.ts
import {
  Component,
  OnInit,
  OnDestroy,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  HostListener,
  ViewChild,
  ElementRef,
} from '@angular/core';
import {
  MediaShowcaseSliderFacade
} from '../../facade/media-showcase-slider.facade';
import { SlideContent, NavigationDirection } from '../../../../core/models/media-showcase-slider.model';

@Component({
  selector: 'app-media-showcase-slider',
  standalone: false,
  templateUrl: './media-showcase-slider.component.html',
  styleUrls: ['./media-showcase-slider.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [MediaShowcaseSliderFacade],
})
export class MediaShowcaseSliderComponent implements OnInit, OnDestroy {

  @ViewChild('sliderContainer', { static: false })
  sliderContainer?: ElementRef<HTMLDivElement>;

  trackBySlideId = (index: number, slide: SlideContent) =>
    this.facade.trackBySlideId(index, slide);

  constructor(
    public facade: MediaShowcaseSliderFacade,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.facade.init(this.cdr, this.sliderContainer?.nativeElement);
  }

  ngOnDestroy(): void {
    this.facade.destroy();
  }

  // ── Host Listeners ────────────────────────────────────────────────────────────

  @HostListener('mouseenter')
  onMouseEnter(): void {
    this.facade.onMouseEnter();
  }

  @HostListener('mouseleave')
  onMouseLeave(): void {
    this.facade.onMouseLeave();
  }

  @HostListener('window:keydown', ['$event'])
  onKeyDown(event: KeyboardEvent): void {
    this.facade.onKeyDown(event);
  }

  // ── Navigation Zone Handlers ──────────────────────────────────────────────────

  onNavZoneEnter(direction: 'prev' | 'next'): void {
    this.facade.setNavigationDirection(
      direction === 'prev' ? NavigationDirection.PREV : NavigationDirection.NEXT
    );
  }

  onNavZoneLeave(): void {
    this.facade.setNavigationDirection('');
  }

  onNavZoneClick(direction: 'prev' | 'next', event: MouseEvent): void {
    event.stopPropagation();

    if (this.facade.isTransitioning) return;

    if (direction === 'prev') {
      this.facade.prevSlide();
    } else {
      this.facade.nextSlide();
    }
  }
}