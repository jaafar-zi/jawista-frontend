// src/app/features/not-found/not-found.component.ts

import { Component, OnInit } from '@angular/core';
import { SeoService } from '../../core/services/seo.service';

@Component({
  selector: 'app-not-found',
  standalone: false,
  templateUrl: './not-found.component.html',
})
export class NotFoundComponent implements OnInit {
  constructor(private readonly seo: SeoService) {}

  ngOnInit(): void {
    this.seo.updateMetaFromKeys({
      titleKey:       'seo.notFound.title',
      descriptionKey: 'seo.notFound.description',
      noIndex:        true,
    });
  }
}