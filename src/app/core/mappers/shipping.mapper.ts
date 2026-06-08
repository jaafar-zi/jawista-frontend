// src/app/core/mappers/shipping.mapper.ts

import { Injectable } from '@angular/core';
import { ShippingDto } from '../../api/models/shipping-dto';
import { ShippingStatusDto } from '../../api/models/shipping-status-dto';
import { ShippingStatusUpdateRequest } from '../../api/models/shipping-status-update-request';
import { CreateShippingRequest } from '../../api/models/create-shipping-request';
import { AddressDto } from '../../api/models/address-dto';
import {
  Shipping,
  ShippingStatusEntry,
  ShippingStatusColor,
  CreateShippingPayload,
  UpdateShippingPayload,
  UpdateShippingStatusPayload,
  SHIPPING_STATUS_CONFIG,
} from '../models/shipping.model';
import { Address } from '../models/address.model';

@Injectable({ providedIn: 'root' })
export class ShippingMapper {

  fromDto(dto: ShippingDto): Shipping {
    const statusHistory = (dto.statusHistory ?? [])
      .map(s => this.mapStatusEntryFromDto(s))
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

    const currentStatus = dto.currentStatus ?? 'PENDING';
    const config = SHIPPING_STATUS_CONFIG[currentStatus] ?? {
      label: currentStatus,
      color: 'warning' as ShippingStatusColor,
      step: 0,
    };

    const estimatedDelivery = dto.estimatedDeliveryDate
      ? new Date(dto.estimatedDeliveryDate)
      : null;

    return {
      id:                    dto.id ?? 0,
      trackingNumber:        dto.trackingNumber ?? '',
      orderId:               dto.orderId,
      orderNumber:           dto.orderNumber ?? '',
      shippingAddress:       this.mapAddressFromDto(dto.shippingAddress),
      shippingMethod:        dto.shippingMethod,
      currentStatus,
      carrier:               dto.carrier,
      shippingCost:          dto.shippingCost ?? 0,
      weight:                dto.weight ?? 0,
      estimatedDeliveryDate: estimatedDelivery,
      actualDeliveryDate:    dto.actualDeliveryDate
                               ? new Date(dto.actualDeliveryDate)
                               : null,
      shippedDate:           dto.shippedDate
                               ? new Date(dto.shippedDate)
                               : null,
      specialInstructions:   dto.specialInstructions ?? '',
      notes:                 dto.notes ?? '',
      statusHistory,
      createdAt:             dto.createdAt ? new Date(dto.createdAt) : null,
      updatedAt:             dto.updatedAt ? new Date(dto.updatedAt) : null,
      isDelivered:           currentStatus === 'DELIVERED',
      isFailed:              currentStatus === 'FAILED',
      isInTransit:           ['PICKED_UP', 'IN_TRANSIT',
                              'OUT_FOR_DELIVERY'].includes(currentStatus),
      statusLabel:           config.label,
      statusColor:           config.color,
      deliveryStep:          config.step,
      latestStatus:          statusHistory[0] ?? null,
      daysUntilDelivery:     this.calcDaysUntilDelivery(estimatedDelivery),
      isOverdue:             this.calcIsOverdue(estimatedDelivery, currentStatus),
    };
  }

  fromDtoList(dtos: ShippingDto[]): Shipping[] {
    return dtos.map(dto => this.fromDto(dto));
  }

  toCreateRequest(payload: CreateShippingPayload): CreateShippingRequest {
    return {
      orderId:             payload.orderId,
      shippingAddressId:   payload.shippingAddressId,
      shippingMethod:      payload.shippingMethod,
      carrier:             payload.carrier,
      shippingCost:        payload.shippingCost,
      weight:              payload.weight,
      specialInstructions: payload.specialInstructions,
      notes:               payload.notes,
    };
  }

  toUpdateDto(payload: UpdateShippingPayload): ShippingDto {
    return {
      trackingNumber:        payload.trackingNumber,
      carrier:               payload.carrier ?? '',
      shippingMethod:        payload.shippingMethod ?? '',
      shippingCost:          payload.shippingCost,
      weight:                payload.weight,
      specialInstructions:   payload.specialInstructions,
      notes:                 payload.notes,
      estimatedDeliveryDate: payload.estimatedDeliveryDate?.toISOString(),
      orderId:               0,
      shippingAddress:       {} as AddressDto,
    };
  }

  toStatusUpdateRequest(
    payload: UpdateShippingStatusPayload
  ): ShippingStatusUpdateRequest {
    return {
      status:      payload.status,
      location:    payload.location,
      description: payload.description,
      notes:       payload.notes,
      updatedBy:   payload.updatedBy,
    };
  }

  private mapStatusEntryFromDto(dto: ShippingStatusDto): ShippingStatusEntry {
    return {
      id:          dto.id ?? 0,
      shippingId:  dto.shippingId,
      status:      dto.status,
      location:    dto.location,
      timestamp:   new Date(dto.timestamp),
      description: dto.description ?? '',
      notes:       dto.notes ?? '',
      updatedBy:   dto.updatedBy ?? '',
      createdAt:   dto.createdAt ? new Date(dto.createdAt) : null,
    };
  }

  private mapAddressFromDto(dto: AddressDto): Address {
    return {
      id:               dto.id ?? 0,
      fullName:         dto.fullName ?? '',
      phoneNumber:      dto.phoneNumber ?? '',
      addressLine1:     dto.addressLine1 ?? '',
      addressLine2:     dto.addressLine2 ?? '',
      city:             dto.city ?? '',
      state:            dto.state ?? '',
      postalCode:       dto.postalCode ?? '',
      country:          dto.country ?? '',
      type:             (dto.type as any) ?? 'SHIPPING',
      isDefault:        dto.isDefault ?? false,
      customerEmail:    dto.customerEmail ?? '',
      notes:            dto.notes ?? '',
      formattedAddress: dto.formattedAddress ?? '',
      createdAt:        dto.createdAt ? new Date(dto.createdAt) : null,
      updatedAt:        dto.updatedAt ? new Date(dto.updatedAt) : null,
      displayName:      `${dto.fullName} — ${dto.addressLine1}`,
      shortAddress:     `${dto.city}, ${dto.state} ${dto.postalCode}`,
      isShipping:       true,
      isBilling:        false,
    };
  }

  private calcDaysUntilDelivery(date: Date | null): number | null {
    if (!date) return null;
    const diff = date.getTime() - new Date().getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  }

  private calcIsOverdue(date: Date | null, status: string): boolean {
    if (!date) return false;
    if (['DELIVERED', 'RETURNED'].includes(status)) return false;
    return new Date() > date;
  }
}