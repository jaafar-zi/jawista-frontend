// shared/services/validation-message.service.ts

import { Injectable } from '@angular/core';
import { TranslocoService } from '@jsverse/transloco';
import { AbstractControl } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class ValidationMessageService {

  constructor(private transloco: TranslocoService) {}

  getErrorMessage(
    control: AbstractControl | null,
    fieldKey?: string
  ): string {
    if (!control || !control.errors) {
      return '';
    }

    if (control.hasError('required')) {
      return this.transloco.translate('checkout.validation.required');
    }

    if (control.hasError('email')) {
      return this.transloco.translate('checkout.validation.email');
    }

    if (control.hasError('minlength')) {
      const minLength = control.errors['minlength'].requiredLength;
      return this.transloco.translate('checkout.validation.minLength', {
        minLength
      });
    }

    if (control.hasError('pattern')) {
      if (fieldKey === 'postalCode') {
        return this.transloco.translate('checkout.validation.postalCode');
      }
      if (fieldKey === 'phone') {
        return this.transloco.translate('checkout.validation.phone');
      }
    }

    return '';
  }
}