import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuItem, SharedModule } from 'primeng/api';
import { Observable, Subject, debounceTime } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { CircleService } from 'src/app/services/circle.service';
import { Circle } from 'src/app/typedefs/Circle.typedef';
import { InputTextModule } from 'primeng/inputtext';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { ButtonModule } from 'primeng/button';
import { SideboxComponent } from '../../components/sidebox/sidebox.component';
import { NgIf } from '@angular/common';

@Component({
    selector: 'ama-circle-box',
    templateUrl: './circle-box.component.html',
    styleUrls: ['./circle-box.component.scss'],
    standalone: true,
    imports: [
        NgIf,
        SideboxComponent,
        ButtonModule,
        OverlayPanelModule,
        SharedModule,
        InputTextModule,
    ],
})
export class CircleBoxComponent implements OnInit {
  @Input() items!: MenuItem[];

  circles$!: Observable<Circle[]>;
  circleMenuItems: MenuItem[] = [];
  circleNameInput = new Subject<string>;
  circleExists = false;

  isLoggedIn = false;

  constructor(
    public cs: CircleService,
    private router: Router,
    private as: AuthService,
  ) {}

  ngOnInit(): void {
    this.as.watchLoggedIn.subscribe((value: boolean) => {
      this.isLoggedIn = value;
    });

    this.cs.circles$.subscribe((circles: Circle[]) => {
        this.circleMenuItems = circles.map((circle: Circle) => ({
          label: circle.name,
          command: () => this.router.navigate([circle.name]),
        })) as MenuItem[]
      })

    this.circleNameInput.pipe(debounceTime(250))
      .subscribe(this.checkCircleExists)
  }

  public checkUserInput = (circleName: string) => {
    this.circleNameInput.next(circleName);
  };

  private checkCircleExists = (circleName: string) => {
    this.cs.circleExists(circleName)
      .subscribe(({ exists }) => this.circleExists = exists)
  }
}
