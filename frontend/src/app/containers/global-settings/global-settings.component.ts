import {
  Component,
  inject,
  OnInit,
  signal,
  WritableSignal,
} from '@angular/core';
import { DisplayNamePipe } from 'src/app/pipes/display-name.pipe';
import { SettingsService } from 'src/app/services/settings.service';
import {
  QuestionIntentionsValue,
  Settings,
} from 'src/app/typedefs/Settings.typedef';
import { CheckboxChangeEvent, CheckboxModule } from 'primeng/checkbox';
import { FormsModule } from '@angular/forms';
import {
  ToggleButtonChangeEvent,
  ToggleButtonModule,
} from 'primeng/togglebutton';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-global-settings',
  imports: [
    DisplayNamePipe,
    CheckboxModule,
    FormsModule,
    ToggleButtonModule,
    NgClass,
  ],
  templateUrl: './global-settings.component.html',
  styleUrl: './global-settings.component.scss',
})
export class GlobalSettingsComponent implements OnInit {
  private ses = inject(SettingsService);
  public settings: WritableSignal<Settings[]> = signal<Settings[]>([]);
  public Array = Array;

  async ngOnInit() {
    this.settings.set(await this.ses.getSettings());
    console.log('settings: ', this.settings());
  }

  async handleMultioptssettingChange(
    event: CheckboxChangeEvent,
    option: QuestionIntentionsValue,
    settingId: any,
  ) {
    // get the current 'multiopts'-setting to get all options.
    const setting = this.settings().find((s) => s._id === settingId);
    const options = setting?.value as QuestionIntentionsValue[];

    // FIXME: stupidly setting all options is bad! Better patching a single
    // value!
    const updatedOptions = options.map((o) => {
      if (o.id === option.id) {
        return option;
      } else {
        return o;
      }
    });

    await this.ses.updateIntentions(settingId, updatedOptions);
  }

  async handleBinarySettingChange({
    event,
    settingId,
    settingKey,
  }: {
    event: ToggleButtonChangeEvent;
    settingId: string;
    settingKey: string;
  }) {
    console.log('toggle event', event);
    console.log('key', settingKey);
    console.log('id', settingId);
    if (settingKey === 'maintenance') {
      await this.ses.updateIsMaintenance(settingId, event.checked as boolean);
    }
  }
}
