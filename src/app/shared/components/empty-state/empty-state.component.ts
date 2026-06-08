// empty-state.component.ts
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-empty-state',
  standalone: false,
  templateUrl: './empty-state.component.html',
  styleUrls: ['./empty-state.component.scss']
})
export class EmptyStateComponent {
  @Input() title = '';
  @Input() subtitle = '';
  @Input() ctaLabel = '';
  @Input() showCta = true;

  @Output() ctaClick = new EventEmitter<void>();
}