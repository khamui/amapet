import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreatePostComponent } from './containers/create-post/create-post.component';
import { PostsComponent } from './containers/posts/posts.component';
import { SignInComponent } from './containers/sign-in/sign-in.component';

const routes: Routes = [
  { path: 'posts', component: PostsComponent },
  { path: 'create', component: CreatePostComponent },
  { path: 'signin', component: SignInComponent },
  { path: '', redirectTo: 'posts', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
