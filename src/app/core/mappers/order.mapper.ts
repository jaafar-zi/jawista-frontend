import { Injectable } from '@angular/core';
import {
  Order,
  OrderItem,
  CreateOrderPayload,
  OrderStatus,
  ORDER_STATUS_CONFIG,
  CANCELLABLE_STATUSES,
  DiscountCode,
} from '../models/order.model';
import { OrderDto } from '../../api/models/order-dto';
import { OrderItemDto } from '../../api/models/order-item-dto';

export interface RawOrderItem {
  id?: number;
  product?: {
    id?: number;
    nameKey?: string;
  };
  quantity?: number;
  unitPrice?: number;
  totalPrice?: number;
}

export interface RawOrderEntity {
  id?: number;
  orderNumber?: string;
  customerPhone?: string;
  customerEmail?: string;
  customerName?: string;
  status?: string;
  items?: Array<RawOrderItem>;
  discountCode?: DiscountCode;
  appliedDiscountCode?: string;
  discountAmount?: number;
  subtotal?: number;
  shippingCost?: number;
  tax?: number;
  total?: number;
  currency?: string;
  shippingAddress?: string;
  billingAddress?: string;
  createdAt?: string;
  updatedAt?: string;
}

@Injectable({ providedIn: 'root' })
export class OrderMapper {

  // ─── DTO → Domain ──────────────────────────────────────────────

  fromDto(dto: OrderDto): Order {
    const status = (dto.status ?? 'CONFIRMED') as OrderStatus;
    const config = ORDER_STATUS_CONFIG[status];

    return {
      id:             dto.id             ?? 0,
      orderNumber:    dto.orderNumber    ?? '',
      customerPhone:  dto.customerPhone  ?? '',
      customerEmail:  dto.customerEmail  ?? undefined,
      customerName:   dto.customerName   ?? '',
      status,

      items: (dto.items ?? []).map(this.mapItemFromDto),

      subtotal:     dto.subtotal     ?? 0,
      tax:          dto.tax          ?? 0,
      total:        dto.total        ?? 0,
      currency:     dto.currency     ?? 'TND',
      shippingCost: dto.shippingCost ?? 0,

      discountCode:        dto.discountCode        ?? undefined,
      appliedDiscountCode: dto.appliedDiscountCode ?? undefined,
      discountAmount:      dto.discountAmount      ?? undefined,

      shippingAddress: dto.shippingAddress ?? '',
      billingAddress:  dto.billingAddress  ?? '',

      createdAt: dto.createdAt ? new Date(dto.createdAt) : null,
      updatedAt: dto.updatedAt ? new Date(dto.updatedAt) : null,

      itemCount:      (dto.items ?? []).length,
      isConfirmed:    status === 'CONFIRMED',
      isDelivered:    status === 'DELIVERED',
      isCancelled:    status === 'CANCELLED',
      canBeCancelled: CANCELLABLE_STATUSES.includes(status),
      statusLabel:    config.label,
      statusColor:    config.color,
    };
  }

  // ─── Raw Entity → Domain ──────────────────────────────────────

  fromEntity(entity: RawOrderEntity): Order {
    const status = (entity.status ?? 'CONFIRMED') as OrderStatus;
    const config = ORDER_STATUS_CONFIG[status];

    return {
      id:             entity.id             ?? 0,
      orderNumber:    entity.orderNumber    ?? '',
      customerPhone:  entity.customerPhone  ?? '',
      customerEmail:  entity.customerEmail  ?? undefined,
      customerName:   entity.customerName   ?? '',
      status,

      items: (entity.items ?? []).map(this.mapRawItem),

      subtotal:     entity.subtotal     ?? 0,
      tax:          entity.tax          ?? 0,
      total:        entity.total        ?? 0,
      currency:     entity.currency     ?? 'TND',
      shippingCost: entity.shippingCost ?? 0,

      discountCode:        entity.discountCode        ?? undefined,
      appliedDiscountCode: entity.appliedDiscountCode ?? undefined,
      discountAmount:      entity.discountAmount      ?? undefined,

      shippingAddress: entity.shippingAddress ?? '',
      billingAddress:  entity.billingAddress  ?? '',

      createdAt: entity.createdAt ? new Date(entity.createdAt) : null,
      updatedAt: entity.updatedAt ? new Date(entity.updatedAt) : null,

      itemCount:      (entity.items ?? []).length,
      isConfirmed:    status === 'CONFIRMED',
      isDelivered:    status === 'DELIVERED',
      isCancelled:    status === 'CANCELLED',
      canBeCancelled: CANCELLABLE_STATUSES.includes(status),
      statusLabel:    config.label,
      statusColor:    config.color,
    };
  }

  // ─── Domain List ───────────────────────────────────────────────

  fromDtoList(dtos: OrderDto[]): Order[] {
    return dtos.map(dto => this.fromDto(dto));
  }

  // ─── Domain → Create DTO ───────────────────────────────────────

  toCreateDto(payload: CreateOrderPayload): OrderDto {
    return {
      customerPhone:   payload.customerPhone,
      customerEmail:   payload.customerEmail,
      customerName:    payload.customerName,
      items:           payload.items.map(this.mapItemToDto),
      shippingAddress: payload.shippingAddress,
      billingAddress:  payload.billingAddress,
      currency:        payload.currency ?? 'TND',
      shippingCost:    payload.shippingCost,

    };
  }

  // ─── Private Helpers ───────────────────────────────────────────

  private mapItemFromDto(item: OrderItemDto): OrderItem {
    return {
      productId:   item.productId   ?? 0,
      productName: item.productName ?? '',
      quantity:    item.quantity    ?? 0,
      unitPrice:   item.unitPrice   ?? 0,
      totalPrice:  item.totalPrice  ?? 0,
    };
  }

  private mapRawItem(item: RawOrderItem): OrderItem {
    return {
      productId:   item.product?.id       ?? 0,
      productName: item.product?.nameKey  ?? '',
      quantity:    item.quantity          ?? 0,
      unitPrice:   item.unitPrice         ?? 0,
      totalPrice:  item.totalPrice        ?? 0,
    };
  }

  private mapItemToDto(item: CreateOrderPayload['items'][0]): OrderItemDto {
    return {
      productId:   item.productId,
      productName: item.productName,
      quantity:    item.quantity,
      unitPrice:   item.unitPrice,
    };
  }
}