// about-section.component.ts

import { Component, OnInit, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { DateService } from '../../../../core/services/date.service';
import { MediaService } from '../../../../core/services/media.service';

@Component({
  selector: 'app-about-section',
  standalone: false,
  templateUrl: './about-section.component.html',
  styleUrls: ['./about-section.component.scss']
})
export class AboutSectionComponent implements OnInit {

  private readonly mediaService = inject(MediaService);

  currentYear!: number;

  readonly aboutImageUrl$: Observable<string> = this.mediaService.getAssetUrl('BANNER',1,'about-section-visual.webp');

  constructor(private dateService: DateService) {}

  ngOnInit(): void {
    this.currentYear = this.dateService.getCurrentYear();
  }
}