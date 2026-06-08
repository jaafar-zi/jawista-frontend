/* eslint-disable */

import { CreateAssetRequest } from "./create-asset-request";
import { CreatePricingRequest } from "./create-pricing-request";
import { CreateAttributeRequest } from "./CreateAttributeRequest";

export interface CreateProductRequest {
  sku: string;
  nameKey: string;
  descriptionKey?: string;
  active?: boolean;
  attributes?: Array<CreateAttributeRequest>;
  assets?: Array<CreateAssetRequest>;
  pricing?: CreatePricingRequest;
}