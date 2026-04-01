import { Component, inject, input, signal, ViewChild } from '@angular/core';
import { Popover, PopoverModule } from 'primeng/popover';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { AuraService } from 'src/app/services/aura.service';

@Component({
  selector: 'ama-username-badge',
  standalone: true,
  imports: [PopoverModule, ProgressSpinnerModule],
  template: `
    <span
      class="text-xs text-500 dark:text-surface-400 hover:text-700 dark:hover:text-surface-300 cursor-default"
      (mouseenter)="handleHover($event)"
    >
      {{ username() }}
    </span>
    <p-popover #auraPopover>
      <div class="flex flex-col items-center gap-1 p-1">
        @if (loading()) {
          <p-progressSpinner [style]="{ width: '24px', height: '24px' }" strokeWidth="4" />
        } @else {
          <div class="font-semibold">{{ auraData().aura }} Aura</div>
          <div class="text-sm text-surface-500 dark:text-surface-400">{{ auraData().level }}</div>
        }
      </div>
    </p-popover>
  `,
})
export class UsernameBadgeComponent {
  @ViewChild('auraPopover') popover!: Popover;

  private auraService = inject(AuraService);

  username = input.required<string>();
  userId = input.required<string>();

  loading = signal(false);
  auraData = signal({ aura: 0, level: '' });

  async handleHover(event: Event) {
    this.popover.show(event);

    // Skip fetch if already loaded
    if (this.auraData().level) return;

    this.loading.set(true);
    const data = await this.auraService.getUserAura(this.userId());
    this.auraData.set(data);
    this.loading.set(false);
  }
}
