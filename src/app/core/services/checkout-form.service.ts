// src/app/core/services/checkout-form.service.ts

import { Injectable } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl,
} from '@angular/forms';
import { AddressSnapshot } from '../models/checkout.model';

@Injectable()
export class CheckoutFormService {

  constructor(private readonly fb: FormBuilder) {}

  // ─── Form Builder ─────────────────────────────────────────────

  buildCheckoutForm(): FormGroup {
    return this.fb.group({
      // Contact
      email:       ['', [Validators.required, Validators.email]],
      emailOffers: [false],

      // Delivery
      firstName:  ['', [Validators.required, Validators.minLength(2)]],
      lastName:   ['', [Validators.required, Validators.minLength(2)]],
      company:    [''],
      address:    ['', [Validators.required, Validators.minLength(5)]],
      apartment:  [''],
      city:       ['', [Validators.required, Validators.minLength(2)]],
      province:   ['', [Validators.required]],
      postalCode: ['', [Validators.required, Validators.pattern(/^\d{4}$/)]],
      phone:      ['', [Validators.pattern(/^[0-9]{10}$/)]],
    });
  }

  // ─── Validation Helpers ───────────────────────────────────────

  isAddressComplete(form: FormGroup): boolean {
    return !!(
      form.get('address')?.valid &&
      form.get('city')?.valid &&
      form.get('province')?.valid &&
      form.get('postalCode')?.valid
    );
  }

  markAllTouched(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      control?.markAsTouched();
      if (control instanceof FormGroup) {
        this.markAllTouched(control);
      }
    });
  }

  hasError(
    form:        FormGroup,
    controlName: string,
    errorName:   string
  ): boolean {
    const control = form.get(controlName);
    return !!(control?.hasError(errorName) && control?.touched);
  }

  // ─── Address Snapshot ─────────────────────────────────────────

  getAddressSnapshot(form: FormGroup): AddressSnapshot {
    return {
      address:    form.get('address')?.value   ?? '',
      city:       form.get('city')?.value      ?? '',
      province:   form.get('province')?.value  ?? '',
      postalCode: form.get('postalCode')?.value ?? '',
    };
  }

  // ─── Form Data Helpers ────────────────────────────────────────

  prefillFromAddress(
    form:    FormGroup,
    address: Partial<{
      fullName:     string;
      addressLine1: string;
      addressLine2: string;
      city:         string;
      state:        string;
      postalCode:   string;
      phoneNumber:  string;
    }>
  ): void {
    const nameParts = (address.fullName ?? '').split(' ');

    form.patchValue({
      firstName:  nameParts[0] ?? '',
      lastName:   nameParts.slice(1).join(' ') ?? '',
      address:    address.addressLine1  ?? '',
      apartment:  address.addressLine2  ?? '',
      city:       address.city          ?? '',
      province:   address.state         ?? '',
      postalCode: address.postalCode    ?? '',
      phone:      address.phoneNumber   ?? '',
    });
  }
}