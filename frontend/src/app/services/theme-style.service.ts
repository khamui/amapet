import { inject, Injectable, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { SettingsService } from './settings.service';
import {
  CozyThemeMeta,
  HoneyThemeMeta,
  ThemeMeta,
} from '../../assets/themes/theme-meta';
import { ThemeName } from '../typedefs/Settings.typedef';

const THEME_CLASSES: Record<Exclude<ThemeName, 'standard'>, string> = {
  cozy: 'theme-cozy',
  honey: 'theme-honey',
};

const THEME_METAS: Record<Exclude<ThemeName, 'standard'>, ThemeMeta> = {
  cozy: CozyThemeMeta,
  honey: HoneyThemeMeta,
};

@Injectable({ providedIn: 'root' })
export class ThemeStyleService {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly settings = inject(SettingsService);

  public applyConfiguredTheme(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    const name = (this.settings.defaultTheme()?.value?.name ??
      'standard') as ThemeName;

    const html = document.documentElement;

    // Clear any prior theme class so switching at next reload is clean.
    html.classList.remove('theme-cozy', 'theme-honey');

    if (name === 'standard') return;

    html.classList.add(THEME_CLASSES[name]);
    this.injectFontLink(THEME_METAS[name]);
  }

  private injectFontLink(meta: ThemeMeta): void {
    const id = `theme-font-${meta.name}`;
    if (document.getElementById(id)) return;

    const link = document.createElement('link');
    link.id = id;
    link.rel = 'stylesheet';
    link.href = meta.fontUrl;
    document.head.appendChild(link);
  }
}
