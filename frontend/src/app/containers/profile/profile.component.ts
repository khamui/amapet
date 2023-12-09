import { Component, Input, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { User } from 'src/app/typedefs/User.typedef';
import { CardModule } from 'primeng/card';

@Component({
    selector: 'app-profile',
    templateUrl: './profile.component.html',
    styleUrls: ['./profile.component.scss'],
    standalone: true,
    imports: [CardModule]
})
export class ProfileComponent implements OnInit {
  user!: User;

  constructor(private as: AuthService) {}

  ngOnInit(): void {
    this.user = this.as.getUser() as User;
  }
}
