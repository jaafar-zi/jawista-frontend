import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import {
  Observable,
  tap,
  catchError,
  throwError,
  map,
  from,
  switchMap,
} from 'rxjs';

import { SubscriberMapper } from '../mappers/subscriber.mapper';
import {
  Subscriber,
  SubscribePayload,
  SubscriberFilter,
} from '../models/subscriber.model';
import { SubscriberControllerService } from '../../api/services/subscriber-controller.service';

@Injectable({ providedIn: 'root' })
export class SubscriberService {
  private readonly api = inject(SubscriberControllerService);
  private readonly mapper = inject(SubscriberMapper);

  private readonly _subscribers = signal<Subscriber[]>([]);
  private readonly _loading = signal(false);
  private readonly _error = signal<string | null>(null);
  private readonly _searchTerm = signal('');

  readonly subscribers = this._subscribers.asReadonly();
  readonly loading = this._loading.asReadonly();
  readonly error = this._error.asReadonly();
  readonly searchTerm = this._searchTerm.asReadonly();

  readonly activeSubscribers = computed(() =>
    this._subscribers().filter(s => s.active)
  );

  readonly totalSubscribers = computed(() =>
    this._subscribers().length
  );

  readonly totalActive = computed(() =>
    this._subscribers().filter(s => s.active).length
  );

  readonly filteredSubscribers = computed(() => {
    const term = this._searchTerm().toLowerCase().trim();
    if (!term) return this._subscribers();

    return this._subscribers().filter(s =>
      s.name.toLowerCase().includes(term) ||
      s.email.toLowerCase().includes(term)
    );
  });

  readonly isEmailSubscribed = (email: string) => computed(() =>
    this._subscribers().some(
      s => s.email.toLowerCase() === email.toLowerCase() && s.active
    )
  );

  getAllActive(): Observable<Subscriber[]> {
    this._loading.set(true);
    this._error.set(null);

    return this.api.getAllActiveSubscribers().pipe(
      map(subscribers => this.mapper.fromDtoList(subscribers)),
      tap(subscribers => {
        this._subscribers.set(subscribers);
        this._loading.set(false);
      }),
      catchError(err => this.handleError('Failed to load subscribers', err))
    );
  }

  subscribe(payload: SubscribePayload): Observable<Subscriber> {
    this._loading.set(true);
    this._error.set(null);

    const dto = this.mapper.toSubscribeDto(payload);

    return this.api.subscribe({ body: dto }).pipe(
      map(subscriber => this.mapper.fromDto(subscriber)),
      tap(subscriber => {
        this._subscribers.update(subs => [...subs, subscriber]);
        this._loading.set(false);
      }),
      catchError(err => this.handleError('Failed to subscribe', err))
    );
  }

  unsubscribe(email: string): Observable<void> {
    this._loading.set(true);
    this._error.set(null);

    return this.api.unsubscribe({ email }).pipe(
      tap(() => {
        this._subscribers.update(subs =>
          subs.filter(s => s.email !== email)
        );
        this._loading.set(false);
      }),
      catchError(err => this.handleError(`Failed to unsubscribe ${email}`, err))
    );
  }

  search(term: string): void {
    this._searchTerm.set(term);
  }

  clearSearch(): void {
    this._searchTerm.set('');
  }

  clearSubscribers(): void {
    this._subscribers.set([]);
  }

  clearError(): void {
    this._error.set(null);
  }

  findByEmail(email: string): Subscriber | undefined {
    return this._subscribers().find(
      s => s.email.toLowerCase() === email.toLowerCase()
    );
  }

  filter(filter: SubscriberFilter): Subscriber[] {
    return this._subscribers().filter(s => {
      const matchesActive =
        filter.active === undefined || s.active === filter.active;

      const matchesSearch = !filter.searchTerm ||
        s.name.toLowerCase().includes(filter.searchTerm.toLowerCase()) ||
        s.email.toLowerCase().includes(filter.searchTerm.toLowerCase());

      return matchesActive && matchesSearch;
    });
  }

  private handleError(fallbackMessage: string, err: unknown): Observable<never> {
    console.error(`[SubscriberService] ${fallbackMessage}:`, err);

    if (err instanceof HttpErrorResponse && err.error instanceof Blob) {
      return from(err.error.text()).pipe(
        switchMap(text => {
          const message = this.extractMessageFromText(text) || fallbackMessage;
          this._error.set(message);
          this._loading.set(false);
          return throwError(() => new Error(message));
        })
      );
    }

    const message = this.extractErrorMessage(err, fallbackMessage);
    this._error.set(message);
    this._loading.set(false);

    return throwError(() => new Error(message));
  }

  private extractErrorMessage(err: unknown, fallbackMessage: string): string {
    if (!err) {
      return fallbackMessage;
    }

    if (err instanceof Error && !(err instanceof HttpErrorResponse)) {
      return err.message || fallbackMessage;
    }

    if (err instanceof HttpErrorResponse) {
      if (err.error && typeof err.error === 'object') {
        return err.error.message || err.error.error || err.message || fallbackMessage;
      }

      if (typeof err.error === 'string') {
        return this.extractMessageFromText(err.error) || err.message || fallbackMessage;
      }

      return err.message || fallbackMessage;
    }

    if (typeof err === 'string') {
      return err;
    }

    if (typeof err === 'object') {
      const anyErr = err as any;
      return anyErr?.message || anyErr?.error || fallbackMessage;
    }

    return fallbackMessage;
  }

  private extractMessageFromText(text: string): string | null {
    if (!text) return null;

    try {
      const parsed = JSON.parse(text);
      return parsed?.message || parsed?.error || null;
    } catch {
      return text.trim() || null;
    }
  }
}