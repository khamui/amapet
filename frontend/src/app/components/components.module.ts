import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// primeng modules
import { PanelModule } from 'primeng/panel';
import { MenuModule } from 'primeng/menu';
import { DividerModule } from 'primeng/divider';
import { ButtonModule } from 'primeng/button';
import { EditorModule } from 'primeng/editor';

// ama components
import { SideboxComponent } from './sidebox/sidebox.component';
import { TexteditorComponent } from './texteditor/texteditor.component';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [SideboxComponent, TexteditorComponent],
  exports: [SideboxComponent, TexteditorComponent],
  imports: [
    CommonModule,
    DividerModule,
    PanelModule,
    MenuModule,
    ButtonModule,
    EditorModule,
    ReactiveFormsModule
  ]
})
export class ComponentsModule { }
