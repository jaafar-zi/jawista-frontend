import {
  Component,
  Input,
  AfterViewInit,
  ElementRef,
  NgZone,
  OnDestroy,
  ChangeDetectionStrategy,
  PLATFORM_ID,
  Inject,
  OnChanges,
  SimpleChanges
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { StickyItem } from '../../../../core/models/about.model';

gsap.registerPlugin(ScrollTrigger);

@Component({
  selector: 'app-sticky-gallery',
  standalone: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './sticky-gallery.component.html',
  styleUrls: ['./sticky-gallery.component.scss']
})
export class StickyGalleryComponent
  implements AfterViewInit, OnDestroy, OnChanges
{
  @Input({ required: true }) items: StickyItem[] = [];
  @Input({ required: true }) fallbackImages: readonly string[] = [];

  private masterTimeline: gsap.core.Timeline | null = null;
  private scrollTriggerInstance: ScrollTrigger | null = null;
  private readonly isBrowser: boolean;
  private viewInitialized = false;

  constructor(
    private el: ElementRef<HTMLElement>,
    private ngZone: NgZone,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngAfterViewInit(): void {
    this.viewInitialized = true;
    this.queueSetup();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!this.isBrowser || !this.viewInitialized) return;

    if (changes['items']) {
      this.queueSetup();
    }
  }

  ngOnDestroy(): void {
    this.destroyAnimation();
  }

  onImageError(event: Event, index: number): void {
    const img = event.target as HTMLImageElement;
    img.src =
      this.fallbackImages[index % this.fallbackImages.length] ??
      this.fallbackImages[0];
  }

  trackById(_index: number, item: StickyItem): number {
    return item.id;
  }

  private queueSetup(): void {
    if (!this.isBrowser || !this.items?.length) return;

    this.ngZone.runOutsideAngular(() => {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          this.setupScrollAnimation();
        });
      });
    });
  }

  private destroyAnimation(): void {
    this.scrollTriggerInstance?.kill();
    this.masterTimeline?.kill();
    this.scrollTriggerInstance = null;
    this.masterTimeline = null;
  }

  private setupScrollAnimation(): void {
    this.destroyAnimation();

    const root = this.el.nativeElement.querySelector(
      '.sticky-component'
    ) as HTMLElement | null;

    if (!root) return;

    const diamondElements = gsap.utils.toArray<HTMLElement>(
      root.querySelectorAll('.diamond-item')
    );

    if (!diamondElements.length) return;

    gsap.set(diamondElements, {
      y: 0,
      opacity: 1,
      scale: 1
    });

    this.masterTimeline = gsap.timeline({
      defaults: {
        ease: 'power2.inOut',
        duration: 1
      }
    });

    diamondElements.forEach((element, index) => {
      this.masterTimeline!.to(
        element,
        {
          y: () => -(element.offsetTop + element.offsetHeight + 80),
          opacity: 0,
          scale: 0.88
        },
        index
      );
    });

    this.scrollTriggerInstance = ScrollTrigger.create({
      trigger: root,
      start: 'top top',
      end: () => `+=${diamondElements.length * window.innerHeight * 1.5}`,
      pin: true,
      pinSpacing: true,
      anticipatePin: 1,
      scrub: 1.5,
      animation: this.masterTimeline,
      invalidateOnRefresh: true
    });

    ScrollTrigger.refresh();
  }
}