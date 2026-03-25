import { Component, OnInit } from '@angular/core';
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
  user!: User;
  getAuraLevel = getAuraLevel;

  constructor(
    private as: AuthService,
    private api: ApiService<any>,
  ) {}

  async ngOnInit(): Promise<void> {
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
