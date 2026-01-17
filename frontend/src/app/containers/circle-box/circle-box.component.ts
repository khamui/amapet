import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuItem, SharedModule } from 'primeng/api';
import { Observable, Subject, debounceTime } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { CircleService } from 'src/app/services/circle.service';
import { Circle } from 'src/app/typedefs/Circle.typedef';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { SideboxComponent } from '../../components/sidebox/sidebox.component';
import { PopoverModule } from 'primeng/popover';

@Component({
  selector: 'ama-circle-box',
  templateUrl: './circle-box.component.html',
  styleUrls: ['./circle-box.component.scss'],
  standalone: true,
  imports: [
    SideboxComponent,
    ButtonModule,
    PopoverModule,
    SharedModule,
    InputTextModule,
  ],
})
export class CircleBoxComponent implements OnInit {
  circles$!: Observable<Circle[]>;
  circleMenuItems: MenuItem[] = [];
  circleNameInput = new Subject<string>();
  circleExists = false;

  isLoggedIn = false;

  constructor(
    public cs: CircleService,
    private router: Router,
    private as: AuthService,
  ) {}

  ngOnInit(): void {
    this.as.watchLoggedIn.subscribe(async (value: boolean) => {
      this.isLoggedIn = value;
      if (value && this.circleMenuItems) {
        const followedCircles = (await this.as.getFollowedCircles()) || [];
        this.circleMenuItems = this.circleMenuItems.map((item) => ({
          ...item,
          state: {
            isFollowed: followedCircles.includes(item.label || ''),
          },
        })) as MenuItem[];
        this.circleMenuItems = [...this.circleMenuItems].sort(
          this.sortFavorites,
        );
      }
    });

    this.cs.circles$.subscribe(async (circles: Circle[]) => {
      const followedCircles =
        (this.isLoggedIn && (await this.as.getFollowedCircles())) || [];
      this.circleMenuItems = circles.map((circle: Circle) => ({
        label: circle.name,
        command: () => this.router.navigate([circle.name]),
        state: {
          isFollowed: followedCircles.includes(circle.name),
        },
      })) as MenuItem[];
      this.circleMenuItems = [...this.circleMenuItems].sort(this.sortFavorites);
    });

    this.circleNameInput
      .pipe(debounceTime(250))
      .subscribe(this.checkCircleExists);
  }

  public checkUserInput = (circleName: string) => {
    this.circleNameInput.next(circleName);
  };

  private checkCircleExists = (circleName: string) => {
    this.cs
      .circleExists(circleName)
      .subscribe(({ exists }) => (this.circleExists = exists));
  };

  private sortFavorites(a: MenuItem, b: MenuItem) {
    const aVal = a.state?.['isFollowed'] ? 0 : 1;
    const bVal = b.state?.['isFollowed'] ? 0 : 1;

    return aVal - bVal;
  }
}
