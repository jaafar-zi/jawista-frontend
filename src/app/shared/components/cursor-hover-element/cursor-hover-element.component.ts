import {
  Component,
  Input,
  ViewChild,
  ElementRef,
  AfterViewInit,
  OnDestroy
} from '@angular/core';

@Component({
  selector: 'app-cursor-hover-element',
  standalone: false,
  templateUrl: './cursor-hover-element.component.html',
  styleUrls: ['./cursor-hover-element.component.scss']
})
export class CursorHoverElementComponent implements AfterViewInit, OnDestroy {
  @Input() referenceText?: string;
  @Input() actionText = 'View Product';
  @Input() visible = false;

  @ViewChild('hoverElement', { static: false }) hoverElement!: ElementRef<HTMLElement>;

  private cursorElement!: HTMLElement;
  private animationFrameId?: number;

  private currentY = 0;
  private targetY = 0;
  private easing = 0.15;

  ngAfterViewInit(): void {
    if (this.hoverElement?.nativeElement) {
      this.cursorElement = this.hoverElement.nativeElement;
    }
  }

  ngOnDestroy(): void {
    this.stopAnimation();
  }

  /**
   * Update the cursor position based on mouse movement
   * Call this from the parent component's mousemove handler
   */
  updatePosition(event: MouseEvent, containerElement: HTMLElement): void {
    if (!this.cursorElement || !containerElement) return;

    const rect = containerElement.getBoundingClientRect();
    this.targetY = event.clientY - rect.top;

    if (!this.animationFrameId && this.visible) {
      this.animate();
    }
  }

  /**
   * Start the animation loop
   * Call this from the parent component's mouseenter handler
   */
  startAnimation(): void {
    if (!this.animationFrameId) {
      this.animate();
    }
  }

  /**
   * Stop the animation loop
   * Call this from the parent component's mouseleave handler
   */
  stopAnimation(): void {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = undefined;
    }
  }

  private animate = (): void => {
    if (!this.visible || !this.cursorElement) {
      this.stopAnimation();
      return;
    }

    this.currentY += (this.targetY - this.currentY) * this.easing;
    this.cursorElement.style.transform = `translateY(${this.currentY}px)`;

    this.animationFrameId = requestAnimationFrame(this.animate);
  };
}