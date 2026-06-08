import { AssetOwnerType } from '../../api/models/asset-owner-type';

export interface ImageSectionConfig {
  imageUrl: string;
  leftTextKey: string;
  centerTextKey: string;
  rightTextKey: string;

  // Optional backend media reference
  mediaOwnerType?: AssetOwnerType;
  mediaOwnerId?: number;
}