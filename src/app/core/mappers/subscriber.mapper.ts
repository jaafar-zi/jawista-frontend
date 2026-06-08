import { Injectable } from '@angular/core';
import { SubscriberDto } from '../../api/models/subscriber-dto';
import {
  Subscriber,
  SubscriberStatusColor,
  SubscribePayload,
} from '../models/subscriber.model';

@Injectable({ providedIn: 'root' })
export class SubscriberMapper {

  // ─── DTO → Domain ────────────────────────────────────────────

  fromDto(dto: SubscriberDto): Subscriber {
    const active = dto.active ?? false;

    return {
      id:          dto.id ?? 0,
      name:        dto.name,
      email:       dto.email,
      active,
      // computed
      initials:    this.buildInitials(dto.name),
      statusLabel: active ? 'Active' : 'Inactive',
      statusColor: (active ? 'success' : 'danger') as SubscriberStatusColor,
    };
  }

  fromDtoList(dtos: SubscriberDto[]): Subscriber[] {
    return dtos.map(dto => this.fromDto(dto));
  }

  // ─── Domain → DTO ────────────────────────────────────────────

  toSubscribeDto(payload: SubscribePayload): SubscriberDto {
    return {
      name:   payload.name,
      email:  payload.email,
      active: true,
    };
  }

  // ─── Private Helpers ─────────────────────────────────────────

  private buildInitials(name: string): string {
    return name
      .split(' ')
      .map(part => part.charAt(0).toUpperCase())
      .slice(0, 2)
      .join('');
  }
}