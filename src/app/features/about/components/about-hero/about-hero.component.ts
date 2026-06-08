import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-about-hero',
  standalone: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './about-hero.component.html',
  styleUrls: ['./about-hero.component.scss'],
})
export class AboutHeroComponent {}