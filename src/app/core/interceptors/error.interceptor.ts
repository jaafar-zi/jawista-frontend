// src/app/core/interceptors/error.interceptor.ts

import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      switch (error.status) {
        case 401:
          localStorage.removeItem('username');
          localStorage.removeItem('password');
          router.navigate(['/login']);
          break;
        case 403:
          router.navigate(['/forbidden']);
          break;
        case 404:
          console.warn(`[HTTP 404] Not found: ${req.url}`);
          break;
        case 500:
          console.error(`[HTTP 500] Server error: ${req.url}`);
          break;
        default:
          console.error(`[HTTP ${error.status}]`, error.message);
      }
      return throwError(() => error);
    })
  );
};