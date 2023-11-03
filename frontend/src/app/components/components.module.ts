import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// primeng modules
import { PanelModule } from 'primeng/panel';
import { MenuModule } from 'primeng/menu';
import { DividerModule } from 'primeng/divider';

// ama components
import { SideboxComponent } from './sidebox/sidebox.component';

@NgModule({
  declarations: [SideboxComponent],
  exports: [SideboxComponent],
  imports: [
    CommonModule,
    DividerModule,
    PanelModule,
    MenuModule,
  ]
})
export class ComponentsModule { }
