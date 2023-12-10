import { Component } from '@angular/core';
import { GoogleSigninButtonModule } from '@abacritt/angularx-social-login';

@Component({
    selector: 'app-sign-in',
    templateUrl: './sign-in.component.html',
    styleUrls: ['./sign-in.component.scss'],
    standalone: true,
    imports: [GoogleSigninButtonModule]
})
export class SignInComponent {

}
