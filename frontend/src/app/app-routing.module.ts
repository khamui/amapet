import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProfileComponent } from './containers/profile/profile.component';
import { ExploreComponent } from './containers/explore/explore.component';
import { CircleComponent } from './containers/circle/circle.component';
import { CreateQuestionComponent } from './containers/create-question/create-question.component';
import { QuestionDetailComponent } from './containers/question-detail/question-detail.component';
import { EditQuestionComponent } from './containers/edit-question/edit-question.component';
import { ModerationQuestionDetailComponent } from './containers/moderation-question-details/moderation-question-detail.component';
import { GlobalSettingsComponent } from './containers/global-settings/global-settings.component';
import { ProfileCirclesComponent } from './containers/profile-circles/profile-circles.component';
import { NotFoundComponent } from './containers/not-found/not-found.component';
import { ImprintComponent } from './containers/legal/imprint/imprint.component';
import { PrivacyComponent } from './containers/legal/privacy/privacy.component';
import { DisclaimerComponent } from './containers/legal/disclaimer/disclaimer.component';
import { TermsComponent } from './containers/legal/terms/terms.component';
import { permLevelGuard } from './guards/perm-level.guard';
import { appAvailableGuard } from './guards/app-available.guard';
import { moderationGuard } from './guards/moderation.guard';

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
    path: 'profile',
    component: ProfileComponent,
    canActivate: [appAvailableGuard],
  },
  {
    path: 'profile/circles',
    component: ProfileCirclesComponent,
    canActivate: [appAvailableGuard],
  },
  {
    path: 'moderate/c/:name/q/:qid',
    component: ModerationQuestionDetailComponent,
    canActivate: [moderationGuard],
  },
  {
    path: 'global-settings',
    component: GlobalSettingsComponent,
    canActivate: [permLevelGuard, appAvailableGuard],
  },
  { path: 'imprint', component: ImprintComponent },
  { path: 'privacy', component: PrivacyComponent },
  { path: 'disclaimer', component: DisclaimerComponent },
  { path: 'terms', component: TermsComponent },
  { path: '', redirectTo: 'explore', pathMatch: 'full' },
  { path: '**', component: NotFoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
