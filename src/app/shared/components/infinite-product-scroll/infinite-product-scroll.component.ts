import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { Product } from '../../models/product.model';
import { SharedModule } from "../../shared.module";

@Component({
  selector: 'app-infinite-product-scroll',
  standalone:false,
  templateUrl: './infinite-product-scroll.component.html',
  styleUrls: ['./infinite-product-scroll.component.scss'],
})
export class InfiniteProductScrollComponent implements OnInit, OnDestroy {
  @Input() products: Product[] = [];
  @Input() scrollSpeed: number = 50; 
  @Input() columns: number = 4; 
  @Input() currencySymbol = 'R';

  duplicatedProducts: Product[] = [];
  private animationId?: number;
  private scrollContainer?: HTMLElement;

  ngOnInit() {
    // Duplicate products for infinite scroll effect
    this.duplicatedProducts = [
      ...this.products,
      ...this.products,
      ...this.products // Triple for smooth infinite scroll
    ];
  }

  ngOnDestroy() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
  }

  onContainerInit(element: HTMLElement) {
    this.scrollContainer = element;
    this.startAutoScroll();
  }

  private startAutoScroll() {
    if (!this.scrollContainer) return;

    let lastTime = performance.now();
    const scroll = (currentTime: number) => {
      if (!this.scrollContainer) return;

      const deltaTime = (currentTime - lastTime) / 1000; // Convert to seconds
      lastTime = currentTime;

      const scrollAmount = this.scrollSpeed * deltaTime;
      this.scrollContainer.scrollTop += scrollAmount;

      // Reset scroll when we've scrolled through one full set
      const maxScroll = this.scrollContainer.scrollHeight / 3;
      if (this.scrollContainer.scrollTop >= maxScroll) {
        this.scrollContainer.scrollTop = 0;
      }

      this.animationId = requestAnimationFrame(scroll);
    };

    this.animationId = requestAnimationFrame(scroll);
  }

  pauseScroll() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = undefined;
    }
  }


  trackByProduct(index: number, product: Product): number {
    return product.id;
  }

  resumeScroll() {
    if (!this.animationId) {
      this.startAutoScroll();
    }
  }
}