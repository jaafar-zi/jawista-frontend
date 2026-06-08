// src/app/core/services/viewport.service.ts

import {
  Injectable,
  OnDestroy,
  PLATFORM_ID,
  inject,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { BehaviorSubject, Observable, fromEvent, Subject } from 'rxjs';
import {
  debounceTime,
  distinctUntilChanged,
  map,
  takeUntil,
} from 'rxjs/operators';

export enum Breakpoint {
  Mobile  = 480,
  Tablet  = 768,
  Desktop = 1024,
  Wide    = 1400,
}

@Injectable({ providedIn: 'root' })
export class ViewportService implements OnDestroy {

  private readonly platformId  = inject(PLATFORM_ID);
  private readonly isBrowser   = isPlatformBrowser(this.platformId);
  private readonly destroy$    = new Subject<void>();

  // ← safe: only access window if browser
  private readonly width$ = new BehaviorSubject<number>(
    this.isBrowser ? window.innerWidth : 0
  );

  readonly viewportWidth$: Observable<number> =
    this.width$.asObservable();

  readonly isMobile$: Observable<boolean> = this.width$.pipe(
    map(width => width <= Breakpoint.Tablet),
    distinctUntilChanged()
  );

  readonly isTablet$: Observable<boolean> = this.width$.pipe(
    map(width => width > Breakpoint.Tablet && width <= Breakpoint.Desktop),
    distinctUntilChanged()
  );

  readonly isDesktop$: Observable<boolean> = this.width$.pipe(
    map(width => width > Breakpoint.Desktop),
    distinctUntilChanged()
  );

  constructor() {
    if (this.isBrowser) {
      this.listenToResize();
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // ─── Sync Methods ─────────────────────────────────────────────

  isMobile(maxWidth: number = Breakpoint.Tablet): boolean {
    return this.isBrowser
      ? window.innerWidth <= maxWidth
      : false;
  }

  isTablet(): boolean {
    if (!this.isBrowser) return false;
    const width = window.innerWidth;
    return width > Breakpoint.Tablet && width <= Breakpoint.Desktop;
  }

  isDesktop(): boolean {
    return this.isBrowser
      ? window.innerWidth > Breakpoint.Desktop
      : true; // assume desktop on server
  }

  isBelow(breakpoint: number): boolean {
    return this.isBrowser
      ? window.innerWidth <= breakpoint
      : false;
  }

  isAbove(breakpoint: number): boolean {
    return this.isBrowser
      ? window.innerWidth > breakpoint
      : true;
  }

  isBelow$(breakpoint: number): Observable<boolean> {
    return this.width$.pipe(
      map(width => width <= breakpoint),
      distinctUntilChanged()
    );
  }

  isAbove$(breakpoint: number): Observable<boolean> {
    return this.width$.pipe(
      map(width => width > breakpoint),
      distinctUntilChanged()
    );
  }

  getCurrentWidth(): number {
    return this.isBrowser ? window.innerWidth : 0;
  }

  // ─── Private ─────────────────────────────────────────────────

  private listenToResize(): void {
    fromEvent(window, 'resize').pipe(
      debounceTime(150),
      map(() => window.innerWidth),
      distinctUntilChanged(),
      takeUntil(this.destroy$)
    ).subscribe(width => this.width$.next(width));
  }
}