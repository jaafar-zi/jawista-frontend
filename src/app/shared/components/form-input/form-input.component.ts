import {
  Component,
  Input,
  forwardRef,
  ChangeDetectionStrategy,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-form-input',
  standalone: false,
  templateUrl: './form-input.component.html',
  styleUrls: ['./form-input.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FormInputComponent),
      multi: true,
    },
  ],
})
export class FormInputComponent implements ControlValueAccessor {
  @Input() type: 'text' | 'email' | 'tel' | 'password' | 'number' = 'text';
  @Input() placeholder = '';
  @Input() errorMessage = '';
  @Input() invalid: boolean | null | undefined = false;
  @Input() variant: 'default' | 'underline' = 'default';

  value = '';
  touched = false;
  disabled = false;

  private onChange: (value: string) => void = () => {};
  private onTouched: () => void = () => {};

  get showError(): boolean {
    return (this.touched || !!this.invalid) && !!this.invalid && !!this.errorMessage;
  }

  writeValue(value: string): void {
    this.value = value ?? '';
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  onInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.value = input.value;
    this.onChange(this.value);
  }

  onBlur(): void {
    this.touched = true;
    this.onTouched();
  }
}