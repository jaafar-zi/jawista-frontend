import {
  Component,
  Input,
  Output,
  EventEmitter,
  ChangeDetectionStrategy
} from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-bracket-cta',
  standalone: true,
  imports: [CommonModule],
  template: `
    <a
      class="bracket-cta"
      [ngClass]="colorScheme"
      [href]="href || null"
      (click)="onCtaClick($event)"
      dir="ltr"
    >
      <!-- Left bracket -->
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 5 16"
        fill="none"
        class="bracket-cta__bracket"
        aria-hidden="true"
      >
        <path
          d="M4.5 1H4C2.34315 1 1 2.34315 1 4V12C1 13.6569 2.34315 15 4 15H4.5"
          stroke="currentColor"
        />
      </svg>

      <span class="bracket-cta__text" dir="auto">{{ text }}</span>

      <!-- Right bracket -->
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 5 16"
        fill="none"
        class="bracket-cta__bracket"
        aria-hidden="true"
      >
        <path
          d="M0.5 15L1 15C2.65685 15 4 13.6569 4 12L4 4C4 2.34315 2.65686 1 1 1L0.500001 1"
          stroke="currentColor"
        />
      </svg>
    </a>
  `,
  styles: [`
    .bracket-cta {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      text-decoration: none;
      cursor: pointer;
      transition: opacity 0.3s ease;
      direction: ltr;
      unicode-bidi: isolate;
    }

    .bracket-cta:hover {
      opacity: 0.7;
    }

    .bracket-cta.dark {
      color: #000;
    }

    .bracket-cta.light {
      color: #fff;
    }

    .bracket-cta__bracket {
      width: 5px;
      height: 16px;
      flex-shrink: 0;
      display: block;
    }

    .bracket-cta__text {
      font-size: 0.75rem;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      font-weight: 500;
      white-space: nowrap;
      text-align: center;
      unicode-bidi: isolate;
    }

    @media (max-width: 768px) {
      .bracket-cta__text {
        font-size: 0.625rem;
      }

      .bracket-cta__bracket {
        width: 4px;
        height: 12px;
      }
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BracketCtaComponent {
  @Input() text = 'View All';
  @Input() href: string | null = null;
  @Input() colorScheme: string = 'dark';
  @Output() ctaClick = new EventEmitter<MouseEvent>();

  onCtaClick(event: MouseEvent): void {
    if (!this.href) {
      event.preventDefault();
    }

    this.ctaClick.emit(event);
  }
}