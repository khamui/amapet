import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class UiStateService {
  public readonly mobileDrawerOpen = signal(false);

  public toggleMobileDrawer(): void {
    this.mobileDrawerOpen.update((open) => !open);
  }

  public closeMobileDrawer(): void {
    this.mobileDrawerOpen.set(false);
  }
}
