import { HttpErrorResponse, type HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';

import { catchError, retry, throwError } from 'rxjs';

import { Router } from '@angular/router';
import { LocalStorage } from '../constant';
import { AuthService } from '../services/auth.service';

export const httpInterceptor: HttpInterceptorFn = (req, next) => {

  const _authSvc = inject(AuthService)
  const router = inject(Router)
  if (_authSvc.isLoggedIn()) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bared ${_authSvc.getUserToken()} `
      },
    });
  }

  return next(req).pipe(
    retry(2),
    catchError((e: HttpErrorResponse) => {
      if (e.status === 401) {
        localStorage.removeItem(LocalStorage.token);
        router.navigate([''])
      }

      const error = e.error.message || e.statusText;
      return throwError(() => error)
    })
  );

};
