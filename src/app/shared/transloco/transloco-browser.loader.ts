import { inject, Injectable, TransferState, makeStateKey } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Translation, TranslocoLoader } from '@jsverse/transloco';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class TranslocoBrowserLoader implements TranslocoLoader {
  private readonly http          = inject(HttpClient);
  private readonly transferState = inject(TransferState);

  getTranslation(lang: string): Observable<Translation> {
    const stateKey = makeStateKey<Translation>(`transloco-${lang}`);

    if (this.transferState.hasKey(stateKey)) {
      const cached = this.transferState.get(stateKey, {} as Translation);
      this.transferState.remove(stateKey);
      return of(cached);
    }

    return this.http
      .get<Translation>(`/i18n/${lang}.json`)
      .pipe(catchError(() => of({} as Translation)));
  }
}
