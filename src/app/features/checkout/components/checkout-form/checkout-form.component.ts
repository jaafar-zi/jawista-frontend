import {
  Component,
  Input,
  Output,
  EventEmitter,
  ChangeDetectionStrategy,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TranslocoService } from '@jsverse/transloco';
import { CheckoutFormData } from '../../../../core/models/checkout.model';
import {
  TUNISIA_CITIES,
  CityData,
} from '../../../../core/constants/cities.constants';

@Component({
  selector: 'app-checkout-form',
  standalone: false,
  templateUrl: './checkout-form.component.html',
  styleUrls: ['./checkout-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CheckoutFormComponent {

  @Input() isSubmitting = false;

  @Output() formSubmit = new EventEmitter<CheckoutFormData>();
  @Output() shippingCalculated = new EventEmitter<number>();

  readonly cities = TUNISIA_CITIES;
  checkoutForm: FormGroup;

  constructor(
    private readonly fb: FormBuilder,
    private readonly transloco: TranslocoService,
  ) {
    this.checkoutForm = this.fb.group({
      phone: ['', [
        Validators.required,
        Validators.pattern(/^[+]?[\d\s-]{8,15}$/),
      ]],
      email: ['', [
        Validators.email,
      ]],
      name: ['', [
        Validators.required,
        Validators.minLength(2),
      ]],
      address: ['', [
        Validators.required,
        Validators.minLength(5),
      ]],
      city: ['', [
        Validators.required,
      ]],
      province: [{ value: '', disabled: true }],
    });
  }

  get phone()    { return this.checkoutForm.get('phone'); }
  get email()    { return this.checkoutForm.get('email'); }
  get name()     { return this.checkoutForm.get('name'); }
  get address()  { return this.checkoutForm.get('address'); }
  get city()     { return this.checkoutForm.get('city'); }
  get province() { return this.checkoutForm.get('province'); }

  onCityChange(): void {
    const selectedCity = this.city?.value;
    const match = this.cities.find((c: CityData) => c.city === selectedCity);

    if (match) {
      this.checkoutForm.patchValue({ province: match.province });
      this.shippingCalculated.emit(8);
    } else {
      this.checkoutForm.patchValue({ province: '' });
    }
  }

  getErrorMessage(field: string): string {
    const control = this.checkoutForm.get(field);
    if (!control || !control.errors || !control.touched) return '';

    if (control.errors['required']) {
      return this.transloco.translate(`checkout.form.errors.${field}Required`);
    }
    if (control.errors['minlength']) {
      return this.transloco.translate(`checkout.form.errors.${field}MinLength`);
    }
    if (control.errors['pattern']) {
      return this.transloco.translate(`checkout.form.errors.${field}Invalid`);
    }
    if (control.errors['email']) {
      return this.transloco.translate(`checkout.form.errors.emailInvalid`);
    }

    return '';
  }

  onSubmit(): void {
    if (this.checkoutForm.invalid || this.isSubmitting) {
      this.checkoutForm.markAllAsTouched();
      return;
    }

    this.formSubmit.emit(this.checkoutForm.getRawValue());
  }
}