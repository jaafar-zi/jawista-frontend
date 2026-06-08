// src/app/core/mappers/address.mapper.ts

import { Injectable } from '@angular/core';
import { AddressDto } from '../../api/models/address-dto';
import {
  Address,
  AddressType,
  CreateAddressPayload,
  UpdateAddressPayload,
} from '../models/address.model';

@Injectable({ providedIn: 'root' })
export class AddressMapper {

  fromDto(dto: AddressDto): Address {
    const type = (dto.type ?? 'SHIPPING') as AddressType;

    return {
      id:               dto.id ?? 0,
      fullName:         dto.fullName,
      phoneNumber:      dto.phoneNumber,
      addressLine1:     dto.addressLine1,
      addressLine2:     dto.addressLine2 ?? '',
      city:             dto.city,
      state:            dto.state,
      postalCode:       dto.postalCode,
      country:          dto.country,
      type,
      isDefault:        dto.isDefault ?? false,
      customerEmail:    dto.customerEmail ?? '',
      notes:            dto.notes ?? '',
      formattedAddress: dto.formattedAddress
                          ?? this.buildFormattedAddress(dto),
      createdAt:        dto.createdAt ? new Date(dto.createdAt) : null,
      updatedAt:        dto.updatedAt ? new Date(dto.updatedAt) : null,
      displayName:      this.buildDisplayName(dto),
      shortAddress:     this.buildShortAddress(dto),
      isShipping:       type === 'SHIPPING' || type === 'BOTH',
      isBilling:        type === 'BILLING'  || type === 'BOTH',
    };
  }

  fromDtoList(dtos: AddressDto[]): Address[] {
    return dtos.map(dto => this.fromDto(dto));
  }

  toCreateDto(payload: CreateAddressPayload): AddressDto {
    return {
      fullName:      payload.fullName,
      phoneNumber:   payload.phoneNumber,
      addressLine1:  payload.addressLine1,
      addressLine2:  payload.addressLine2,
      city:          payload.city,
      state:         payload.state,
      postalCode:    payload.postalCode,
      country:       payload.country,
      type:          payload.type ?? 'SHIPPING',
      isDefault:     payload.isDefault ?? false,
      customerEmail: payload.customerEmail,
      notes:         payload.notes,
    };
  }

  toUpdateDto(payload: UpdateAddressPayload): AddressDto {
    return {
      id:            payload.id,
      fullName:      payload.fullName      ?? '',
      phoneNumber:   payload.phoneNumber   ?? '',
      addressLine1:  payload.addressLine1  ?? '',
      addressLine2:  payload.addressLine2,
      city:          payload.city          ?? '',
      state:         payload.state         ?? '',
      postalCode:    payload.postalCode    ?? '',
      country:       payload.country       ?? '',
      type:          payload.type,
      isDefault:     payload.isDefault,
      customerEmail: payload.customerEmail,
      notes:         payload.notes,
    };
  }

  private buildFormattedAddress(dto: AddressDto): string {
    return [
      dto.addressLine1,
      dto.addressLine2,
      dto.city,
      dto.state,
      dto.postalCode,
      dto.country,
    ].filter(Boolean).join(', ');
  }

  private buildDisplayName(dto: AddressDto): string {
    return `${dto.fullName} — ${dto.addressLine1}, ${dto.city}`;
  }

  private buildShortAddress(dto: AddressDto): string {
    return `${dto.city}, ${dto.state} ${dto.postalCode}`;
  }
}