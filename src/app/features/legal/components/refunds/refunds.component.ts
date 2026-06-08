// src/app/features/legal/components/refunds/refunds.component.ts

import { Component, OnInit } from '@angular/core';
import { SeoService } from '../../../../core/services/seo.service';
import { LegalPageConfig } from '../../../../core/models/legal.model';
import { LegalFacade } from '../../facade/legal.facade';

@Component({
  selector: 'app-refunds',
  standalone: false,
  templateUrl: './refunds.component.html',
})
export class RefundsComponent implements OnInit {
  config!: LegalPageConfig;

  constructor(private readonly seo: SeoService,
              private facade: LegalFacade) {}

  ngOnInit(): void {
    this.config = this.facade.getRefundsConfig();

    this.seo.updateMetaFromKeys({
      titleKey:       'seo.legal.refunds.title',
      descriptionKey: 'seo.legal.refunds.description',
      keywordsKey:    'seo.legal.refunds.keywords',
    });
  }
}