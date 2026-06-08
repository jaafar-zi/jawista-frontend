// src/app/api/models/media-dto.ts

export interface MediaDto {
  id: number;
  productId: number;
  fileName: string;
  fileType: string;
  fileSize: number;
  url: string;
  isPrimary: boolean;
  displayOrder: number;
  createdAt: string;
  updatedAt: string;
}