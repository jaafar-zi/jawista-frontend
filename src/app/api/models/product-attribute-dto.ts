/* eslint-disable */

import { AttributeValueDto } from "./attribute-value-dto";

export interface ProductAttributeDto {
  id?: number;
  attributeKey?: string;
  language?: string;
  attributeValues?: Array<AttributeValueDto>;
}