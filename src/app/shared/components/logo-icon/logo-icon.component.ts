// logo-icon.component.ts
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-logo-icon',
  standalone: false,
  template: `
    <div class="logo-icon" [class]="'logo-icon--' + size">
      <svg viewBox="0 0 100 100" class="logo-icon__svg" aria-hidden="true">
        <circle cx="50" cy="20" r="5"  fill="currentColor" />
        <circle cx="30" cy="30" r="4"  fill="currentColor" />
        <circle cx="70" cy="30" r="4"  fill="currentColor" />
        <circle cx="20" cy="45" r="3"  fill="currentColor" />
        <circle cx="80" cy="45" r="3"  fill="currentColor" />
        <path
          d="M50 30 L37.5 50 L30 62.5 L50 75 L70 62.5 L62.5 50 Z"
          fill="currentColor"
        />
      </svg>
    </div>
  `,
  styleUrls: ['./logo-icon.component.scss']
})
export class LogoIconComponent {
  @Input() size: 'sm' | 'md' | 'lg' = 'md';
}