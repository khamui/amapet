import { Component, inject, input, signal, OnInit } from '@angular/core';
import { TooltipModule } from 'primeng/tooltip';
import { AuraService } from 'src/app/services/aura.service';

@Component({
  selector: 'ama-username-badge',
  standalone: true,
  imports: [TooltipModule],
  template: `
    <span
      class="text-xs text-500 hover:text-700 cursor-default"
      [pTooltip]="tooltipText()"
      tooltipPosition="top"
    >
      {{ username() }}
    </span>
  `,
})
export class UsernameBadgeComponent implements OnInit {
  private auraService = inject(AuraService);

  username = input.required<string>();
  userId = input.required<string>();

  tooltipText = signal('Loading...');

  async ngOnInit() {
    const { aura, level } = await this.auraService.getUserAura(this.userId());
    this.tooltipText.set(`${aura} Aura - ${level}`);
  }
}
