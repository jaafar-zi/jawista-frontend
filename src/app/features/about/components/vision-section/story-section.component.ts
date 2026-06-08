// vision-section.component.ts
import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-story-section',
  standalone: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './story-section.component.html',
  styleUrls: ['./story-section.component.scss']
})
export class StorySectionComponent {}