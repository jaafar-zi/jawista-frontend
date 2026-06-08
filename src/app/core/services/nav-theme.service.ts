import { Injectable, signal } from '@angular/core';
import { NavTheme } from '../models/nav-theme.model';

@Injectable({ providedIn: 'root' })
export class NavThemeService {
  readonly theme = signal<NavTheme>('dark');

  setTheme(theme: NavTheme): void {
    this.theme.set(theme);
  }
}