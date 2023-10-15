import { Component, Input } from '@angular/core';

@Component({
  selector: 'ama-sidebox',
  templateUrl: './sidebox.component.html',
  styleUrls: ['./sidebox.component.scss']
})
export class SideboxComponent {
  @Input() items: any;
}
