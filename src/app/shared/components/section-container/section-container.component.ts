// section-container.component.ts
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-section-container',
  standalone: false,
  templateUrl: './section-container.component.html',
  styleUrls: ['./section-container.component.scss']
})
export class SectionContainerComponent {
  @Input() variant: 'default' | 'muted' | 'dark' | 'transparent' = 'default';
  @Input() maxWidth: 'sm' | 'md' | 'lg' | 'xl' | 'full' | 'none' = 'lg';
  @Input() padding: 'none' | 'sm' | 'md' | 'lg' | 'xl' = 'xl';
  @Input() centered = false;
  @Input() ariaLabel?: string;
}