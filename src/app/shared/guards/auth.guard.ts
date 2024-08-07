import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

import { AuthService } from '../services/auth/auth.service';

export const authGuard: CanActivateFn = (route, state) => {

  const _authSvc = inject(AuthService)
  const router = inject(Router)

  if (!_authSvc.isLoggedIn()) {
    router.navigate(['login'])
    return false
  }
  return true;
};
