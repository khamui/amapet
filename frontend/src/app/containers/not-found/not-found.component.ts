import { Component, computed, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { BackendStatusService } from 'src/app/services/backend-status.service';

@Component({
  selector: 'app-not-found',
  templateUrl: './not-found.component.html',
  standalone: true,
  imports: [ButtonModule],
})
export class NotFoundComponent {
  private router = inject(Router);
  private backendStatus = inject(BackendStatusService);

  public isBackendDown = computed(() => !this.backendStatus.isAvailable());

  public navigateToExplore(): void {
    this.backendStatus.resetStatus();
    this.router.navigate(['/explore']);
  }
}
