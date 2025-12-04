import { Component, inject, OnInit } from '@angular/core';
import { DisplayNamePipe } from 'src/app/pipes/display-name.pipe';
import { ApiService } from 'src/app/services/api.service';
import { SettingsService } from 'src/app/services/settings.service';
import { MaintenanceMode, Settings } from 'src/app/typedefs/Settings.typedef';
import { CheckboxModule } from 'primeng/checkbox';

@Component({
  selector: 'app-global-settings',
  imports: [DisplayNamePipe, CheckboxModule],
  templateUrl: './global-settings.component.html',
  styleUrl: './global-settings.component.scss',
})
export class GlobalSettingsComponent implements OnInit {
  private ses = inject(SettingsService);
  public settings!: Settings[];
  public Array = Array;

  async ngOnInit() {
    this.settings = await this.ses.getSettings();
  }
}
