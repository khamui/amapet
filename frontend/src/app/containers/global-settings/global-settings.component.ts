import { Component, inject, OnInit, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { DisplayNamePipe } from 'src/app/pipes/display-name.pipe';
import { SettingsService } from 'src/app/services/settings.service';
import { DatabaseService } from 'src/app/services/database.service';
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
import { DatePipe, isPlatformBrowser, NgClass } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';
import { DividerModule } from 'primeng/divider';

@Component({
  selector: 'app-global-settings',
  imports: [
    DisplayNamePipe,
    CheckboxModule,
    FormsModule,
    ToggleButtonModule,
    NgClass,
    ButtonModule,
    ConfirmDialogModule,
    DividerModule,
    DatePipe,
  ],
  providers: [ConfirmationService],
  templateUrl: './global-settings.component.html',
  styleUrl: './global-settings.component.scss',
})
export class GlobalSettingsComponent implements OnInit {
  private platformId = inject(PLATFORM_ID);
  public ses = inject(SettingsService);
  public dbs = inject(DatabaseService);
  private confirmationService = inject(ConfirmationService);
  private router = inject(Router);

  ngOnInit(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return; // Skip on server - requires browser context
    }
    this.dbs.checkCanSeed();
    this.dbs.loadBackups();
  }

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

  handleSeed(): void {
    this.confirmationService.confirm({
      message: 'This will populate the database with sample data. Continue?',
      header: 'Seed Sample Data',
      icon: 'pi pi-database',
      accept: async () => {
        const success = await this.dbs.seed();
        if (success) {
          await this.dbs.checkCanSeed();
        }
      },
    });
  }

  async handleCreateBackup(): Promise<void> {
    await this.dbs.createBackup();
  }

  handleRestore(backupName: string): void {
    this.confirmationService.confirm({
      message: `This will restore the database from "${backupName}" and replace ALL data including user accounts. You will be logged out and must log in with an account from the backup. Continue?`,
      header: 'Restore Database',
      icon: 'pi pi-exclamation-triangle',
      acceptButtonStyleClass: 'p-button-danger',
      accept: async () => {
        const success = await this.dbs.restore(backupName);
        if (success) {
          // Force logout - clear token and redirect to home
          localStorage.removeItem('amapet_token');
          this.router.navigate(['/']);
        }
      },
    });
  }

  handleDownload(backupName: string): void {
    this.dbs.downloadBackup(backupName);
  }
}
