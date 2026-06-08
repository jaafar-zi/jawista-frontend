import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-description-text',
  standalone: false,
  template: `
    <p [class]="classes">
      <ng-content />
    </p>
  `,
  styleUrls: ['./description-text.component.scss']
})
export class DescriptionTextComponent {
  @Input() size: 'sm' | 'md' | 'lg' | 'lead' = 'sm';
  @Input() alignment: 'left' | 'center' | 'right' = 'left';
  @Input() maxWidth = true;

  get classes(): string {
    return [
      'desc-text',
      `desc-text--${this.size}`,
      `desc-text--${this.alignment}`,
      this.maxWidth ? 'desc-text--constrained' : ''
    ].filter(Boolean).join(' ');
  }
}