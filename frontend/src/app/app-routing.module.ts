import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SignInComponent } from './containers/sign-in/sign-in.component';
import { ProfileComponent } from './containers/profile/profile.component';
import { ExploreComponent } from './containers/explore/explore.component';
import { CircleComponent } from './containers/circle/circle.component';
import { CreateQuestionComponent } from './containers/create-question/create-question.component';

const routes: Routes = [
  { path: 'explore', component: ExploreComponent },
  { path: 'c/:id', component: CircleComponent  },
  { path: 'c/:id/questions/create', component: CreateQuestionComponent },
  { path: 'signin', component: SignInComponent },
  { path: 'profile', component: ProfileComponent },
  { path: '', redirectTo: 'explore', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
