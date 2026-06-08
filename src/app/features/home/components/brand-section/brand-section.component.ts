// brand-section.component.ts

import { Component, OnInit, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { HomeFacade } from '../../facade/home.facade';
import { MediaService } from '../../../../core/services/media.service';

@Component({
  selector: 'app-brand-section',
  standalone: false,
  templateUrl: './brand-section.component.html',
  styleUrls: ['./brand-section.component.scss']
})
export class BrandSectionComponent implements OnInit {

  private readonly mediaService = inject(MediaService);

  readonly logoUrl$: Observable<string> = this.mediaService.getAssetUrl('BRAND',1,'brand-section-visual.webp');

  constructor(private homeFacade: HomeFacade) {}

  ngOnInit(): void {}
}