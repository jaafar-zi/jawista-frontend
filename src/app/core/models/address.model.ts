// src/app/core/models/address.model.ts

export type AddressType = 'SHIPPING' | 'BILLING' | 'BOTH';

export interface Address {
  id: number;
  fullName: string;
  phoneNumber: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  type: AddressType | string;
  isDefault: boolean;
  customerEmail: string;
  notes: string;
  formattedAddress: string;
  createdAt: Date | null;
  updatedAt: Date | null;
  displayName: string;
  shortAddress: string;
  isShipping: boolean;
  isBilling: boolean;
}

export interface CreateAddressPayload {
  fullName: string;
  phoneNumber: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  type?: AddressType;
  isDefault?: boolean;
  customerEmail: string;
  notes?: string;
}

export interface UpdateAddressPayload extends Partial<CreateAddressPayload> {
  id: number;
}

export interface SetDefaultAddressPayload {
  id: number;
  customerEmail: string;
}

export interface AddressFilter {
  customerEmail?: string;
  type?: AddressType;
  isDefault?: boolean;
}