import type { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { SpinnerService } from '../services/spinner/spinner.service';
import { finalize } from 'rxjs';

export const spinnerInterceptorInterceptor: HttpInterceptorFn = (req, next) => {
  const _spinnerSvc = inject(SpinnerService)
  _spinnerSvc.show()

  return next(req)
    .pipe(
      finalize(() => _spinnerSvc.hide())
    )
};
