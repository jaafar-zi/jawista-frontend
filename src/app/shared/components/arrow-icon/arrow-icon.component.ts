// arrow-icon.component.ts
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-arrow-icon',
  standalone: false,
  template: `
    <svg
      class="arrow-icon"
      viewBox="0 0 5 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true">
      <path
        d="M0.5 1L4 8L0.5 15"
        stroke="currentColor"
        [attr.stroke-width]="strokeWidth"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  `,
  styleUrls: ['./arrow-icon.component.scss']
})
export class ArrowIconComponent {
  @Input() strokeWidth = '0.8';
}