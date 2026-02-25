import { Component, computed, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { MenuModule } from 'primeng/menu';
import { ApiService } from 'src/app/services/api.service';
import { AuthService } from 'src/app/services/auth.service';
import { FollowResponse } from 'src/app/typedefs/FollowResponse.typedef';

@Component({
  selector: 'ama-sidebox',
  templateUrl: './sidebox.component.html',
  styleUrls: ['./sidebox.component.scss'],
  standalone: true,
  imports: [MenuModule, ButtonModule, RouterLink],
})
export class SideboxComponent {
  private api = inject(ApiService<any>);
  private as = inject(AuthService);

  public items = input<MenuItem[]>();
  public context = input<string>();

  public isLoggedIn = computed(() => this.as.isLoggedIn());

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
