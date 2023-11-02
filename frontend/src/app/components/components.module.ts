import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// primeng modules
import { PanelModule } from 'primeng/panel';
import { MenuModule } from 'primeng/menu';
import { DividerModule } from 'primeng/divider';

// ama components
import { SideboxComponent } from './sidebox/sidebox.component';
import { QuestionComponent } from './question/question.component';

// custom pipe
import { DateAgoPipe } from '../pipes/date-ago.pipe';

@NgModule({
  declarations: [QuestionComponent, SideboxComponent, DateAgoPipe],
  exports: [QuestionComponent, SideboxComponent],
  imports: [
    CommonModule,
    DividerModule,
    PanelModule,
    MenuModule,
  ]
})
export class ComponentsModule { }
