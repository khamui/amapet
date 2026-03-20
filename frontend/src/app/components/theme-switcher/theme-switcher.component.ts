import { Component, inject } from '@angular/core';
import { SelectButton } from 'primeng/selectbutton';
import { FormsModule } from '@angular/forms';
import { ThemeService, Theme } from '../../services/theme.service';

interface ThemeOption {
  value: Theme;
  icon: string;
  tooltip: string;
}

@Component({
  selector: 'ama-theme-switcher',
  standalone: true,
  imports: [SelectButton, FormsModule],
  templateUrl: './theme-switcher.component.html',
  styleUrl: './theme-switcher.component.scss',
})
export class ThemeSwitcherComponent {
  private readonly themeService = inject(ThemeService);

  public readonly options: ThemeOption[] = [
    { value: 'light', icon: 'pi pi-sun', tooltip: 'Light' },
    { value: 'system', icon: 'pi pi-desktop', tooltip: 'System' },
    { value: 'dark', icon: 'pi pi-moon', tooltip: 'Dark' },
  ];

  public get selectedTheme(): Theme {
    return this.themeService.theme();
  }

  public set selectedTheme(value: Theme) {
    this.themeService.setTheme(value);
  }
}
