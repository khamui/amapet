import { Component, inject, OnInit, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { User } from 'src/app/typedefs/User.typedef';
import { CardModule } from 'primeng/card';
import { ApiService } from 'src/app/services/api.service';
import { getAuraLevel } from 'src/app/utils/aura.utils';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  standalone: true,
  imports: [CardModule, RouterLink],
})
export class ProfileComponent implements OnInit {
  private platformId = inject(PLATFORM_ID);
  private as = inject(AuthService);
  private api = inject(ApiService<any>);

  user!: User;
  getAuraLevel = getAuraLevel;

  async ngOnInit(): Promise<void> {
    if (!isPlatformBrowser(this.platformId)) {
      return; // Skip on server - authenticated calls require browser
    }

    this.user = this.as.getUser() as User;
    const { isError, result } = await this.api.read('/profile', true);
    if (isError) {
      console.error('Error fetching profile:', result);
    } else {
      const {
        profile: { numOfQuestions, numOfCircles, aura },
      } = result as any;
      this.user.numOfCircles = numOfCircles;
      this.user.numOfQuestions = numOfQuestions;
      this.user.aura = aura || 0;
    }
  }
}
