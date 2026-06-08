// src/app/layout/components/community-modal/community-modal.component.ts

import {
  Component,
  OnInit,
  OnDestroy,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Inject,
  PLATFORM_ID,
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TranslocoModule } from '@jsverse/transloco';
import { finalize, switchMap } from 'rxjs';
import { SESSION_KEYS } from '../../core/constants/preferences.constants';
import { DiscountType } from '../../core/models/order.model';
import { OrderService } from '../../core/services/order.service';
import { SessionStorageService } from '../../core/services/session-storage.service';
import { SubscriberService } from '../../core/services/subscriber.service';
import { SharedModule } from '../../shared/shared.module';


@Component({
  selector: 'app-community-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TranslocoModule, SharedModule],
  templateUrl: './community-modal.component.html',
  styleUrls: ['./community-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CommunityModalComponent implements OnInit, OnDestroy {
  isVisible = false;
  isClosing = false;
  submitted = false;
  submitting = false;
  errorMessage: string | null = null;
  generatedCode: string | null = null;

  form: FormGroup;

  private triggerTimer: ReturnType<typeof setTimeout> | null = null;

  private readonly DEFAULT_DISCOUNT: {
    discountType: DiscountType;
    discountValue: number;
    maxUses: number;
    maxUsesPerCustomer: number;
  } = {
    discountType: 'PERCENTAGE',
    discountValue: 10,
    maxUses: 1,
    maxUsesPerCustomer: 1,
  };

  constructor(
    private readonly fb: FormBuilder,
    private readonly cdr: ChangeDetectorRef,
    private readonly subscriberService: SubscriberService,
    private readonly orderService: OrderService,
    private readonly sessionStorage: SessionStorageService,
    @Inject(PLATFORM_ID) private readonly platformId: Object,
  ) {
    this.form = this.fb.group({
      nameSurname: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      prefix: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(10),
          Validators.pattern(/^[a-zA-Z0-9]+$/),
        ],
      ],
    });
  }

  ngOnInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    // ── Skip if already dismissed this session ────────────────────
    if (this.sessionStorage.has(SESSION_KEYS.communityModalDismissed)) {
      return;
    }

    this.triggerTimer = setTimeout(() => {
      // Double-check in case user navigated and dismissed on another page
      if (!this.sessionStorage.has(SESSION_KEYS.communityModalDismissed)) {
        this.open();
      }
    }, 5000);
  }

  ngOnDestroy(): void {
    if (this.triggerTimer) {
      clearTimeout(this.triggerTimer);
      this.triggerTimer = null;
    }
  }

  open(): void {
    this.isVisible = true;
    this.isClosing = false;
    this.cdr.markForCheck();
  }

  close(): void {
    this.isClosing = true;
    this.cdr.markForCheck();

    // ── Mark as dismissed for this session ─────────────────────────
    this.sessionStorage.set(SESSION_KEYS.communityModalDismissed, 'true');

    setTimeout(() => {
      this.isVisible = false;
      this.isClosing = false;
      this.resetState();
      this.cdr.markForCheck();
    }, 400);
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.cdr.markForCheck();
      return;
    }

    this.submitting = true;
    this.submitted = false;
    this.generatedCode = null;
    this.errorMessage = null;
    this.cdr.markForCheck();

    const { nameSurname, email, prefix } = this.form.getRawValue();

    this.subscriberService
      .subscribe({ name: nameSurname, email })
      .pipe(
        switchMap(() =>
          this.orderService.createDiscountCode({
            userPrefix: String(prefix).toUpperCase(),
            discountType: this.DEFAULT_DISCOUNT.discountType,
            discountValue: this.DEFAULT_DISCOUNT.discountValue,
            maxUses: this.DEFAULT_DISCOUNT.maxUses,
            maxUsesPerCustomer: this.DEFAULT_DISCOUNT.maxUsesPerCustomer,
          })
        ),
        finalize(() => {
          this.submitting = false;
          this.cdr.markForCheck();
        }),
      )
      .subscribe({
        next: discountCode => {
          this.submitted = true;
          this.generatedCode = discountCode?.code ?? null;
          this.errorMessage = null;

          // ── Also mark dismissed after successful submission ──────
          this.sessionStorage.set(SESSION_KEYS.communityModalDismissed, 'true');

          this.cdr.markForCheck();
        },
        error: (err: unknown) => {
          this.submitted = false;
          this.generatedCode = null;
          this.errorMessage = this.resolveErrorMessage(err);
          this.cdr.markForCheck();
        },
      });
  }

  onOverlayClick(event: MouseEvent): void {
    if ((event.target as HTMLElement).classList.contains('modal-overlay')) {
      this.close();
    }
  }

  get nameSurname() { return this.form.get('nameSurname'); }
  get email()       { return this.form.get('email'); }
  get prefix()      { return this.form.get('prefix'); }

  getNameError(): string {
    if (!this.nameSurname?.touched || !this.nameSurname?.invalid) return '';
    return 'communityModal.nameError';
  }

  getEmailError(): string {
    if (!this.email?.touched || !this.email?.invalid) return '';
    return 'communityModal.emailError';
  }

  getPrefixError(): string {
    if (!this.prefix?.touched || !this.prefix?.invalid) return '';
    if (this.prefix?.errors?.['required'])  return 'communityModal.prefixRequired';
    if (this.prefix?.errors?.['minlength']) return 'communityModal.prefixMinLength';
    if (this.prefix?.errors?.['pattern'])   return 'communityModal.prefixPattern';
    return '';
  }

  private resolveErrorMessage(err: unknown): string {
    if (!err) return 'Something went wrong. Please try again.';
    if (err instanceof Error) return err.message || 'Something went wrong. Please try again.';
    if (typeof err === 'string') return err;
    if (typeof err === 'object') {
      const anyErr = err as any;
      return (
        anyErr?.error?.message ||
        anyErr?.error?.error ||
        anyErr?.message ||
        'Something went wrong. Please try again.'
      );
    }
    return 'Something went wrong. Please try again.';
  }

  private resetState(): void {
    this.submitted = false;
    this.submitting = false;
    this.errorMessage = null;
    this.generatedCode = null;
    this.form.reset();
  }
}