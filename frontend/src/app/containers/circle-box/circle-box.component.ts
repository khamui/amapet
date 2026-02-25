import {
  Component,
  computed,
  effect,
  inject,
  OnInit,
  signal,
  untracked,
} from '@angular/core';
import { Router, RouterLink } from '@angular/router';
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
  public cs = inject(CircleService);
  private router = inject(Router);
  private as = inject(AuthService);

  circles$!: Observable<Circle[]>;
  circleMenuItems = signal<MenuItem[]>([]);
  circleNameInput = new Subject<string>();
  circleExists = false;

  public isLoggedIn = computed(() => this.as.isLoggedIn());

  constructor() {
    // React to login state changes
    effect(async () => {
      const loggedIn = this.as.isLoggedIn();
      if (loggedIn) {
        // Use untracked to read circleMenuItems without creating a dependency
        // This prevents infinite loop: effect reads signal -> writes signal -> triggers effect
        const items = untracked(() => this.circleMenuItems());
        if (items.length > 0) {
          const followedCircles = (await this.as.getFollowedCircles()) || [];
          const updatedItems = items.map((item) => ({
            ...item,
            state: {
              isFollowed: followedCircles.includes(item.label || ''),
            },
          })) as MenuItem[];
          this.circleMenuItems.set([...updatedItems].sort(this.sortFavorites));
        }
      }
    });
  }

  ngOnInit(): void {
    this.cs.circles$.subscribe(async (circles: Circle[]) => {
      const followedCircles =
        (this.isLoggedIn() && (await this.as.getFollowedCircles())) || [];
      const items = circles.map((circle: Circle) => ({
        label: circle.name,
        command: () => this.router.navigate([circle.name]),
        state: {
          isFollowed: followedCircles.includes(circle.name),
        },
      })) as MenuItem[];
      this.circleMenuItems.set([...items].sort(this.sortFavorites));
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
