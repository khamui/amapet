import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// primeng modules
import { PanelModule } from 'primeng/panel';

// ama components
import { PostComponent } from './post/post.component';

@NgModule({
  declarations: [PostComponent],
  exports: [PostComponent],
  imports: [
    CommonModule,
    PanelModule
  ]
})
export class ComponentsModule { }
