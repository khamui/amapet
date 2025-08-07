import { Component, Input } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { MenuModule } from 'primeng/menu';
import { ApiService } from 'src/app/services/api.service';
import { FollowResponse } from 'src/app/typedefs/FollowResponse.typedef';

@Component({
  selector: 'ama-sidebox',
  templateUrl: './sidebox.component.html',
  styleUrls: ['./sidebox.component.scss'],
  standalone: true,
  imports: [MenuModule, ButtonModule],
})
export class SideboxComponent {
  @Input() items: any;
  @Input() context!: string;

  constructor(private api: ApiService<any>) {}

  public async handleFollowCircle(event: MouseEvent, item: any) {
    event.stopPropagation();
    event.preventDefault();

    const response = await this.api.create('follow-circle', {
      circleName: item.label,
    });
    item.state.isFollowed =
      (response as FollowResponse).result.action === 'followed';
  }
}
