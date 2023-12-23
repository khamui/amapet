import {
  Component,
  EventEmitter,
  Inject,
  Input,
  OnInit,
  Output,
  PLATFORM_ID,
} from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { SharedModule } from 'primeng/api';
import { EditorModule } from 'primeng/editor';
import { isPlatformBrowser } from '@angular/common';
import { ToggleButton } from 'primeng/togglebutton';

@Component({
  selector: 'ama-texteditor',
  templateUrl: './texteditor.component.html',
  styleUrls: ['./texteditor.component.scss'],
  standalone: true,
  imports: [ReactiveFormsModule, EditorModule, SharedModule, ButtonModule],
})
export class TexteditorComponent implements OnInit {
  @Input() loading!: boolean;
  @Input() editorHeightCss = { height: '8rem' };
  @Input() submitButtonText = "Answer";
  @Input() cancelButtonText!: string;
  @Input() initialValue!: any;
  @Input() data!: any;
  @Input() editorButtonElement!: ToggleButton;
  @Input() listButtonElement!: ToggleButton;
  @Output() submit = new EventEmitter();
  @Output() cancel = new EventEmitter();

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  ngOnInit(): void {
    if (this.initialValue) {
      this.textEditorForm.controls['textEditor'].setValue(this.initialValue);
    };
  }

  get isBrowserOnly(): boolean {
    return isPlatformBrowser(this.platformId);
  }

  public cancelEditor = () => {
    this.cancel.emit();
  };

  public submitEditor = (e: SubmitEvent) => {
    e.preventDefault();
    e.stopPropagation();
    this.data
      ? this.submit.emit({
          text: this.textEditorForm.controls['textEditor'].value,
          data: this.data,
          editorButtonEl: this.editorButtonElement,
          listButtonEl: this.listButtonElement
        })
      : this.submit.emit(this.textEditorForm.controls['textEditor'].value);
  };

  public textEditorForm = new FormGroup({
    textEditor: new FormControl(''),
  });
}
