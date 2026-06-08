import { inject, Injectable, PLATFORM_ID, TransferState, makeStateKey } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { isPlatformBrowser } from '@angular/common';
import { of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Translation, TranslocoLoader } from '@jsverse/transloco';

@Injectable({ providedIn: 'root' })
export class TranslocoHttpLoader implements TranslocoLoader {
  private readonly http = inject(HttpClient);
  private readonly transferState = inject(TransferState);
  private readonly platformId = inject(PLATFORM_ID);

  getTranslation(lang: string) {
    const key = makeStateKey<Translation>(`transloco-${lang}`);

    // Browser: use state transferred from server
    if (isPlatformBrowser(this.platformId)) {
      if (this.transferState.hasKey(key)) {
        const cached = this.transferState.get(key, {});
        this.transferState.remove(key);
        return of(cached);
      }
    }

    // Server: fetch and store in TransferState
    return this.http.get<Translation>(`/i18n/${lang}.json`).pipe(
      tap(translation => {
        if (!isPlatformBrowser(this.platformId)) {
          this.transferState.set(key, translation);
        }
      })
    );
  }
}