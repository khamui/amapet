import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CreatePostComponent } from './create-post/create-post.component';
import { PostsComponent } from './posts/posts.component';
import { TopbarComponent } from './topbar/topbar.component';

// prime components
import { CardModule } from 'primeng/card';
import { ToastModule } from 'primeng/toast';
import { ComponentsModule } from '../components/components.module';
import { EditorModule } from 'primeng/editor';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ToolbarModule } from 'primeng/toolbar';
import { ButtonModule } from 'primeng/button';

@NgModule({
  declarations: [
    CreatePostComponent,
    PostsComponent,
    TopbarComponent
  ],
  imports: [
    CommonModule,
    CardModule,
    ToastModule,
    ComponentsModule,
    EditorModule,
    ReactiveFormsModule,
    FormsModule,
    ToolbarModule,
    ButtonModule
  ],
  exports: [
    PostsComponent,
    TopbarComponent
  ]
})
export class ContainersModule { }


