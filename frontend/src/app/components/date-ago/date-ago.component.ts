import {
  Component,
  computed,
  inject,
  input,
  signal,
  PLATFORM_ID,
  afterNextRender,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { DateAgoPipe } from '../../pipes/date-ago.pipe';

@Component({
  selector: 'ama-date-ago',
  standalone: true,
  template: `{{ display() }}`,
})
export class DateAgoComponent {
  value = input.required<number | string | Date | null | undefined>();

  private platformId = inject(PLATFORM_ID);
  private pipe = new DateAgoPipe();
  private hydrated = signal(false);

  display = computed(() => {
    const v = this.value();
    if (v === null || v === undefined || v === '') return '';
    if (!this.hydrated()) {
      // Stable, deterministic SSR output (no Date.now), matches between server and client first paint.
      const d = new Date(v as string | number | Date);
      if (isNaN(d.getTime())) return '';
      return d.toISOString().slice(0, 10);
    }
    return this.pipe.transform(v) as string;
  });

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      afterNextRender(() => {
        this.hydrated.set(true);
      });
    }
  }
}
