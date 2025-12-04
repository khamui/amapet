import { inject, Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { MaintenanceMode, Settings } from '../typedefs/Settings.typedef';

@Injectable({
  providedIn: 'root',
})
export class SettingsService {
  private api = inject(ApiService<MaintenanceMode>);

  public getSettings = async () => {
    const { result } = await this.api.read<Settings[]>('settings', true);
    console.log('result', result);
    return result as Settings[];
  };
}
