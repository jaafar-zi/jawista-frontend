export type ButtonVariant = 'primary' | 'outline' | 'text';
export type ButtonType = 'button' | 'submit' | 'reset';
export type ButtonSize = 'small' | 'medium' | 'large';

export interface ButtonConfig {
  variant?: ButtonVariant;
  type?: ButtonType;
  size?: ButtonSize;
  disabled?: boolean;
  fullWidth?: boolean;
  loading?: boolean;
}