import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { User } from 'src/app/typedefs/User.typedef';
import { CardModule } from 'primeng/card';
import { ApiService } from 'src/app/services/api.service';

@Component({
    selector: 'app-profile',
    templateUrl: './profile.component.html',
    styleUrls: ['./profile.component.scss'],
    standalone: true,
    imports: [CardModule]
})
export class ProfileComponent implements OnInit {
  user!: User;

  constructor(private as: AuthService, private api: ApiService<any>) {}

  async ngOnInit(): Promise<void> {
    this.user = this.as.getUser() as User;
    const { isError, result } = await this.api.read('profile', true);
    if (isError) {
      console.error('Error fetching profile:', result);
    } else {
      const { profile: { numOfQuestions, numOfCircles } } = result as any;
      this.user.numOfCircles = numOfCircles;
      this.user.numOfQuestions = numOfQuestions;
    }
  }
}
