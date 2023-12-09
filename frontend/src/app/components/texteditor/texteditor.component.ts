import { Component, EventEmitter, Inject, Input, Output, PLATFORM_ID } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { SharedModule } from 'primeng/api';
import { EditorModule } from 'primeng/editor';
import { isPlatformBrowser } from '@angular/common';

@Component({
    selector: 'ama-texteditor',
    templateUrl: './texteditor.component.html',
    styleUrls: ['./texteditor.component.scss'],
    standalone: true,
    imports: [ReactiveFormsModule, EditorModule, SharedModule, ButtonModule]
})
export class TexteditorComponent {
  @Input() loading!: boolean;
  @Output() submit = new EventEmitter();

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  get isBrowserOnly(): boolean {
    return isPlatformBrowser(this.platformId);
  }

  public submitEditor = (e: SubmitEvent) => {
    e.preventDefault();
    e.stopPropagation();
    this.submit.emit(this.textEditorForm.controls['textEditor'].value);
  }

  public textEditorForm = new FormGroup({
    textEditor: new FormControl(''),
  });
}
