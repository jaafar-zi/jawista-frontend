// src/app/core/constants/app.constants.ts

import { StickyItem } from "../models/about.model";
import { FlickthroughImage } from "../models/flick-through-image.model";
import { ASSET_PATHS } from "./asset-paths.constants";

const STICKY_GALLERY_FALLBACK_IMAGES = [
  'sticky_gallery_img_01.jpg',
  'sticky_gallery_img_02.jpg',
  'sticky_gallery_img_03.jpg',
  'sticky_gallery_img_04.jpg'
] as const;

export const APP_CONSTANTS = {
  featuredProducts: {
    scrollSpeed: 1,
    ctaColorScheme: 'dark' as const
  },
  externalLinks: {
    instagram: 'https://www.instagram.com/oddritual.gc/'
  },
  imageSection: {
    defaultImageUrl: 'about-image-section.jpg'
  },
  splitContent: {
    rightImageUrl: ASSET_PATHS.images.about.scrollPortrait as string,
    flickthroughImages: ASSET_PATHS.images.about.flickthrough.map(
      (url): FlickthroughImage => ({ url })
    )
  },
  stickyGallery: {
    fallbackImages: STICKY_GALLERY_FALLBACK_IMAGES,
    defaultItems: [
      {
        id: 1,
        imageUrl: STICKY_GALLERY_FALLBACK_IMAGES[0],
        altText: '',
        zIndex: 4,
        alignment: 'top-left'
      },
      {
        id: 2,
        imageUrl: STICKY_GALLERY_FALLBACK_IMAGES[1],
        altText: '',
        zIndex: 3,
        alignment: 'center-left'
      },
      {
        id: 3,
        imageUrl: STICKY_GALLERY_FALLBACK_IMAGES[2],
        altText: '',
        zIndex: 2,
        alignment: 'top-right'
      },
      {
        id: 4,
        imageUrl: STICKY_GALLERY_FALLBACK_IMAGES[3],
        altText: '',
        zIndex: 1,
        alignment: 'center-bottom'
      }
    ] as StickyItem[]
  }
} as const;