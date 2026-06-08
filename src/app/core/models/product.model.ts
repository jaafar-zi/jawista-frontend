export interface ProductAsset {
  id: number;
  assetType: string;
  url: string;
  altText: string;
  displayOrder: number;
  isPrimary: boolean;
}

export interface ProductPricing {
  basePrice: number;
  salePrice: number | null;
  currency: string;
  taxRate: number;
}

export interface ProductInventory {
  quantity: number;
  availableQuantity: number;
  inStock: boolean;
  lowStock: boolean;
}

export interface Product {
  id: number;
  sku: string;
  name: string;
  description: string;
  active: boolean;
  attributes: Record<string, string>;
  assets: ProductAsset[];
  pricing: ProductPricing;
  inventory: ProductInventory;
  primaryImage: string | null;
  hasDiscount: boolean;
  discountPercentage: number;
}

export interface CreateProductPayload {
  sku: string;
  name: string;
  description: string;
  active: boolean;
  attributes?: Record<string, string>;
  assets?: Omit<ProductAsset, 'id'>[];
  pricing: Omit<ProductPricing, 'salePrice'> & { salePrice?: number };
  inventory: Pick<ProductInventory, 'quantity'>;
}

export interface UpdateProductPayload extends Partial<CreateProductPayload> {
  id: number;
}

export interface ProductFilter {
  activeOnly?: boolean;
}

export interface ProductsResponse {
  products: Product[];
  total: number;
  page: number;
  pageSize: number;
}