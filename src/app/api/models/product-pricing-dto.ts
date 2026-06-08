/* eslint-disable */
export interface ProductPricingDto {
  id?: number;
  basePrice?: number;
  salePrice?: number;
  effectivePrice?: number;
  currency?: string;
  taxRate?: number;
  onSale?: boolean;
}