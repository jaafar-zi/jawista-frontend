// src/app/api/models/file-upload-response.ts

export interface FileUploadResponse {
  publicId: string;
  originalFileName: string;
  contentType: string;
  fileSize: number;
  url: string;
  uploadedAt: string;
}