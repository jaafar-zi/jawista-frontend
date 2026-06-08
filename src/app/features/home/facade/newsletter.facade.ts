// src/app/features/home/facade/newsletter.facade.ts

import { Injectable, OnDestroy, signal, computed } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { NewsletterStatus, NewsletterSubscription } from '../../../core/models/news-letter.model';
import { NewsletterService } from '../../../layout/services/newsletter.service';

@Injectable()
export class NewsletterFacade implements OnDestroy {

  // ─── State ────────────────────────────────────────────────────
  private readonly _status  = signal<NewsletterStatus>('idle');
  private readonly _message = signal<string | null>(null);

  // ─── Public Readonly State ────────────────────────────────────
  readonly status  = this._status.asReadonly();
  readonly message = this._message.asReadonly();

  // ─── Computed ─────────────────────────────────────────────────
  readonly isLoading = computed(() => this._status() === 'loading');
  readonly isSuccess = computed(() => this._status() === 'success');
  readonly isError   = computed(() => this._status() === 'error');
  readonly isIdle    = computed(() => this._status() === 'idle');

  readonly isAlreadySubscribed = computed(() =>
    this._status() === 'already-subscribed'
  );

  private readonly destroy$ = new Subject<void>();

  constructor(
    private readonly newsletterService: NewsletterService
  ) {}

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // ─── Actions ──────────────────────────────────────────────────

  subscribe(data: NewsletterSubscription): void {
    if (this._status() === 'loading') return;

    // guard: check if already subscribed
    if (this.newsletterService.isSubscribed(data.email)) {
      this._status.set('already-subscribed');
      this._message.set('You are already subscribed to our newsletter.');
      return;
    }

    this._status.set('loading');
    this._message.set(null);

    this.newsletterService
      .subscribe(data)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this._status.set('success');
          this._message.set(
            response.message ?? 'Thank you for subscribing!'
          );
          this.resetAfterDelay(5000);
        },
        error: (response) => {
          const isAlreadySubscribed = response?.message
            ?.toLowerCase()
            .includes('already subscribed');

          this._status.set(
            isAlreadySubscribed ? 'already-subscribed' : 'error'
          );
          this._message.set(
            response?.message ?? 'Something went wrong. Please try again.'
          );
        },
      });
  }

  unsubscribe(email: string): void {
    if (this._status() === 'loading') return;

    this._status.set('loading');

    this.newsletterService
      .unsubscribe(email)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this._status.set('idle');
          this._message.set('You have been unsubscribed.');
        },
        error: () => {
          this._status.set('error');
          this._message.set('Failed to unsubscribe. Please try again.');
        },
      });
  }

  reset(): void {
    this._status.set('idle');
    this._message.set(null);
  }

  // ─── Private ─────────────────────────────────────────────────

  private resetAfterDelay(ms: number): void {
    setTimeout(() => this.reset(), ms);
  }
}