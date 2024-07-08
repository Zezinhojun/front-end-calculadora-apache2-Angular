import { DOCUMENT } from '@angular/common';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Inject, inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, map, Observable, throwError } from 'rxjs';

import { ApiEndpoint, LocalStorage } from '../../constant';
import {
  ApiResponse,
  LoginPayload,
  RegisterPayload,
  User,
} from '../../model/commom.model';
import IAuthService from './auth.service.interface';

@Injectable({
  providedIn: 'root',
})
export class AuthService implements IAuthService {
  isLoggedIn = signal<boolean>(false);
  router = inject(Router);

  constructor(
    private _http: HttpClient,
    @Inject(DOCUMENT) private document: Document,
  ) {
    const localStorage = this.document.defaultView?.localStorage;
    if (localStorage?.getItem(LocalStorage.token)) {
      this.isLoggedIn.set(true);
    }
  }

  register(payload: RegisterPayload): Observable<ApiResponse<User>> {
    return this._http
      .post<ApiResponse<User>>(`${ApiEndpoint.Auth.Register}`, payload)
      .pipe(
        map((response) => {
          return response;
        }),
        catchError((error) => {
          return throwError(() => error);
        }),
      );
  }

  login(payload: LoginPayload): Observable<ApiResponse<User>> {
    return this._http
      .post<ApiResponse<User>>(`${ApiEndpoint.Auth.Login}`, payload)
      .pipe(
        map((response) => {
          if (response?.token) {
            localStorage.setItem(LocalStorage.token, response.token);
            this.isLoggedIn.set(true);
          }
          return response;
        }),
        catchError((error: HttpErrorResponse) => {
          return throwError(() => error);
        }),
      );
  }

  me(): Observable<ApiResponse<User>> {
    return this._http.get<ApiResponse<User>>(`${ApiEndpoint.Auth.Me}`);
  }

  getUserToken(): string | null {
    const localStorage = this.document.defaultView?.localStorage;
    return localStorage ? localStorage.getItem(LocalStorage.token) : null;
  }

  logout(): void {
    const localStorage = this.document.defaultView?.localStorage;
    if (localStorage) localStorage.removeItem(LocalStorage.token);
    this.isLoggedIn.set(false);
    this.router.navigate(['login']);
  }
}
