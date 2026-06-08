// src/app/shared/transloco/transloco-server.loader.ts
import { Injectable, TransferState, makeStateKey } from '@angular/core';
import { Translation, TranslocoLoader } from '@jsverse/transloco';
import { Observable, from, of } from 'rxjs';
import { catchError, shareReplay, tap } from 'rxjs/operators';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

@Injectable()
export class TranslocoServerLoader implements TranslocoLoader {
  private readonly serverCache = new Map<string, Observable<Translation>>();

  constructor(private readonly transferState: TransferState) {}

  getTranslation(lang: string): Observable<Translation> {
    const stateKey = makeStateKey<Translation>(`transloco-${lang}`);

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

    this.serverCache.set(lang, translation$);
    return translation$;
  }

  private loadFromDisk(lang: string): Promise<Translation> {
    const cwd = process.cwd();

    const pathsToCheck = [
      join(cwd, 'public', 'i18n', `${lang}.json`),
      join(cwd, 'src', 'assets', 'i18n', `${lang}.json`),
      join(cwd, 'dist', 'jawista-front-e-trunk', 'browser', 'i18n', `${lang}.json`),
      join(cwd, 'dist', 'jawista-front-e-trunk', 'browser', 'assets', 'i18n', `${lang}.json`),
    ];

    for (const filePath of pathsToCheck) {
      if (existsSync(filePath)) {
        const content = readFileSync(filePath, 'utf8');
        return Promise.resolve(JSON.parse(content) as Translation);
      }
    }

    return Promise.resolve({} as Translation);
  }
}