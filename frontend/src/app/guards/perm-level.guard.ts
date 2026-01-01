import { CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { inject } from '@angular/core';

export const permLevelGuard: CanActivateFn = (route, state) => {
  const as = inject(AuthService);
  return !!as.getPermLevel();
};
