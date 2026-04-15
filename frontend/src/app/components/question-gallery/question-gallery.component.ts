import { Component, computed, input, output, signal } from '@angular/core';
import { GalleriaModule } from 'primeng/galleria';
import { PrimeTemplate } from 'primeng/api';

@Component({
  selector: 'ama-question-gallery',
  templateUrl: './question-gallery.component.html',
  standalone: true,
  imports: [GalleriaModule, PrimeTemplate],
})
export class QuestionGalleryComponent {
  images = input<string[]>([]);
  imageClick = output<void>();

  activeIndex = signal(0);
  hasImages = computed(() => this.images().length > 0);
  showItemNavigators = computed(() => this.images().length > 1);

  onImageClick() {
    this.imageClick.emit();
  }
}
