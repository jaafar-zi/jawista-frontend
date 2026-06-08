// src/app/core/services/cookie.service.ts

import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';

@Injectable({ providedIn: 'root' })
export class CookieService {

  private readonly document   = inject(DOCUMENT);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly isBrowser  = isPlatformBrowser(this.platformId);

  get(name: string): string | null {
    if (!this.isBrowser) return null;

    const cookies = this.document.cookie.split(';');
    for (const cookie of cookies) {
      const [key, value] = cookie.trim().split('=');
      if (key === name) {
        return decodeURIComponent(value);
      }
    }
    return null;
  }

  set(name: string, value: string, days: number = 365): void {
    if (!this.isBrowser) return;

    const expires = new Date();
    expires.setDate(expires.getDate() + days);

    this.document.cookie = [
      `${name}=${encodeURIComponent(value)}`,
      `expires=${expires.toUTCString()}`,
      'path=/',
      'SameSite=Lax',
    ].join('; ');
  }

  remove(name: string): void {
    if (!this.isBrowser) return;
    this.document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
  }
}