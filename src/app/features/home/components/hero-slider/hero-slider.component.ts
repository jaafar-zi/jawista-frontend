import {
  Component,
  HostListener,
  OnDestroy,
  OnInit
} from '@angular/core';
import { HeroSliderFacade } from '../../facade/hero-slider.facade';
import { HeroSlideConfig } from '../../../../core/models/hero-slider.model';

@Component({
  selector: 'app-hero-slider',
  standalone: false,
  templateUrl: './hero-slider.component.html',
  styleUrls: ['./hero-slider.component.scss'],
  providers: [HeroSliderFacade]
})
export class HeroSliderComponent implements OnInit, OnDestroy {
  trackBySlideId = (index: number, slide: HeroSlideConfig) =>
    this.facade.trackBySlideId(index, slide);

  constructor(public facade: HeroSliderFacade) {}

  ngOnInit(): void {
    this.facade.init();
  }

  ngOnDestroy(): void {
    this.facade.destroy();
  }

  @HostListener('window:resize')
  onResize(): void {
    this.facade.onResize();
  }
}