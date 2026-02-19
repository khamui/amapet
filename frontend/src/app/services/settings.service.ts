import {
  computed,
  inject,
  Injectable,
  signal,
  WritableSignal,
} from '@angular/core';
import { ApiService } from './api.service';
import {
  MaintenanceMode,
  QuestionIntentionsValue,
  Settings,
} from '../typedefs/Settings.typedef';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class SettingsService {
  private api = inject(ApiService<any>);

  // settings (each setting, one signal)
  public readonly intentions: WritableSignal<Settings | undefined> =
    signal(undefined);
  public readonly maintenance: WritableSignal<Settings | undefined> =
    signal(undefined);

  // computed dependants of 'maintenance'-setting
  public readonly isMaintenance = computed(
    () => this.maintenance()?.value.isMaintenanceMode,
  );
  public readonly appIsAvailable = computed(
    () => !this.isMaintenance() || environment.current !== 'prod',
  );

  // globally initialize settings signal variables and use them in different
  // components.
  public init = async () => {
    const { isError, result } = await this.api.read<Settings[]>(
      'settings',
      true,
    );
    if (!isError) {
      for (const setting of result) {
        if (setting.key === 'question_intentions') {
          this.intentions.set(setting);
        } else if (setting.key === 'maintenance') {
          this.maintenance.set(setting);
        }
      }
    }
  };

  public updateSetting = async <T>(settingId: string, reqPayload: T) => {
    const { result } = await this.api.update(
      'settings',
      {
        id: settingId,
        value: reqPayload,
      },
      true,
    );
    return result;
  };
}
