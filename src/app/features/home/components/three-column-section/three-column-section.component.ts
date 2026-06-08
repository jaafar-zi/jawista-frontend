import {
  Component,
  OnInit,
  ViewChildren,
  QueryList,
  ElementRef,
  Input
} from '@angular/core';
import { ColumnItem } from '../../../../core/models/column-item.model';
import { CursorHoverElementComponent } from '../../../../shared/components/cursor-hover-element/cursor-hover-element.component';
import { HomeFacade } from '../../facade/home.facade';

@Component({
  selector: 'app-three-column-section',
  standalone: false,
  templateUrl: './three-column-section.component.html',
  styleUrls: ['./three-column-section.component.scss']
})
export class ThreeColumnSectionComponent implements OnInit {
  @ViewChildren(CursorHoverElementComponent)
  cursorElements!: QueryList<CursorHoverElementComponent>;

  @ViewChildren('imageWrapper', { read: ElementRef })
  imageWrappers!: QueryList<ElementRef<HTMLElement>>;

  @Input() navTheme: 'light' | 'dark' = 'dark';

  columns: ColumnItem[] = [];
  hoveredIndex: number | null = null;

  constructor(private homeFacade: HomeFacade) {}

  ngOnInit(): void {
    this.columns = this.homeFacade.columns;
  }

  trackByIndex(index: number): number {
    return index;
  }

  onImageError(event: Event, index: number): void {
    const img = event.target as HTMLImageElement;
    const column = this.columns[index];
  }

  onMouseMove(event: MouseEvent, index: number): void {
    const cursorElement = this.cursorElements?.toArray()[index];
    const wrapperElement = this.imageWrappers?.toArray()[index];

    if (cursorElement && wrapperElement) {
      cursorElement.updatePosition(event, wrapperElement.nativeElement);
    }
  }

  onMouseEnter(index: number): void {
    this.hoveredIndex = index;
    const cursorElement = this.cursorElements?.toArray()[index];
    if (cursorElement) {
      cursorElement.startAnimation();
    }
  }

  onMouseLeave(index: number): void {
    this.hoveredIndex = null;
    const cursorElement = this.cursorElements?.toArray()[index];
    if (cursorElement) {
      cursorElement.stopAnimation();
    }
  }
}