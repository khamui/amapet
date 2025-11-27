import { Component, inject, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { SettingsService } from 'src/app/services/settings.service';
import { MaintenanceMode } from 'src/app/typedefs/Settings.typedef';

@Component({
  selector: 'app-global-settings',
  imports: [],
  templateUrl: './global-settings.component.html',
  styleUrl: './global-settings.component.scss',
})
export class GlobalSettingsComponent implements OnInit {
  private ses = inject(SettingsService);

  async ngOnInit() {
    console.log('settings', await this.ses.getSettings());
  }
}
