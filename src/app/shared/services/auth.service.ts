import { DOCUMENT } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Inject, inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { map } from 'rxjs';

import { ApiEndpoint, LocalStorage } from '../constant';
import { ApiResponse, LoginPayload, RegisterPayload, User } from '../model/commom.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  isLoggedIn = signal<boolean>(false)
  constructor(private _http: HttpClient, @Inject(DOCUMENT) private document: Document) {
    const localStorage = this.document.defaultView?.localStorage;
    if (localStorage && localStorage.getItem(LocalStorage.token)) {
      this.isLoggedIn.update(() => true)
    }
  }
  router = inject(Router)
  register(payload: RegisterPayload) {
    return this._http.post<ApiResponse<User>>(`${ApiEndpoint.Auth.Register}`, payload);
  }
  login(payload: LoginPayload) {
    return this._http
      .post<ApiResponse<User>>(`${ApiEndpoint.Auth.Login}`, payload)
      .pipe(map((response) => {
        if (response?.token) {
          localStorage.setItem(LocalStorage.token, response.token);
          this.isLoggedIn.update(() => true)
        }
        return response
      }));
  }
  me() {
    return this._http.get<ApiResponse<User>>(`${ApiEndpoint.Auth.Me}`);
  }
  getUserToken() {
    return localStorage.getItem(LocalStorage.token);
  }
  logout() {
    localStorage.removeItem(LocalStorage.token)
    this.isLoggedIn.update(() => false)
    this.router.navigate(['login'])
  }
}
