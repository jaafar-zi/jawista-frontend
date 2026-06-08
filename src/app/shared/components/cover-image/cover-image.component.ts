// cover-image.component.ts
import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-cover-image',
  standalone: false,
  template: `
    <div class="cover-image" [class.cover-image--hoverable]="hoverable">
      <img
        class="cover-image__img"
        [src]="src"
        [alt]="alt"
        [loading]="loading"
        (error)="onError($event)"
      />
      <div class="cover-image__overlay" *ngIf="overlay"></div>
    </div>
  `,
  styleUrls: ['./cover-image.component.scss']
})
export class CoverImageComponent {
  @Input() src!: string;
  @Input() alt = '';
  @Input() loading: 'eager' | 'lazy' = 'lazy';
  @Input() overlay = false;
  @Input() hoverable = false;
  @Input() fallbackSrc?: string;

  @Output() imageError = new EventEmitter<Event>();

  onError(event: Event): void {
    if (this.fallbackSrc) {
      (event.target as HTMLImageElement).src = this.fallbackSrc;
    }
    this.imageError.emit(event);
  }
}