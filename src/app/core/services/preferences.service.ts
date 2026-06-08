// src/app/core/services/preferences.service.ts

import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser, DOCUMENT } from '@angular/common';
import { TranslocoService } from '@jsverse/transloco';
import { BehaviorSubject, Observable } from 'rxjs';
import { distinctUntilChanged } from 'rxjs/operators';

import { CookieService } from './cookie.service';
import {
  SupportedLang,
  SupportedCurrency,
  LayoutDirection,
  LangConfig,
  LANG_CONFIGS,
  DEFAULT_LANG,
  DEFAULT_CURRENCY,
  COOKIE_KEYS,
  SUPPORTED_LANGS,
  SUPPORTED_CURRENCIES,
} from '../constants/preferences.constants';

@Injectable({ providedIn: 'root' })
export class PreferencesService {

  private readonly transloco  = inject(TranslocoService);
  private readonly cookie     = inject(CookieService);
  private readonly document   = inject(DOCUMENT);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly isBrowser  = isPlatformBrowser(this.platformId);

  // ── State ───────────────────────────────────────────────────────────────────

  private readonly _lang$     = new BehaviorSubject<SupportedLang>(this.resolveInitialLang());
  private readonly _currency$ = new BehaviorSubject<SupportedCurrency>(this.resolveInitialCurrency());

  readonly lang$:     Observable<SupportedLang>     = this._lang$.asObservable().pipe(distinctUntilChanged());
  readonly currency$: Observable<SupportedCurrency> = this._currency$.asObservable().pipe(distinctUntilChanged());

  /** Current language snapshot */
  get currentLang(): SupportedLang {
    return this._lang$.value;
  }

  /** Current currency snapshot */
  get currentCurrency(): SupportedCurrency {
    return this._currency$.value;
  }

  /** Current language config */
  get currentLangConfig(): LangConfig {
    return LANG_CONFIGS[this.currentLang];
  }

  /** Current layout direction */
  get direction(): LayoutDirection {
    return LANG_CONFIGS[this.currentLang].direction;
  }

  /** All available languages */
  get availableLangs(): LangConfig[] {
    return SUPPORTED_LANGS.map(code => LANG_CONFIGS[code]);
  }

  /** All available currencies */
  get availableCurrencies(): SupportedCurrency[] {
    return [...SUPPORTED_CURRENCIES];
  }

  // ── Public API ──────────────────────────────────────────────────────────────

  /**
   * Call once in AppComponent ngOnInit to bootstrap language.
   */
  initialize(): void {
    const lang = this.currentLang;
    this.applyLang(lang);
  }

  /**
   * Switch language — persists to cookie, updates Transloco, updates DOM.
   */
  setLang(lang: SupportedLang): void {
    if (!SUPPORTED_LANGS.includes(lang)) return;

    this._lang$.next(lang);
    this.cookie.set(COOKIE_KEYS.lang, lang);
    this.applyLang(lang);

    // Auto-set currency based on lang if user hasn't manually changed it
    const langCurrency = LANG_CONFIGS[lang].currency;
    if (this.currentCurrency === this.resolveInitialCurrency()) {
      this.setCurrency(langCurrency);
    }
  }

  /**
   * Switch currency — persists to cookie.
   */
  setCurrency(currency: SupportedCurrency): void {
    if (!SUPPORTED_CURRENCIES.includes(currency)) return;

    this._currency$.next(currency);
    this.cookie.set(COOKIE_KEYS.currency, currency);
  }

  // ── Private ─────────────────────────────────────────────────────────────────

  private applyLang(lang: SupportedLang): void {
    // Transloco
    this.transloco.setActiveLang(lang);

    // DOM direction + lang attribute
    if (this.isBrowser) {
      const html = this.document.documentElement;
      const config = LANG_CONFIGS[lang];
      html.setAttribute('lang', lang);
      html.setAttribute('dir', config.direction);
    }
  }

  private resolveInitialLang(): SupportedLang {
    // 1. Cookie
    const cookieLang = this.cookie.get(COOKIE_KEYS.lang);
    if (cookieLang && this.isValidLang(cookieLang)) {
      return cookieLang as SupportedLang;
    }

    // 2. Browser language
    if (this.isBrowser) {
      const browserLang = navigator.language?.split('-')[0];
      if (browserLang && this.isValidLang(browserLang)) {
        return browserLang as SupportedLang;
      }
    }

    // 3. Default
    return DEFAULT_LANG;
  }

  private resolveInitialCurrency(): SupportedCurrency {
    const cookieCurrency = this.cookie.get(COOKIE_KEYS.currency);
    if (cookieCurrency && this.isValidCurrency(cookieCurrency)) {
      return cookieCurrency as SupportedCurrency;
    }
    return DEFAULT_CURRENCY;
  }

  private isValidLang(value: string): value is SupportedLang {
    return SUPPORTED_LANGS.includes(value as SupportedLang);
  }

  private isValidCurrency(value: string): value is SupportedCurrency {
    return SUPPORTED_CURRENCIES.includes(value as SupportedCurrency);
  }
}