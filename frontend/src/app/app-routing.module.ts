import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SignInComponent } from './containers/sign-in/sign-in.component';
import { ProfileComponent } from './containers/profile/profile.component';
import { ExploreComponent } from './containers/explore/explore.component';
import { CircleComponent } from './containers/circle/circle.component';
import { CreateQuestionComponent } from './containers/create-question/create-question.component';
import { QuestionDetailComponent } from './containers/question-detail/question-detail.component';
import { EditQuestionComponent } from './containers/edit-question/edit-question.component';
import { ModerationComponent } from './containers/moderation/moderation.component';
import { ModerationQuestionsComponent } from './containers/moderation-questions/moderation-questions.component';
import { ModerationQuestionDetailComponent } from './containers/moderation-question-details/moderation-question-detail.component';
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
    path: 'moderation',
    component: ModerationComponent,
  },
  {
    path: 'moderate/c/:name',
    component: ModerationQuestionsComponent,
  },
  {
    path: 'moderate/c/:name/q/:qid',
    component: ModerationQuestionDetailComponent,
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
