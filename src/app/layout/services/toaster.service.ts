import { Injectable, signal, computed } from '@angular/core';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface Toast {
  id: string;
  type: ToastType;
  message: string;
  duration: number;
}

@Injectable({ providedIn: 'root' })
export class ToastService {

  private readonly _toasts = signal<Toast[]>([]);
  readonly toasts = this._toasts.asReadonly();

  private show(
    message: string,
    type: ToastType,
    duration = 4000
  ): void {
    const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2)}`;

    const toast: Toast = { id, type, message, duration };

    this._toasts.update(current => [...current, toast]);

    setTimeout(() => this.dismiss(id), duration);
  }

  success(message: string, duration?: number): void {
    this.show(message, 'success', duration);
  }

  error(message: string, duration?: number): void {
    this.show(message, 'error', duration);
  }

  info(message: string, duration?: number): void {
    this.show(message, 'info', duration);
  }

  warning(message: string, duration?: number): void {
    this.show(message, 'warning', duration);
  }

  dismiss(id: string): void {
    this._toasts.update(current => current.filter(t => t.id !== id));
  }

  clear(): void {
    this._toasts.set([]);
  }
}