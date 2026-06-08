import { Component, Input, Output, EventEmitter, HostBinding } from '@angular/core';

export type ButtonVariant = 'primary' | 'outline' | 'text';
export type ButtonType = 'button' | 'submit' | 'reset';
export type ButtonSize = 'small' | 'medium' | 'large';

@Component({
  selector: 'app-button',
  standalone: false,
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss']
})
export class ButtonComponent {
  @Input() variant: ButtonVariant = 'outline';
  @Input() type: ButtonType = 'button';
  @Input() size: ButtonSize = 'medium';
  @Input() disabled = false;
  @Input() loading = false;
  @Input() href?: string;
  @Input() routerLink?: string | any[];
  @Input() target?: string;
  @Input() rel?: string;
  @Input() ariaLabel?: string;
  @Input() customClass = '';
  @Input() fullWidth = false;
  @Input() iconLeft?: string;
  @Input() iconRight?: string;
  @Input() showContentWhileLoading = false;

  @Output() clicked = new EventEmitter<Event>();

  @HostBinding('class.full-width')
  get hostFullWidth(): boolean {
    return this.fullWidth;
  }

  get buttonClasses(): string {
    const baseStyles = [
      'inline-flex',
      'items-center',
      'justify-center',
      'gap-2',
      'text-center',
      'uppercase',
      'tracking-[0.1em]',
      'transition-all',
      'duration-200',
      'leading-none',
      'whitespace-nowrap'
    ].join(' ');

    const sizeStyles = this.getSizeStyles();
    const variantStyles = this.getVariantStyles();
    const widthStyles = this.fullWidth ? 'w-full' : '';
    const disabledStyles = this.isDisabled
      ? 'opacity-50 cursor-not-allowed pointer-events-none'
      : 'cursor-pointer';

    return `${baseStyles} ${sizeStyles} ${variantStyles} ${widthStyles} ${disabledStyles} ${this.customClass}`.trim();
  }

  get isExternalLink(): boolean {
    return !!this.href && !this.routerLink;
  }

  get isRouterLink(): boolean {
    return !!this.routerLink && !this.href;
  }

  get isDisabled(): boolean {
    return this.disabled || this.loading;
  }

  private getSizeStyles(): string {
    const sizes: Record<ButtonSize, string> = {
      small: 'px-3 py-2 min-h-[40px] text-xs sm:px-4',
      medium: 'px-3 py-3 min-h-[44px] text-sm sm:px-4',
      large: 'px-3 py-3 min-h-[48px] text-base sm:px-4 sm:min-h-[52px] md:px-5'
    };

    return sizes[this.size] || sizes.medium;
  }

  private getVariantStyles(): string {
    const variants: Record<ButtonVariant, string> = {
      primary: 'bg-black text-white hover:bg-gray-800 active:bg-gray-900',
      outline: 'border border-black bg-transparent hover:bg-black hover:text-white active:bg-gray-900',
      text: 'hover:opacity-60 active:opacity-40'
    };

    return variants[this.variant] || variants.outline;
  }

  onClick(event: Event): void {
    if (!this.isDisabled) {
      this.clicked.emit(event);
    } else {
      event.preventDefault();
      event.stopPropagation();
    }
  }
}