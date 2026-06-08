// src/app/core/interceptors/auth.interceptor.ts
import { HttpInterceptorFn } from '@angular/common/http';
import { inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const platformId = inject(PLATFORM_ID);

  if (!isPlatformBrowser(platformId)) {
    return next(req);
  }

  const username = localStorage.getItem('username');
  const password = localStorage.getItem('password');

  if (username && password) {
    const credentials = btoa(`${username}:${password}`);
    return next(
      req.clone({
        setHeaders: {
          Authorization: `Basic ${credentials}`,
        },
      })
    );
  }

  return next(req);
};