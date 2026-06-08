// logger.service.ts
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LoggerService {
  error(message: string, error?: Error): void {
    console.error(`[ERROR] ${message}`, error);
    // Send to logging service (e.g., Sentry, DataDog)
  }

  warn(message: string): void {
    console.warn(`[WARN] ${message}`);
  }

  log(message: string): void {
    console.log(`[LOG] ${message}`);
  }
}