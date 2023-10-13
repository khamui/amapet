import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CreatePostComponent } from './create-post/create-post.component';
import { PostsComponent } from './posts/posts.component';
import { TopbarComponent } from './topbar/topbar.component';

// prime components
import { CardModule } from 'primeng/card';
import { ComponentsModule } from '../components/components.module';
import { EditorModule } from 'primeng/editor';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ToolbarModule } from 'primeng/toolbar';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { SignInComponent } from './sign-in/sign-in.component';

// third party features
import {
  GoogleSigninButtonDirective,
  GoogleSigninButtonModule,
} from '@abacritt/angularx-social-login';

@NgModule({
  declarations: [
    CreatePostComponent,
    PostsComponent,
    TopbarComponent,
    SignInComponent,
  ],
  imports: [
    CommonModule,
    CardModule,
    ComponentsModule,
    EditorModule,
    ReactiveFormsModule,
    FormsModule,
    ToolbarModule,
    ButtonModule,
    InputTextModule,
    GoogleSigninButtonModule,
  ],
  exports: [PostsComponent, TopbarComponent, GoogleSigninButtonDirective],
})
export class ContainersModule {}
