// status-message.component.ts
import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

type MessageVariant = 'error' | 'success' | 'warning' | 'info';

@Component({
  selector: 'app-status-message',
  standalone: false,
  templateUrl: './status-message.component.html',
  styleUrls: ['./status-message.component.scss']
})
export class StatusMessageComponent {
  @Input() variant: MessageVariant = 'info';
  @Input() message = '';
  @Input() visible = true;
}