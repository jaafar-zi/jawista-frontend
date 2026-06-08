// image-with-fallback.component.ts
import {
  Component,
  Input,
  OnInit,
  ChangeDetectionStrategy,
} from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-image-with-fallback',
  template: `
    <img
      [src]="src"
      [alt]="alt"
      [ngClass]="{ 'image-error': isError }"
      (error)="onImageError()"
      loading="lazy"
      decoding="async"
      [class]="customClass"
    />
  `,
  styles: [
    `
      img {
        display: block;

        &.image-error {
          background-color: #e5e7eb;
        }
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [CommonModule],
})
export class ImageWithFallbackComponent implements OnInit {
  @Input() src!: string;
  @Input() alt = 'Image';
  @Input() customClass = '';

  isError = false;

  ngOnInit(): void {
    if (!this.src) {
      this.isError = true;
    }
  }

  onImageError(): void {
    this.isError = true;
  }
}