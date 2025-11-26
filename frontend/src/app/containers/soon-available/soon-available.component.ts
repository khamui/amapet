import { Component, inject } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'ama-soon-available',
  imports: [],
  templateUrl: './soon-available.component.html',
  styleUrl: './soon-available.component.scss',
})
export class SoonAvailableComponent {
  private tis = inject(Title);

  constructor() {
    this.tis.setTitle('Helpa.ws Q&A Community for all things pets');
  }
}
