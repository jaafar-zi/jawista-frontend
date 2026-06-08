// label-text.component.ts
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-label-text',
  standalone: false,
  template: `
    <p [class]="'label-text label-text--' + size + ' label-text--' + color">
      <ng-content />
    </p>
  `,
  styleUrls: ['./label-text.component.scss']
})
export class LabelTextComponent {
  @Input() size: 'xs' | 'sm' | 'md' = 'sm';
  @Input() color: 'default' | 'muted' | 'light' = 'muted';
}