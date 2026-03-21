import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { ModerationStore } from '../stores/moderation.store';

export const moderationGuard: CanActivateFn = (route, state) => {
  const moderationStore = inject(ModerationStore);
  const router = inject(Router);

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
