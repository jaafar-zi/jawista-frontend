// search-icon.component.ts
import { Component, Input } from '@angular/core';

type IconSize = 'sm' | 'md' | 'lg';

@Component({
  selector: 'app-search-icon',
  standalone: false,
  templateUrl: './search-icon.component.html',
  styleUrls: ['./search-icon.component.scss']
})
export class SearchIconComponent {
  @Input() size: IconSize = 'md';
}