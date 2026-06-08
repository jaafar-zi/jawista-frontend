// src/app/core/models/nav-theme.model.ts
export type NavTheme = 'light' | 'dark';

export interface NavThemeRegion {
  selector: string;
  theme: NavTheme;
}