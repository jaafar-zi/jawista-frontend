// navbar.component.ts

import {
  Component,
  OnInit,
  OnDestroy,
  HostListener,
  PLATFORM_ID,
  inject,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
} from '@angular/core';
import { Router, NavigationEnd, RouterModule } from '@angular/router';
import { isPlatformBrowser, CommonModule } from '@angular/common';
import { Subject } from 'rxjs';
import { takeUntil, filter } from 'rxjs/operators';
import { TranslocoModule, TranslocoService } from '@jsverse/transloco';
import { ReactiveFormsModule } from '@angular/forms';
import { menuAnimations } from '../../core/animations/menu.animations';
import { Cart } from '../../core/models/cart.model';
import { MenuConfig, MenuItem } from '../../core/models/menu-item.model';
import { CartService } from '../../core/services/cart.service';
import { MenuService } from '../../core/services/menu.service';
import { NavThemeService } from '../../core/services/nav-theme.service';
import { ImageWithFallbackComponent } from '../../shared/components/image-with-fallback/image-with-fallback.component';
import { SharedModule } from '../../shared/shared.module';
import { LanguageSwitcherComponent } from '../language-switcher/language-switcher.component';

@Component({
  selector: 'app-navbar',
  standalone: true,
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    TranslocoModule,
    ImageWithFallbackComponent,
    SharedModule,
    LanguageSwitcherComponent,
  ],
  animations: [
    menuAnimations.menuState,
    menuAnimations.overlayFade,
    menuAnimations.panelSlide,
    menuAnimations.fadeIn,
    menuAnimations.menuLinkSlide,
    menuAnimations.staggerMenuItems,
    menuAnimations.imageClipPath,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavbarComponent implements OnInit, OnDestroy {

  private readonly platformId       = inject(PLATFORM_ID);
  private readonly cdr              = inject(ChangeDetectorRef);
  readonly navThemeService          = inject(NavThemeService);
  public  readonly menuService      = inject(MenuService);
  public  readonly cartService      = inject(CartService);
  private readonly router           = inject(Router);
  private readonly translocoService = inject(TranslocoService);

  readonly isBrowser: boolean = isPlatformBrowser(this.platformId);

  private readonly destroy$ = new Subject<void>();

  // ── Menu state ────────────────────────────────────────────────
  menuState: 'open' | 'closed'     = 'closed';
  menuConfig: MenuConfig | null    = null;
  activeMenuItem: MenuItem | null  = null;
  currentImageUrl                  = '';
  imageState: 'hidden' | 'visible' = 'hidden';

  // ── Cart state ────────────────────────────────────────────────
  cart: Cart | null = null;
  cartOpen          = false;

  // ── Layout state ──────────────────────────────────────────────
  isScrolled = false;
  isMobile   = false;

  // ── Animation getters (SSR-safe) ──────────────────────────────
  get animMenuState()       { return this.isBrowser ? this.menuState : null; }
  get animOverlayFade()     { return this.isBrowser ? this.menuState : null; }
  get animPanelSlide()      { return this.isBrowser ? this.menuState : null; }
  get animFadeIn()          { return this.isBrowser ? this.menuState : null; }
  get animMenuLinkSlide()   { return this.isBrowser ? this.menuState : null; }
  get animImageClipPath()   { return this.isBrowser ? this.imageState : null; }
  get animStaggerMenuItems(){ return this.isBrowser ? (this.menuConfig?.items?.length ?? 0) : null; }

  // ── Logo getters (delegate to MenuService) ────────────────────
  get currentLogoUrl(): string {
    return this.navThemeService.theme() === 'light'
      ? this.menuService.logoLightUrl
      : this.menuService.logoDarkUrl;
  }

  // ── Lifecycle ─────────────────────────────────────────────────
  ngOnInit(): void {
    this.initializeSubscriptions();
    this.handleRouteChanges();

    if (this.isBrowser) {
      this.checkMobileView();
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();

    if (this.isBrowser) {
      document.body.style.overflow = '';
    }
  }

  // ── Subscriptions ─────────────────────────────────────────────
  private initializeSubscriptions(): void {
    this.menuService.menuOpen$
      .pipe(takeUntil(this.destroy$))
      .subscribe(isOpen => {
        this.menuState = isOpen ? 'open' : 'closed';

        if (isOpen && this.menuConfig?.items?.length) {
          this.currentImageUrl = this.menuConfig.items[0].imageUrl ?? '';
          this.imageState      = 'visible';
        } else {
          this.imageState = 'hidden';
        }

        this.cdr.markForCheck();
      });

    this.menuService.menuConfig$
      .pipe(takeUntil(this.destroy$))
      .subscribe(config => {
        this.menuConfig = config;

        if (config?.items?.length) {
          this.currentImageUrl = config.items[0].imageUrl ?? '';
        }

        this.cdr.markForCheck();
      });

    this.menuService.activeMenuItem$
      .pipe(takeUntil(this.destroy$))
      .subscribe(item => {
        this.activeMenuItem = item;

        if (item?.imageUrl) {
          this.currentImageUrl = item.imageUrl;
        }

        this.cdr.markForCheck();
      });

    this.cartService.cart$
      .pipe(takeUntil(this.destroy$))
      .subscribe(cart => {
        this.cart = cart;
        this.cdr.markForCheck();
      });

    this.cartService.cartOpen$
      .pipe(takeUntil(this.destroy$))
      .subscribe(isOpen => {
        this.cartOpen = isOpen;
        this.cdr.markForCheck();
      });

    this.translocoService.langChanges$
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        if (this.menuState === 'open' && this.menuConfig?.items?.length) {
          const activeImage = this.activeMenuItem?.imageUrl
            ?? this.menuConfig.items[0].imageUrl
            ?? '';

          this.currentImageUrl = activeImage;
          this.imageState      = 'visible';
        }

        this.cdr.markForCheck();
      });
  }

  private handleRouteChanges(): void {
    this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd),
        takeUntil(this.destroy$)
      )
      .subscribe(() => {
        this.closeMenu();
        this.cdr.markForCheck();
      });
  }

  // ── Host listeners ────────────────────────────────────────────
  @HostListener('window:resize')
  onResize(): void {
    if (this.isBrowser) {
      this.checkMobileView();
      this.cdr.markForCheck();
    }
  }

  @HostListener('window:scroll')
  onScroll(): void {
    if (this.isBrowser) {
      this.isScrolled = window.scrollY > 50;
      this.cdr.markForCheck();
    }
  }

  @HostListener('document:keydown.escape')
  onEscapeKey(): void {
    if (this.menuState === 'open') this.closeMenu();
    if (this.cartOpen)            this.closeCart();
  }

  // ── Layout helpers ────────────────────────────────────────────
  private checkMobileView(): void {
    this.isMobile = window.innerWidth < 992;
  }

  // ── Menu actions ──────────────────────────────────────────────
  toggleMenu():  void { this.menuService.toggleMenu(); }
  openMenu():    void { this.menuService.openMenu(); }
  closeMenu():   void { this.menuService.closeMenu(); this.imageState = 'hidden'; }

  onMenuItemHover(item: MenuItem): void {
    if (!this.isMobile && item.imageUrl) {
      this.currentImageUrl = item.imageUrl;
      this.menuService.setActiveMenuItem(item);
      this.imageState = 'visible';
      this.cdr.markForCheck();
    }
  }

  onMenuItemLeave(): void {
    if (!this.isMobile && this.menuConfig?.items?.length) {
      this.currentImageUrl = this.menuConfig.items[0].imageUrl ?? '';
      this.imageState      = 'visible';
      this.cdr.markForCheck();
    }
  }

  navigateToMenuItem(item: MenuItem): void {
    this.router.navigate([item.url]);
    this.closeMenu();
  }

  // ── Cart actions ──────────────────────────────────────────────
  toggleCart():  void { this.cartService.toggleCart(); }
  openCart():    void { this.cartService.openCart(); }
  closeCart():   void { this.cartService.closeCart(); }

  removeCartItem(itemId: string): void {
    this.cartService.removeItem(itemId);
  }

  updateCartItemQuantity(itemId: string, quantity: number): void {
    this.cartService.updateQuantity(itemId, quantity);
  }

  onQuantityChange(itemId: string, event: Event): void {
    const input    = event.target as HTMLInputElement;
    const quantity = parseInt(input.value, 10);
    if (!isNaN(quantity) && quantity >= 0) {
      this.updateCartItemQuantity(itemId, quantity);
    }
  }

  navigateToCheckout(): void {
    this.router.navigate(['/checkout']);
    this.closeCart();
  }

  // ── Route helpers ─────────────────────────────────────────────
  isActiveRoute(url: string): boolean {
    return this.router.url === url;
  }

  // ── Display helpers ───────────────────────────────────────────
  formatPrice(price: number, currency: string): string {
    return `${currency} ${price.toFixed(2)}`;
  }

  // ── Track by ──────────────────────────────────────────────────
  trackByItemId(_index: number, item: MenuItem): string { return item.id; }
  trackByCartItemId(_index: number, item: any): string  { return item.id; }
}