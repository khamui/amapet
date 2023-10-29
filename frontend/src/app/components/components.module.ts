import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// primeng modules
import { PanelModule } from 'primeng/panel';
import { MenuModule } from 'primeng/menu';

// ama components
import { SideboxComponent } from './sidebox/sidebox.component';
import { QuestionComponent } from './question/question.component';

@NgModule({
  declarations: [QuestionComponent, SideboxComponent],
  exports: [QuestionComponent, SideboxComponent],
  imports: [
    CommonModule,
    PanelModule,
    MenuModule,
  ]
})
export class ComponentsModule { }
