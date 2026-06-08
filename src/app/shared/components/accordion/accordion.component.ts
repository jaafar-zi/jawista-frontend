// accordion.component.ts
import {
  Component,
  Input,
  Output,
  EventEmitter,
  ChangeDetectionStrategy
} from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-accordion',
  standalone: false,
  templateUrl: './accordion.component.html',
  styleUrls: ['./accordion.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AccordionComponent {
  @Input() itemId!: string;
  @Input() title = '';
  @Input() isExpanded = false;

  @Output() toggled = new EventEmitter<string>();

  onToggle(): void {
    this.toggled.emit(this.itemId);
  }
}