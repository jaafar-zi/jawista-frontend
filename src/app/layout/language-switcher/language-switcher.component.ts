import {
  Component,
  inject,
  ChangeDetectionStrategy,
  PLATFORM_ID,
  OnInit,
  OnDestroy,
  signal,
} from '@angular/core';
import { isPlatformBrowser, CommonModule } from '@angular/common';
import { LangConfig, SupportedLang } from '../../core/constants/preferences.constants';
import { PreferencesService } from '../../core/services/preferences.service';
import { NavThemeService } from '../../core/services/nav-theme.service';

@Component({
  selector: 'app-language-switcher',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <!-- ── Desktop: full radio group ───────────────────────── -->
    <div
      class="lang-switcher lang-switcher--desktop"
      [class.is-light]="navTheme() === 'light'"
      [class.is-dark]="navTheme() === 'dark'"
      role="radiogroup"
      aria-label="Language selector"
    >
      @for (lang of languages; track lang.code; let last = $last) {
        <button
          type="button"
          class="lang-btn"
          [class.active]="lang.code === currentLang"
          [attr.aria-checked]="lang.code === currentLang"
          [attr.aria-label]="'Switch to ' + lang.label"
          role="radio"
          (click)="onLangChange(lang.code)"
        >
          {{ lang.nativeLabel }}
        </button>

        <span
          *ngIf="!last"
          class="lang-separator"
          aria-hidden="true"
        ></span>
      }
    </div>

    <!-- ── Mobile: cycle button ────────────────────────────── -->
    <button
      type="button"
      class="lang-cycle"
      [class.is-light]="navTheme() === 'light'"
      [class.is-dark]="navTheme() === 'dark'"
      [attr.aria-label]="'Current language: ' + currentLangLabel + '. Tap to switch.'"
      (click)="cycleLanguage()"
    >
      {{ currentLangPrefix }}
    </button>
  `,
  styles: [`
    :host {
      display: inline-flex;
      align-items: center;
      flex-shrink: 0;
    }

    // ============================================================
    // Desktop — full radio group
    // ============================================================
    .lang-switcher--desktop {
      display: inline-flex;
      align-items: center;
      gap: 0;
      flex-shrink: 0;
      flex-wrap: nowrap;
    }

    .lang-switcher--desktop.is-light {
      .lang-btn {
        color: #ffffff;
      }

      .lang-separator {
        background-color: rgba(255, 255, 255, 0.25);
      }
    }

    .lang-switcher--desktop.is-dark {
      .lang-btn {
        color: #000000;
      }

      .lang-separator {
        background-color: rgba(0, 0, 0, 0.25);
      }
    }

    .lang-btn {
      background: none;
      border: none;
      cursor: pointer;
      padding: 4px 6px;
      font-size: 11px;
      font-family: inherit;
      letter-spacing: 0.05em;
      text-transform: uppercase;
      white-space: nowrap;
      color: inherit;
      opacity: 0.4;
      transition:
        opacity 0.2s ease,
        color 0.3s ease;
      -webkit-tap-highlight-color: transparent;
      touch-action: manipulation;
      line-height: 1;

      &:hover {
        opacity: 0.75;
      }

      &:focus-visible {
        outline: 2px solid currentColor;
        outline-offset: 2px;
        border-radius: 2px;
      }

      &.active {
        opacity: 1;
        text-decoration: underline;
        text-underline-offset: 3px;
        text-decoration-thickness: 1px;
      }
    }

    .lang-separator {
      display: block;
      width: 1px;
      height: 10px;
      flex-shrink: 0;
      background-color: currentColor;
      opacity: 0.25;
    }

    // ============================================================
    // Mobile — cycle button
    // ============================================================
    .lang-cycle {
      display: none;
      background: none;
      border: 1px solid currentColor;
      border-radius: 4px;
      cursor: pointer;
      padding: 4px 8px;
      font-size: 10px;
      font-family: inherit;
      font-weight: 500;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      white-space: nowrap;
      line-height: 1;
      color: inherit;
      opacity: 0.7;
      transition:
        opacity 0.2s ease,
        color 0.3s ease,
        border-color 0.3s ease;
      -webkit-tap-highlight-color: transparent;
      touch-action: manipulation;

      &:hover,
      &:active {
        opacity: 1;
      }

      &:focus-visible {
        outline: 2px solid currentColor;
        outline-offset: 2px;
      }

      &.is-light {
        color: #ffffff;
        border-color: rgba(255, 255, 255, 0.4);
      }

      &.is-dark {
        color: #000000;
        border-color: rgba(0, 0, 0, 0.4);
      }
    }

    // ============================================================
    // Responsive — swap at mobile breakpoint
    // ============================================================
    @media (max-width: 991px) {
      .lang-switcher--desktop {
        display: none;
      }

      .lang-cycle {
        display: inline-flex;
        align-items: center;
        justify-content: center;
      }
    }

    @media (max-width: 480px) {
      .lang-cycle {
        padding: 3px 6px;
        font-size: 9px;
      }
    }
  `],
})
export class LanguageSwitcherComponent {
  private readonly preferences = inject(PreferencesService);
  private readonly navThemeService = inject(NavThemeService);

  readonly languages: LangConfig[] = this.preferences.availableLangs;
  readonly navTheme = this.navThemeService.theme;

  /** Language prefix map */
  private readonly prefixMap: Record<string, string> = {
    en: 'EN',
    ar: 'AR',
    fr: 'FR',
  };

  get currentLang(): SupportedLang {
    return this.preferences.currentLang;
  }

  get currentLangPrefix(): string {
    return this.prefixMap[this.currentLang] ?? this.currentLang.toUpperCase();
  }

  get currentLangLabel(): string {
    const found = this.languages.find(l => l.code === this.currentLang);
    return found?.label ?? this.currentLang;
  }

  onLangChange(lang: SupportedLang): void {
    this.preferences.setLang(lang);
  }

  /**
   * Cycles to the next language in the list.
   * e.g. EN → AR → FR → EN
   */
  cycleLanguage(): void {
    const currentIndex = this.languages.findIndex(
      l => l.code === this.currentLang
    );
    const nextIndex = (currentIndex + 1) % this.languages.length;
    const nextLang = this.languages[nextIndex];

    this.preferences.setLang(nextLang.code);
  }
}