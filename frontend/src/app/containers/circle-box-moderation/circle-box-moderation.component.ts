import { Component, computed, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SideboxComponent } from 'src/app/components/sidebox/sidebox.component';
import { ModerationStore } from 'src/app/stores/moderation.store';

@Component({
  selector: 'ama-circle-box-moderation',
  imports: [SideboxComponent],
  templateUrl: './circle-box-moderation.component.html',
  styleUrl: './circle-box-moderation.component.scss',
})
export class CircleBoxModerationComponent {
  public circleMenuItems = computed(() => {
    console.log('Recomputing circleMenuItems');
    return this.moderationStore.moderatedCircles$().map((circle) => ({
      label: circle.name,
      command: () => {
        this.router.navigateByUrl(`moderate/${circle.name}`);
      },
    }));
  });

  constructor(
    private moderationStore: ModerationStore,
    private router: Router,
  ) {}
}
