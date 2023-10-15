import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// primeng modules
import { PanelModule } from 'primeng/panel';
import { MenuModule } from 'primeng/menu';

// ama components
import { PostComponent } from './post/post.component';
import { SideboxComponent } from './sidebox/sidebox.component';

@NgModule({
  declarations: [PostComponent, SideboxComponent],
  exports: [PostComponent, SideboxComponent],
  imports: [
    CommonModule,
    PanelModule,
    MenuModule,
  ]
})
export class ComponentsModule { }
