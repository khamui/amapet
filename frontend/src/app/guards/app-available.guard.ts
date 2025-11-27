import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { SettingsService } from '../services/settings.service';

export const appAvailableGuard: CanActivateFn = async (route, state) => {
  const ses = inject(SettingsService);
  const appIsAvailable = await ses.getAppIsAvailable();
  return appIsAvailable;
};
