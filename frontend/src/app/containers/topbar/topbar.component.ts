import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { AuthService } from 'src/app/services/auth.service';
import { ButtonModule } from 'primeng/button';
import { NgIf } from '@angular/common';
import { ToolbarModule } from 'primeng/toolbar';

@Component({
    selector: 'ama-topbar',
    templateUrl: './topbar.component.html',
    styleUrls: ['./topbar.component.scss'],
    providers: [MessageService],
    standalone: true,
    imports: [
        ToolbarModule,
        NgIf,
        ButtonModule,
    ],
})
export class TopbarComponent implements OnInit {
  isLoggedIn = false;

  constructor(
    public router: Router,
    public as: AuthService
  ) {}

  ngOnInit(): void {
    this.as.watchLoggedIn.subscribe((value: boolean) => {
      this.isLoggedIn = value;
    })
  }
}
