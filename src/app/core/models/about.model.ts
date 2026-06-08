// core/models/about.model.ts
export type StickyItemAlignment =
  | 'top-left'
  | 'center-left'
  | 'top-right'
  | 'center-bottom';

export interface StickyItem {
  id: number;
  imageUrl: string;
  altText: string;
  zIndex: number;
  alignment: StickyItemAlignment;
}

export interface HeroSectionConfig {
  imageUrl: string;
  imageAlt: string;
  leftText: string;
  centerText: string;
  rightText: string;
}

export interface SplitGalleryImage {
  src: string;
  alt: string;
  width: number;
  height: number;
}

export interface SplitGalleryContent {
  heading?: string;
  description?: string;
  features?: Array<{
    icon?: string;
    title: string;
    description: string;
  }>;
}

export interface SplitGalleryConfig {
  leftImages: SplitGalleryImage[];
  rightImage: SplitGalleryImage;
  hasFlickthrough?: boolean;
  centerContent?: SplitGalleryContent;
}

export interface AboutPageConfig {
  hero: HeroSectionConfig;
  splitGallery: SplitGalleryConfig;
  stickyItems: StickyItem[];
  visionContent: any;
}