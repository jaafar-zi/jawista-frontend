import {
  Component,
  ChangeDetectionStrategy,
} from '@angular/core';
import { ToastService, Toast, ToastType } from '../../services/toaster.service';

@Component({
  selector: 'app-toast',
  standalone: false,
  templateUrl: './toast.component.html',
  styleUrls: ['./toast.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ToastComponent {

  constructor(readonly toastService: ToastService) {}

  trackById(_: number, toast: Toast): string {
    return toast.id;
  }

  dismiss(id: string): void {
    this.toastService.dismiss(id);
  }

  getIcon(type: ToastType): string {
    const icons: Record<ToastType, string> = {
      success: '✓',
      error:   '✕',
      warning: '⚠',
      info:    'ℹ',
    };
    return icons[type];
  }
}