import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

import { AuthService } from '../services/auth.service';


export const guestGuard: CanActivateFn = (route, state) => {

  const _authSvc = inject(AuthService)
  const router = inject(Router)
  if (_authSvc.isLoggedIn()) {
    router.navigate([''])
  }
  return true;
};
