// src/app/shared/transloco/transloco-http-loader.ts
import { inject, Injectable, PLATFORM_ID, TransferState, makeStateKey } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Translation, TranslocoLoader } from '@jsverse/transloco';
import { Observable, of, from } from 'rxjs';
import { catchError, shareReplay, tap } from 'rxjs/operators';
import { isPlatformServer, isPlatformBrowser } from '@angular/common';

@Injectable({ providedIn: 'root' })
export class TranslocoHttpLoader implements TranslocoLoader {
  private readonly http          = inject(HttpClient);
  private readonly platformId    = inject(PLATFORM_ID);
  private readonly transferState = inject(TransferState);

  // Server-side cache — keyed by lang
  // shareReplay(1) ensures the file is read ONCE per lang per server instance
  private readonly serverCache = new Map<string, Observable<Translation>>();

  getTranslation(lang: string): Observable<Translation> {
    const stateKey = makeStateKey<Translation>(`transloco-${lang}`);

    // ── Browser ──────────────────────────────────────────────────
    if (isPlatformBrowser(this.platformId)) {
      if (this.transferState.hasKey(stateKey)) {
        const cached = this.transferState.get(stateKey, {} as Translation);
        this.transferState.remove(stateKey);
        return of(cached);
      }

      return this.http
        .get<Translation>(`/i18n/${lang}.json`)
        .pipe(catchError(() => of({} as Translation)));
    }

    // ── Server ───────────────────────────────────────────────────
    if (this.serverCache.has(lang)) {
      return this.serverCache.get(lang)!;
    }

    const translation$ = from(this.loadFromDisk(lang)).pipe(
      tap(translation => {
        this.transferState.set(stateKey, translation);
      }),
      catchError(err => {
        console.error(`[SSR Transloco] Error loading: ${lang}`, err);
        return of({} as Translation);
      }),
      shareReplay(1)
    );

    // Store in cache before returning
    this.serverCache.set(lang, translation$);

    return translation$;
  }

  private async loadFromDisk(lang: string): Promise<Translation> {
    const fs   = await import('fs');
    const path = await import('path');

    const cwd = process.cwd();

    const pathsToCheck = [
      path.join(cwd, 'public', 'i18n', `${lang}.json`),
      path.join(cwd, 'src', 'assets', 'i18n', `${lang}.json`),
      path.join(cwd, 'dist', 'jawista-front-e-trunk', 'browser', 'i18n', `${lang}.json`),
      path.join(cwd, 'dist', 'jawista-front-e-trunk', 'browser', 'assets', 'i18n', `${lang}.json`),
    ];

    for (const filePath of pathsToCheck) {
      if (fs.existsSync(filePath)) {
        const content = fs.readFileSync(filePath, 'utf8');
        return JSON.parse(content) as Translation;
      }
    }
    return {} as Translation;
  }
}