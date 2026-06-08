// option-selector.component.ts
import {
  Component,
  Input,
  Output,
  EventEmitter,
  ChangeDetectionStrategy
} from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-option-selector',
  standalone: false,
  templateUrl: './option-selector.component.html',
  styleUrls: ['./option-selector.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OptionSelectorComponent {
  @Input() options: string[] = [];
  @Input() selected: string | null = null;
  @Input() label = '';
  @Input() disabled = false;

  @Output() optionChange = new EventEmitter<string>();

  onSelect(option: string): void {
    if (!this.disabled) {
      this.optionChange.emit(option);
    }
  }
}