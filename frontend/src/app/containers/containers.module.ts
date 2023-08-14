import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CreatePostComponent } from './create-post/create-post.component';
import { PostsComponent } from './posts/posts.component';

// prime components
import { CardModule } from 'primeng/card';
import { ToastModule } from 'primeng/toast';
import { BrowserModule } from '@angular/platform-browser';

@NgModule({
  declarations: [
    CreatePostComponent,
    PostsComponent
  ],
  imports: [
    CommonModule,
    CardModule,
    ToastModule,
  ],
  exports: [
    PostsComponent
  ]
})
export class ContainersModule { }
