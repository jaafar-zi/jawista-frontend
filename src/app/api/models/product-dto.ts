/* eslint-disable */

import { InventoryDto } from "./inventory-dto";
import { ProductAssetDto } from "./product-asset-dto";
import { ProductAttributeDto } from "./product-attribute-dto";
import { ProductPricingDto } from "./product-pricing-dto";

export interface ProductDto {
  id?: number;
  sku?: string;
  inventory?: InventoryDto;
  active?: boolean;
  name?: string;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
  pricing?: ProductPricingDto;
  attributes?: Array<ProductAttributeDto>;
  assets?: Array<ProductAssetDto>;
}