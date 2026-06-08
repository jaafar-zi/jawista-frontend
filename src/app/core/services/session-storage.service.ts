// src/app/core/services/session-storage.service.ts

import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({ providedIn: 'root' })
export class SessionStorageService {

  private readonly platformId = inject(PLATFORM_ID);
  private readonly isBrowser  = isPlatformBrowser(this.platformId);

  // In-memory fallback for SSR
  private readonly memoryStore = new Map<string, string>();

  get(key: string): string | null {
    if (this.isBrowser) {
      return sessionStorage.getItem(key);
    }
    return this.memoryStore.get(key) ?? null;
  }

  set(key: string, value: string): void {
    if (this.isBrowser) {
      sessionStorage.setItem(key, value);
    } else {
      this.memoryStore.set(key, value);
    }
  }

  remove(key: string): void {
    if (this.isBrowser) {
      sessionStorage.removeItem(key);
    } else {
      this.memoryStore.delete(key);
    }
  }

  has(key: string): boolean {
    if (this.isBrowser) {
      return sessionStorage.getItem(key) !== null;
    }
    return this.memoryStore.has(key);
  }
}