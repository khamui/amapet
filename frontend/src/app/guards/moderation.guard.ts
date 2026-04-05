import { CanActivateFn, Router } from '@angular/router';
import { inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { ModerationStore } from '../stores/moderation.store';

export const moderationGuard: CanActivateFn = async (route, state) => {
  const moderationStore = inject(ModerationStore);
  const router = inject(Router);
  const platformId = inject(PLATFORM_ID);

  // Skip guard on server — let the client handle it after hydration
  if (!isPlatformBrowser(platformId)) {
    return true;
  }

  // Wait for the moderation store to be initialized
  if (!moderationStore.ready$()) {
    await moderationStore.initStore();
  }

  const circleName = route.paramMap.get('name');
  const moderatedCircles = moderationStore.moderatedCircles$();
  const isModerator = moderatedCircles.some(
    (c) => c.name === `c/${circleName}`
  );

  if (!isModerator) {
    router.navigate(['/explore']);
    return false;
  }

  return true;
};
