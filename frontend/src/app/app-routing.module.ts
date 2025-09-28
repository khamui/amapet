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

const routes: Routes = [
  { path: 'explore', component: ExploreComponent },
  { path: 'c/:name', component: CircleComponent  },
  { path: 'c/:id/questions/create', component: CreateQuestionComponent },
  { path: 'c/:id/questions/:qid/edit', component: EditQuestionComponent },
  { path: 'c/:name/questions/:qid', component: QuestionDetailComponent },
  { path: 'signin', component: SignInComponent },
  { path: 'profile', component: ProfileComponent },
  { path: 'moderation', component: ModerationComponent},
  { path: '', redirectTo: 'explore', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
