import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SignInComponent } from './containers/sign-in/sign-in.component';
import { ProfileComponent } from './containers/profile/profile.component';
import { ExploreComponent } from './containers/explore/explore.component';
import { CircleComponent } from './containers/circle/circle.component';
import { CreateQuestionComponent } from './containers/create-question/create-question.component';
import { QuestionDetailComponent } from './containers/question-detail/question-detail.component';
import { EditQuestionComponent } from './containers/edit-question/edit-question.component';
import { GlobalSettingsComponent } from './containers/global-settings/global-settings.component';
import { permLevelGuard } from './guards/perm-level.guard';
import { appAvailableGuard } from './guards/app-available.guard';

const routes: Routes = [
  {
    path: 'explore',
    component: ExploreComponent,
    canActivate: [appAvailableGuard],
  },
  {
    path: 'c/:name',
    component: CircleComponent,
    canActivate: [appAvailableGuard],
  },
  {
    path: 'c/:id/questions/create',
    component: CreateQuestionComponent,
    canActivate: [appAvailableGuard],
  },
  {
    path: 'c/:id/questions/:qid/edit',
    component: EditQuestionComponent,
    canActivate: [appAvailableGuard],
  },
  {
    path: 'c/:name/questions/:qid',
    component: QuestionDetailComponent,
    canActivate: [appAvailableGuard],
  },
  {
    path: 'signin',
    component: SignInComponent,
    canActivate: [appAvailableGuard],
  },
  {
    path: 'profile',
    component: ProfileComponent,
    canActivate: [appAvailableGuard],
  },
  {
    path: 'global-settings',
    component: GlobalSettingsComponent,
    canActivate: [permLevelGuard, appAvailableGuard],
  },
  { path: '', redirectTo: 'explore', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
