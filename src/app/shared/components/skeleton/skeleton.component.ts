// skeleton.component.ts
import { Component, Input } from '@angular/core';

type SkeletonVariant = 'rect' | 'square' | 'text' | 'circle';

@Component({
  selector: 'app-skeleton',
  standalone: false,
  templateUrl: './skeleton.component.html',
  styleUrls: ['./skeleton.component.scss']
})
export class SkeletonComponent {
  @Input() variant: SkeletonVariant = 'rect';
  @Input() width = '100%';
  @Input() height = '1rem';
}