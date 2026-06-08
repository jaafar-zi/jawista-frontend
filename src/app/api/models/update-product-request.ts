/* eslint-disable */
import { CreateAssetRequest } from '../models/create-asset-request';
import { CreatePricingRequest } from '../models/create-pricing-request';
import { CreateAttributeRequest } from './CreateAttributeRequest';

export interface UpdateProductRequest {
  nameKey?: string;
  descriptionKey?: string;
  active?: boolean;
  attributes?: Array<CreateAttributeRequest>;
  assets?: Array<CreateAssetRequest>;
  pricing?: CreatePricingRequest;
}