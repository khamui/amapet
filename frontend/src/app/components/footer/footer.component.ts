import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { version } from '../../../../package.json';

@Component({
  selector: 'ama-footer',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './footer.component.html',
})
export class FooterComponent {
  readonly version = version;
}
