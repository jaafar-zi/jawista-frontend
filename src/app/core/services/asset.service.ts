import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AssetService {
  private readonly assetsPath = 'assets/images/';

  getImagePath(imageName: string): string {
    return `${this.assetsPath}${imageName}`;
  }

  getPlaceholderImage(): string {
    return this.getImagePath('placeholder-product.jpg');
  }

  getHeroImage(): string {
    return this.getImagePath('hero-image.jpg');
  }

  getProductsSectionImage(): string {
    return this.getImagePath('products-section.jpg');
  }

  getStorySectionImage(): string {
    return this.getImagePath('story-section.jpg');
  }

  getCommunitySectionImage(): string {
    return this.getImagePath('community-section.jpg');
  }
}