import { Injectable, signal, computed, inject } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class BackendStatusService {
  private router = inject(Router);
  private _isAvailable = signal(true);

  public readonly isAvailable = computed(() => this._isAvailable());

  public setUnavailable(): void {
    if (this._isAvailable()) {
      this._isAvailable.set(false);
      this.router.navigate(['/not-found']);
    }
  }

  public setAvailable(): void {
    this._isAvailable.set(true);
  }

  public resetStatus(): void {
    this._isAvailable.set(true);
  }
}
