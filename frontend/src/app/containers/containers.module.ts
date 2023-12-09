import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CreateQuestionComponent } from './create-question/create-question.component';
import { TopbarComponent } from './topbar/topbar.component';

// prime components
import { CardModule } from 'primeng/card';
import { ComponentsModule } from '../components/components.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ToolbarModule } from 'primeng/toolbar';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { SignInComponent } from './sign-in/sign-in.component';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { PanelModule } from 'primeng/panel';
import { DividerModule } from 'primeng/divider';
import { ConfirmDialogModule } from 'primeng/confirmdialog';

// third party features
import {
  GoogleSigninButtonDirective,
  GoogleSigninButtonModule,
} from '@abacritt/angularx-social-login';
import { ProfileComponent } from './profile/profile.component';
import { CircleBoxComponent } from './circle-box/circle-box.component';
import { ExploreComponent } from './explore/explore.component';
import { CircleComponent } from './circle/circle.component';
import { QuestionsComponent } from './questions/questions.component';
import { QuestionDetailComponent } from './question-detail/question-detail.component';
import { QuestionComponent } from './question/question.component';
import { DateAgoPipe } from '../pipes/date-ago.pipe';
import { EditQuestionComponent } from './edit-question/edit-question.component';
import { AnswersComponent } from './answers/answers.component';

@NgModule({
    imports: [
        CommonModule,
        CardModule,
        ComponentsModule,
        ReactiveFormsModule,
        FormsModule,
        ToolbarModule,
        ButtonModule,
        InputTextModule,
        GoogleSigninButtonModule,
        OverlayPanelModule,
        PanelModule,
        DividerModule,
        ConfirmDialogModule,
        CreateQuestionComponent,
        QuestionsComponent,
        TopbarComponent,
        SignInComponent,
        ProfileComponent,
        CircleBoxComponent,
        ExploreComponent,
        CircleComponent,
        QuestionDetailComponent,
        QuestionComponent,
        DateAgoPipe,
        EditQuestionComponent,
        AnswersComponent,
    ],
    exports: [
        QuestionsComponent,
        TopbarComponent,
        GoogleSigninButtonDirective,
        CircleBoxComponent,
        CreateQuestionComponent,
    ],
})
export class ContainersModule {}
