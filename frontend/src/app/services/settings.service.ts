import { inject, Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { MaintenanceMode, Settings } from '../typedefs/Settings.typedef';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class SettingsService {
  private api = inject(ApiService<any>);

  public getSettings = async () => {
    const { result } = await this.api.read<Settings[]>('settings', true);
    return result as Settings[];
  };

  private getSetting = async (key: string) => {
    const result = await this.getSettings();
    return (result as Settings[]).find(
      (setting: Settings) => setting.key === key,
    );
  };

  public getIsMaintenance = async () => {
    const settingMaintenance = (await this.getSetting(
      'maintenance',
    )) as Settings;
    return (settingMaintenance.value as MaintenanceMode).isMaintenanceMode;
  };

  public getAppIsAvailable = async () => {
    const isMaintenance = await this.getIsMaintenance();
    return !isMaintenance || environment.current !== 'prod';
  };

  public updateIsMaintenance = async (
    settingId: string,
    settingValue: boolean,
  ) => {
    const { result } = await this.api.update(
      'settings',
      {
        id: settingId,
        value: {
          isMaintenanceMode: settingValue,
        },
      },
      true,
    );
    return result as any;
  };
}
