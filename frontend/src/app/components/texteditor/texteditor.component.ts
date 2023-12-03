import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'ama-texteditor',
  templateUrl: './texteditor.component.html',
  styleUrls: ['./texteditor.component.scss']
})
export class TexteditorComponent {
  @Input() loading!: boolean;
  @Output() submit = new EventEmitter();

  public submitEditor = (e: SubmitEvent) => {
    e.preventDefault();
    e.stopPropagation();
    this.submit.emit(this.textEditorForm.controls['textEditor'].value);
  }

  public textEditorForm = new FormGroup({
    textEditor: new FormControl(''),
  });
}
