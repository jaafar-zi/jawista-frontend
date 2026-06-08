// src/app/core/models/hero-slider.model.ts
export interface HeroSlideConfig {
  id: number;
  image: string;
  thumbnail: string; 
  titleKey: string;          
  ctaTextKey: string;    
  ctaLink: string;
  isExternal?: boolean;
  isActive?: boolean;
  priority?: number;
  publishDate?: string;
  expiryDate?: string;
}

export interface HeroSliderSettings {
  autoPlay: boolean;
  autoPlayInterval: number;
  enableKeyboardNav: boolean;
  enableMouseWheel: boolean;
  enableTouchSwipe: boolean;
  transitionDuration: number;
}