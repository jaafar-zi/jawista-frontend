// link-wrapper.component.ts
import { Component, Input } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-link-wrapper',
  standalone: false,
  template: `
    <ng-container *ngIf="isExternal; else internalLink">
      <a
        [href]="href"
        target="_blank"
        rel="noopener noreferrer"
        [class]="className"
        [attr.aria-label]="ariaLabel || null">
        <ng-content />
      </a>
    </ng-container>

    <ng-template #internalLink>
      <a
        [routerLink]="href"
        [class]="className"
        [attr.aria-label]="ariaLabel || null">
        <ng-content />
      </a>
    </ng-template>
  `
})
export class LinkWrapperComponent {
  @Input() href!: string;
  @Input() isExternal = false;
  @Input() className = '';
  @Input() ariaLabel?: string;
}