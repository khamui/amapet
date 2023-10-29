import { AfterViewInit, Component, OnChanges, OnInit } from '@angular/core';
import { ActivatedRoute, Router, UrlSegment } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { CircleService } from 'src/app/services/circle.service';
import { Circle } from 'src/app/typedefs/Circle.typedef';

@Component({
  selector: 'app-circle',
  templateUrl: './circle.component.html',
  styleUrls: ['./circle.component.scss'],
})
export class CircleComponent implements AfterViewInit {
  //slug!: string;
  circle!: Circle | undefined;
  isLoggedIn = false;

  constructor(
    public router: Router,
    private cs: CircleService,
    private ar: ActivatedRoute,
    public as: AuthService
  ) {
    // this.activatedRoute.url.subscribe((urlSegs: UrlSegment[]) => {
    //   this.slug = urlSegs[1].path;
    //   console.log('current slug: ', this.slug);
    // })
  }

  ngOnInit(): void {
    this.as.watchLoggedIn.subscribe((value: boolean) => {
      this.isLoggedIn = value;
    })
  }

  ngAfterViewInit(): void {
    this.ar.paramMap.subscribe((paramMap) => {
      this.circle = this.cs
        .getCircles()
        .find((c) => c.name === `c/${paramMap.get('id')}`);
      console.log('circle: ', this.circle);
    })
  }

  navigateToCreateForm = () => {
    if (this.circle) {
      this.router.navigateByUrl(`/${this.circle.name}/questions/create`)
    }
  }
}
