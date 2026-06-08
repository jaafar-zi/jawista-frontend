// src/app/core/services/seo.service.ts

import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Meta, Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { TranslocoService } from '@jsverse/transloco';

// ── Types ─────────────────────────────────────────────────────────────────────

export interface SeoConfig {
  title: string;
  description: string;
  keywords?: string;
  ogImage?: string;
  ogType?: 'website' | 'product' | 'article';
  noIndex?: boolean;
}

export interface SeoTranslocoConfig {
  titleKey: string;
  descriptionKey: string;
  keywordsKey?: string;
  titleParams?: Record<string, string>;
  descriptionParams?: Record<string, string>;
  keywordsParams?: Record<string, string>;
  ogImage?: string;
  ogType?: 'website' | 'product' | 'article';
  noIndex?: boolean;
}

export interface ProductSeoConfig {
  name: string;
  description?: string;
  image?: string;
  price?: number;
  currency?: string;
  availability?: 'InStock' | 'OutOfStock';
}

interface StructuredData {
  [key: string]: any;
}

// ── Constants ─────────────────────────────────────────────────────────────────

const BASE_URL   = 'https://www.jawista.com';
const DEFAULT_OG = '/assets/images/og-default.jpg';

// ──────────────────────────────────────────────────────────────────────────────

@Injectable({ providedIn: 'root' })
export class SeoService {

  private readonly meta       = inject(Meta);
  private readonly titleSvc   = inject(Title);
  private readonly router     = inject(Router);
  private readonly transloco  = inject(TranslocoService);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly isBrowser  = isPlatformBrowser(this.platformId);

  // ── Primary API — uses Transloco keys ───────────────────────────────────────

  updateMetaFromKeys(config: SeoTranslocoConfig): void {
    const siteName    = this.transloco.translate('seo.siteName');
    const title       = this.transloco.translate(config.titleKey, config.titleParams);
    const description = this.transloco.translate(config.descriptionKey, config.descriptionParams);
    const keywords    = config.keywordsKey
      ? this.transloco.translate(config.keywordsKey, config.keywordsParams)
      : undefined;

    this.applyMeta({
      title,
      description,
      keywords,
      ogImage: config.ogImage,
      ogType:  config.ogType,
      noIndex: config.noIndex,
    }, siteName);
  }

  /**
   * Set page meta using raw strings (fallback when keys aren't available).
   */
  updateMeta(config: SeoConfig): void {
    const siteName = this.transloco.translate('seo.siteName');
    this.applyMeta(config, siteName);
  }

  /**
   * Convenience for product detail pages — call after product data loads.
   */
  updateProductMeta(product: ProductSeoConfig): void {
    const siteName = this.transloco.translate('seo.siteName');

    const description: string = product.description
      ?? this.transloco.translate('seo.productFallback.description', {
           productName: product.name,
         });

    const keywords: string = this.transloco.translate('seo.productFallback.keywords', {
      productName: product.name,
    });

    this.applyMeta({
      title:   product.name,
      description,
      keywords,
      ogImage: product.image,
      ogType:  'product',
    }, siteName);

    this.setStructuredData({
      '@context': 'https://schema.org',
      '@type':    'Product',
      name:        product.name,
      description,
      image:       product.image,
      brand: {
        '@type': 'Brand',
        name:    siteName,
      },
      offers: {
        '@type':       'Offer',
        price:         product.price      ?? 0,
        priceCurrency: product.currency   ?? 'TND',
        availability:  `https://schema.org/${product.availability ?? 'InStock'}`,
        url:           `${BASE_URL}${this.router.url}`,
      },
    });
  }

  // ── Structured Data ─────────────────────────────────────────────────────────

  setStructuredData(data: StructuredData): void {
    this.removeStructuredData();
    if (!this.isBrowser) return;

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(data);
    document.head.appendChild(script);
  }

  removeStructuredData(): void {
    if (!this.isBrowser) return;
    document
      .querySelectorAll('script[type="application/ld+json"]')
      .forEach(s => s.remove());
  }

  // ── Private ─────────────────────────────────────────────────────────────────

  private applyMeta(config: SeoConfig, siteName: string): void {
    const fullTitle  = `${config.title} | ${siteName}`;
    const ogImage    = config.ogImage ?? DEFAULT_OG;
    const ogType     = config.ogType  ?? 'website';
    const currentUrl = `${BASE_URL}${this.router.url}`;

    this.titleSvc.setTitle(fullTitle);

    this.setTag('description', config.description);
    this.setTag('robots', config.noIndex ? 'noindex, nofollow' : 'index, follow');

    if (config.keywords) {
      this.setTag('keywords', config.keywords);
    }

    this.setProp('og:title',       fullTitle);
    this.setProp('og:description', config.description);
    this.setProp('og:image',       ogImage);
    this.setProp('og:url',         currentUrl);
    this.setProp('og:type',        ogType);
    this.setProp('og:site_name',   siteName);

    this.setTag('twitter:card',        'summary_large_image');
    this.setTag('twitter:title',       fullTitle);
    this.setTag('twitter:description', config.description);
    this.setTag('twitter:image',       ogImage);
  }

  private setTag(name: string, content: string): void {
    this.meta.updateTag({ name, content });
  }

  private setProp(property: string, content: string): void {
    this.meta.updateTag({ property, content });
  }
}