import { Component, Input } from '@angular/core';

type TitleLevel = 'h1' | 'h2' | 'h3' | 'h4';
type TitleSize = 'hero' | 'display' | 'section' | 'subsection' | 'card' | 'label';
type TitleWeight = 'light' | 'normal' | 'medium' | 'bold';
type Alignment = 'left' | 'center' | 'right';
type TitleColor = 'default' | 'light' | 'muted';

@Component({
  selector: 'app-section-title',
  standalone: false,
  templateUrl: './section-title.component.html',
  styleUrls: ['./section-title.component.scss']
})
export class SectionTitleComponent {
  @Input() level: TitleLevel = 'h2';
  @Input() size: TitleSize = 'section';
  @Input() weight: TitleWeight = 'bold';
  @Input() alignment: Alignment = 'left';
  @Input() color: TitleColor = 'default';
  @Input() uppercase = true;

  get classes(): string {
    return [
      'section-title',
      `section-title--${this.size}`,
      `section-title--${this.weight}`,
      `section-title--${this.alignment}`,
      `section-title--${this.color}`,
      this.uppercase ? 'section-title--uppercase' : ''
    ].filter(Boolean).join(' ');
  }
}