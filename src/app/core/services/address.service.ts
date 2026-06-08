// src/app/core/services/address.service.ts

import { Injectable, inject, signal, computed } from '@angular/core';
import { Observable, tap, catchError, throwError, map } from 'rxjs';
import { AddressControllerService } from '../../api/services/address-controller.service';
import { AddressMapper } from '../mappers/address.mapper';
import {
  Address,
  AddressType,
  CreateAddressPayload,
  UpdateAddressPayload,
  SetDefaultAddressPayload,
} from '../models/address.model';

@Injectable({ providedIn: 'root' })
export class AddressService {

  // ─── Dependencies ─────────────────────────────────────────────
  private readonly api    = inject(AddressControllerService);
  private readonly mapper = inject(AddressMapper);

  // ─── State ────────────────────────────────────────────────────
  private readonly _addresses      = signal<Address[]>([]);
  private readonly _selected       = signal<Address | null>(null);
  private readonly _defaultAddress = signal<Address | null>(null);
  private readonly _loading        = signal(false);
  private readonly _error          = signal<string | null>(null);

  // ─── Public Readonly State ────────────────────────────────────
  readonly addresses      = this._addresses.asReadonly();
  readonly selected       = this._selected.asReadonly();
  readonly defaultAddress = this._defaultAddress.asReadonly();
  readonly loading        = this._loading.asReadonly();
  readonly error          = this._error.asReadonly();

  // ─── Computed ─────────────────────────────────────────────────
  readonly shippingAddresses = computed(() =>
    this._addresses().filter(a => a.isShipping)
  );

  readonly billingAddresses = computed(() =>
    this._addresses().filter(a => a.isBilling)
  );

  readonly totalAddresses = computed(() =>
    this._addresses().length
  );

  readonly hasAddresses = computed(() =>
    this._addresses().length > 0
  );

  readonly hasDefault = computed(() =>
    this._addresses().some(a => a.isDefault)
  );

  // ─── API Methods ──────────────────────────────────────────────

  getById(id: number): Observable<Address> {
    this._loading.set(true);
    this._error.set(null);

    return this.api.getAddress({ id }).pipe(
      map(dto => this.mapper.fromDto(dto)),
      tap(address => {
        this._selected.set(address);
        this._loading.set(false);
      }),
      catchError(err =>
        this.handleError(`Failed to load address #${id}`, err)
      )
    );
  }

  getByCustomerEmail(email: string): Observable<Address[]> {
    this._loading.set(true);
    this._error.set(null);

    return this.api.getCustomerAddresses({ email }).pipe(
      map(dtos => this.mapper.fromDtoList(dtos)),
      tap(addresses => {
        this._addresses.set(addresses);
        const defaultAddr = addresses.find(a => a.isDefault) ?? null;
        this._defaultAddress.set(defaultAddr);
        this._loading.set(false);
      }),
      catchError(err =>
        this.handleError(`Failed to load addresses for ${email}`, err)
      )
    );
  }

  getByEmailAndType(
    email: string,
    type:  AddressType
  ): Observable<Address[]> {
    this._loading.set(true);
    this._error.set(null);

    return this.api.getCustomerAddressesByType({ email, type }).pipe(
      map(dtos => this.mapper.fromDtoList(dtos)),
      tap(addresses => {
        this._addresses.set(addresses);
        this._loading.set(false);
      }),
      catchError(err =>
        this.handleError(
          `Failed to load ${type} addresses for ${email}`,
          err
        )
      )
    );
  }

  getDefaultByEmail(email: string): Observable<Address> {
    this._loading.set(true);
    this._error.set(null);

    return this.api.getDefaultAddress({ email }).pipe(
      map(dto => this.mapper.fromDto(dto)),
      tap(address => {
        this._defaultAddress.set(address);
        this._loading.set(false);
      }),
      catchError(err =>
        this.handleError(
          `Failed to load default address for ${email}`,
          err
        )
      )
    );
  }

  create(payload: CreateAddressPayload): Observable<Address> {
    this._loading.set(true);
    this._error.set(null);

    const dto = this.mapper.toCreateDto(payload);

    return this.api.createAddress({ body: dto }).pipe(
      map(result => this.mapper.fromDto(result)),
      tap(address => {
        this._addresses.update(list => [...list, address]);

        // Set as default if first address or explicitly set
        if (address.isDefault || this._addresses().length === 1) {
          this._defaultAddress.set(address);
        }
        this._loading.set(false);
      }),
      catchError(err =>
        this.handleError('Failed to create address', err)
      )
    );
  }

  update(payload: UpdateAddressPayload): Observable<Address> {
    this._loading.set(true);
    this._error.set(null);

    const dto = this.mapper.toUpdateDto(payload);

    return this.api.updateAddress({ id: payload.id, body: dto }).pipe(
      map(result => this.mapper.fromDto(result)),
      tap(updated => {
        this._addresses.update(list =>
          list.map(a => a.id === updated.id ? updated : a)
        );

        if (this._selected()?.id === updated.id) {
          this._selected.set(updated);
        }

        if (updated.isDefault) {
          this._defaultAddress.set(updated);
        }

        this._loading.set(false);
      }),
      catchError(err =>
        this.handleError(`Failed to update address #${payload.id}`, err)
      )
    );
  }

  delete(id: number): Observable<void> {
    this._loading.set(true);
    this._error.set(null);

    return this.api.deleteAddress({ id }).pipe(
      tap(() => {
        this._addresses.update(list =>
          list.filter(a => a.id !== id)
        );

        if (this._selected()?.id === id) {
          this._selected.set(null);
        }

        if (this._defaultAddress()?.id === id) {
          // Promote next available address as default
          const next = this._addresses().find(a => a.id !== id) ?? null;
          this._defaultAddress.set(next);
        }

        this._loading.set(false);
      }),
      catchError(err =>
        this.handleError(`Failed to delete address #${id}`, err)
      )
    );
  }

  setDefault(payload: SetDefaultAddressPayload): Observable<Address> {
    this._loading.set(true);
    this._error.set(null);

    return this.api.setDefaultAddress({
      id:            payload.id,
      customerEmail: payload.customerEmail,
    }).pipe(
      map(dto => this.mapper.fromDto(dto)),
      tap(updated => {
        // Unmark all, then mark the updated one
        this._addresses.update(list =>
          list.map(a => ({
            ...a,
            isDefault: a.id === updated.id,
          }))
        );
        this._defaultAddress.set(updated);
        this._loading.set(false);
      }),
      catchError(err =>
        this.handleError(
          `Failed to set default address #${payload.id}`,
          err
        )
      )
    );
  }

  // ─── Local State Helpers ──────────────────────────────────────

  selectAddress(address: Address | null): void {
    this._selected.set(address);
  }

  clearAddresses(): void {
    this._addresses.set([]);
    this._selected.set(null);
    this._defaultAddress.set(null);
  }

  clearError(): void {
    this._error.set(null);
  }

  findById(id: number): Address | undefined {
    return this._addresses().find(a => a.id === id);
  }

  filterByType(type: AddressType): Address[] {
    return this._addresses().filter(a => a.type === type);
  }

  // ─── Private ─────────────────────────────────────────────────

  private handleError(
    message: string,
    err:     unknown
  ): Observable<never> {
    this._error.set(message);
    this._loading.set(false);
    console.error(`[AddressService] ${message}:`, err);
    return throwError(() => err);
  }
}