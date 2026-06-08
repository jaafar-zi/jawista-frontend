// async-state-wrapper.component.ts
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-async-state-wrapper',
  standalone: false,
  templateUrl: './async-state-wrapper.component.html'
})
export class AsyncStateWrapperComponent {
  @Input() isLoading = false;
  @Input() hasError = false;
  @Input() isEmpty = false;
}