import { Component, Input } from '@angular/core';
import { MenuModule } from 'primeng/menu';

@Component({
    selector: 'ama-sidebox',
    templateUrl: './sidebox.component.html',
    styleUrls: ['./sidebox.component.scss'],
    standalone: true,
    imports: [MenuModule]
})
export class SideboxComponent {
  @Input() items: any;
}
