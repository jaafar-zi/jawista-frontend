// src/app/features/legal/components/terms-of-service/terms-of-service.component.ts

import { Component, OnInit } from '@angular/core';
import { SeoService } from '../../../../core/services/seo.service';
import { LegalPageConfig } from '../../../../core/models/legal.model';
import { LegalFacade } from '../../facade/legal.facade';

@Component({
  selector: 'app-terms-of-service',
  standalone: false,
  templateUrl: './terms-of-service.component.html',
})
export class TermsOfServiceComponent implements OnInit {
    config!: LegalPageConfig;
    
    constructor(private readonly seo: SeoService,
                      private facade: LegalFacade) {}
    
  ngOnInit(): void {
    this.config = this.facade.getTermsOfServiceConfig();

    this.seo.updateMetaFromKeys({
      titleKey:       'seo.legal.termsOfService.title',
      descriptionKey: 'seo.legal.termsOfService.description',
      keywordsKey:    'seo.legal.termsOfService.keywords',
    });
  }
}