import {
  Injectable,
  OnDestroy,
  PLATFORM_ID,
  inject,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { BehaviorSubject, catchError, forkJoin, Observable, of, Subject, takeUntil } from 'rxjs';
import { MenuItem, MenuConfig } from '../models/menu-item.model';
import { MediaService } from './media.service';

@Injectable({ providedIn: 'root' })
export class MenuService implements OnDestroy {

  private readonly isBrowser    = isPlatformBrowser(inject(PLATFORM_ID));
  private readonly mediaService = inject(MediaService);
  private readonly destroy$     = new Subject<void>();

  private menuOpenSubject       = new BehaviorSubject<boolean>(false);
  private activeMenuItemSubject = new BehaviorSubject<MenuItem | null>(null);
  private menuConfigSubject     = new BehaviorSubject<MenuConfig | null>(null);

  private _logoLightUrl = 'jawista-logo-light.png';
  private _logoDarkUrl  = 'jawista-logo-dark.png';

  // ── Guard: ensure media loads exactly once ────────────────────
  private mediaLoaded = false;

  get logoLightUrl(): string { return this._logoLightUrl; }
  get logoDarkUrl(): string  { return this._logoDarkUrl; }

  readonly menuOpen$:       Observable<boolean>           = this.menuOpenSubject.asObservable();
  readonly activeMenuItem$: Observable<MenuItem | null>   = this.activeMenuItemSubject.asObservable();
  readonly menuConfig$:     Observable<MenuConfig | null> = this.menuConfigSubject.asObservable();

  constructor() {
    // Always emit default config immediately — no HTTP calls here
    this.menuConfigSubject.next(this.buildDefaultConfig());
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Called once by APP_INITIALIZER.
   * Loads backend media and updates the config.
   */
  initialize(): Promise<void> {
    if (this.mediaLoaded) {
      return Promise.resolve();
    }

    this.mediaLoaded = true;

    return new Promise(resolve => {
      const config = this.buildDefaultConfig();

      forkJoin([
        // Menu item images
        ...config.items.map((item, index) =>
          this.mediaService
            .getAssetUrl('BANNER', 80 + index, item.imageUrl ?? '')
            .pipe(catchError(() => of(item.imageUrl ?? '')))
        ),
        // Logos
        this.mediaService
          .getAssetUrl('BRAND', 10, 'jawista-logo-light.png')
          .pipe(catchError(() => of('jawista-logo-light.png'))),
        this.mediaService
          .getAssetUrl('BRAND', 11, 'jawista-logo-dark.png')
          .pipe(catchError(() => of('jawista-logo-dark.png'))),
      ])
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (urls: string[]) => {
            const itemCount = config.items.length;

            const updatedItems = config.items.map((item, i) => ({
              ...item,
              imageUrl: urls[i]
            }));

            this._logoLightUrl = urls[itemCount];
            this._logoDarkUrl  = urls[itemCount + 1];

            this.menuConfigSubject.next({
              ...config,
              items: updatedItems,
              footer: {
                ...config.footer,
                logoUrl: this._logoDarkUrl
              }
            });

            resolve();
          },
          error: () => {
            // Backend failed → keep defaults
            resolve();
          }
        });
    });
  }

  // ── Menu actions ──────────────────────────────────────────────

  openMenu(): void {
    this.menuOpenSubject.next(true);
    this.setBodyOverflow('hidden');
  }

  closeMenu(): void {
    this.menuOpenSubject.next(false);
    if (this.isBrowser) {
      setTimeout(() => this.setBodyOverflow(''), 600);
    }
  }

  toggleMenu(): void {
    this.menuOpenSubject.value ? this.closeMenu() : this.openMenu();
  }

  setActiveMenuItem(item: MenuItem | null): void {
    this.activeMenuItemSubject.next(item);
  }

  getMenuConfig(): MenuConfig | null {
    return this.menuConfigSubject.value;
  }

  isMenuOpen(): boolean {
    return this.menuOpenSubject.value;
  }

  // ── Private ───────────────────────────────────────────────────

  private setBodyOverflow(value: string): void {
    if (this.isBrowser) {
      document.body.style.overflow = value;
    }
  }

  private buildDefaultConfig(): MenuConfig {
    return {
      items: [
        {
          id: 'shop',
          label: 'Our Shop',
          labelKey: 'nav.menuItems.shop',
          url: '/collections/all',
          imageUrl: 'Home_Gallery1.jpg',
          order: 1,
        },
        {
          id: 'home',
          label: 'Home',
          labelKey: 'nav.menuItems.home',
          url: '/',
          imageUrl: 'Home_Gallery2.jpg',
          order: 2,
          isActive: true,
        },
        {
          id: 'about',
          label: 'About us',
          labelKey: 'nav.menuItems.about',
          url: 'about',
          imageUrl: 'Home_Gallery3.jpg',
          order: 3,
        }
      ],
      footer: {
        logoUrl: 'jawista-logo-dark.png',
        copyright: 'Jawista © 2025',
        location: 'Tunisia',
        socialLinks: [
          {
            platform: 'instagram',
            url: 'https://www.instagram.com/jawista.club/',
            label: 'Instagram',
            labelKey: 'nav.socialLinks.instagram',
          },
        ],
      },
    };
  }
}