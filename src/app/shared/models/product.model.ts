// src/app/shared/models/product.model.ts

export interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  hoverImage?: string;
  images?: string[];
  description?: string;
  category: string;
  inStock: boolean;
  slug?: string;
  sku?: string;
  sizes?: string[];
  colors?: string[];
  features?: string[];
  attributes?: ProductAttribute[];
}

export interface ProductDetail extends Product {
  mainImage: string;
  lifestyleImages: string[];
  garmentDetails: string;
  washCare: string;
  collection?: string;
  origin?: string;
  edition?: string;
}

export interface ProductAttribute {
  id: string;
  title: string;
  content: string;
}

export interface ProductVariant {
  size?: string;
  color?: string;
  sku?: string;
  inStock: boolean;
}

export interface ProductSelection {
  product: Product;
  selectedSize?: string;
  selectedColor?: string;
  quantity: number;
}