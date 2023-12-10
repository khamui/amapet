import {
  Component,
  EventEmitter,
  Inject,
  Input,
  Output,
  PLATFORM_ID,
} from '@angular/core';
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
  imports: [ReactiveFormsModule, EditorModule, SharedModule, ButtonModule],
})
export class TexteditorComponent {
  @Input() loading!: boolean;
  @Input() data!: any;
  @Output() submit = new EventEmitter();

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  get isBrowserOnly(): boolean {
    return isPlatformBrowser(this.platformId);
  }

  public submitEditor = (e: SubmitEvent) => {
    e.preventDefault();
    e.stopPropagation();
    this.data
      ? this.submit.emit({
          text: this.textEditorForm.controls['textEditor'].value,
          data: this.data,
        })
      : this.submit.emit(this.textEditorForm.controls['textEditor'].value);
  };

  public textEditorForm = new FormGroup({
    textEditor: new FormControl(''),
  });
}
