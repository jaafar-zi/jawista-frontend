// src/app/shared/directives/nav-light.directive.ts
import {
  Directive,
  ElementRef,
  OnInit,
  OnDestroy,
  inject,
  PLATFORM_ID,
  NgZone,
  Input,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { NavThemeService } from '../../core/services/nav-theme.service';
import { NavTheme } from '../../core/models/nav-theme.model';

@Directive({
  selector: '[appNavLight]',
})
export class NavLightDirective implements OnInit, OnDestroy {
  private readonly el = inject(ElementRef);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly ngZone = inject(NgZone);
  private readonly navThemeService = inject(NavThemeService);

  // The section declares which theme it triggers: <section appNavLight="light">
  @Input('appNavLight') theme: NavTheme = 'light';

  private observer?: IntersectionObserver;

  ngOnInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    if (typeof IntersectionObserver === 'undefined') return;

    this.ngZone.runOutsideAngular(() => {
      this.observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              this.ngZone.run(() => {
                this.navThemeService.setTheme(this.theme);
              });
            }

          });
        },
        {
          rootMargin: '-10% 0px -85% 0px',
          threshold: 0,
        }
      );

      if (this.el?.nativeElement) {
        this.observer.observe(this.el.nativeElement);
      }
    });
  }

  ngOnDestroy(): void {
    if (this.observer) {
      this.observer.disconnect();
      this.observer = undefined;
    }
  }
}