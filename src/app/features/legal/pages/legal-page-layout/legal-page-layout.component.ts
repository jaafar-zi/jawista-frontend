// legal-page-layout.component.ts
import {
  Component,
  Input,
  ChangeDetectionStrategy,
  Inject,
  PLATFORM_ID
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { LegalPageConfig, LegalSection } from '../../../../core/models/legal.model';

@Component({
  selector: 'app-legal-page-layout',
  standalone: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './legal-page-layout.component.html',
  styleUrls: ['./legal-page-layout.component.scss']
})
export class LegalPageLayoutComponent {
  @Input({ required: true }) config!: LegalPageConfig;

  private isBrowser: boolean;

  constructor(@Inject(PLATFORM_ID) platformId: Object) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  trackBySectionId(_index: number, section: LegalSection): string {
    return section.id;
  }

  scrollToSection(sectionId: string): void {
    if (!this.isBrowser) return;
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }
}