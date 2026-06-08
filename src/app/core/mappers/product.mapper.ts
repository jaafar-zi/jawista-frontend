import { Injectable, inject } from '@angular/core';
import {
  Product,
  ProductDetail,
  ProductAttribute,
} from '../../shared/models/product.model';
import { ProductDto } from '../../api/models/product-dto';
import { ProductAssetDto } from '../../api/models/product-asset-dto';
import { ProductAttributeDto } from '../../api/models/product-attribute-dto';
import { PreferencesService } from '../services/preferences.service';

@Injectable({ providedIn: 'root' })
export class ProductMapper {

  private readonly preferences = inject(PreferencesService);

  // ── Public API ────────────────────────────────────────────────

  toProduct(dto: ProductDto, lang?: string): Product {
    const resolvedLang = lang ?? this.preferences.currentLang;
    const assets       = dto.assets ?? [];
    const pricing      = dto.pricing;
    const inventory    = dto.inventory;

    const primaryAsset    = this.getPrimaryAsset(assets);
    const secondaryAssets = this.getSecondaryAssets(assets);

    return {
      id:          dto.id          ?? 0,
      name:        dto.name        ?? '',
      price:       pricing?.salePrice ?? pricing?.basePrice ?? 0,
      image:       primaryAsset?.url  ?? 'assets/images/placeholder-product.jpg',
      hoverImage:  secondaryAssets[0]?.url,
      images:      assets.map(a => a.url ?? '').filter(Boolean),
      description: dto.description ?? '',
      category:    this.extractCategory(dto, resolvedLang),
      inStock:     inventory?.inStock ?? false,
      sku:         dto.sku ?? '',
      sizes:       this.extractSizes(dto, resolvedLang),
      colors:      this.extractColors(dto, resolvedLang),
      features:    this.extractFeatures(dto, resolvedLang),
      attributes:  this.extractAttributes(dto, resolvedLang),
      slug:        this.buildSlug(dto.name ?? ''),
    };
  }

  toProductList(dtos: ProductDto[], lang?: string): Product[] {
    const resolvedLang = lang ?? this.preferences.currentLang;
    return dtos.map(dto => this.toProduct(dto, resolvedLang));
  }

  toProductDetail(dto: ProductDto, lang?: string): ProductDetail {
    const resolvedLang = lang ?? this.preferences.currentLang;
    const product      = this.toProduct(dto, resolvedLang);
    const assets       = dto.assets ?? [];

    return {
      ...product,
      mainImage:       product.image,
      lifestyleImages: this.getSecondaryAssets(assets)
        .map(a => a.url ?? '')
        .filter(Boolean),
      garmentDetails:  this.extractAttributeValues(dto, 'material', resolvedLang),
      washCare:        this.extractWashCare(dto, resolvedLang),
      collection:      this.extractFirstValue(dto, 'collection', resolvedLang),
      origin:          this.extractFirstValue(dto, 'origin', resolvedLang),
      edition:         this.extractFirstValue(dto, 'edition', resolvedLang),
    };
  }

  // ── Asset helpers ─────────────────────────────────────────────

  private getPrimaryAsset(
    assets: ProductAssetDto[]
  ): ProductAssetDto | undefined {
    return assets.find(a => a.isPrimary) ?? assets[0];
  }

  private getSecondaryAssets(assets: ProductAssetDto[]): ProductAssetDto[] {
    const primary = this.getPrimaryAsset(assets);
    return assets.filter(a => a !== primary);
  }

  // ── Attribute helpers ─────────────────────────────────────────

  /**
   * Find a single attribute by key, preferring the resolved language.
   * Falls back to 'en' and then to language-agnostic (no language field).
   */
  private findAttribute(
    dto: ProductDto,
    key: string,
    lang: string
  ): ProductAttributeDto | undefined {
    const attrs = (dto.attributes ?? []).filter(
      a => a.attributeKey === key
    );

    // 1. Exact language match
    const exact = attrs.find(a => a.language === lang);
    if (exact) return exact;

    // 2. English fallback
    const enFallback = attrs.find(a => a.language === 'en');
    if (enFallback) return enFallback;

    // 3. No language field (language-agnostic attribute)
    const noLang = attrs.find(a => !a.language);
    if (noLang) return noLang;

    // 4. Any available
    return attrs[0];
  }

  private extractFirstValue(
    dto: ProductDto,
    key: string,
    lang: string
  ): string {
    const attr = this.findAttribute(dto, key, lang);
    return attr?.attributeValues?.[0]?.value ?? '';
  }

  private extractAllValues(
    dto: ProductDto,
    key: string,
    lang: string
  ): string[] {
    const attr = this.findAttribute(dto, key, lang);
    return (attr?.attributeValues ?? [])
      .map(v => v.value ?? '')
      .filter(Boolean);
  }

  private extractCategory(dto: ProductDto, lang: string): string {
    return (
      this.extractFirstValue(dto, 'category', lang) ||
      this.extractFirstValue(dto, 'type', lang)     ||
      'uncategorized'
    );
  }

  private extractSizes(dto: ProductDto, lang: string): string[] {
    return this.extractAllValues(dto, 'sizes', lang)
      .flatMap(v => v.split(',').map(s => s.trim()))
      .filter(Boolean);
  }

  private extractColors(dto: ProductDto, lang: string): string[] {
    return this.extractAllValues(dto, 'colors', lang)
      .flatMap(v => v.split(',').map(c => c.trim()))
      .filter(Boolean);
  }

  private extractFeatures(dto: ProductDto, lang: string): string[] {
    return this.extractAllValues(dto, 'features', lang)
      .flatMap(v => v.split(',').map(f => f.trim()))
      .filter(Boolean);
  }

  private extractAttributeValues(
    dto: ProductDto,
    key: string,
    lang: string
  ): string {
    return this.extractAllValues(dto, key, lang).join('\n');
  }

  private extractWashCare(dto: ProductDto, lang: string): string {
    const wash     = this.extractAllValues(dto, 'wash_instructions', lang);
    const dry      = this.extractAllValues(dto, 'dry_instructions', lang);
    const iron     = this.extractAllValues(dto, 'iron_instructions', lang);
    const dryClean = this.extractFirstValue(dto, 'dry_clean', lang);

    return [
      wash.length     ? `Lavage:\n${wash.join('\n')}`     : '',
      dry.length      ? `Séchage:\n${dry.join('\n')}`     : '',
      iron.length     ? `Repassage:\n${iron.join('\n')}`  : '',
      dryClean        ? dryClean                          : '',
    ]
      .filter(Boolean)
      .join('\n\n');
  }

  private extractAttributes(
    dto: ProductDto,
    lang: string
  ): ProductAttribute[] {
    const reserved = new Set([
      'category', 'type', 'sizes', 'size',
      'colors', 'color', 'features',
      'name', 'description',
      'wash_instructions', 'dry_instructions',
      'iron_instructions', 'dry_clean',
      'collection', 'origin', 'edition',
    ]);

    // Group attributes by key, pick best language match per key
    const allAttrs   = dto.attributes ?? [];
    const byKey      = new Map<string, ProductAttributeDto>();

    for (const attr of allAttrs) {
      const key = attr.attributeKey;
      if (!key || reserved.has(key)) continue;

      const existing = byKey.get(key);

      if (!existing) {
        byKey.set(key, attr);
        continue;
      }

      // Prefer exact language match
      if (attr.language === lang) {
        byKey.set(key, attr);
        continue;
      }

      // Prefer English over unknown
      if (attr.language === 'en' && existing.language !== lang) {
        byKey.set(key, attr);
      }
    }

    return Array.from(byKey.values()).map(a => ({
      id:      a.attributeKey ?? '',
      title:   this.formatAttributeTitle(a.attributeKey ?? ''),
      content: (a.attributeValues ?? [])
        .map(v => v.value ?? '')
        .filter(Boolean)
        .join(', '),
    }));
  }

  // ── String helpers ────────────────────────────────────────────

  private buildSlug(name: string): string {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  private formatAttributeTitle(key: string): string {
    return key
      .replace(/-/g, ' ')
      .replace(/_/g, ' ')
      .replace(/\b\w/g, c => c.toUpperCase());
  }
}