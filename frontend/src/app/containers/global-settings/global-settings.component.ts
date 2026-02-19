import { Component, inject } from '@angular/core';
import { DisplayNamePipe } from 'src/app/pipes/display-name.pipe';
import { SettingsService } from 'src/app/services/settings.service';
import {
  MaintenanceMode,
  QuestionIntentionsValue,
  Settings,
} from 'src/app/typedefs/Settings.typedef';
import { CheckboxModule } from 'primeng/checkbox';
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
export class GlobalSettingsComponent {
  public ses = inject(SettingsService);

  async handleMultioptssettingChange(
    option: QuestionIntentionsValue,
    settingId: any,
  ) {
    // get the current 'multiopts'-setting to get all options.
    const options = this.ses.intentions()?.value as QuestionIntentionsValue[];

    // FIXME: stupidly setting all options is bad! Better patching a single
    // value!
    const reqPayload: QuestionIntentionsValue[] = options.map((o) => {
      if (o.id === option.id) {
        return option;
      } else {
        return o;
      }
    });

    this.ses.intentions.set(
      (await this.ses.updateSetting<QuestionIntentionsValue[]>(
        settingId,
        reqPayload,
      )) as Settings,
    );
  }

  async handleBinarySettingChange({
    event,
    settingId,
  }: {
    event: ToggleButtonChangeEvent;
    settingId: string | undefined;
  }) {
    const reqPayload = {
      isMaintenanceMode: event.checked as boolean,
    };
    if (settingId) {
      this.ses.maintenance.set(
        (await this.ses.updateSetting<MaintenanceMode>(
          settingId,
          reqPayload,
        )) as Settings,
      );
    }
  }
}
