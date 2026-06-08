// src/app/core/services/newsletter.service.ts

import { Injectable, inject } from '@angular/core';
import { Observable, map, catchError, throwError } from 'rxjs';
import { NewsletterSubscription, NewsletterResponse } from '../../core/models/news-letter.model';
import { SubscriberService } from '../../core/services/subscriber.service';

@Injectable({ providedIn: 'root' })
export class NewsletterService {

  private readonly subscriberService = inject(SubscriberService);

  // ─── Public API (same interface as before) ────────────────────

  subscribe(data: NewsletterSubscription): Observable<NewsletterResponse> {
    return this.subscriberService
      .subscribe({ name: data.name, email: data.email })
      .pipe(
        map(() => ({
          success: true,
          message: 'Successfully subscribed to newsletter',
        } as NewsletterResponse)),
        catchError(err => {
          const isAlreadySubscribed = err?.message?.includes(
            'already subscribed'
          );

          if (isAlreadySubscribed) {
            return throwError(() => ({
              success: false,
              message: 'This email is already subscribed',
            } as NewsletterResponse));
          }

          return throwError(() => ({
            success: false,
            message: 'Failed to subscribe. Please try again.',
          } as NewsletterResponse));
        })
      );
  }

  unsubscribe(email: string): Observable<NewsletterResponse> {
    return this.subscriberService.unsubscribe(email).pipe(
      map(() => ({
        success: true,
        message: 'Successfully unsubscribed from newsletter',
      } as NewsletterResponse)),
      catchError(() =>
        throwError(() => ({
          success: false,
          message: 'Failed to unsubscribe. Please try again.',
        } as NewsletterResponse))
      )
    );
  }

  // ─── Convenience Helpers ──────────────────────────────────────

  isSubscribed(email: string): boolean {
    return this.subscriberService.isEmailSubscribed(email)();
  }

  get isLoading(): boolean {
    return this.subscriberService.loading();
  }

  get error(): string | null {
    return this.subscriberService.error();
  }
}