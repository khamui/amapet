import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, tap, throwError } from 'rxjs';
import { BackendStatusService } from '../services/backend-status.service';

export const backendStatusInterceptor: HttpInterceptorFn = (req, next) => {
  const backendStatus = inject(BackendStatusService);

  return next(req).pipe(
    tap(() => {
      backendStatus.setAvailable();
    }),
    catchError((error: HttpErrorResponse) => {
      if (error.status === 0 || error.status >= 500) {
        backendStatus.setUnavailable();
      }
      return throwError(() => error);
    }),
  );
};
