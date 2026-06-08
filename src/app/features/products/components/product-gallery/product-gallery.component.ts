// product-gallery.component.ts
import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { ASSET_PATHS } from '../../../../core/constants/asset-paths.constants';

@Component({
  selector: 'app-product-gallery',
  standalone: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './product-gallery.component.html',
  styleUrls: ['./product-gallery.component.scss']
})
export class ProductGalleryComponent {
  @Input({ required: true }) productName!: string;

  @Input() set images(value: string[]) {
    this._images = value?.length
      ? value
      : [ASSET_PATHS.images.placeholderProduct];
  }

  readonly placeholderImage = ASSET_PATHS.images.placeholderProduct;
  private _images: string[] = [ASSET_PATHS.images.placeholderProduct];

  get featuredImage(): string {
    return this._images[0];
  }

  get additionalImages(): string[] {
    return this._images.slice(1);
  }

  onImageError(event: Event): void {
    const img = event.target as HTMLImageElement;
    img.src = this.placeholderImage;
  }

  trackByIndex(index: number): number {
    return index;
  }
}